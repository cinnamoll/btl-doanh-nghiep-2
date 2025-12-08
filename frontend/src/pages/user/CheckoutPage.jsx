import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { CreditCard, MapPin } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { orderService } from '../../services/orderService';
import { toast } from 'sonner';

export default function CheckoutPage() {
    const navigate = useNavigate();
    const { items, getTotal, clearCart } = useCartStore();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        cardNumber: '',
        expiryDate: '',
        cvv: '',
    });

    const createOrderMutation = useMutation({
        mutationFn: orderService.create,
        onSuccess: (data) => {
            clearCart();
            toast.success('Order placed successfully!');
            navigate(`/order-success/${data.orderId}`);
        },
        onError: () => {
            toast.error('Failed to place order');
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        const orderData = {
            customerName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            shippingAddress: {
                street: formData.address,
                city: formData.city,
                zipCode: formData.zipCode,
            },
            orderLineItemsDtoList: items.map(item => ({
                skuCode: item.skuCode,
                price: item.price,
                quantity: item.quantity,
            })),
        };

        createOrderMutation.mutate(orderData);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form */}
                <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
                    {/* Shipping Information */}
                    <div className="card p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-5 h-5 text-primary-600" />
                            <h2 className="text-xl font-semibold">Shipping Information</h2>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                name="fullName"
                                placeholder="Full Name"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                                className="input-field"
                            />
                            <input
                                name="email"
                                type="email"
                                placeholder="Email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="input-field"
                            />
                            <input
                                name="phone"
                                placeholder="Phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                className="input-field md:col-span-2"
                            />
                            <input
                                name="address"
                                placeholder="Address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                                className="input-field md:col-span-2"
                            />
                            <input
                                name="city"
                                placeholder="City"
                                value={formData.city}
                                onChange={handleChange}
                                required
                                className="input-field"
                            />
                            <input
                                name="zipCode"
                                placeholder="ZIP Code"
                                value={formData.zipCode}
                                onChange={handleChange}
                                required
                                className="input-field"
                            />
                        </div>
                    </div>

                    {/* Payment Information */}
                    <div className="card p-6">
                        <div className="flex items-center gap-2 mb-4">
                            <CreditCard className="w-5 h-5 text-primary-600" />
                            <h2 className="text-xl font-semibold">Payment Information</h2>
                        </div>
                        <div className="space-y-4">
                            <input
                                name="cardNumber"
                                placeholder="Card Number"
                                value={formData.cardNumber}
                                onChange={handleChange}
                                required
                                className="input-field"
                            />
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    name="expiryDate"
                                    placeholder="MM/YY"
                                    value={formData.expiryDate}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                                <input
                                    name="cvv"
                                    placeholder="CVV"
                                    value={formData.cvv}
                                    onChange={handleChange}
                                    required
                                    className="input-field"
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={createOrderMutation.isPending}
                        className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:bg-gray-400"
                    >
                        {createOrderMutation.isPending ? 'Processing...' : 'Place Order'}
                    </button>
                </form>

                {/* Order Summary */}
                <div className="card p-6 h-fit">
                    <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                    <div className="space-y-3">
                        {items.map((item) => (
                            <div key={item.id} className="flex justify-between">
                <span className="text-gray-600">
                  {item.name} x {item.quantity}
                </span>
                                <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                    <div className="border-t mt-4 pt-4 space-y-2">
                        <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>${getTotal().toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Shipping</span>
                            <span>Free</span>
                        </div>
                        <div className="flex justify-between font-bold text-lg">
                            <span>Total</span>
                            <span>${getTotal().toFixed(2)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}