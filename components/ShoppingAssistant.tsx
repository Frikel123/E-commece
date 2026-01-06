
import React, { useState } from 'react';
import { getShoppingAssistantResponse } from '../services/geminiService';
import { Product } from '../types';

interface ShoppingAssistantProps {
  products: Product[];
}

const ShoppingAssistant: React.FC<ShoppingAssistantProps> = ({ products }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: "Hi! I'm Nova, your AI shopping assistant. Looking for something specific today?" }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!query.trim()) return;
    
    const userMsg = query;
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setQuery('');
    setLoading(true);

    const productList = products.map(p => `${p.name} ($${p.price})`).join(', ');
    const aiResponse = await getShoppingAssistantResponse(userMsg, productList);
    
    setMessages(prev => [...prev, { role: 'ai', text: aiResponse || "Sorry, I'm a bit lost." }]);
    setLoading(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {isOpen ? (
        <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
          <div className="bg-indigo-600 p-4 flex justify-between items-center">
            <div className="flex items-center text-white">
              <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-2">
                <i className="fas fa-robot"></i>
              </div>
              <span className="font-bold">Nova AI</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-indigo-200">
              <i className="fas fa-times"></i>
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${m.role === 'user' ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-white text-gray-700 shadow-sm border border-gray-100 rounded-tl-none'}`}>
                  {m.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-tl-none p-3 shadow-sm border border-gray-100">
                  <div className="flex space-x-1">
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="p-3 border-t border-gray-100 bg-white">
            <div className="relative">
              <input 
                type="text" 
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
                placeholder="Ask Nova anything..."
                className="w-full bg-gray-100 rounded-full py-2 pl-4 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 outline-none border-none"
              />
              <button 
                onClick={handleSend}
                disabled={loading}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 hover:text-indigo-700"
              >
                <i className="fas fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-110 flex items-center justify-center"
        >
          <i className="fas fa-robot text-2xl"></i>
        </button>
      )}
    </div>
  );
};

export default ShoppingAssistant;
