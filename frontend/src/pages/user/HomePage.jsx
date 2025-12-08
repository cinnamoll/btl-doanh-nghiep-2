// src/pages/user/HomePage.jsx
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, ShieldCheck, Truck } from 'lucide-react';
import ProductCard from '../../components/user/ProductCard';
import { productService } from '../../services/productService';

export default function HomePage() {
    const { data: products, isLoading } = useQuery({
        queryKey: ['products', { limit: 8 }],
        queryFn: () => productService.getAll({ limit: 8 }),
    });

    return (
        <div className="min-h-screen">
            {/* Hero Banner */}
            <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
                <div className="container mx-auto px-4 py-20">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            <h1 className="text-5xl font-bold leading-tight">
                                Welcome to MicroMart
                            </h1>
                            <p className="text-xl text-primary-100">
                                Discover amazing products at unbeatable prices. Shop now and enjoy fast delivery!
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/products"
                                    className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center"
                                >
                                    Shop Now
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Link>
                                <Link
                                    to="/products?sort=popular"
                                    className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
                                >
                                    View Trending
                                </Link>
                            </div>
                        </div>
                        <div className="hidden lg:block">
                            <img
                                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800"
                                alt="Shopping"
                                className="rounded-2xl shadow-2xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Truck className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
                            <p className="text-gray-600">Free shipping on orders over $50</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <ShieldCheck className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
                            <p className="text-gray-600">100% secure payment methods</p>
                        </div>
                        <div className="text-center p-6">
                            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <TrendingUp className="w-8 h-8 text-primary-600" />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
                            <p className="text-gray-600">Competitive prices guaranteed</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">Featured Products</h2>
                            <p className="text-gray-600 mt-2">Check out our latest and most popular items</p>
                        </div>
                        <Link
                            to="/products"
                            className="text-primary-600 font-semibold hover:text-primary-700 flex items-center"
                        >
                            View All
                            <ArrowRight className="ml-2 w-5 h-5" />
                        </Link>
                    </div>

                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(8)].map((_, i) => (
                                <div key={i} className="bg-white rounded-xl h-96 animate-pulse" />
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {products?.data?.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Categories */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Shop by Category
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {[
                            { name: 'Electronics', image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', slug: 'electronics' },
                            { name: 'Fashion', image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', slug: 'fashion' },
                            { name: 'Home & Living', image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?w=400', slug: 'home' },
                            { name: 'Sports', image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400', slug: 'sports' },
                        ].map((category) => (
                            <Link
                                key={category.slug}
                                to={`/products?category=${category.slug}`}
                                className="group relative overflow-hidden rounded-xl aspect-square"
                            >
                                <img
                                    src={category.image}
                                    alt={category.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all flex items-center justify-center">
                                    <h3 className="text-white text-2xl font-bold">{category.name}</h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-16 bg-primary-600 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
                    <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
                        Get the latest updates on new products and upcoming sales
                    </p>
                    <form className="max-w-md mx-auto flex gap-4">
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-white"
                        />
                        <button
                            type="submit"
                            className="px-8 py-3 bg-white text-primary-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}

