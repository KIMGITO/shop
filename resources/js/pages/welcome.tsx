import WavyBg from './sections/AppWaveBg';
import Footer from './sections/Footer';
import AppHeader from './sections/Header';
import Hello from './sections/Hello';
import Products from './sections/Product';
import Testimonials from './sections/Testimonials';

export default function Welcome() {
    const menuItems = [
        {
            title: 'Home',
            href: '/',
            description: "Welcome to KayKay's Dairy",
            subItems: [
                {
                    title: 'Welcome',
                    href: '/',
                    description: 'Discover our farm fresh products',
                },
                {
                    title: 'Special Offers',
                    href: '/offers',
                    description: 'Current promotions and discounts',
                },
                {
                    title: 'Our Story',
                    href: '/story',
                    description: 'Learn about our dairy farm history',
                },
            ],
        },
        {
            title: 'Products',
            href: '/products',
            description: 'Our farm fresh offerings',
            subItems: [
                {
                    title: 'Milk Products',
                    href: '/products/milk',
                    description: 'Fresh milk varieties',
                },
                {
                    title: 'Cheese',
                    href: '/products/cheese',
                    description: 'Artisanal cheese selection',
                },
                {
                    title: 'Yogurt',
                    href: '/products/yogurt',
                    description: 'Creamy yogurt options',
                },
                {
                    title: 'Specialty Items',
                    href: '/products/specialty',
                    description: 'Seasonal and specialty products',
                },
            ],
        },
        {
            title: 'About',
            href: '/about',
            description: 'Learn about our farm',
            subItems: [
                {
                    title: 'Our Farm',
                    href: '/about/farm',
                    description: 'See where our products come from',
                },
                {
                    title: 'Sustainability',
                    href: '/about/sustainability',
                    description: 'Our eco-friendly practices',
                },
                {
                    title: 'Team',
                    href: '/about/team',
                    description: 'Meet the people behind our dairy',
                },
            ],
        },
        {
            title: 'Delivery',
            href: '/delivery',
            description: 'How we get products to you',
            subItems: [
                {
                    title: 'Areas Covered',
                    href: '/delivery/areas',
                    description: 'Check if we deliver to your location',
                },
                {
                    title: 'Schedule',
                    href: '/delivery/schedule',
                    description: 'Delivery days and times',
                },
                {
                    title: 'Subscription',
                    href: '/delivery/subscription',
                    description: 'Regular delivery options',
                },
            ],
        },
        {
            title: 'Contact',
            href: '/contact',
            description: 'Get in touch with us',
            subItems: [
                {
                    title: 'Visit Us',
                    href: '/contact/visit',
                    description: 'Farm location and visiting hours',
                },
                {
                    title: 'Customer Service',
                    href: '/contact/service',
                    description: 'Questions and support',
                },
                {
                    title: 'Wholesale',
                    href: '/contact/wholesale',
                    description: 'Inquiries for businesses',
                },
            ],
        },
    ];

    return (
        <div className="from-pink-200-50 bg--300 relative min-h-screen overflow-hidden bg-gradient-to-r bg-amber-900 to-pink-300">
            {/* Milky Wave Background */}
            <WavyBg />
            <AppHeader />

            {/* Horizontal Main Content */}
            <Hello />

            {/* Our Products Section */}
            <Products />
            {/* Testimonials Section */}
            <Testimonials />

            {/* Footer large screen */}

            {/* Footer small screen */}
            <Footer />
        </div>
    );
}
