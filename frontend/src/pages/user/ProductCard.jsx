// src/components/user/ProductCard.jsx
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { toast } from 'sonner';

export default function ProductCard({ product }) {
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = (e) => {
        e.preventDefault();
        addItem(product);
        toast.success('Added to cart!');
    };

    return (
        <Link
            to={`/products/${product.id}`}
            className="card group hover:shadow-xl transition-shadow"
        >
            {/* Image */}
            <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                    src={product.imageUrl || 'https://via.placeholder.com/400'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        toast.info('Added to wishlist');
                    }}
                    className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                >
                    <Heart className="w-5 h-5 text-gray-600" />
                </button>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-2xl font-bold text-primary-600">
                            ${product.price.toFixed(2)}
                        </p>
                    </div>
                    <button
                        onClick={handleAddToCart}
                        className="p-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        <ShoppingCart className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </Link>
    );
}