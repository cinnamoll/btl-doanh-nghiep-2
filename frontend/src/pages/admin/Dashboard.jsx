import { useQuery } from '@tanstack/react-query';
import { TrendingUp, Package, ShoppingBag, DollarSign } from 'lucide-react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

export default function Dashboard() {
    const { data: stats } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
            // Mock data - replace with actual API call
            return {
                totalOrders: 1234,
                totalRevenue: 45678,
                totalProducts: 567,
                lowStockItems: 12,
                recentOrders: Array(5).fill(null).map((_, i) => ({
                    id: `ORD-${1000 + i}`,
                    customer: `Customer ${i + 1}`,
                    amount: Math.random() * 500 + 50,
                    status: ['pending', 'processing', 'shipped'][Math.floor(Math.random() * 3)],
                    date: new Date().toISOString(),
                })),
                salesData: Array(7).fill(null).map((_, i) => ({
                    name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
                    sales: Math.random() * 1000 + 500,
                })),
            };
        },
    });

    const statCards = [
        {
            title: 'Total Orders',
            value: stats?.totalOrders || 0,
            icon: ShoppingBag,
            color: 'bg-blue-500',
            change: '+12%',
        },
        {
            title: 'Revenue',
            value: `$${stats?.totalRevenue?.toLocaleString() || 0}`,
            icon: DollarSign,
            color: 'bg-green-500',
            change: '+8%',
        },
        {
            title: 'Products',
            value: stats?.totalProducts || 0,
            icon: Package,
            color: 'bg-purple-500',
            change: '+5',
        },
        {
            title: 'Low Stock',
            value: stats?.lowStockItems || 0,
            icon: TrendingUp,
            color: 'bg-red-500',
            change: '-3',
        },
    ];

    return (
        <div className="space-y-6">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`${stat.color} p-3 rounded-lg`}>
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-sm text-green-600 font-medium">{stat.change}</span>
                        </div>
                        <h3 className="text-gray-600 text-sm mb-1">{stat.title}</h3>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Weekly Sales</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stats?.salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Orders Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Orders by Day</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats?.salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="sales" fill="#0ea5e9" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold">Recent Orders</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Order ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Amount
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Date
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y">
                        {stats?.recentOrders?.map((order) => (
                            <tr key={order.id}>
                                <td className="px-6 py-4 whitespace-nowrap font-medium">{order.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{order.customer}</td>
                                <td className="px-6 py-4 whitespace-nowrap">${order.amount.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                    <span
                        className={`px-2 py-1 text-xs rounded-full ${
                            order.status === 'shipped'
                                ? 'bg-green-100 text-green-800'
                                : order.status === 'processing'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-yellow-100 text-yellow-800'
                        }`}
                    >
                      {order.status}
                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(order.date).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}