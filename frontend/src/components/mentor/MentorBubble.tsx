import React from 'react';
import { Sparkles, User, Copy, Check } from 'lucide-react';

interface MentorBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  codeSnapshot?: string;
  timestamp?: string;
}

export const MentorBubble: React.FC<MentorBubbleProps> = ({
  role,
  content,
  codeSnapshot,
  timestamp,
}) => {
  const isUser = role === 'user';
  const [copied, setCopied] = React.useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Simple Markdown parsing helper for safe, custom rendering
  const renderMarkdown = (text: string) => {
    const parts = text.split(/(```[\s\S]*?```)/g);

    return parts.map((part, index) => {
      // Code Block
      if (part.startsWith('```')) {
        const match = part.match(/```(\w*)\n([\s\S]*?)```/);
        const language = match ? match[1] : '';
        const code = match ? match[2] : part.slice(3, -3);

        return (
          <div key={index} className="my-3 rounded-lg overflow-hidden border border-amber-900/40 bg-zinc-950 font-mono text-xs">
            <div className="flex justify-between items-center px-4 py-1.5 bg-zinc-900 border-b border-amber-900/20 text-zinc-400">
              <span>{language || 'python'}</span>
              <button
                onClick={() => copyToClipboard(code)}
                className="hover:text-amber-400 transition-colors flex items-center gap-1"
                title="Copy code"
              >
                {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>
            <pre className="p-3 overflow-x-auto text-amber-200/90">
              <code>{code.trim()}</code>
            </pre>
          </div>
        );
      }

      // Inline code and normal text parsing
      const subParts = part.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
      return (
        <span key={index}>
          {subParts.map((sub, subIdx) => {
            if (sub.startsWith('`') && sub.endsWith('`')) {
              return (
                <code key={subIdx} className="px-1.5 py-0.5 rounded bg-zinc-900 text-amber-300 font-mono text-xs border border-amber-950/40">
                  {sub.slice(1, -1)}
                </code>
              );
            }
            if (sub.startsWith('**') && sub.endsWith('**')) {
              return (
                <strong key={subIdx} className="font-semibold text-amber-100">
                  {sub.slice(2, -2)}
                </strong>
              );
            }
            return sub;
          })}
        </span>
      );
    });
  };

  return (
    <div className={`flex w-full gap-3 my-4 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border border-amber-500/30 bg-zinc-950 text-amber-400 shadow-lg shadow-amber-500/5">
          <Sparkles size={16} />
        </div>
      )}

      <div
        className={`flex flex-col max-w-[80%] rounded-xl px-4 py-3 text-sm shadow-md transition-all duration-300 ${
          isUser
            ? 'bg-gradient-to-br from-purple-950/70 to-zinc-900 border border-purple-900/30 text-zinc-100 rounded-tr-none'
            : 'bg-gradient-to-br from-zinc-900 to-zinc-950 border border-amber-500/20 text-zinc-300 rounded-tl-none'
        }`}
      >
        <div className="leading-relaxed whitespace-pre-line">{renderMarkdown(content)}</div>

        {codeSnapshot && (
          <details className="mt-3 border-t border-purple-900/20 pt-2">
            <summary className="cursor-pointer text-xs text-purple-400 hover:text-purple-300 transition-colors select-none font-semibold">
              View code snapshot sent to Oracle
            </summary>
            <pre className="mt-2 p-2 rounded bg-zinc-950 border border-purple-900/10 font-mono text-[10px] text-zinc-400 overflow-x-auto">
              {codeSnapshot}
            </pre>
          </details>
        )}

        {timestamp && (
          <span className="text-[10px] text-zinc-500 mt-1.5 self-end">
            {new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full border border-purple-500/30 bg-zinc-950 text-purple-400 shadow-lg shadow-purple-500/5">
          <User size={16} />
        </div>
      )}
    </div>
  );
};
