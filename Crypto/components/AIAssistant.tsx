
import React, { useState, useRef, useEffect } from 'react';
import Card from './ui/Card';
import Input from './ui/Input';
import Button from './ui/Button';
import SendIcon from './icons/SendIcon';
import BotIcon from './icons/BotIcon';
import type { ChatMessage } from '../types';
import { getAIAssistantResponse } from '../services/geminiService';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: 'ai', text: 'Hello! How can I help you with your trading analysis today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || isLoading) return;

    const userMessage: ChatMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    const aiResponseText = await getAIAssistantResponse(input);
    const aiMessage: ChatMessage = { sender: 'ai', text: aiResponseText };
    setMessages(prev => [...prev, aiMessage]);
    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <Card className="flex flex-col h-full">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <BotIcon className="w-6 h-6 mr-2 text-brand-primary" />
        AI Trading Assistant
      </h3>
      <div className="flex-grow overflow-y-auto pr-2 space-y-4 mb-4 h-96">
        {messages.map((msg, index) => (
          <div key={index} className={`flex items-start gap-3 ${msg.sender === 'user' ? 'justify-end' : ''}`}>
            {msg.sender === 'ai' && <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0"><BotIcon className="w-5 h-5" /></div>}
            <div className={`max-w-md rounded-lg p-3 ${msg.sender === 'ai' ? 'bg-dark-700' : 'bg-brand-primary text-white'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex items-start gap-3">
                 <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center flex-shrink-0"><BotIcon className="w-5 h-5" /></div>
                 <div className="max-w-md rounded-lg p-3 bg-dark-700">
                    <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    </div>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="flex items-center space-x-2">
        <Input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Ask about market trends..."
          className="flex-grow"
          disabled={isLoading}
        />
        <Button onClick={handleSend} disabled={isLoading} className="px-4 py-3">
          <SendIcon className="w-5 h-5" />
        </Button>
      </div>
    </Card>
  );
};

export default AIAssistant;
