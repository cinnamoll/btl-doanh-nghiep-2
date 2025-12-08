import { useParams, Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';

export default function OrderSuccessPage() {
    const { orderId } = useParams();

    return (
        <div className="container mx-auto px-4 py-16">
            <div className="max-w-md mx-auto text-center">
                <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
                <h1 className="text-3xl font-bold mb-4">Order Successful!</h1>
                <p className="text-gray-600 mb-2">Thank you for your order</p>
                <p className="text-gray-600 mb-8">
                    Order ID: <span className="font-semibold">{orderId}</span>
                </p>
                <p className="text-gray-600 mb-8">
                    A confirmation email has been sent to your email address.
                </p>
                <div className="flex flex-col gap-4">
                    <Link
                        to="/profile?tab=orders"
                        className="btn-primary"
                    >
                        View My Orders
                    </Link>
                    <Link
                        to="/products"
                        className="btn-secondary"
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    );
}