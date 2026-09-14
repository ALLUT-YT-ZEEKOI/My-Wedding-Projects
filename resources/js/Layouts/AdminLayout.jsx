import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AdminLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const navItems = [
        { name: 'Dashboard', href: route('admin.dashboard'), active: route().current('admin.dashboard'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'Vendors', href: route('admin.vendors.index'), active: route().current('admin.vendors.*'), icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
        { name: 'Halls', href: route('admin.halls.index'), active: route().current('admin.halls.*'), icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0h6m-6 0V11m6 10V11m-6 0a1 1 0 00-1 1v7a1 1 0 001 1h2a1 1 0 001-1v-7a1 1 0 00-1-1h-2z' },
        { name: 'Bookings', href: route('admin.bookings.index'), active: route().current('admin.bookings.*'), icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
        { name: 'Customers', href: route('admin.customers.index'), active: route().current('admin.customers.*'), icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z' },
        { name: 'Subscriptions', href: route('admin.subscriptions.index'), active: route().current('admin.subscriptions.*'), icon: 'M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z' },
        { name: 'Payments & Refunds', href: route('admin.payments.index'), active: route().current('admin.payments.*'), icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        { name: 'Reviews', href: route('admin.reviews.index'), active: route().current('admin.reviews.*'), icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z' },
        { name: 'Offers & Promos', href: route('admin.offers.index'), active: route().current('admin.offers.*'), icon: 'M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' },
        { name: 'Support & Tickets', href: route('admin.support.index'), active: route().current('admin.support.*'), icon: 'M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z' },
        { name: 'Reports & Audits', href: route('admin.reports.index'), active: route().current('admin.reports.*'), icon: 'M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
            {/* Sidebar (Desktop) */}
            <div className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 z-50">
                <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-slate-900 border-r border-slate-800">
                    <div className="flex items-center flex-shrink-0 px-4">
                        <Link href="/" className="flex items-center gap-3">
                            <ApplicationLogo className="block h-8 w-auto fill-current text-rose-500" />
                            <span className="text-white text-xl font-bold tracking-tight">Admin Portal</span>
                        </Link>
                    </div>
                    <div className="mt-8 flex-1 flex flex-col">
                        <nav className="flex-1 px-2 space-y-2">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 ${
                                        item.active
                                            ? 'bg-rose-600 text-white shadow-md'
                                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
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
                        <div className="flex items-center w-full">
                            <div>
                                <div className="h-9 w-9 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold text-sm">
                                    {user.name.charAt(0)}
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-white">{user.name}</p>
                                <p className="text-xs font-medium text-slate-400 group-hover:text-slate-300">Super Admin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu logic omitted for brevity */}
            <div className={`md:hidden ${showingNavigationDropdown ? 'block' : 'hidden'} fixed inset-0 z-40 flex`}>
                <div className="fixed inset-0 bg-slate-600 bg-opacity-75" onClick={() => setShowingNavigationDropdown(false)}></div>
                <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-slate-900">
                    <div className="flex items-center flex-shrink-0 px-4">
                        <span className="text-white text-xl font-bold">Admin Portal</span>
                    </div>
                    <div className="mt-5 flex-1 h-0 overflow-y-auto">
                        <nav className="px-2 space-y-1">
                            {navItems.map((item) => (
                                <Link key={item.name} href={item.href} className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${item.active ? 'bg-rose-600 text-white' : 'text-slate-300 hover:bg-slate-700 hover:text-white'}`}>
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 w-full md:pl-64">
                <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white/70 backdrop-blur-md shadow-sm border-b border-gray-200/50">
                    <button type="button" className="px-4 border-r border-gray-200 text-gray-500 md:hidden" onClick={() => setShowingNavigationDropdown(true)}>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
                    </button>
                    
                    <div className="flex-1 px-4 flex justify-between sm:px-6 lg:px-8">
                        <div className="flex-1 flex items-center">
                            {header && <div className="text-xl font-bold text-gray-900 tracking-tight">{header}</div>}
                        </div>
                        <div className="ml-4 flex items-center md:ml-6 space-x-4">
                            <Link href={route('login')} className="text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors hidden sm:block">Customer Login</Link>
                            <Link href={route('register')} className="text-sm font-bold text-slate-500 hover:text-rose-600 transition-colors hidden sm:block">Customer Registration</Link>
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md shadow-sm">
                                        <button type="button" className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 transition ease-in-out duration-150">
                                            {user.name}
                                            <svg className="ml-2 -mr-0.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('login')}>Customer Login</Dropdown.Link>
                                    <Dropdown.Link href={route('register')}>Customer Registration</Dropdown.Link>
                                    <Dropdown.Link href={route('profile.edit')}>Profile Settings</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                <main className="flex-1 relative overflow-y-auto focus:outline-none bg-slate-50/50">
                    <div className="py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
