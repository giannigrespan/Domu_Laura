import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToConcierge } from '../services/geminiService';
import { ChatMessage, LoadingState } from '../types';

export const Concierge: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'model',
      text: 'Ciao! Sono Laura, il tuo assistente virtuale per Casa Vacanze Torpè. Come posso aiutarti oggi? Chiedimi pure delle spiagge vicine o dei migliori ristoranti!',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || loadingState === LoadingState.LOADING) return;

    const userMessage: ChatMessage = {
      role: 'user',
      text: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setLoadingState(LoadingState.LOADING);

    try {
      const responseText = await sendMessageToConcierge(userMessage.text);
      
      const botMessage: ChatMessage = {
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      setLoadingState(LoadingState.ERROR);
      setMessages(prev => [...prev, {
        role: 'model',
        text: 'Scusa, ho avuto un piccolo problema di connessione. Riprova tra poco.',
        timestamp: new Date()
      }]);
    }
  };

  return (
    <section id="concierge" className="py-20 bg-sardinia-sea/5">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-serif font-bold text-gray-900 mb-2">Concierge Virtuale</h2>
          <p className="text-gray-600">Hai domande su Torpè o sui dintorni? Chiedi a Mauro, il nostro assistente AI.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 flex flex-col h-[500px]">
          {/* Chat Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
                    msg.role === 'user'
                      ? 'bg-sardinia-sea text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-sm'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loadingState === LoadingState.LOADING && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100">
            <form onSubmit={handleSend} className="flex gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Chiedi: 'Qual è la spiaggia più vicina?'..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sardinia-sea focus:border-transparent transition-all"
              />
              <button
                type="submit"
                disabled={loadingState === LoadingState.LOADING || !inputValue.trim()}
                className="bg-sardinia-sea text-white px-6 py-3 rounded-lg font-medium hover:bg-sky-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Invia
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
