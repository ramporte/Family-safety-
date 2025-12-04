import React, { useState, useRef, useEffect } from 'react';
import { Send, Shield, AlertTriangle, Loader2 } from 'lucide-react';
import { getSafetyAdvice } from '../services/geminiService';
import { ChatMessage } from '../types';

const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Hello! I am your Guardian Safety Advisor. I can help with first aid tips, emergency preparedness, or general safety questions. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await getSafetyAdvice(input);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "What to do for a burn?",
    "Earthquake safety tips",
    "How to perform CPR?",
    "Home security checklist"
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-4 bg-indigo-600 text-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          <h2 className="font-semibold">Safety Advisor</h2>
        </div>
        <div className="text-xs bg-indigo-500 px-2 py-1 rounded text-indigo-100">
          Powered by Gemini
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50" ref={scrollRef}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none'
                  : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'
              }`}
            >
              {msg.role === 'model' && (
                <div className="flex items-center gap-1 mb-1 text-xs text-indigo-600 font-bold uppercase tracking-wider">
                  <Shield size={10} /> Guardian AI
                </div>
              )}
              <div className="whitespace-pre-wrap">{msg.text}</div>
              <div className={`text-[10px] mt-1 text-right ${msg.role === 'user' ? 'text-indigo-200' : 'text-slate-400'}`}>
                {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white border border-slate-200 p-3 rounded-2xl rounded-bl-none shadow-sm flex items-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin text-indigo-600" />
              <span className="text-xs text-slate-500">Thinking...</span>
            </div>
          </div>
        )}
      </div>

      <div className="p-4 bg-white border-t border-slate-100">
         {/* Quick Prompts */}
         {messages.length < 3 && (
            <div className="flex gap-2 overflow-x-auto pb-3 mb-2 scrollbar-hide">
              {quickPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => setInput(prompt)}
                  className="whitespace-nowrap px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs rounded-full transition-colors"
                >
                  {prompt}
                </button>
              ))}
            </div>
         )}
        
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about safety..."
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="p-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md shadow-indigo-200"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
