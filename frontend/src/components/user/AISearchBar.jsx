import { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AISearchBar() {
    const [query, setQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const navigate = useNavigate();

    const handleSearch = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length > 2) {
            // Call AI to get smart suggestions
            // Mock suggestions for now
            setSuggestions([
                'iPhone 15 Pro Max',
                'iPhone 15 cases',
                'iPhone 15 screen protector',
            ]);
        } else {
            setSuggestions([]);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/products?search=${query}`);
            setSuggestions([]);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="relative">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    placeholder="Ask AI to find products..."
                    className="w-full pl-10 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                />
                <Sparkles className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-600" />
            </div>

            {/* AI Suggestions */}
            {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border rounded-lg shadow-lg z-50">
                    <div className="p-2 border-b bg-purple-50">
                        <p className="text-xs text-purple-600 flex items-center gap-1">
                            <Sparkles className="w-3 h-3" />
                            AI Suggestions
                        </p>
                    </div>
                    {suggestions.map((suggestion, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setQuery(suggestion);
                                navigate(`/products?search=${suggestion}`);
                                setSuggestions([]);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 transition-colors"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            )}
        </form>
    );
}