import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { UserPlus, Search, Edit, Trash2, Shield, ShieldOff } from 'lucide-react';
import { userService } from '../../services/userService';
import { toast } from 'sonner';

export default function UserManagement() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [roleFilter, setRoleFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const queryClient = useQueryClient();

    const { data: users, isLoading } = useQuery({
        queryKey: ['users', searchQuery, roleFilter, statusFilter],
        queryFn: () => userService.getAll({ search: searchQuery, role: roleFilter, status: statusFilter }),
    });

    const updateRoleMutation = useMutation({
        mutationFn: ({ userId, role }) => userService.updateRole(userId, role),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            toast.success('User role updated');
        },
    });

    const toggleStatusMutation = useMutation({
        mutationFn: ({ userId, status }) => userService.updateStatus(userId, status),
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            toast.success('User status updated');
        },
    });

    const deleteMutation = useMutation({
        mutationFn: userService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['users']);
            toast.success('User deleted');
        },
    });

    const handleToggleStatus = (user) => {
        const newStatus = user.status === 'active' ? 'inactive' : 'active';
        toggleStatusMutation.mutate({ userId: user.id, status: newStatus });
    };

    const handleDelete = (userId) => {
        if (confirm('Are you sure you want to delete this user?')) {
            deleteMutation.mutate(userId);
        }
    };

    return (
        <div className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold">{users?.stats?.total || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-600">Admins</p>
                    <p className="text-2xl font-bold">{users?.stats?.admins || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-600">Active Users</p>
                    <p className="text-2xl font-bold">{users?.stats?.active || 0}</p>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <p className="text-sm text-gray-600">New This Month</p>
                    <p className="text-2xl font-bold">{users?.stats?.newThisMonth || 0}</p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="all">All Roles</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-6 border-b flex items-center justify-between">
                    <h2 className="text-xl font-semibold">Users</h2>
                    <button
                        onClick={() => {
                            setEditingUser(null);
                            setShowModal(true);
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                    >
                        <UserPlus className="w-5 h-5" />
                        Add User
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                User
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Email
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Role
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Joined
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Last Active
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y">
                        {isLoading ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : users?.data?.length === 0 ? (
                            <tr>
                                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            users?.data?.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-primary-600">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                                            </div>
                                            <div>
                                                <p className="font-medium">{user.name}</p>
                                                <p className="text-sm text-gray-500">{user.id}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{user.email}</td>
                                    <td className="px-6 py-4">
                                        <select
                                            value={user.role}
                                            onChange={(e) =>
                                                updateRoleMutation.mutate({ userId: user.id, role: e.target.value })
                                            }
                                            className="px-2 py-1 border rounded text-sm"
                                        >
                                            <option value="user">User</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleToggleStatus(user)}
                                            className="flex items-center gap-1"
                                        >
                        <span
                            className={`px-2 py-1 text-xs rounded-full ${
                                user.status === 'active'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}
                        >
                          {user.status}
                        </span>
                                            {user.status === 'active' ? (
                                                <Shield className="w-4 h-4 text-green-600" />
                                            ) : (
                                                <ShieldOff className="w-4 h-4 text-red-600" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setEditingUser(user);
                                                    setShowModal(true);
                                                }}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(user.id)}
                                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* User Modal */}
            {showModal && (
                <UserModal
                    user={editingUser}
                    onClose={() => setShowModal(false)}
                    onSuccess={() => {
                        setShowModal(false);
                        queryClient.invalidateQueries(['users']);
                    }}
                />
            )}
        </div>
    );
}

// User Modal Component
function UserModal({ user, onClose, onSuccess }) {
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        password: '',
        role: user?.role || 'user',
    });

    const mutation = useMutation({
        mutationFn: (data) =>
            user ? userService.update(user.id, data) : userService.create(data),
        onSuccess: () => {
            toast.success(user ? 'User updated' : 'User created');
            onSuccess();
        },
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">
                    {user ? 'Edit User' : 'Add New User'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            required
                            className="w-full px-4 py-2 border rounded-lg"
                        />
                    </div>
                    {!user && (
                        <div>
                            <label className="block text-sm font-medium mb-1">Password</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                                className="w-full px-4 py-2 border rounded-lg"
                            />
                        </div>
                    )}
                    <div>
                        <label className="block text-sm font-medium mb-1">Role</label>
                        <select
                            value={formData.role}
                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                            className="w-full px-4 py-2 border rounded-lg"
                        >
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={mutation.isPending}
                            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-gray-400"
                        >
                            {mutation.isPending ? 'Saving...' : user ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}