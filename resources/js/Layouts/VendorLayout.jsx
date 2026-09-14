import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function VendorLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const navItems = [
        { name: 'Dashboard', href: route('vendor.dashboard'), active: route().current('vendor.dashboard'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'Hall Management', href: route('vendor.halls.index'), active: route().current('vendor.halls.*'), icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        { name: 'Availability Calendar', href: route('vendor.availability.index'), active: route().current('vendor.availability.*'), icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { name: 'Bookings', href: route('vendor.bookings.index'), active: route().current('vendor.bookings.*'), icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
        { name: 'Customers', href: route('vendor.customers.index'), active: route().current('vendor.customers.*'), icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { name: 'Finance & Revenue', href: route('vendor.finance.index'), active: route().current('vendor.finance.*'), icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { name: 'Subscription', href: route('vendor.subscription.choose'), active: route().current('vendor.subscription.*'), icon: 'M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 z-50">
                <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-slate-900 border-r border-slate-800">
                    <div className="flex items-center flex-shrink-0 px-5 mb-6">
                        <Link href="/" className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md">
                                <ApplicationLogo className="w-5 h-5 fill-current text-white" />
                            </div>
                            <div>
                                <span className="text-white text-lg font-bold tracking-tight block">Vendor Portal</span>
                                <span className="text-xs text-indigo-400 font-medium">MyHall Business</span>
                            </div>
                        </Link>
                    </div>

                    <div className="flex-1 flex flex-col px-3">
                        <nav className="flex-1 space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center px-3.5 py-2.5 text-sm font-semibold rounded-xl transition-all duration-200 ${
                                        item.active
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                            : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    <svg className={`mr-3 flex-shrink-0 h-5 w-5 ${item.active ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                    </svg>
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    <div className="flex-shrink-0 flex bg-slate-950 p-4 border-t border-slate-800">
                        <div className="flex items-center w-full justify-between">
                            <div className="flex items-center">
                                <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-white">{user.name}</p>
                                    <p className="text-xs text-slate-400 truncate max-w-[110px]">{user.email}</p>
                                </div>
                            </div>
                            <Link href={route('logout')} method="post" as="button" title="Log Out" className="text-slate-400 hover:text-rose-400 p-1">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <div className={`md:hidden ${showingNavigationDropdown ? 'block' : 'hidden'} fixed inset-0 z-50 flex`}>
                <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-xs" onClick={() => setShowingNavigationDropdown(false)}></div>
                <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-slate-900">
                    <div className="flex items-center flex-shrink-0 px-4">
                        <span className="text-white text-xl font-bold">Vendor Portal</span>
                    </div>
                    <div className="mt-5 flex-1 h-0 overflow-y-auto">
                        <nav className="px-2 space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center px-3 py-2 text-base font-medium rounded-md ${
                                        item.active ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main Content View Container */}
            <div className="flex flex-col flex-1 w-full md:pl-64">
                <div className="sticky top-0 z-40 flex-shrink-0 flex h-16 bg-white/80 backdrop-blur-md shadow-xs border-b border-slate-200/60">
                    <button
                        type="button"
                        className="px-4 border-r border-slate-200 text-slate-500 md:hidden"
                        onClick={() => setShowingNavigationDropdown(true)}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                    </button>
                    
                    <div className="flex-1 px-4 flex justify-between sm:px-6 lg:px-8">
                        <div className="flex-1 flex items-center">
                            {header && <div className="text-xl font-bold text-slate-900 tracking-tight">{header}</div>}
                        </div>
                        <div className="ml-4 flex items-center md:ml-6 space-x-4">
                            <Link href={route('login')} className="text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors hidden sm:block">Customer Login</Link>
                            <Link href={route('register')} className="text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors hidden sm:block">Customer Registration</Link>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md shadow-sm">
                                        <button type="button" className="inline-flex items-center px-3 py-2 border border-slate-300 text-sm leading-4 font-bold rounded-full text-slate-700 bg-white hover:bg-slate-50 hover:text-slate-900 focus:outline-none transition ease-in-out duration-150">
                                            {user.name}
                                            <svg className="ml-2 -mr-0.5 h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>

                                <Dropdown.Content>
                                    <Dropdown.Link href={route('login')}>Customer Login</Dropdown.Link>
                                    <Dropdown.Link href={route('register')}>Customer Registration</Dropdown.Link>
                                    <Dropdown.Link href={route('profile.edit')}>Profile Settings</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                <main className="flex-1 relative overflow-y-auto focus:outline-none bg-slate-50/50">
                    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
