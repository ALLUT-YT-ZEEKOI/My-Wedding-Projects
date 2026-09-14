import VendorLayout from '@/Layouts/VendorLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function BookingsIndex({ bookings, activeStatusFilter }) {
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleStatusUpdate = (id, newStatus) => {
        setIsUpdating(true);
        router.post(
            route('vendor.bookings.status', id),
            { status: newStatus },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setSelectedBooking(null);
                    setIsUpdating(false);
                },
                onError: () => setIsUpdating(false),
            }
        );
    };

    const statusFilters = ['all', 'pending', 'confirmed', 'completed', 'cancelled', 'rejected'];

    return (
        <VendorLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-bold text-xl text-slate-900 leading-tight">Online & Offline Bookings</h2>
                        <p className="text-xs text-slate-500">Manage customer booking requests, payment status, and event schedules.</p>
                    </div>
                </div>
            }
        >
            <Head title="Bookings Management" />

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-xs">
                {statusFilters.map((filter) => (
                    <Link
                        key={filter}
                        href={route('vendor.bookings.index') + `?status=${filter}`}
                        className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all ${
                            activeStatusFilter === filter
                                ? 'bg-indigo-600 text-white shadow-xs'
                                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                    >
                        {filter}
                    </Link>
                ))}
            </div>

            {/* Bookings Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                {bookings.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <p className="font-bold text-slate-700">No bookings match the selected filter.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Booking ID & Customer</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Event Details</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Type & Guests</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Amount</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white text-xs font-medium">
                                {bookings.map((b) => (
                                    <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-slate-900">{b.booking_code}</div>
                                            <div className="text-slate-500 font-semibold">{b.customer_name} ({b.customer_phone})</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-slate-900">{b.event_type}</div>
                                            <div className="text-slate-500">{b.event_date} &bull; {b.slot.toUpperCase()}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${b.booking_type === 'offline' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                                                {b.booking_type}
                                            </span>
                                            <div className="text-slate-500 mt-1">{b.guest_count} Guests</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-extrabold text-slate-900">₹{Number(b.booking_amount).toLocaleString('en-IN')}</div>
                                            <div className="text-[10px] text-emerald-600 font-bold">Advance: ₹{Number(b.advance_amount).toLocaleString('en-IN')}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold uppercase ${
                                                b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                                b.status === 'completed' ? 'bg-indigo-100 text-indigo-800' :
                                                b.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                                            }`}>
                                                {b.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => setSelectedBooking(b)}
                                                className="px-3 py-1.5 rounded-lg bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 cursor-pointer"
                                            >
                                                View & Manage &rarr;
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Slide-over / Modal for Booking Details & Action Buttons */}
            {selectedBooking && (
                <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl">
                        <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-4">
                            <div>
                                <span className="text-xs font-bold uppercase text-indigo-600">Booking #{selectedBooking.booking_code}</span>
                                <h3 className="text-xl font-extrabold text-slate-900">{selectedBooking.customer_name}</h3>
                            </div>
                            <button onClick={() => setSelectedBooking(null)} className="text-slate-400 hover:text-slate-700 font-bold cursor-pointer">✕</button>
                        </div>

                        <div className="space-y-4 text-xs">
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 grid grid-cols-2 gap-3">
                                <div><strong className="text-slate-400">Phone:</strong> <span className="text-slate-900 font-bold">{selectedBooking.customer_phone}</span></div>
                                <div><strong className="text-slate-400">Email:</strong> <span className="text-slate-900 font-bold">{selectedBooking.customer_email || 'N/A'}</span></div>
                                <div><strong className="text-slate-400">Event Date:</strong> <span className="text-slate-900 font-bold">{selectedBooking.event_date}</span></div>
                                <div><strong className="text-slate-400">Slot:</strong> <span className="text-slate-900 font-bold uppercase">{selectedBooking.slot}</span></div>
                                <div><strong className="text-slate-400">Booking Type:</strong> <span className="text-slate-900 font-bold uppercase">{selectedBooking.booking_type}</span></div>
                                <div><strong className="text-slate-400">Guests:</strong> <span className="text-slate-900 font-bold">{selectedBooking.guest_count}</span></div>
                            </div>

                            <div className="bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100 flex justify-between items-center">
                                <div>
                                    <div className="text-slate-500 font-medium">Total Amount</div>
                                    <div className="text-lg font-black text-indigo-900">₹{Number(selectedBooking.booking_amount).toLocaleString('en-IN')}</div>
                                </div>
                                <div>
                                    <div className="text-slate-500 font-medium">Remaining Due</div>
                                    <div className="text-lg font-black text-rose-600">₹{Number(selectedBooking.remaining_amount).toLocaleString('en-IN')}</div>
                                </div>
                            </div>

                            <div className="border-t border-slate-100 pt-4 space-y-2">
                                <div className="text-xs font-bold text-slate-700 uppercase mb-2">Update Booking Status:</div>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        onClick={() => handleStatusUpdate(selectedBooking.id, 'confirmed')}
                                        disabled={isUpdating}
                                        className="py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs cursor-pointer disabled:opacity-50 transition-colors"
                                    >
                                        Confirm Booking
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedBooking.id, 'completed')}
                                        disabled={isUpdating}
                                        className="py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs cursor-pointer disabled:opacity-50 transition-colors"
                                    >
                                        Mark Completed
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedBooking.id, 'rejected')}
                                        disabled={isUpdating}
                                        className="py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-xl text-xs cursor-pointer disabled:opacity-50 transition-colors"
                                    >
                                        Reject Request
                                    </button>
                                    <button
                                        onClick={() => handleStatusUpdate(selectedBooking.id, 'cancelled')}
                                        disabled={isUpdating}
                                        className="py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-xs cursor-pointer disabled:opacity-50 transition-colors"
                                    >
                                        Cancel Booking
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </VendorLayout>
    );
}
