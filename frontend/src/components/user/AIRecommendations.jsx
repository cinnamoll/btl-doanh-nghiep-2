import { useQuery } from '@tanstack/react-query';
import { Sparkles } from 'lucide-react';
import ProductCard from './ProductCard';

export default function AIRecommendations({ userId, currentProductId }) {
    const { data: recommendations, isLoading } = useQuery({
        queryKey: ['ai-recommendations', userId, currentProductId],
        queryFn: async () => {
            // This would call your AI recommendation service
            // For now, return mock data
            return {
                products: [
                    {
                        id: 1,
                        name: 'Wireless Headphones',
                        price: 99.99,
                        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
                        description: 'High-quality wireless headphones',
                    },
                    {
                        id: 2,
                        name: 'Smart Watch',
                        price: 199.99,
                        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
                        description: 'Feature-rich smartwatch',
                    },
                ],
                reason: 'Based on your browsing history and preferences',
            };
        },
    });

    if (isLoading || !recommendations?.products?.length) return null;

    return (
        <div className="mt-12">
            <div className="flex items-center gap-2 mb-6">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <div>
                    <h2 className="text-2xl font-bold">AI Recommendations</h2>
                    <p className="text-gray-600 text-sm">{recommendations.reason}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendations.products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}