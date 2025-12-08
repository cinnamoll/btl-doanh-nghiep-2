import api from './api';

export const userService = {
    getAll: async (params) => {
        // Mock data - replace with actual API
        return {
            data: [
                {
                    id: '1',
                    name: 'John Doe',
                    email: 'john@example.com',
                    role: 'user',
                    status: 'active',
                    createdAt: '2024-01-15',
                    lastActive: '2024-12-08',
                },
                {
                    id: '2',
                    name: 'Jane Smith',
                    email: 'jane@example.com',
                    role: 'admin',
                    status: 'active',
                    createdAt: '2024-02-20',
                    lastActive: '2024-12-08',
                },
                {
                    id: '3',
                    name: 'Bob Johnson',
                    email: 'bob@example.com',
                    role: 'user',
                    status: 'inactive',
                    createdAt: '2024-03-10',
                    lastActive: '2024-11-20',
                },
            ],
            stats: {
                total: 156,
                admins: 5,
                active: 142,
                newThisMonth: 12,
            },
        };
    },

    create: async (data) => {
        const response = await api.post('/api/users', data);
        return response.data;
    },

    update: async (id, data) => {
        const response = await api.put(`/api/users/${id}`, data);
        return response.data;
    },

    updateRole: async (id, role) => {
        const response = await api.patch(`/api/users/${id}/role`, { role });
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await api.patch(`/api/users/${id}/status`, { status });
        return response.data;
    },

    delete: async (id) => {
        const response = await api.delete(`/api/users/${id}`);
        return response.data;
    },
};