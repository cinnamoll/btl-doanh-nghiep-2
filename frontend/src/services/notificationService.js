import api from './api';

export const notificationService = {
  getAll: async (filters) => {
    const params = new URLSearchParams();
    if (filters.status !== 'all') params.append('status', filters.status);
    if (filters.search) params.append('search', filters.search);
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);

    // Mock data for now - replace with actual API
    return {
      data: [
        {
          id: '1',
          recipientName: 'John Doe',
          recipientEmail: 'john@example.com',
          type: 'order_confirmation',
          subject: 'Your order has been confirmed',
          status: 'sent',
          sentAt: new Date().toISOString(),
        },
        {
          id: '2',
          recipientName: 'Jane Smith',
          recipientEmail: 'jane@example.com',
          type: 'order_shipped',
          subject: 'Your order has been shipped',
          status: 'sent',
          sentAt: new Date(Date.now() - 86400000).toISOString(),
        },
        {
          id: '3',
          recipientName: 'Bob Johnson',
          recipientEmail: 'bob@example.com',
          type: 'order_confirmation',
          subject: 'Your order has been confirmed',
          status: 'failed',
          sentAt: new Date(Date.now() - 172800000).toISOString(),
        },
      ],
      stats: {
        sent: 145,
        failed: 3,
        pending: 5,
      },
      currentPage: 1,
      totalPages: 3,
    };
  },

  retry: async (id) => {
    const response = await api.post(`/api/notification/${id}/retry`);
    return response.data;
  },
};