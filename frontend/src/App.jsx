import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';

// User Pages
import HomePage from './pages/user/HomePage';
import ProductListPage from './pages/user/ProductListPage';
import ProductDetailPage from './pages/user/ProductDetailPage';
import CartPage from './pages/user/CartPage';
import CheckoutPage from './pages/user/CheckoutPage';
import OrderSuccessPage from './pages/user/OrderSuccessPage';
import ProfilePage from './pages/user/ProfilePage';
import LoginPage from './pages/auth/LoginPage';

// Admin Pages
import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import ProductManagement from './pages/admin/ProductManagement';
import InventoryManagement from './pages/admin/InventoryManagement';
import OrderManagement from './pages/admin/OrderManagement';
import NotificationLog from './pages/admin/NotificationLog';
import UserManagement from './pages/admin/UserManagement';

// Layouts
import UserLayout from './layouts/UserLayout';
import ProtectedRoute from './components/common/ProtectedRoute';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
            staleTime: 5 * 60 * 1000, // 5 minutes
        },
    },
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Toaster position="top-right" richColors />
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<LoginPage />} />

                    {/* User Routes */}
                    <Route path="/" element={<UserLayout />}>
                        <Route index element={<HomePage />} />
                        <Route path="products" element={<ProductListPage />} />
                        <Route path="products/:id" element={<ProductDetailPage />} />
                        <Route path="cart" element={<CartPage />} />
                        <Route
                            path="checkout"
                            element={
                                <ProtectedRoute>
                                    <CheckoutPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="order-success/:orderId"
                            element={
                                <ProtectedRoute>
                                    <OrderSuccessPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="profile"
                            element={
                                <ProtectedRoute>
                                    <ProfilePage />
                                </ProtectedRoute>
                            }
                        />
                    </Route>

                    {/* Admin Routes */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute requiredRole="admin">
                                <AdminLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Dashboard />} />
                        <Route path="products" element={<ProductManagement />} />
                        <Route path="inventory" element={<InventoryManagement />} />
                        <Route path="orders" element={<OrderManagement />} />
                        <Route path="notifications" element={<NotificationLog />} />
                        <Route path="users" element={<UserManagement />} />
                    </Route>

                    {/* 404 */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;