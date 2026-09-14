import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function CustomerLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [scrolled, setScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navItems = [
        { name: 'Dashboard', href: route('customer.dashboard'), active: route().current('customer.dashboard'), auth: true },
        { name: 'My Bookings', href: route('customer.bookings.index'), active: route().current('customer.bookings.*'), auth: true },
        { name: 'Wishlist', href: route('customer.favourites.index'), active: route().current('customer.favourites.*'), auth: true },
        { name: 'Browse Halls', href: route('halls.index'), active: route().current('halls.*') },
        { name: 'Offers', href: route('offers.index'), active: route().current('offers.*') },
    ].filter((item) => !item.auth || user);

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-rose-200">
            <nav
                className={`fixed w-full z-50 transition-all duration-300 border-b bg-white/95 backdrop-blur-md shadow-sm ${
                    scrolled ? 'py-2 border-slate-200' : 'py-4 border-slate-100'
                }`}
            >
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-8">
                            <Link href="/" className="flex items-center gap-3 group">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-rose-600 transition-transform group-hover:scale-105" />
                                <span className="text-2xl font-black tracking-tighter text-slate-900">
                                    LUXE<span className="text-rose-600">HALLS</span>
                                </span>
                            </Link>

                            <div className="hidden lg:flex items-center gap-1">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                                            item.active
                                                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                                                : 'text-slate-700 hover:bg-slate-100 hover:text-rose-600'
                                        }`}
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            {user ? (
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200/60 shadow-sm transition-all focus:outline-none">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-inner">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <span className="text-sm font-bold text-slate-800 pr-1 hidden sm:block">{user.name}</span>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content contentClasses="py-2 bg-white rounded-xl border border-slate-100 shadow-xl">
                                        <div className="px-4 py-3 border-b border-slate-100 mb-1">
                                            <p className="text-xs text-slate-500">Signed in as</p>
                                            <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                                        </div>
                                        <Dropdown.Link href={route('customer.dashboard')} className="hover:text-rose-600 font-medium">
                                            Dashboard
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('customer.bookings.index')} className="hover:text-rose-600 font-medium">
                                            My Bookings
                                        </Dropdown.Link>
                                        <Dropdown.Link href={route('profile.edit')} className="hover:text-rose-600 font-medium">
                                            Account Settings
                                        </Dropdown.Link>
                                        <div className="border-t border-slate-100 mt-1 pt-1">
                                            <Dropdown.Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="text-red-600 hover:text-red-700 hover:bg-red-50 font-bold"
                                            >
                                                Log Out
                                            </Dropdown.Link>
                                        </div>
                                    </Dropdown.Content>
                                </Dropdown>
                            ) : (
                                <div className="hidden sm:flex items-center gap-3">
                                    <Link href={route('login')} className="text-sm font-bold text-slate-700 hover:text-rose-600 transition-colors">
                                        Sign In
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="px-5 py-2.5 text-sm font-bold bg-slate-900 hover:bg-rose-600 text-white rounded-lg shadow-md transition-all"
                                    >
                                        Register
                                    </Link>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => setMobileOpen((v) => !v)}
                                className="lg:hidden p-2 rounded-lg text-slate-700 hover:bg-slate-100"
                                aria-label="Toggle menu"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {mobileOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {mobileOpen && (
                        <div className="lg:hidden mt-3 pb-3 border-t border-slate-100 pt-3 space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`block px-4 py-2.5 rounded-lg text-sm font-bold ${
                                        item.active ? 'bg-rose-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            {!user && (
                                <div className="flex gap-2 pt-2 px-1 sm:hidden">
                                    <Link href={route('login')} className="flex-1 text-center py-2.5 text-sm font-bold border border-slate-200 rounded-lg">
                                        Sign In
                                    </Link>
                                    <Link href={route('register')} className="flex-1 text-center py-2.5 text-sm font-bold bg-slate-900 text-white rounded-lg">
                                        Register
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            <main className="flex-1 pt-[72px]">
                {header && (
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">{header}</h1>
                    </div>
                )}
                {children}
            </main>

            <footer className="bg-slate-950 text-slate-300 pt-16 pb-10 mt-auto border-t border-slate-800 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-rose-600/10 blur-[120px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">
                    <div className="md:col-span-4 space-y-5">
                        <div className="flex items-center gap-3">
                            <ApplicationLogo className="h-8 w-auto fill-current text-rose-500" />
                            <span className="text-2xl font-black tracking-tighter text-white">
                                LUXE<span className="text-rose-500">HALLS</span>
                            </span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
                            India&apos;s trusted luxury event venue network. Discover, compare, and book the perfect banquet hall for your most precious moments.
                        </p>
                    </div>

                    <div className="md:col-span-2 md:col-start-7">
                        <h4 className="text-sm font-black uppercase tracking-widest text-white mb-5">Discover</h4>
                        <ul className="space-y-3 text-sm font-medium text-slate-400">
                            <li>
                                <Link href={route('halls.index')} className="hover:text-rose-400 transition-colors">
                                    All Venues
                                </Link>
                            </li>
                            <li>
                                <Link href={route('halls.index', { event_type: 'Wedding' })} className="hover:text-rose-400 transition-colors">
                                    Weddings
                                </Link>
                            </li>
                            <li>
                                <Link href={route('halls.index', { event_type: 'Corporate' })} className="hover:text-rose-400 transition-colors">
                                    Corporate Events
                                </Link>
                            </li>
                            <li>
                                <Link href={route('offers.index')} className="hover:text-rose-400 transition-colors">
                                    Offers
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div className="md:col-span-3">
                        <h4 className="text-sm font-black uppercase tracking-widest text-white mb-5">Support & Contact</h4>
                        <ul className="space-y-3 text-sm font-medium text-slate-400">
                            <li>124 Luxury Avenue, Mumbai 400001</li>
                            <li>
                                <span className="font-bold text-white">+91 1800-LUXE-HALL</span>
                            </li>
                            <li>VIP@luxehalls.com</li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-4 relative z-10">
                    <p className="text-xs font-semibold text-slate-500">
                        &copy; {new Date().getFullYear()} LUXEHALLS Platform. All rights reserved.
                    </p>
                    <div className="flex gap-6 text-xs font-semibold text-slate-500">
                        <Link href={route('register')} className="hover:text-white transition-colors">
                            Partner with Us
                        </Link>
                        <a href="#" className="hover:text-white transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="hover:text-white transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
