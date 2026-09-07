import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Dashboard({ stats, pendingVendors = [], pendingHalls = [], recentActivities = [] }) {
    const { post, processing } = useForm();

    const handleApproveVendor = (id) => {
        post(route('admin.vendors.approve', id));
    };

    const handleApproveHall = (id) => {
        post(route('admin.halls.approve', id));
    };

    return (
        <AdminLayout header="Super Admin Control Center">
            <Head title="Admin Dashboard" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                
                {/* Stats Overview */}
                {stats && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Vendors</span>
                            <div className="flex items-baseline justify-between mt-2">
                                <span className="text-3xl font-extrabold text-slate-900">{stats.total_vendors || 0}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-amber-100 text-amber-800">{stats.pending_vendors || 0} Pending</span>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Listed Halls</span>
                            <div className="flex items-baseline justify-between mt-2">
                                <span className="text-3xl font-extrabold text-slate-900">{stats.total_halls || 0}</span>
                                <span className="text-xs px-2 py-0.5 rounded-full font-bold bg-emerald-100 text-emerald-800">{stats.live_halls || 0} Live</span>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Bookings</span>
                            <div className="flex items-baseline justify-between mt-2">
                                <span className="text-3xl font-extrabold text-slate-900">{stats.total_bookings || 0}</span>
                                <Link href={route('admin.bookings.index')} className="text-xs font-bold text-rose-600 hover:underline">View All</Link>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">Platform Revenue</span>
                            <div className="flex items-baseline justify-between mt-2">
                                <span className="text-2xl font-extrabold text-emerald-600">₹{(stats.total_revenue || 0).toLocaleString()}</span>
                                <span className="text-xs text-slate-400">Completed</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Quick Actions Grid */}
                <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-md">
                    <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Quick Management Navigation</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        <Link href={route('admin.vendors.index')} className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl text-center text-xs font-medium transition">
                            👥 Vendor Directory
                        </Link>
                        <Link href={route('admin.halls.index')} className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl text-center text-xs font-medium transition">
                            🏛️ Hall Verification
                        </Link>
                        <Link href={route('admin.subscriptions.index')} className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl text-center text-xs font-medium transition">
                            💳 Subscriptions
                        </Link>
                        <Link href={route('admin.payments.index')} className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl text-center text-xs font-medium transition">
                            💰 Payments & Refunds
                        </Link>
                        <Link href={route('admin.offers.index')} className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl text-center text-xs font-medium transition">
                            🏷️ Promo Codes
                        </Link>
                        <Link href={route('admin.support.index')} className="bg-slate-800 hover:bg-slate-700 p-3 rounded-xl text-center text-xs font-medium transition">
                            🎧 Support Tickets
                        </Link>
                    </div>
                </div>

                {/* Pending Vendors Section */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Pending Vendor Verification</h3>
                            <p className="mt-1 text-sm text-gray-500">Review and approve vendor business credentials.</p>
                        </div>
                        <Link href={route('admin.vendors.index')} className="text-sm font-semibold text-rose-600 hover:text-rose-700">View All Vendors &rarr;</Link>
                    </div>
                    <div className="p-0">
                        {pendingVendors.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-sm text-gray-500 font-medium">All caught up! No pending vendor approvals.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Business Info</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                            <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {pendingVendors.map((vendor) => (
                                            <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="h-9 w-9 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold text-sm">
                                                            {vendor.business_name ? vendor.business_name.charAt(0) : 'V'}
                                                        </div>
                                                        <div className="ml-3">
                                                            <div className="text-sm font-bold text-gray-900">{vendor.business_name}</div>
                                                            <div className="text-xs text-gray-500">{vendor.user?.name}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{vendor.phone}</div>
                                                    <div className="text-xs text-gray-500">{vendor.user?.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                                        Pending Review
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <PrimaryButton onClick={() => handleApproveVendor(vendor.id)} disabled={processing} className="bg-emerald-600 hover:bg-emerald-500 text-xs">
                                                        Approve Vendor
                                                    </PrimaryButton>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Pending Halls Section */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                    <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Pending Hall Approvals</h3>
                            <p className="mt-1 text-sm text-gray-500">Review new hall listings before making them Live.</p>
                        </div>
                        <Link href={route('admin.halls.index')} className="text-sm font-semibold text-rose-600 hover:text-rose-700">View All Halls &rarr;</Link>
                    </div>
                    <div className="p-0">
                        {pendingHalls.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-sm text-gray-500 font-medium">All caught up! No pending hall approvals.</p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hall Name</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor</th>
                                            <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                                            <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-100">
                                        {pendingHalls.map((hall) => (
                                            <tr key={hall.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-bold text-gray-900">{hall.name}</div>
                                                    <div className="text-xs text-gray-500">Capacity: {hall.capacity} guests</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hall.vendor?.business_name || 'Vendor'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{hall.city || hall.location}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                    <Link href={route('admin.halls.review', hall.id)} className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-xs font-semibold rounded-lg text-slate-700 bg-white hover:bg-slate-50">
                                                        Deep Review
                                                    </Link>
                                                    <PrimaryButton onClick={() => handleApproveHall(hall.id)} disabled={processing} className="bg-emerald-600 hover:bg-emerald-500 text-xs">
                                                        Make Live
                                                    </PrimaryButton>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Audit Activity Log */}
                {recentActivities.length > 0 && (
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="text-base font-bold text-slate-900 mb-4">Recent Audit Activity</h3>
                        <div className="space-y-3">
                            {recentActivities.map((act) => (
                                <div key={act.id} className="flex justify-between items-center text-xs py-2 border-b border-slate-100 last:border-0">
                                    <div className="flex items-center space-x-3">
                                        <span className="px-2 py-0.5 rounded font-bold bg-slate-100 text-slate-700">{act.module}</span>
                                        <span className="font-semibold text-slate-900">{act.action}</span>
                                        <span className="text-slate-500">{act.description}</span>
                                    </div>
                                    <span className="text-slate-400">{new Date(act.created_at).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </div>
        </AdminLayout>
    );
}
