import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    // Sidebar navigation items
    const navItems = [
        { name: 'Dashboard', href: route('customer.dashboard'), active: route().current('customer.dashboard'), icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
        { name: 'My Halls', href: route('vendor.halls.index'), active: route().current('vendor.halls.*'), icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
        // Add Admin conditional nav if needed later, but sticking to Vendor mostly
    ];

    if (user.email === 'admin@myhall.com') { // Basic check for demo
        navItems.push({ name: 'Admin Dashboard', href: route('admin.dashboard'), active: route().current('admin.dashboard'), icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z' });
    }

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans text-gray-900">
            {/* Sidebar (Desktop) */}
            <div className="hidden md:flex md:w-64 md:flex-col fixed inset-y-0 z-50">
                <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-gray-900 border-r border-gray-800">
                    <div className="flex items-center flex-shrink-0 px-4">
                        <Link href="/" className="flex items-center gap-3">
                            <ApplicationLogo className="block h-8 w-auto fill-current text-indigo-500" />
                            <span className="text-white text-xl font-bold tracking-tight">My Hall</span>
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
                                            ? 'bg-indigo-600 text-white shadow-md'
                                            : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                                    }`}
                                >
                                    <svg className={`mr-3 flex-shrink-0 h-5 w-5 ${item.active ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
                                    </svg>
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex-shrink-0 flex bg-gray-950 p-4 border-t border-gray-800">
                        <div className="flex items-center w-full">
                            <div>
                                <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">
                                    {user.name.charAt(0)}
                                </div>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-white">{user.name}</p>
                                <p className="text-xs font-medium text-gray-400 group-hover:text-gray-300">{user.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile menu (Hidden initially) - simplified for demo */}
            <div className={`md:hidden ${showingNavigationDropdown ? 'block' : 'hidden'} fixed inset-0 z-40 flex`}>
                {/* Overlay */}
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setShowingNavigationDropdown(false)}></div>
                <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-900">
                    <div className="flex items-center flex-shrink-0 px-4">
                        <span className="text-white text-xl font-bold">My Hall</span>
                    </div>
                    <div className="mt-5 flex-1 h-0 overflow-y-auto">
                        <nav className="px-2 space-y-1">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                                        item.active ? 'bg-indigo-600 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                                    }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col flex-1 w-full md:pl-64">
                {/* Glassmorphic Top Header */}
                <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white/70 backdrop-blur-md shadow-sm border-b border-gray-200/50">
                    <button
                        type="button"
                        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
                        onClick={() => setShowingNavigationDropdown(true)}
                    >
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h7" />
                        </svg>
                    </button>
                    
                    <div className="flex-1 px-4 flex justify-between sm:px-6 lg:px-8">
                        <div className="flex-1 flex items-center">
                            {header && (
                                <div className="text-xl font-bold text-gray-900 tracking-tight">{header}</div>
                            )}
                        </div>
                        <div className="ml-4 flex items-center md:ml-6">
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <span className="inline-flex rounded-md shadow-sm">
                                        <button type="button" className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 hover:text-gray-900 focus:outline-none transition ease-in-out duration-150">
                                            {user.name}
                                            <svg className="ml-2 -mr-0.5 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </span>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('profile.edit')}>Profile Settings</Dropdown.Link>
                                    <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>
                    </div>
                </div>

                <main className="flex-1 relative overflow-y-auto focus:outline-none bg-gray-50/50">
                    <div className="py-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
