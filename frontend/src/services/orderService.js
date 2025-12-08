import api from './api';

export const orderService = {
    create: async (orderData) => {
        const response = await api.post('/api/order', orderData);
        return response.data;
    },

    getAll: async (params) => {
        const response = await api.get('/api/order', { params });
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/api/order/${id}`);
        return response.data;
    },

    updateStatus: async (id, status) => {
        const response = await api.patch(`/api/order/${id}/status`, { status });
        return response.data;
    },
};