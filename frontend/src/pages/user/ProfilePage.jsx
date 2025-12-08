import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { User, ShoppingBag } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { orderService } from '../../services/orderService';

export default function ProfilePage() {
    const [activeTab, setActiveTab] = useState('profile');
    const { user } = useAuthStore();

    const { data: orders } = useQuery({
        queryKey: ['my-orders'],
        queryFn: orderService.getAll,
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">My Account</h1>

            {/* Tabs */}
            <div className="flex gap-4 border-b mb-6">
                <button
                    onClick={() => setActiveTab('profile')}
                    className={`pb-3 px-4 ${
                        activeTab === 'profile'
                            ? 'border-b-2 border-primary-600 text-primary-600'
                            : 'text-gray-600'
                    }`}
                >
                    <User className="w-5 h-5 inline mr-2" />
                    Profile
                </button>
                <button
                    onClick={() => setActiveTab('orders')}
                    className={`pb-3 px-4 ${
                        activeTab === 'orders'
                            ? 'border-b-2 border-primary-600 text-primary-600'
                            : 'text-gray-600'
                    }`}
                >
                    <ShoppingBag className="w-5 h-5 inline mr-2" />
                    Orders
                </button>
            </div>

            {/* Content */}
            {activeTab === 'profile' && (
                <div className="card p-6 max-w-2xl">
                    <h2 className="text-xl font-semibold mb-4">Profile Information</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                defaultValue={user?.name}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                defaultValue={user?.email}
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                            <input
                                type="tel"
                                defaultValue={user?.phone}
                                className="input-field"
                            />
                        </div>
                        <button className="btn-primary">Save Changes</button>
                    </div>
                </div>
            )}

            {activeTab === 'orders' && (
                <div className="space-y-4">
                    {orders?.data?.map((order) => (
                        <div key={order.id} className="card p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold">Order #{order.orderNumber}</h3>
                                    <p className="text-sm text-gray-600">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                  {order.status}
                </span>
                            </div>
                            <div className="space-y-2">
                                {order.items?.map((item, index) => (
                                    <div key={index} className="flex justify-between text-sm">
                                        <span>{item.name} x {item.quantity}</span>
                                        <span className="font-medium">${item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t mt-4 pt-4 flex justify-between font-bold">
                                <span>Total</span>
                                <span>${order.total}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}