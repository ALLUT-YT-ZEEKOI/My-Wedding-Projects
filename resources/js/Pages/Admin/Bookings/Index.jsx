import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ bookings = [], currentFilter = 'all' }) {
    const [isCancelling, setIsCancelling] = useState(false);

    const handleCancel = (id) => {
        const reason = prompt('Cancellation reason (optional):');
        if (reason === null) return;
        setIsCancelling(true);
        router.post(
            route('admin.bookings.cancel', id),
            { reason },
            { preserveScroll: true, onFinish: () => setIsCancelling(false) }
        );
    };

    const filterOptions = ['all', 'confirmed', 'pending', 'completed', 'cancelled'];

    return (
        <AdminLayout header="Cross-Platform Booking Ledger">
            <Head title="Platform Bookings" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                {/* Filters */}
                <div className="flex space-x-2 border-b border-gray-200 pb-3 overflow-x-auto">
                    {filterOptions.map((filter) => (
                        <Link
                            key={filter}
                            href={route('admin.bookings.index', { status: filter })}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg capitalize whitespace-nowrap transition ${
                                currentFilter === filter
                                    ? 'bg-rose-600 text-white shadow-sm'
                                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            {filter} Bookings
                        </Link>
                    ))}
                </div>

                {/* Ledger Table */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">All Master Bookings</h3>
                            <p className="text-xs text-gray-500 mt-1">Audit customer reservations and vendor hall bookings.</p>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                            Total: {bookings.length}
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Event Details</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hall & Location</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {bookings.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                                            No bookings found matching status '{currentFilter}'.
                                        </td>
                                    </tr>
                                ) : (
                                    bookings.map((b) => (
                                        <tr key={b.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">{b.event_name || 'Wedding Event'}</div>
                                                <div className="text-xs text-gray-500">Date: {b.event_date || 'N/A'}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">{b.hall?.name || 'Hall'}</div>
                                                <div className="text-xs text-gray-500">{b.hall?.city || b.hall?.location}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{b.customer?.name || b.customer_name || 'Customer'}</div>
                                                <div className="text-xs text-gray-500">{b.customer?.email || b.customer_email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-700">
                                                ₹{(b.total_price || b.amount || 0).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                    b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                                    b.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                                    b.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                {b.status !== 'cancelled' && (
                                                    <button
                                                        onClick={() => handleCancel(b.id)}
                                                        disabled={isCancelling}
                                                        className="px-3 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded-lg text-xs font-semibold border border-red-200 transition disabled:opacity-50"
                                                    >
                                                        Cancel Booking
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
