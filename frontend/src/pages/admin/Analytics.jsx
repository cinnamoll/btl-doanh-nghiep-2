import { useQuery } from '@tanstack/react-query';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, ShoppingCart } from 'lucide-react';

export default function Analytics() {
    const { data: analytics } = useQuery({
        queryKey: ['analytics'],
        queryFn: async () => ({
            revenue: {
                current: 45678,
                previous: 42340,
                change: 7.9,
                data: [
                    { month: 'Jan', revenue: 4200 },
                    { month: 'Feb', revenue: 3800 },
                    { month: 'Mar', revenue: 4500 },
                    { month: 'Apr', revenue: 5200 },
                    { month: 'May', revenue: 4800 },
                    { month: 'Jun', revenue: 5600 },
                ],
            },
            orders: {
                current: 1234,
                previous: 1156,
                change: 6.7,
                data: [
                    { month: 'Jan', orders: 180 },
                    { month: 'Feb', orders: 195 },
                    { month: 'Mar', orders: 210 },
                    { month: 'Apr', orders: 205 },
                    { month: 'May', orders: 220 },
                    { month: 'Jun', orders: 224 },
                ],
            },
            categories: [
                { name: 'Electronics', value: 35, color: '#0ea5e9' },
                { name: 'Fashion', value: 28, color: '#8b5cf6' },
                { name: 'Home', value: 20, color: '#10b981' },
                { name: 'Sports', value: 17, color: '#f59e0b' },
            ],
            topProducts: [
                { name: 'iPhone 15 Pro', sales: 245, revenue: 245000 },
                { name: 'AirPods Pro', sales: 189, revenue: 47250 },
                { name: 'MacBook Air', sales: 156, revenue: 187200 },
                { name: 'iPad Pro', sales: 134, revenue: 107200 },
            ],
        }),
    });

    const COLORS = ['#0ea5e9', '#8b5cf6', '#10b981', '#f59e0b'];

    return (
        <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-600">Total Revenue</p>
                            <p className="text-3xl font-bold">${analytics?.revenue.current.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                            <DollarSign className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-green-600">+{analytics?.revenue.change}% from last month</span>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-600">Total Orders</p>
                            <p className="text-3xl font-bold">{analytics?.orders.current.toLocaleString()}</p>
                        </div>
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        <span className="text-sm text-blue-600">+{analytics?.orders.change}% from last month</span>
                    </div>
                </div>
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Revenue Trend</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics?.revenue.data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Category Distribution */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Sales by Category</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={analytics?.categories}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, value }) => `${name}: ${value}%`}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {analytics?.categories.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* Orders Chart */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Order Volume</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics?.orders.data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="orders" fill="#8b5cf6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-lg font-semibold mb-4">Top Products</h3>
                    <div className="space-y-4">
                        {analytics?.topProducts.map((product, index) => (
                            <div key={index} className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">{product.name}</p>
                                    <p className="text-sm text-gray-500">{product.sales} sales</p>
                                </div>
                                <p className="font-semibold">${product.revenue.toLocaleString()}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}