import React, { useEffect, useState, useRef } from 'react';
import { Sparkles, X, Send, Loader2, RefreshCw, Terminal, BookOpen, AlertTriangle } from 'lucide-react';
import { mentorApi, MentorMessage } from '../../services/mentorApi';
import { MentorBubble } from './MentorBubble';
import { useProgressionStore } from '../../store/progressionStore';

interface MentorChatPanelProps {
  conceptId?: string;
  lessonId?: string;
  getCodeSnapshot?: () => string;
}

export const MentorChatPanel: React.FC<MentorChatPanelProps> = ({
  conceptId,
  lessonId,
  getCodeSnapshot,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [messages, setMessages] = useState<MentorMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { stats, fetchProgression } = useProgressionStore();

  // Scroll to bottom helper
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Load progression on mount
  useEffect(() => {
    if (!stats) {
      fetchProgression();
    }
  }, [stats, fetchProgression]);

  // Initialize or resume conversation
  useEffect(() => {
    if (!isOpen) return;

    const initConversation = async () => {
      setInitLoading(true);
      setError(null);
      
      const storageKey = `arambh_mentor_${conceptId || 'general'}_${lessonId || 'general'}`;
      const cachedId = localStorage.getItem(storageKey);

      try {
        if (cachedId) {
          const convId = parseInt(cachedId, 10);
          try {
            const data = await mentorApi.getConversation(convId);
            setConversationId(data.id);
            setMessages(data.messages);
            setInitLoading(false);
            return;
          } catch (e) {
            console.warn("Cached conversation not found in backend, creating a new one.");
          }
        }

        // Create new conversation
        const newConv = await mentorApi.createConversation(conceptId, lessonId);
        setConversationId(newConv.id);
        setMessages(newConv.messages);
        localStorage.setItem(storageKey, newConv.id.toString());
      } catch (err: any) {
        console.error("Failed to initialize mentor conversation:", err);
        setError("Unable to summon the AI Mentor. Please check your network connection.");
      } finally {
        setInitLoading(false);
      }
    };

    initConversation();
  }, [isOpen, conceptId, lessonId]);

  const handleSend = async (messageText: string = input) => {
    if (!messageText.trim() || conversationId === null || loading) return;

    setInput('');
    setLoading(true);
    setError(null);

    // Get current code snapshot if applicable
    const codeContext = getCodeSnapshot ? getCodeSnapshot() : undefined;

    // Optimistically add user message
    const tempUserMsg: MentorMessage = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      code_snapshot: codeContext,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const assistantMsg = await mentorApi.sendMessage(
        conversationId,
        messageText,
        codeContext
      );
      setMessages((prev) => {
        // Remove optimistic user message and append official ones
        return [...prev.filter(m => m.id !== tempUserMsg.id), tempUserMsg, assistantMsg];
      });
    } catch (err: any) {
      console.error("Failed to send message:", err);
      setError("Failed to fetch response from Oracle. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    handleSend(suggestion);
  };

  // Keyboard shortcut: Send on Enter
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Setup suggestion chips based on the page context
  const getSuggestions = () => {
    if (lessonId) {
      return [
        "Explain this task in simple terms.",
        "Give me a Socratic hint about my code.",
        "Can you suggest an analogy for this challenge?",
      ];
    }
    return [
      "What are the common pitfalls for this concept?",
      "Can you give me an analogy to understand this?",
      "Can we do a step-by-step walk-through?",
    ];
  };

  return (
    <>
      {/* Floating Sparkle Summons Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed right-6 bottom-20 z-40 flex items-center gap-2 rounded-full border border-amber-500 bg-zinc-950 px-4 py-3 text-sm font-semibold text-amber-400 shadow-2xl shadow-amber-500/20 hover:scale-105 hover:bg-zinc-900 transition-all duration-300 animate-pulse"
        >
          <Sparkles size={18} />
          <span>Summon Mentor</span>
        </button>
      )}

      {/* Slide-out Sidebar Panel */}
      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-96 max-w-full bg-zinc-950 border-l border-amber-900/30 flex flex-col transition-all duration-300 ease-in-out shadow-2xl ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center px-4 py-3.5 bg-zinc-900 border-b border-amber-900/20 text-zinc-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 animate-spin-slow">
              <Sparkles size={16} />
            </div>
            <div>
              <h3 className="font-semibold text-sm tracking-wide text-amber-400">Oracle's Guide</h3>
              {stats && (
                <span className="text-[10px] text-zinc-400">
                  Lvl {stats.current_level} {stats.player_class || 'Novice'}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded transition-all"
          >
            <X size={18} />
          </button>
        </div>

        {/* Messages list / Content */}
        <div className="flex-1 overflow-y-auto px-4 py-2 bg-gradient-to-b from-zinc-950 to-zinc-900 scrollbar-thin scrollbar-thumb-zinc-800">
          {initLoading ? (
            <div className="flex flex-col items-center justify-center h-64 text-zinc-400 gap-3">
              <Loader2 size={32} className="animate-spin text-amber-400" />
              <span className="text-xs font-medium tracking-wide">Summoning mentor from the stack...</span>
            </div>
          ) : error && messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-red-400 gap-3 px-6 text-center">
              <AlertTriangle size={32} className="text-amber-500" />
              <span className="text-xs">{error}</span>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setTimeout(() => setIsOpen(true), 100);
                }}
                className="mt-2 text-xs flex items-center gap-1.5 px-3 py-1.5 rounded border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 transition-all font-semibold"
              >
                <RefreshCw size={12} />
                Retry Summons
              </button>
            </div>
          ) : (
            <>
              {messages.length === 0 && (
                <div className="my-8 rounded-lg border border-amber-950/60 bg-amber-950/10 p-4 text-center">
                  <BookOpen size={24} className="mx-auto mb-2 text-amber-500/60" />
                  <p className="text-xs text-amber-200/80 font-medium mb-1">Welcome to the Socratic Chambers</p>
                  <p className="text-[11px] text-zinc-400">
                    Ask questions about your code, search for metaphors to explain logic, or ask for diagnostic hints. I will guide you, but the final stroke of logic is yours to cast.
                  </p>
                </div>
              )}

              {messages.map((msg) => (
                <MentorBubble
                  key={msg.id}
                  role={msg.role}
                  content={msg.content}
                  codeSnapshot={msg.code_snapshot}
                  timestamp={msg.created_at}
                />
              ))}

              {loading && (
                <div className="flex w-full gap-3 my-4 justify-start">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-amber-500/30 bg-zinc-950 text-amber-400 animate-pulse">
                    <Sparkles size={16} />
                  </div>
                  <div className="rounded-xl px-4 py-3 bg-zinc-900 border border-amber-950/40 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}

              {error && messages.length > 0 && (
                <div className="flex justify-center my-2">
                  <span className="text-xs text-red-400 border border-red-950 bg-red-950/20 px-3 py-1.5 rounded-md flex items-center gap-1.5">
                    <AlertTriangle size={12} /> {error}
                  </span>
                </div>
              )}

              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Suggestion Chips */}
        {!initLoading && (
          <div className="px-4 py-2 border-t border-amber-900/10 bg-zinc-900/60 shrink-0">
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1.5 font-semibold">Suggested Prompts</span>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {getSuggestions().map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestion(suggestion)}
                  disabled={loading || initLoading}
                  className="text-[11px] text-left px-2.5 py-1 rounded bg-zinc-950 hover:bg-zinc-800 border border-amber-900/25 hover:border-amber-500/30 text-amber-300/80 hover:text-amber-300 disabled:opacity-50 disabled:pointer-events-none transition-all truncate max-w-full"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className="p-3 bg-zinc-900 border-t border-amber-900/20 shrink-0">
          <div className="relative flex items-center rounded-lg border border-amber-900/40 bg-zinc-950 px-3 py-2 shadow-inner focus-within:border-amber-500/60 transition-all">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the Oracle..."
              disabled={loading || initLoading}
              rows={2}
              className="w-full bg-transparent text-sm text-zinc-200 outline-none resize-none placeholder-zinc-500 pr-10 font-sans"
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading || initLoading}
              className="absolute right-3.5 bottom-3.5 p-1 text-zinc-400 hover:text-amber-400 disabled:opacity-30 disabled:hover:text-zinc-400 transition-colors"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
