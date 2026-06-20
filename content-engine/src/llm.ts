import { GoogleGenAI } from '@google/genai';
import { ConceptContentSchema, KnowledgeGraphSchema } from '../../frontend/src/types/library';

// Initialize the SDK. It will automatically use process.env.GEMINI_API_KEY
const ai = new GoogleGenAI({});

/**
 * Extracts the knowledge graph from a given book's table of contents or raw text chunk.
 */
export async function extractKnowledgeGraph(subject: string, rawText: string) {
  const prompt = `
    You are an expert technical educator and curriculum architect.
    Analyze the following raw text from a technical book about ${subject}.
    Extract the core concepts and build a learning dependency graph.
    
    Rules:
    - Difficulty score must be 1-100.
    - Keep concept IDs lowercase with hyphens (e.g., "variables-python").
    - Ensure prerequisiteConcepts correctly map to other conceptIds.
    
    Raw Text:
    ${rawText.substring(0, 50000)} // Truncating for safety
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        // In a real production environment, you would use responseSchema with the Zod schema
        // However, the exact syntax depends on the specific version of @google/genai.
        // For this V3 engine, we request strict JSON.
      }
    });

    const jsonString = response.text || '{}';
    // Validate the output
    const graphData = JSON.parse(jsonString);
    return KnowledgeGraphSchema.parse(graphData);
  } catch (error) {
    console.error('Failed to extract knowledge graph:', error);
    throw error;
  }
}

/**
 * Generates the full 30+ field concept JSON from raw text using the Universal Schema.
 */
export async function generateConceptContent(conceptId: string, rawText: string, existingContent?: any) {
  const prompt = `
    You are an expert technical educator and RPG game designer.
    We are building the Arambh RPG Learning Platform.
    
    Your task is to generate the complete educational and RPG metadata for the concept: ${conceptId}.
    
    If 'existingContent' is provided, you must FUSE the new information into it without losing previous data.
    
    Raw Text:
    ${rawText.substring(0, 50000)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const jsonString = response.text || '{}';
    const conceptData = JSON.parse(jsonString);
    
    // Zod will automatically validate all 30 fields (Boss Battle, XP, Memory, Analytics, etc.)
    return ConceptContentSchema.parse(conceptData);
  } catch (error) {
    console.error(`Failed to generate concept content for ${conceptId}:`, error);
    throw error;
  }
}
