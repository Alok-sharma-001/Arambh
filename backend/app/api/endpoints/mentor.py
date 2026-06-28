import os
import json
import logging
import httpx
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime, timezone

from app.database.session import get_db
from app.auth.router import get_current_user
from app.models.user import User, UserStats
from app.models.mentor import MentorConversation, MentorMessage
from app.schemas.mentor import ConversationCreate, ConversationResponse, MessageCreate, MessageResponse

router = APIRouter()
logger = logging.getLogger(__name__)

# Try to resolve concept file path
PROJECT_ROOT = "/home/alok/Projects_Antigravity/Arambh/Arambh"
CONCEPTS_DIR = os.path.join(PROJECT_ROOT, "frontend/src/data/library/python/concepts")

def load_concept_context(concept_id: str) -> Optional[dict]:
    if not concept_id:
        return None
    # Clean concept_id to avoid path traversal
    clean_id = os.path.basename(concept_id).replace(".json", "")
    file_path = os.path.join(CONCEPTS_DIR, f"{clean_id}.json")
    
    if not os.path.exists(file_path):
        # Try finding case-insensitive or alternative naming
        logger.warning(f"Concept file not found at: {file_path}")
        return None
        
    try:
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error reading concept file {concept_id}: {e}")
        return None

async def call_gemini_api(prompt: str, system_instruction: str) -> str:
    api_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    if not api_key:
        logger.warning("GEMINI_API_KEY not found in environment. Using offline fallback response.")
        return get_fallback_socratic_response(prompt)

    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key={api_key}"
    payload = {
        "contents": [
            {
                "role": "user",
                "parts": [
                    {"text": prompt}
                ]
            }
        ],
        "systemInstruction": {
            "parts": [
                {"text": system_instruction}
            ]
        }
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=payload)
            if response.status_code == 200:
                data = response.json()
                text = data["candidates"][0]["content"]["parts"][0]["text"]
                return text
            else:
                logger.error(f"Gemini API returned status {response.status_code}: {response.text}")
                return "The spirits of the compiler are quiet... (Failed to connect to AI Mentor. Please try again.)"
    except Exception as e:
        logger.error(f"Exception during Gemini API call: {e}")
        return "A storm in the network blocks our link to the Oracle. (Network error during AI call.)"

def get_fallback_socratic_response(prompt: str) -> str:
    """Mock fallback logic to act as a Socratic guide when API key is missing."""
    prompt_lower = prompt.lower()
    if "recursion" in prompt_lower:
        return (
            "Ah, you ask about Recursion—the infinite mirror of the programming realm!\n\n"
            "Think of it like a set of nested Russian Dolls. To solve the largest doll, you must solve a slightly "
            "smaller doll inside it. What happens when you reach the smallest doll that cannot be opened any further?\n\n"
            "In code, we call that the **Base Case**. Without it, we would fall into the Exception Abyss. "
            "Where in your current logic do you define when the repetition should stop?"
        )
    if "iterator" in prompt_lower or "iterable" in prompt_lower or "iter" in prompt_lower:
        return (
            "Ah, traveler of the Iterator Isles! You ask of collections and cursors.\n\n"
            "An Iterable is like a closed book containing pages, while an Iterator is a bookmark pointing to the current page.\n\n"
            "When you call `iter()`, you get the bookmark. When you call `next()`, you read the page and advance the bookmark.\n\n"
            "What happens if you try to call `next()` when the bookmark is already past the final page of the book? How does Python signal this?"
        )
    if "generator" in prompt_lower or "yield" in prompt_lower:
        return (
            "A Generator is a powerful mage that casts a spell, pauses, and goes to sleep, waiting to be awakened again!\n\n"
            "Instead of returning a full list eagerly and exhausting your mana (RAM), the `yield` keyword pauses the execution frame and saves the current state.\n\n"
            "How does `yield` differ from `return` in terms of saving local variable values between calls? What happens when you call `next()` on a paused generator?"
        )
    if "variables" in prompt_lower or "variable" in prompt_lower:
        return (
            "Variables are like labeled storage chests in your memory forest.\n\n"
            "When you write `x = 10`, you are labeling a chest 'x' and putting the number 10 inside.\n\n"
            "If you want to access that value, how would you call the chest? What do you expect to see inside if you print it?"
        )
    return (
        "I am the Arambh AI Mentor, your guide through the Python wilderness.\n\n"
        "Tell me: what does your code seek to accomplish, and what is the error message or unexpected behavior you are encountering? "
        "Let's break down the logic step-by-step without giving away the direct solution."
    )

@router.post("/conversation", response_model=ConversationResponse)
def create_conversation(
    payload: ConversationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conversation = MentorConversation(
        user_id=current_user.id,
        concept_id=payload.concept_id,
        lesson_id=payload.lesson_id
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation

@router.get("/conversation/{id}", response_model=ConversationResponse)
def get_conversation(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conversation = db.query(MentorConversation).filter(
        MentorConversation.id == id,
        MentorConversation.user_id == current_user.id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    return conversation

@router.post("/chat", response_model=MessageResponse)
async def chat_message(
    payload: MessageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    conversation = db.query(MentorConversation).filter(
        MentorConversation.id == payload.conversation_id,
        MentorConversation.user_id == current_user.id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
        
    # Get user stats for progression-awareness
    stats = current_user.stats
    user_level = stats.current_level if stats else 1
    user_class = stats.player_class if stats else "Novice"
    user_xp = stats.total_xp if stats else 0
    
    # Save the user's message
    user_msg = MentorMessage(
        conversation_id=conversation.id,
        role="user",
        content=payload.message,
        code_snapshot=payload.code_context
    )
    db.add(user_msg)
    
    # Log mentor_request analytics event
    from app.models.analytics import AnalyticsEvent
    mentor_event = AnalyticsEvent(
        user_id=current_user.id,
        event_type="mentor_request",
        details=json.dumps({
            "concept_id": conversation.concept_id,
            "lesson_id": conversation.lesson_id
        })
    )
    db.add(mentor_event)
    
    db.commit()
    db.refresh(user_msg)
    
    # Build System Prompt
    system_instruction = (
        "You are the Arambh AI Mentor, a Socratic Python programming tutor designed in a dark fantasy RPG style.\n"
        "Your mission is to guide the user to learn coding step-by-step. Do NOT solve challenges for them, do NOT give complete solutions, "
        "and do NOT write entire lines of corrected code for them. Instead, ask guided questions, point out conceptual mismatches, "
        "suggest where to look in their code, and supply analogies.\n\n"
        f"User Details:\n"
        f"- Level: {user_level}\n"
        f"- Player Class: {user_class}\n"
        f"- Current XP: {user_xp}\n\n"
    )
    
    # Load Concept details if available
    concept_context = load_concept_context(conversation.concept_id) if conversation.concept_id else None
    if concept_context:
        simplified = concept_context.get("simplifiedExplanation", "")
        confusion = ", ".join(concept_context.get("confusionPoints", []))
        analogies = ", ".join(concept_context.get("analogyLibrary", []))
        hints = ", ".join(concept_context.get("hintSystem", []))
        
        system_instruction += (
            f"Concept Context ({conversation.concept_id}):\n"
            f"- Concept Title: {concept_context.get('title', '')}\n"
            f"- Simplified Explanation: {simplified}\n"
            f"- Common Confusion Points: {confusion}\n"
            f"- Metaphors/Analogies: {analogies}\n"
            f"- Guided Hint Pool: {hints}\n\n"
        )
        
    if conversation.lesson_id:
        system_instruction += f"The user is currently attempting Lesson ID: {conversation.lesson_id}.\n\n"
        
    if conversation.concept_id and any(x in conversation.concept_id for x in ["iterable", "iterator", "generator", "stream"]):
        system_instruction += (
            "SOCRATIC ITERATOR ISLES RULES:\n"
            "- Emphasize that collections allocate all memory upfront (eager evaluation) while iterators generate items on-demand (lazy evaluation).\n"
            "- If the user asks for code, do not write a generator or iterator class. Instead, ask them: 'What method does the iterator protocol require to retrieve the next value?' or 'How does yield suspend our execution frame?'\n"
            "- If they try to build collections (e.g. list, tuple, bracket-lists) inside generator functions, explain that this defeats the purpose of the Iterator Isles.\n\n"
        )

    system_instruction += (
        "RULES FOR RESPONSE:\n"
        "1. Adopt a helpful, encouraging, and atmospheric Socratic guide persona. Keep the tone RPG-themed (Novice, Wizard, Code Knight, etc.).\n"
        "2. Keep explanations simple, focused, and bite-sized.\n"
        "3. Provide short markdown code snippets ONLY to illustrate general concepts, never the solution to the user's specific problem.\n"
        "4. Ask questions that force the user to examine their code or the logic flow.\n"
    )

    # Compile conversation history for context
    history_messages = db.query(MentorMessage).filter(
        MentorMessage.conversation_id == conversation.id
    ).order_by(MentorMessage.id.asc())
    
    # Fetch last 8 messages
    recent_msgs = history_messages.limit(10).all()
    
    prompt = "Conversation History:\n"
    for m in recent_msgs[:-1]: # Exclude the user message we just created to add it cleanly at the end
        prompt += f"{m.role.upper()}: {m.content}\n"
        if m.code_snapshot:
            prompt += f"[Code Snapshot]:\n{m.code_snapshot}\n"
            
    prompt += f"USER: {payload.message}\n"
    if payload.code_context:
        prompt += f"[Current Code in Editor]:\n{payload.code_context}\n"
        
    prompt += "ASSISTANT:"

    # Call Gemini model
    response_content = await call_gemini_api(prompt, system_instruction)

    # Save the assistant's message
    assistant_msg = MentorMessage(
        conversation_id=conversation.id,
        role="assistant",
        content=response_content
    )
    db.add(assistant_msg)
    db.commit()
    db.refresh(assistant_msg)

    return assistant_msg
