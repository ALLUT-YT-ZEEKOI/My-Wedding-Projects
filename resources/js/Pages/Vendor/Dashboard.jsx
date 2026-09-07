import VendorLayout from '@/Layouts/VendorLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard({ metrics, recentBookings, halls }) {
    return (
        <VendorLayout header="Vendor Dashboard">
            <Head title="Vendor Dashboard" />

            {/* Top Quick Actions Bar */}
            <div className="flex flex-wrap gap-3 mb-8">
                <Link
                    href={route('vendor.halls.create')}
                    className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md shadow-indigo-600/20 transition-all flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
                    Add / Edit Hall
                </Link>
                <Link
                    href={route('vendor.availability.index')}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-xs transition-all flex items-center gap-2"
                >
                    <svg className="w-4 h-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    Manage Availability
                </Link>
                <Link
                    href={route('vendor.availability.index') + '?action=offline'}
                    className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
                >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                    Add Offline Booking
                </Link>
                <Link
                    href={route('vendor.bookings.index')}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-xs transition-all flex items-center gap-2"
                >
                    <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" /></svg>
                    View Bookings
                </Link>
                <Link
                    href={route('vendor.finance.index')}
                    className="px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-xs transition-all flex items-center gap-2"
                >
                    <svg className="w-4 h-4 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1" /></svg>
                    View Revenue
                </Link>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Total Bookings</div>
                    <div className="text-3xl font-extrabold text-slate-900">{metrics.totalBookings}</div>
                    <div className="mt-2 text-xs text-slate-500 font-medium">Across all registered halls</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">Upcoming Events</div>
                    <div className="text-3xl font-extrabold text-emerald-600">{metrics.upcomingEvents}</div>
                    <div className="mt-2 text-xs text-emerald-700 font-medium">Confirmed future dates</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-600 mb-1">Pending Requests</div>
                    <div className="text-3xl font-extrabold text-amber-600">{metrics.pendingBookings}</div>
                    <div className="mt-2 text-xs text-amber-700 font-medium">Awaiting vendor confirmation</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">Monthly Revenue</div>
                    <div className="text-3xl font-extrabold text-indigo-600">₹{Number(metrics.monthlyRevenue).toLocaleString('en-IN')}</div>
                    <div className="mt-2 text-xs text-indigo-700 font-medium">This month's earnings</div>
                </div>
            </div>

            {/* Subscription & Status Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-6 mb-8 text-white flex flex-col md:flex-row items-center justify-between gap-4 border border-indigo-900/40 shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center text-2xl font-bold">
                        ⭐
                    </div>
                    <div>
                        <div className="text-xs font-bold uppercase text-amber-400 tracking-wider mb-0.5">Founding Vendor Subscription</div>
                        <div className="text-lg font-bold">Status: {metrics.subscriptionStatus}</div>
                        <p className="text-xs text-slate-300">Enjoy complete access to Hall Setup, Pricing, Availability Calendar, and Bookings.</p>
                    </div>
                </div>
                <Link
                    href={route('vendor.subscription.choose')}
                    className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-all whitespace-nowrap shadow-lg shadow-amber-500/20"
                >
                    Manage Subscription (₹200/yr) &rarr;
                </Link>
            </div>

            {/* Registered Halls & Recent Bookings */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                
                {/* Halls Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900">My Wedding Halls ({halls.length})</h3>
                        <Link href={route('vendor.halls.create')} className="text-xs font-bold text-indigo-600 hover:underline">
                            + Add New Hall
                        </Link>
                    </div>

                    {halls.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl">
                            <p className="text-slate-500 text-sm font-medium">No halls added yet.</p>
                            <Link href={route('vendor.halls.create')} className="mt-3 inline-block px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold">
                                Create First Hall
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {halls.map((hall) => (
                                <div key={hall.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 flex justify-between items-center hover:bg-white hover:shadow-md transition-all">
                                    <div>
                                        <h4 className="font-bold text-slate-900">{hall.name}</h4>
                                        <p className="text-xs text-slate-500">{hall.location} &bull; Capacity: {hall.capacity} guests</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${hall.status === 'live' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                                            {hall.status === 'live' ? 'Live' : 'Pending Review'}
                                        </span>
                                        <Link href={route('vendor.halls.edit', hall.id)} className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-100">
                                            Edit
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Bookings Card */}
                <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-bold text-slate-900">Recent Bookings</h3>
                        <Link href={route('vendor.bookings.index')} className="text-xs font-bold text-indigo-600 hover:underline">
                            View All &rarr;
                        </Link>
                    </div>

                    {recentBookings.length === 0 ? (
                        <div className="text-center py-10 border-2 border-dashed border-slate-100 rounded-xl">
                            <p className="text-slate-500 text-sm font-medium">No bookings received yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentBookings.map((b) => (
                                <div key={b.id} className="p-3.5 rounded-xl border border-slate-100 flex justify-between items-center text-sm">
                                    <div>
                                        <div className="font-bold text-slate-900">{b.customer_name} ({b.event_type})</div>
                                        <div className="text-xs text-slate-500">{b.event_date} &bull; {b.slot.toUpperCase()}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-extrabold text-slate-900">₹{Number(b.booking_amount).toLocaleString('en-IN')}</div>
                                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                            b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                            b.status === 'completed' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {b.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </VendorLayout>
    );
}
