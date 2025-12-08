import { Outlet, Link, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    Package,
    Warehouse,
    ShoppingBag,
    Bell,
    Users,
    LogOut,
    Menu,
    X,
} from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const location = useLocation();
    const { user, logout } = useAuthStore();

    const navigation = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Products', href: '/admin/products', icon: Package },
        { name: 'Inventory', href: '/admin/inventory', icon: Warehouse },
        { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
        { name: 'Notifications', href: '/admin/notifications', icon: Bell },
        { name: 'Users', href: '/admin/users', icon: Users },
        {name: 'Analytics', href: '/admin/analytics', icon: BarChart },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full bg-gray-900 text-white transition-all duration-300 z-40 ${
                    sidebarOpen ? 'w-64' : 'w-20'
                }`}
            >
                <div className="flex items-center justify-between p-4 border-b border-gray-800">
                    {sidebarOpen && <h1 className="text-xl font-bold">Admin Panel</h1>}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 hover:bg-gray-800 rounded"
                    >
                        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                <nav className="p-4 space-y-2">
                    {navigation.map((item) => {
                        const isActive = location.pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                to={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    isActive
                                        ? 'bg-primary-600 text-white'
                                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                }`}
                            >
                                <item.icon className="w-5 h-5" />
                                {sidebarOpen && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-800">
                    <button
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 w-full text-gray-300 hover:bg-gray-800 rounded-lg"
                    >
                        <LogOut className="w-5 h-5" />
                        {sidebarOpen && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className={`transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-20'}`}>
                {/* Header */}
                <header className="bg-white shadow-sm p-4 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {navigation.find((item) => item.href === location.pathname)?.name || 'Dashboard'}
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600">Welcome, {user?.name || 'Admin'}</span>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}