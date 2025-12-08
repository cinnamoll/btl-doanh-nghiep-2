import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, Heart, Minus, Plus, Star } from 'lucide-react';
import { productService } from '../../services/productService';
import { inventoryService } from '../../services/inventoryService';
import { useCartStore } from '../../store/cartStore';
import { toast } from 'sonner';

export default function ProductDetailPage() {
    const { id } = useParams();
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    const { data: product, isLoading } = useQuery({
        queryKey: ['product', id],
        queryFn: () => productService.getById(id),
    });

    const { data: inventory } = useQuery({
        queryKey: ['inventory', product?.skuCode],
        queryFn: () => inventoryService.checkStock(product.skuCode),
        enabled: !!product?.skuCode,
    });

    const handleAddToCart = () => {
        if (quantity > (inventory?.quantity || 0)) {
            toast.error('Not enough stock');
            return;
        }
        addItem(product, quantity);
        toast.success(`Added ${quantity} item(s) to cart`);
    };

    if (isLoading) return <div className="container mx-auto px-4 py-8">Loading...</div>;
    if (!product) return <div className="container mx-auto px-4 py-8">Product not found</div>;

    const inStock = inventory?.quantity > 0;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Images */}
                <div>
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden mb-4">
                        <img
                            src={product.imageUrl || 'https://via.placeholder.com/600'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                {/* Details */}
                <div className="space-y-6">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.name}</h1>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                ))}
                                <span className="ml-2">4.5 (128 reviews)</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-baseline gap-4">
                        <p className="text-4xl font-bold text-primary-600">${product.price}</p>
                        {product.originalPrice && (
                            <p className="text-2xl text-gray-400 line-through">${product.originalPrice}</p>
                        )}
                    </div>

                    <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {inStock ? `In Stock (${inventory.quantity})` : 'Out of Stock'}
            </span>
                    </div>

                    <p className="text-gray-700 leading-relaxed">{product.description}</p>

                    {/* Quantity & Add to Cart */}
                    {inStock && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <label className="font-medium">Quantity:</label>
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="p-2 hover:bg-gray-100"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                        className="w-16 text-center border-x border-gray-300"
                                    />
                                    <button
                                        onClick={() => setQuantity(Math.min(inventory.quantity, quantity + 1))}
                                        className="p-2 hover:bg-gray-100"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart className="w-5 h-5" />
                                    Add to Cart
                                </button>
                                <button className="p-3 border-2 border-gray-300 rounded-lg hover:border-primary-600 hover:text-primary-600">
                                    <Heart className="w-6 h-6" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}