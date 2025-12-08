import api from './api';

export const inventoryService = {
    checkStock: async (skuCode) => {
        const response = await api.get(`/api/inventory/${skuCode}`);
        return response.data;
    },

    getAll: async () => {
        const response = await api.get('/api/inventory');
        return response.data;
    },

    updateStock: async (skuCode, quantity) => {
        const response = await api.put(`/api/inventory/${skuCode}`, { quantity });
        return response.data;
    },
};