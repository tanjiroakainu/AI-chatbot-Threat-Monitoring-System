import { useState, useRef, useEffect } from 'react';
import { sendToGemini } from '../lib/gemini';

interface Message {
  role: 'user' | 'assistant';
  text: string;
}

const SYSTEM_PROMPT =
  'You are a helpful, friendly assistant. Answer any question the user asks—general knowledge, weather, advice, or anything else. When they ask about the Threat Monitoring System (threat reports, raid bookings, drug monitoring), give relevant guidance; otherwise answer normally. Be concise and clear.';

export default function AIChatButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((m) => [...m, { role: 'user', text }]);
    setLoading(true);
    try {
      const prompt = `${SYSTEM_PROMPT}\n\nUser: ${text}`;
      const reply = await sendToGemini(prompt);
      setMessages((m) => [...m, { role: 'assistant', text: reply }]);
    } catch (err) {
      setMessages((m) => [
        ...m,
        { role: 'assistant', text: err instanceof Error ? err.message : 'Failed to get AI response.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-amber-500 text-zinc-950 shadow-lg hover:bg-amber-400 transition-colors touch-manipulation"
        aria-label="Open AI Chat"
      >
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      </button>

      {open && (
        <div className="fixed bottom-20 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-24 z-50 flex w-full max-w-md flex-col overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900 shadow-xl max-h-[85vh] sm:max-h-[none]">
          <div className="flex items-center justify-between border-b border-zinc-700 bg-zinc-800/80 px-4 py-3">
            <span className="font-medium text-amber-400">AI Chat (Gemini)</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1.5 text-zinc-400 hover:bg-zinc-700 hover:text-white"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex h-72 sm:h-80 flex-col overflow-hidden min-h-0">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 && (
                <p className="text-center text-sm text-zinc-500">Ask anything—general questions, weather, or help with this system.</p>
              )}
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`rounded-lg px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'ml-8 bg-amber-500/20 text-amber-100'
                      : 'mr-8 bg-zinc-800 text-zinc-200'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
              {loading && (
                <div className="mr-8 rounded-lg bg-zinc-800 px-3 py-2 text-sm text-zinc-400">Thinking…</div>
              )}
              <div ref={listEndRef} />
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend();
              }}
              className="flex gap-2 border-t border-zinc-700 p-3"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message…"
                className="flex-1 rounded-lg border border-zinc-600 bg-zinc-800 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="rounded-lg bg-amber-500 px-4 py-2.5 text-sm font-medium text-zinc-950 hover:bg-amber-400 disabled:opacity-50 disabled:pointer-events-none"
              >
                Send
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
