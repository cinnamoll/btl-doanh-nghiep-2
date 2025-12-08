import { Outlet } from 'react-router-dom';
import Header from '../components/user/Header';
import Footer from '../components/user/Footer';
import AIChatWidget from '../components/user/AIChatWidget.jsx';

export default function UserLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <Outlet />
            </main>
            <Footer />
            <AIChatWidget />
        </div>
    );
}