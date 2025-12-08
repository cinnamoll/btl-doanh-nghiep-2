import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { productService } from '../../services/productService';
import { toast } from 'sonner';

export default function ProductManagement() {
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const queryClient = useQueryClient();

    const { data: products, isLoading } = useQuery({
        queryKey: ['admin-products', searchQuery],
        queryFn: () => productService.getAll({ search: searchQuery }),
    });

    const deleteMutation = useMutation({
        mutationFn: productService.delete,
        onSuccess: () => {
            queryClient.invalidateQueries(['admin-products']);
            toast.success('Product deleted successfully');
        },
    });

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to delete this product?')) {
            deleteMutation.mutate(id);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                    />
                </div>
                <button
                    onClick={() => {
                        setEditingProduct(null);
                        setShowModal(true);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                >
                    <Plus className="w-5 h-5" />
                    Add Product
                </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Stock
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                            Actions
                        </th>
                    </tr>
                    </thead>
                    <tbody className="divide-y">
                    {products?.data?.map((product) => (
                        <tr key={product.id}>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img
                                        src={product.imageUrl || 'https://via.placeholder.com/50'}
                                        alt={product.name}
                                        className="w-12 h-12 rounded object-cover"
                                    />
                                    <div>
                                        <p className="font-medium">{product.name}</p>
                                        <p className="text-sm text-gray-500">{product.skuCode}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">{product.category}</td>
                            <td className="px-6 py-4 font-medium">${product.price}</td>
                            <td className="px-6 py-4">
                  <span
                      className={`px-2 py-1 text-xs rounded-full ${
                          product.stock > 10
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                      }`}
                  >
                    {product.stock || 0} units
                  </span>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditingProduct(product);
                                            setShowModal(true);
                                        }}
                                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Product Modal would go here */}
        </div>
    );
}
