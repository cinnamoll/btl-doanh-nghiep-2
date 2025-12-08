import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Eye, Filter } from 'lucide-react';
import { orderService } from '../../services/orderService';
import { toast } from 'sonner';

export default function OrderManagement() {
    const [statusFilter, setStatusFilter] = useState('all');
    const queryClient = useQueryClient();

    const { data: orders, isLoading } = useQuery({
        queryKey: ['admin-orders', statusFilter],
        queryFn: () => orderService.getAll({ status: statusFilter !== 'all' ? statusFilter : undefined }),
    });

    const updateStatusMutation = useMutation({
        mutationFn: ({ id, status }) => orderService.updateStatus(id, status),
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-orders']);
            toast.success('Order status updated');
        },
    });

    return (
        <div className="space-y-6">
            {/* Filters */}
            <div className="flex items-center gap-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg"
                >
                    <option value="all">All Orders</option>
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Order ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Items
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Total
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {orders?.data?.map((order) => (
                        <tr key={order.id}>
                            <td className="px-6 py-4 font-medium">{order.orderNumber}</td>
                            <td className="px-6 py-4">{order.customerName}</td>
                            <td className="px-6 py-4">{order.items?.length || 0} items</td>
                            <td className="px-6 py-4 font-medium">${order.total?.toFixed(2)}</td>
                            <td className="px-6 py-4">
                                <select
                                    value={order.status}
                                    onChange={(e) =>
                                        updateStatusMutation.mutate({ id: order.id, status: e.target.value })
                                    }
                                    className="px-2 py-1 text-xs border rounded"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded">
                                    <Eye className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}