import { Link } from 'react-router-dom';
import { Trash2, ArrowLeft } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

export default function CartPage() {
    const { items, updateQuantity, removeItem, getTotal } = useCartStore();

    if (items.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
                <Link to="/products" className="btn-primary inline-block">
                    Continue Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/products" className="flex items-center text-primary-600 hover:underline mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
            </Link>

            <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2 space-y-4">
                    {items.map((item) => (
                        <div key={item.id} className="card p-6 flex gap-4">
                            <img
                                src={item.imageUrl || 'https://via.placeholder.com/150'}
                                alt={item.name}
                                className="w-24 h-24 object-cover rounded"
                            />
                            <div className="flex-1">
                                <h3 className="font-semibold text-lg">{item.name}</h3>
                                <p className="text-gray-600">${item.price}</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        className="px-3 py-1 border rounded"
                                    >
                                        -
                                    </button>
                                    <span className="px-4">{item.quantity}</span>
                                    <button
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                        className="px-3 py-1 border rounded"
                                    >
                                        +
                                    </button>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-lg">${(item.price * item.quantity).toFixed(2)}</p>
                                <button
                                    onClick={() => removeItem(item.id)}
                                    className="mt-2 text-red-600 hover:text-red-700"
                                >
                                    <Trash2 className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Summary */}
                <div className="card p-6 h-fit">
                    <h3 className="font-bold text-xl mb-4">Order Summary</h3>
                    <div className="space-y-2 mb-4">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${getTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="border-t pt-2 flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${getTotal().toFixed(2)}</span>
                        </div>
                    </div>
                    <Link
                        to="/checkout"
                        className="block w-full py-3 bg-primary-600 text-white text-center rounded-lg font-semibold hover:bg-primary-700"
                    >
                        Proceed to Checkout
                    </Link>
                </div>
            </div>
        </div>
    );
}