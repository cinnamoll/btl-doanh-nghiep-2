export default function FilterSidebar({ filters, onFilterChange }) {
    const categories = ['Electronics', 'Fashion', 'Home', 'Sports', 'Books'];

    return (
        <div className="bg-white rounded-xl p-6 space-y-6">
            <div>
                <h3 className="font-semibold text-lg mb-4">Filters</h3>

                {/* Category */}
                <div className="mb-6">
                    <h4 className="font-medium mb-3">Category</h4>
                    <div className="space-y-2">
                        {categories.map((cat) => (
                            <label key={cat} className="flex items-center">
                                <input
                                    type="radio"
                                    name="category"
                                    checked={filters.category === cat.toLowerCase()}
                                    onChange={() => onFilterChange({ category: cat.toLowerCase() })}
                                    className="mr-2"
                                />
                                {cat}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Range */}
                <div className="mb-6">
                    <h4 className="font-medium mb-3">Price Range</h4>
                    <div className="space-y-2">
                        <input
                            type="number"
                            placeholder="Min"
                            value={filters.minPrice}
                            onChange={(e) => onFilterChange({ minPrice: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        />
                        <input
                            type="number"
                            placeholder="Max"
                            value={filters.maxPrice}
                            onChange={(e) => onFilterChange({ maxPrice: e.target.value })}
                            className="w-full px-3 py-2 border rounded"
                        />
                    </div>
                </div>

                <button
                    onClick={() => onFilterChange({ category: '', minPrice: '', maxPrice: '' })}
                    className="w-full py-2 text-sm text-primary-600 hover:underline"
                >
                    Clear All Filters
                </button>
            </div>
        </div>
    );
}