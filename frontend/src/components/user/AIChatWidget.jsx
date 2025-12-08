import { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, Sparkles } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';

export default function AIChatWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            role: 'assistant',
            content: 'Hi! I\'m your shopping assistant. How can I help you today?',
        },
    ]);
    const [input, setInput] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const chatMutation = useMutation({
        mutationFn: async (message) => {
            // This would call your AI service (e.g., Claude API via your backend)
            const response = await fetch('https://api.anthropic.com/v1/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'claude-sonnet-4-20250514',
                    max_tokens: 1000,
                    messages: [
                        ...messages.map(m => ({ role: m.role, content: m.content })),
                        { role: 'user', content: message },
                    ],
                }),
            });

            const data = await response.json();
            return data.content[0].text;
        },
        onSuccess: (response) => {
            setMessages(prev => [...prev, { role: 'assistant', content: response }]);
        },
        onError: () => {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
            }]);
        },
    });

    const handleSend = () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setInput('');
        chatMutation.mutate(userMessage);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Suggested questions
    const suggestedQuestions = [
        'What are your best-selling products?',
        'Do you have any discounts?',
        'How can I track my order?',
        'What is your return policy?',
    ];

    return (
        <>
            {/* Chat Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-primary-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center z-50 group"
                >
                    <MessageCircle className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></span>
                </button>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 animate-in slide-in-from-bottom-4">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-600 to-purple-600 text-white p-4 rounded-t-2xl flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-semibold">AI Shopping Assistant</h3>
                                <p className="text-xs text-primary-100">Online</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                                        message.role === 'user'
                                            ? 'bg-primary-600 text-white'
                                            : 'bg-white shadow-sm'
                                    }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                </div>
                            </div>
                        ))}

                        {chatMutation.isPending && (
                            <div className="flex justify-start">
                                <div className="bg-white shadow-sm rounded-2xl px-4 py-2">
                                    <div className="flex gap-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Suggested Questions */}
                        {messages.length === 1 && (
                            <div className="space-y-2">
                                <p className="text-xs text-gray-500 text-center">Suggested questions:</p>
                                {suggestedQuestions.map((question, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            setInput(question);
                                            handleSend();
                                        }}
                                        className="w-full text-left px-4 py-2 bg-white hover:bg-gray-100 rounded-lg text-sm transition-colors"
                                    >
                                        {question}
                                    </button>
                                ))}
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className="p-4 border-t bg-white rounded-b-2xl">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder="Type your message..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                                disabled={chatMutation.isPending}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || chatMutation.isPending}
                                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                        <p className="text-xs text-gray-500 mt-2 text-center">
                            Powered by Claude AI
                        </p>
                    </div>
                </div>
            )}
        </>
    );
}