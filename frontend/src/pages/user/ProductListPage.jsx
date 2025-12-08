import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Filter, Grid, List } from 'lucide-react';
import ProductCard from '../../components/user/ProductCard';
import FilterSidebar from '../../components/user/FilterSidebar';
import { productService } from '../../services/productService';

export default function ProductListPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [viewMode, setViewMode] = useState('grid');
    const [showFilters, setShowFilters] = useState(false);

    const filters = {
        search: searchParams.get('search') || '',
        category: searchParams.get('category') || '',
        minPrice: searchParams.get('minPrice') || '',
        maxPrice: searchParams.get('maxPrice') || '',
        sort: searchParams.get('sort') || 'name',
        page: parseInt(searchParams.get('page') || '1'),
        limit: 12,
    };

    const { data, isLoading } = useQuery({
        queryKey: ['products', filters],
        queryFn: () => productService.getAll(filters),
    });

    const updateFilters = (newFilters) => {
        const params = new URLSearchParams();
        Object.entries({ ...filters, ...newFilters }).forEach(([key, value]) => {
            if (value) params.set(key, value);
        });
        setSearchParams(params);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
                        <p className="text-gray-600 mt-1">
                            {data?.total || 0} products found
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* Sort */}
                        <select
                            value={filters.sort}
                            onChange={(e) => updateFilters({ sort: e.target.value })}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="name">Name</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                            <option value="newest">Newest</option>
                        </select>

                        {/* View Mode */}
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded ${viewMode === 'grid' ? 'bg-primary-600 text-white' : 'bg-white'}`}
                            >
                                <Grid className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary-600 text-white' : 'bg-white'}`}
                            >
                                <List className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Filter Toggle (Mobile) */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden p-2 bg-white rounded-lg"
                        >
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {/* Filters */}
                    <div className={`${showFilters ? 'block' : 'hidden'} md:block`}>
                        <FilterSidebar filters={filters} onFilterChange={updateFilters} />
                    </div>

                    {/* Products */}
                    <div className="md:col-span-3">
                        {isLoading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(12)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-xl h-96 animate-pulse" />
                                ))}
                            </div>
                        ) : (
                            <>
                                <div className={
                                    viewMode === 'grid'
                                        ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                                        : 'flex flex-col gap-4'
                                }>
                                    {data?.data?.map((product) => (
                                        <ProductCard key={product.id} product={product} viewMode={viewMode} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                {data?.totalPages > 1 && (
                                    <div className="flex justify-center mt-8 gap-2">
                                        {[...Array(data.totalPages)].map((_, i) => (
                                            <button
                                                key={i}
                                                onClick={() => updateFilters({ page: i + 1 })}
                                                className={`px-4 py-2 rounded-lg ${
                                                    filters.page === i + 1
                                                        ? 'bg-primary-600 text-white'
                                                        : 'bg-white text-gray-700 hover:bg-gray-100'
                                                }`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
