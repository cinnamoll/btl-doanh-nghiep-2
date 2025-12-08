export default function Header() {
    return (
        <header className="w-full bg-white shadow-md p-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">E-Commerce</h1>
            <nav className="flex gap-4">
                <a href="/frontend/public" className="hover:underline">Home</a>
                <a href="/products" className="hover:underline">Products</a>
                <a href="/cart" className="hover:underline">Cart</a>
                <a href="/profile" className="hover:underline">Profile</a>
            </nav>
        </header>
    );
}