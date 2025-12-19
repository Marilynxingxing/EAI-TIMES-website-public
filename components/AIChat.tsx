import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles } from 'lucide-react';
import { chatWithArticle } from '../services/geminiService';
import { ChatMessage } from '../types';

interface AIChatProps {
  articleContent: string;
}

const AIChat: React.FC<AIChatProps> = ({ articleContent }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: query };
    setMessages(prev => [...prev, userMsg]);
    setQuery('');
    setIsLoading(true);

    const answer = await chatWithArticle(articleContent, userMsg.text);
    
    setMessages(prev => [...prev, { role: 'model', text: answer }]);
    setIsLoading(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-lg transition-all duration-300 group border border-nexus-cyan/30 ${
          isOpen ? 'bg-nexus-gray text-white rotate-90' : 'bg-nexus-cyan text-black hover:scale-110'
        }`}
      >
        {isOpen ? <X size={24} /> : <Sparkles size={24} className="group-hover:animate-spin" />}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-8 z-40 w-96 max-w-[90vw] h-[500px] bg-nexus-black/95 border border-nexus-cyan/50 backdrop-blur-xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-fade-in-up">
          {/* Header */}
          <div className="p-4 border-b border-white/10 flex items-center gap-2 bg-nexus-cyan/5">
            <Bot size={20} className="text-nexus-cyan" />
            <h3 className="font-mono text-nexus-cyan font-bold tracking-wider">NEXUS AI</h3>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-10 text-sm">
                <p>Analyzing article data...</p>
                <p className="mt-2">Ask me anything about this text.</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-3 rounded-lg text-sm ${
                    msg.role === 'user'
                      ? 'bg-nexus-cyan/20 text-white border border-nexus-cyan/20'
                      : 'bg-white/5 text-gray-200 border border-white/10'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-3 rounded-lg flex gap-1">
                   <div className="w-2 h-2 bg-nexus-cyan rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-nexus-cyan rounded-full animate-bounce delay-75"></div>
                   <div className="w-2 h-2 bg-nexus-cyan rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/10 bg-black/20">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask about this article..."
                className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white focus:outline-none focus:border-nexus-cyan placeholder-gray-500 font-mono"
              />
              <button
                onClick={handleSend}
                disabled={isLoading}
                className="p-2 bg-nexus-cyan text-black rounded-lg hover:bg-white transition-colors disabled:opacity-50"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChat;