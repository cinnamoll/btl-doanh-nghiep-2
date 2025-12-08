import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'sonner';

export default function LoginPage() {
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Mock login - replace with actual OAuth2/Keycloak integration
        try {
            // Simulate API call
            const mockUser = {
                id: '1',
                name: 'John Doe',
                email: formData.email,
                role: formData.email.includes('admin') ? 'admin' : 'user',
            };
            const mockToken = 'mock-jwt-token';

            login(mockUser, mockToken);
            localStorage.setItem('access_token', mockToken);

            toast.success('Login successful!');
            navigate(mockUser.role === 'admin' ? '/admin' : '/');
        } catch (error) {
            toast.error('Login failed');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full card p-8">
                <h1 className="text-3xl font-bold text-center mb-8">Login</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            required
                            className="input-field"
                        />
                    </div>
                    <button type="submit" className="w-full btn-primary">
                        Login
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 mt-4">
                    Use 'admin@example.com' to login as admin
                </p>
            </div>
        </div>
    );
}