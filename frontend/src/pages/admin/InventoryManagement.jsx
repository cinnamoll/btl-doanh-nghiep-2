import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertTriangle, TrendingDown } from 'lucide-react';
import { inventoryService } from '../../services/inventoryService';
import { toast } from 'sonner';

export default function InventoryManagement() {
    const queryClient = useQueryClient();

    const { data: inventory } = useQuery({
        queryKey: ['inventory'],
        queryFn: inventoryService.getAll,
    });

    const updateStockMutation = useMutation({
        mutationFn: ({ skuCode, quantity }) => inventoryService.updateStock(skuCode, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries(['inventory']);
            toast.success('Stock updated successfully');
        },
    });

    const lowStockItems = inventory?.filter(item => item.quantity < 10) || [];

    return (
        <div className="space-y-6">
            {/* Low Stock Alert */}
            {lowStockItems.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-red-800">
                        <AlertTriangle className="w-5 h-5" />
                        <span className="font-semibold">
              {lowStockItems.length} items are running low on stock
            </span>
                    </div>
                </div>
            )}

            {/* Inventory Table */}
            <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                    <h2 className="text-xl font-semibold">Inventory Management</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                SKU
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Product
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Quantity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody className="divide-y">
                        {inventory?.map((item) => (
                            <tr key={item.skuCode}>
                                <td className="px-6 py-4 font-mono text-sm">{item.skuCode}</td>
                                <td className="px-6 py-4">{item.productName}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{item.quantity}</span>
                                        {item.quantity < 10 && (
                                            <TrendingDown className="w-4 h-4 text-red-500" />
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                    <span
                        className={`px-2 py-1 text-xs rounded-full ${
                            item.quantity > 50
                                ? 'bg-green-100 text-green-800'
                                : item.quantity > 10
                                    ? 'bg-yellow-100 text-yellow-800'
                                    : 'bg-red-100 text-red-800'
                        }`}
                    >
                      {item.quantity > 50 ? 'In Stock' : item.quantity > 10 ? 'Low Stock' : 'Critical'}
                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <input
                                        type="number"
                                        defaultValue={item.quantity}
                                        onBlur={(e) => {
                                            const newQty = parseInt(e.target.value);
                                            if (newQty !== item.quantity) {
                                                updateStockMutation.mutate({
                                                    skuCode: item.skuCode,
                                                    quantity: newQty,
                                                });
                                            }
                                        }}
                                        className="w-24 px-2 py-1 border rounded"
                                    />
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}