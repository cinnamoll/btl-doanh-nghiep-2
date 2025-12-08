import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Mail, CheckCircle, XCircle, RefreshCw, Search, Filter } from 'lucide-react';
import { notificationService } from '../../services/notificationService';
import { toast } from 'sonner';

export default function NotificationLog() {
    const [filters, setFilters] = useState({
        status: 'all',
        search: '',
        dateFrom: '',
        dateTo: '',
    });
    const queryClient = useQueryClient();

    const { data: notifications, isLoading } = useQuery({
        queryKey: ['notifications', filters],
        queryFn: () => notificationService.getAll(filters),
    });

    const retryMutation = useMutation({
        mutationFn: notificationService.retry,
        onSuccess: () => {
            queryClient.invalidateQueries(['notifications']);
            toast.success('Notification resent successfully');
        },
        onError: () => {
            toast.error('Failed to resend notification');
        },
    });

    const handleRetry = (id) => {
        if (confirm('Resend this notification?')) {
            retryMutation.mutate(id);
        }
    };

    const getStatusBadge = (status) => {
        const styles = {
            sent: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            pending: 'bg-yellow-100 text-yellow-800',
        };
        return styles[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status) => {
        if (status === 'sent') return <CheckCircle className="w-4 h-4 text-green-600" />;
        if (status === 'failed') return <XCircle className="w-4 h-4 text-red-600" />;
        return <Mail className="w-4 h-4 text-yellow-600" />;
    };

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Total Sent</p>
                            <p className="text-2xl font-bold">{notifications?.stats?.sent || 0}</p>
                        </div>
                        <CheckCircle className="w-10 h-10 text-green-500" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Failed</p>
                            <p className="text-2xl font-bold">{notifications?.stats?.failed || 0}</p>
                        </div>
                        <XCircle className="w-10 h-10 text-red-500" />
                    </div>
                </div>
                <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">Pending</p>
                            <p className="text-2xl font-bold">{notifications?.stats?.pending || 0}</p>
                        </div>
                        <Mail className="w-10 h-10 text-yellow-500" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-gray-600" />
                    <h3 className="font-semibold">Filters</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search recipient..."
                            value={filters.search}
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 border rounded-lg"
                        />
                    </div>
                    <select
                        value={filters.status}
                        onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                        className="px-4 py-2 border rounded-lg"
                    >
                        <option value="all">All Status</option>
                        <option value="sent">Sent</option>
                        <option value="failed">Failed</option>
                        <option value="pending">Pending</option>
                    </select>
                    <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                        className="px-4 py-2 border rounded-lg"
                        placeholder="From date"
                    />
                    <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                        className="px-4 py-2 border rounded-lg"
                        placeholder="To date"
                    />
                </div>
            </div>

            {/* Notifications Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Recipient
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Type
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Subject
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Sent At
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y">
                        {isLoading ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : notifications?.data?.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                                    No notifications found
                                </td>
                            </tr>
                        ) : (
                            notifications?.data?.map((notification) => (
                                <tr key={notification.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(notification.status)}
                                            <span className={`px-2 py-1 text-xs rounded-full ${getStatusBadge(notification.status)}`}>
                          {notification.status}
                        </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div>
                                            <p className="font-medium">{notification.recipientName}</p>
                                            <p className="text-sm text-gray-500">{notification.recipientEmail}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {notification.type}
                      </span>
                                    </td>
                                    <td className="px-6 py-4 max-w-xs truncate">
                                        {notification.subject}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(notification.sentAt).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        {notification.status === 'failed' && (
                                            <button
                                                onClick={() => handleRetry(notification.id)}
                                                disabled={retryMutation.isPending}
                                                className="p-2 text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50"
                                                title="Retry sending"
                                            >
                                                <RefreshCw className="w-4 h-4" />
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {notifications?.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    {[...Array(notifications.totalPages)].map((_, i) => (
                        <button
                            key={i}
                            className={`px-4 py-2 rounded ${
                                i + 1 === notifications.currentPage
                                    ? 'bg-primary-600 text-white'
                                    : 'bg-white hover:bg-gray-100'
                            }`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}