import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function CustomerLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Dashboard', href: route('customer.dashboard'), active: route().current('customer.dashboard') },
        { name: 'My Bookings', href: route('customer.bookings.index'), active: route().current('customer.bookings.*') },
        { name: 'Wishlist', href: route('customer.favourites.index'), active: route().current('customer.favourites.*') },
        { name: 'Browse Halls', href: route('halls.index'), active: route().current('halls.*') },
        { name: 'Offers', href: route('offers.index'), active: route().current('offers.*') },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-rose-200">
            {/* Premium Glass Navbar - Always visible background for readability */}
            <nav className={`fixed w-full z-50 transition-all duration-300 border-b bg-white/90 backdrop-blur-md shadow-sm ${scrolled ? 'py-2 border-slate-200' : 'py-4 border-slate-100'}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-8">
                            <Link href="/" className="flex items-center gap-3 group">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-rose-600 transition-transform group-hover:scale-110" />
                                <span className="text-2xl font-black tracking-tighter text-slate-900">LUXE<span className="text-rose-600">HALLS</span></span>
                            </Link>

                            <div className="hidden md:flex space-x-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${
                                            item.active
                                                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                                                : 'text-slate-700 hover:bg-slate-100 hover:text-rose-600'
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            {user ? (
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center space-x-2 px-1.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 border border-slate-200/50 shadow-sm transition-all focus:outline-none">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center font-bold shadow-inner">
                                                {user.name.charAt(0)}
                                            </div>
                                            <span className="text-sm font-bold text-slate-800 pr-2 hidden sm:block">{user.name}</span>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content contentClasses="py-2 bg-white rounded-2xl border border-slate-100 shadow-2xl">
                                        <div className="px-4 py-3 border-b border-slate-100 mb-2">
                                            <p className="text-xs text-slate-500">Signed in as</p>
                                            <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                                        </div>
                                        <Dropdown.Link href={route('customer.dashboard')} className="hover:text-rose-600 font-medium block w-full text-left">Dashboard</Dropdown.Link>
                                        <Dropdown.Link href={route('customer.bookings.index')} className="hover:text-rose-600 font-medium block w-full text-left">My Bookings</Dropdown.Link>
                                        <Dropdown.Link href={route('profile.edit')} className="hover:text-rose-600 font-medium block w-full text-left">Account Settings</Dropdown.Link>
                                        <div className="border-t border-slate-100 mt-2 pt-2">
                                            <Dropdown.Link href={route('logout')} method="post" as="button" className="text-red-600 hover:text-red-700 hover:bg-red-50 font-bold block w-full text-left">Log Out</Dropdown.Link>
                                        </div>
                                    </Dropdown.Content>
                                </Dropdown>
                            ) : (
                                <div className="space-x-3 flex items-center">
                                    <Link href={route('login')} className="text-sm font-bold text-slate-700 hover:text-rose-600 transition-colors">Sign In</Link>
                                    <Link href={route('register')} className="px-5 py-2.5 text-sm font-bold bg-slate-900 hover:bg-rose-600 text-white rounded-full shadow-lg hover:shadow-rose-600/30 transition-all transform hover:-translate-y-0.5">Register</Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content with top padding to account for fixed navbar */}
            <main className="flex-1 pt-[72px]">
                {header && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-up">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{header}</h1>
                    </div>
                )}
                <div className="animate-fade-up">
                    {children}
                </div>
            </main>

            {/* Premium Footer */}
            <footer className="bg-slate-950 text-slate-300 pt-20 pb-10 mt-auto border-t border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-rose-600/10 blur-[120px] rounded-full pointer-events-none"></div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
                    <div className="md:col-span-4 space-y-6">
                        <div className="flex items-center space-x-3">
                            <ApplicationLogo className="h-8 w-auto fill-current text-rose-500" />
                            <span className="text-2xl font-black tracking-tighter text-white">LUXE<span className="text-rose-500">HALLS</span></span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                            India's most trusted luxury event venue network. Discover, compare, and instantly book the perfect banquet hall for your most precious moments.
                        </p>
                    </div>
                    
                    <div className="md:col-span-2 md:col-start-7">
                        <h4 className="text-sm font-black uppercase tracking-widest text-white mb-6">Discover</h4>
                        <ul className="space-y-4 text-sm font-medium text-slate-400">
                            <li><Link href={route('halls.index')} className="hover:text-rose-400 transition-colors">All Venues</Link></li>
                            <li><Link href={route('halls.index', { event_type: 'Wedding' })} className="hover:text-rose-400 transition-colors">Weddings</Link></li>
                            <li><Link href={route('halls.index', { event_type: 'Corporate' })} className="hover:text-rose-400 transition-colors">Corporate Events</Link></li>
                            <li><Link href={route('offers.index')} className="hover:text-rose-400 transition-colors flex items-center gap-2">Offers <span className="bg-rose-500/20 text-rose-400 text-[10px] px-2 py-0.5 rounded-full font-bold">HOT</span></Link></li>
                        </ul>
                    </div>
                    
                    <div className="md:col-span-3">
                        <h4 className="text-sm font-black uppercase tracking-widest text-white mb-6">Support & Contact</h4>
                        <ul className="space-y-4 text-sm font-medium text-slate-400">
                            <li className="flex items-start gap-3">
                                <span className="text-rose-500">📍</span> 124 Luxury Avenue, Mumbai 400001
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-rose-500">📞</span> <span className="font-bold text-white">+91 1800-LUXE-HALL</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <span className="text-rose-500">✉️</span> VIP@luxehalls.com
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
                    <p className="text-xs font-semibold text-slate-500">
                        © {new Date().getFullYear()} LUXEHALLS Platform. Crafted with precision.
                    </p>
                    <div className="flex gap-6 text-xs font-semibold text-slate-500">
                        <Link href={route('register')} className="hover:text-white transition-colors">Partner with Us (Vendors)</Link>
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
