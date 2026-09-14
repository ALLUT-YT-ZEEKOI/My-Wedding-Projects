import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function CustomerLayout({ header, children, activeCategory, onSelectCategory }) {
    const user = usePage().props.auth.user;
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const categories = [
        { id: 'all', label: 'All', icon: '🌐' },
        { id: 'banquet', label: 'Banquet Halls', icon: '🏰' },
        { id: 'lawn', label: 'Lawns & Outdoor', icon: '🌿' },
        { id: 'heritage', label: 'Heritage Palaces', icon: '🏛️' },
        { id: 'resort', label: 'Luxury Resorts', icon: '💎' },
        { id: 'beach', label: 'Beachfront', icon: '⛵' },
    ];

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans text-slate-900 antialiased selection:bg-rose-100 selection:text-rose-600">
            {/* Airbnb Style Sticky Navbar */}
            <header className={`sticky top-0 z-50 bg-white transition-all duration-200 border-b border-slate-100 ${scrolled ? 'shadow-sm py-3' : 'py-4.5'}`}>
                <div className="max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-4">
                    
                    {/* Left: Brand Logo */}
                    <Link href="/" className="flex items-center gap-2 group shrink-0">
                        <div className="w-9 h-9 rounded-full bg-[#FF385C] flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
                            <span className="text-xl font-black">✦</span>
                        </div>
                        <span className="text-xl font-black tracking-tighter text-[#FF385C] hidden sm:inline-block">
                            luxe<span className="text-slate-900">halls</span>
                        </span>
                    </Link>

                    {/* Right: Host link, Language & Airbnb User Menu Button */}
                    <div className="flex items-center gap-3 shrink-0">
                        <Link
                            href={route('register')}
                            className="hidden sm:inline-block text-xs md:text-sm font-semibold text-slate-700 hover:bg-slate-50 px-4 py-2.5 rounded-full transition-colors"
                        >
                            Become a host
                        </Link>
                        
                        <button className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-700 text-sm transition-colors" title="Language & Currency">
                            🌐
                        </button>

                        {/* Airbnb Style Menu Pill Dropdown */}
                        <Dropdown>
                            <Dropdown.Trigger>
                                <button className="flex items-center gap-3 pl-3 pr-1.5 py-1.5 rounded-full border border-slate-300 hover:shadow-md transition-all bg-white cursor-pointer">
                                    <span className="text-slate-700 text-base leading-none">☰</span>
                                    <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center font-bold text-xs shadow-inner">
                                        {user ? user.name.charAt(0).toUpperCase() : '👤'}
                                    </div>
                                </button>
                            </Dropdown.Trigger>

                            <Dropdown.Content contentClasses="py-2 bg-white rounded-2xl border border-slate-100 shadow-xl w-64 mt-2">
                                {user ? (
                                    <>
                                        <div className="px-5 py-3 border-b border-slate-100">
                                            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Signed in as</p>
                                            <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                        </div>

                                        <div className="py-1">
                                            <Dropdown.Link href={route('customer.dashboard')} className="px-5 py-2.5 hover:bg-slate-50 font-semibold text-slate-700 text-sm block">
                                                My Personal Dashboard
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('customer.bookings.index')} className="px-5 py-2.5 hover:bg-slate-50 font-semibold text-slate-700 text-sm block">
                                                Trips & Bookings
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('customer.favourites.index')} className="px-5 py-2.5 hover:bg-slate-50 font-semibold text-slate-700 text-sm block">
                                                Wishlists
                                            </Dropdown.Link>
                                        </div>

                                        <div className="border-t border-slate-100 py-1">
                                            <Dropdown.Link href={route('profile.edit')} className="px-5 py-2.5 hover:bg-slate-50 text-slate-600 text-sm block">
                                                Account Settings
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('offers.index')} className="px-5 py-2.5 hover:bg-slate-50 text-slate-600 text-sm block">
                                                Exclusive Offers
                                            </Dropdown.Link>
                                        </div>

                                        <div className="border-t border-slate-100 pt-1">
                                            <Dropdown.Link href={route('logout')} method="post" as="button" className="px-5 py-2.5 text-rose-600 hover:bg-rose-50 font-bold text-sm block w-full text-left">
                                                Log Out
                                            </Dropdown.Link>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div className="py-1">
                                            <Dropdown.Link href={route('login')} className="px-5 py-2.5 hover:bg-slate-50 font-bold text-slate-900 text-sm block">
                                                Sign In
                                            </Dropdown.Link>
                                            <Dropdown.Link href={route('register')} className="px-5 py-2.5 hover:bg-slate-50 font-semibold text-slate-700 text-sm block">
                                                Sign Up
                                            </Dropdown.Link>
                                        </div>
                                        <div className="border-t border-slate-100 pt-1">
                                            <Link href={route('halls.index')} className="px-5 py-2.5 hover:bg-slate-50 text-slate-600 text-sm block">
                                                Explore Venues
                                            </Link>
                                        </div>
                                    </>
                                )}
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1">
                {header && (
                    <div className="max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 pt-6">
                        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">{header}</h1>
                    </div>
                )}
                {children}
            </main>

            {/* Airbnb Style Footer */}
            <footer className="bg-slate-50 border-t border-slate-200 mt-20 py-12 text-slate-600 text-sm">
                <div className="max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div>
                        <h3 className="font-bold text-slate-900 mb-3">Support</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:underline">Help Center</a></li>
                            <li><a href="#" className="hover:underline">AirCover for Guests</a></li>
                            <li><a href="#" className="hover:underline">Anti-discrimination</a></li>
                            <li><a href="#" className="hover:underline">Disability support</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 mb-3">Hosting</h3>
                        <ul className="space-y-2">
                            <li><Link href={route('register')} className="hover:underline">LUXEHALL your venue</Link></li>
                            <li><a href="#" className="hover:underline">AirCover for Hosts</a></li>
                            <li><a href="#" className="hover:underline">Hosting resources</a></li>
                            <li><a href="#" className="hover:underline">Community forum</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 mb-3">LUXEHALLS</h3>
                        <ul className="space-y-2">
                            <li><a href="#" className="hover:underline">Newsroom</a></li>
                            <li><a href="#" className="hover:underline">New features</a></li>
                            <li><a href="#" className="hover:underline">Careers</a></li>
                            <li><a href="#" className="hover:underline">Investors</a></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 mb-3">Top Destinations</h3>
                        <ul className="space-y-2">
                            <li><Link href={route('halls.index', { location: 'Ernakulam' })} className="hover:underline">Kochi Venues</Link></li>
                            <li><Link href={route('halls.index', { location: 'Thiruvananthapuram' })} className="hover:underline">Trivandrum Venues</Link></li>
                            <li><Link href={route('halls.index', { location: 'Thrissur' })} className="hover:underline">Thrissur Banquets</Link></li>
                            <li><Link href={route('halls.index', { location: 'Kozhikode' })} className="hover:underline">Calicut Resorts</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 mt-10 pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs">
                    <div className="flex flex-wrap items-center gap-3">
                        <span>© {new Date().getFullYear()} LUXEHALLS, Inc.</span>
                        <span>·</span>
                        <a href="#" className="hover:underline">Privacy</a>
                        <span>·</span>
                        <a href="#" className="hover:underline">Terms</a>
                        <span>·</span>
                        <a href="#" className="hover:underline">Sitemap</a>
                    </div>
                    <div className="flex items-center gap-4 font-semibold text-slate-800">
                        <span className="flex items-center gap-1 cursor-pointer">🌐 English (IN)</span>
                        <span className="cursor-pointer">₹ INR</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

