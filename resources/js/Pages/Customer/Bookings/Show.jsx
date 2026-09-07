import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Show({ booking }) {
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showReviewModal, setShowReviewModal] = useState(false);

    const cancelForm = useForm({ reason: '' });
    const reviewForm = useForm({ rating: 5, review_text: '' });

    const handleConfirmCancel = (e) => {
        e.preventDefault();
        cancelForm.post(route('customer.bookings.cancel', booking.id), {
            onSuccess: () => setShowCancelModal(false),
        });
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        reviewForm.post(route('customer.halls.reviews.store', booking.hall_id), {
            onSuccess: () => setShowReviewModal(false),
        });
    };

    return (
        <CustomerLayout header={`Booking #${booking.booking_code}`}>
            <Head title={`Booking ${booking.booking_code}`} />

            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* Status Bar */}
                <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
                    <div>
                        <span className="text-xs uppercase font-bold text-slate-400">Reservation Status</span>
                        <div className="flex items-center space-x-3 mt-1">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                                booking.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                booking.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                            }`}>
                                {booking.status}
                            </span>
                            <span className="text-sm font-bold text-slate-900">Code: {booking.booking_code}</span>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <Link
                            href={route('customer.bookings.invoice', booking.id)}
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                        >
                            📄 Download Invoice
                        </Link>
                        {booking.status === 'confirmed' && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 text-xs font-bold rounded-xl"
                            >
                                Cancel Booking
                            </button>
                        )}
                        {booking.status === 'completed' && (
                            <button
                                onClick={() => setShowReviewModal(true)}
                                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-white font-bold text-xs rounded-xl"
                            >
                                ★ Write Review
                            </button>
                        )}
                    </div>
                </div>

                {/* Main Itinerary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Left 2 Cols: Hall & Event Specs */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                            <h3 className="text-base font-bold text-slate-900">Venue Details</h3>
                            <div className="flex space-x-4">
                                <img
                                    src={booking.hall?.cover_photo || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=300&q=80'}
                                    alt={booking.hall?.name}
                                    className="w-24 h-24 object-cover rounded-2xl border border-slate-200"
                                />
                                <div>
                                    <h4 className="text-lg font-bold text-slate-900">{booking.hall?.name}</h4>
                                    <p className="text-xs text-slate-500">📍 {booking.hall?.address || booking.hall?.location}</p>
                                    <p className="text-xs text-slate-500 mt-1">Contact: {booking.hall?.contact_number || '+91 98765 43210'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-3 text-xs">
                            <h3 className="text-base font-bold text-slate-900 mb-2">Event Specifications</h3>
                            <div className="flex justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-600">Event Occasion</span>
                                <span className="font-bold text-slate-900">{booking.event_type}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-600">Event Date</span>
                                <span className="font-bold text-slate-900">{booking.event_date}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-600">Reserved Slot</span>
                                <span className="font-bold text-slate-900 capitalize">{booking.slot}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-600">Guest Count</span>
                                <span className="font-bold text-slate-900">{booking.guest_count} Guests</span>
                            </div>
                            {booking.notes && (
                                <div className="p-3 bg-slate-50 rounded-xl mt-2">
                                    <strong>Special Instructions:</strong> {booking.notes}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Col: Financial Ledger Breakdown */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 text-xs">
                        <h3 className="text-base font-bold text-slate-900">Payment Breakdown</h3>
                        <div className="flex justify-between py-2 border-b border-slate-100">
                            <span className="text-slate-600">Total Agreed Rent</span>
                            <span className="font-bold text-slate-900">₹{(booking.booking_amount || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100 text-emerald-600 font-bold">
                            <span>Advance Paid (40%)</span>
                            <span>₹{(booking.advance_amount || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between py-2 border-b border-slate-100 text-rose-600 font-bold">
                            <span>Balance Due at Venue</span>
                            <span>₹{(booking.remaining_amount || 0).toLocaleString()}</span>
                        </div>
                    </div>

                </div>

            </div>

            {/* Cancel Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
                        <h3 className="text-lg font-bold text-slate-900">Confirm Booking Cancellation</h3>
                        <p className="text-xs text-slate-500">
                            According to platform policy, cancellation before 30 days receives 90% refund of advance deposit.
                        </p>
                        <form onSubmit={handleConfirmCancel} className="space-y-3">
                            <textarea
                                value={cancelForm.data.reason}
                                onChange={(e) => cancelForm.setData('reason', e.target.value)}
                                rows="3"
                                placeholder="State reason for cancellation..."
                                className="w-full text-sm border-slate-300 rounded-xl"
                                required
                            ></textarea>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setShowCancelModal(false)}
                                    className="px-4 py-2 border border-slate-300 text-xs font-semibold rounded-lg"
                                >
                                    Keep Booking
                                </button>
                                <button
                                    type="submit"
                                    disabled={cancelForm.processing}
                                    className="px-4 py-2 bg-red-600 text-white text-xs font-bold rounded-lg"
                                >
                                    Confirm Cancellation
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Review Modal */}
            {showReviewModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
                        <h3 className="text-lg font-bold text-slate-900">Write Customer Review</h3>
                        <form onSubmit={handleReviewSubmit} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700">Rating (1 to 5 Stars)</label>
                                <select
                                    value={reviewForm.data.rating}
                                    onChange={(e) => reviewForm.setData('rating', e.target.value)}
                                    className="w-full text-sm border-slate-300 rounded-lg"
                                >
                                    <option value="5">★★★★★ (5/5) Excellent</option>
                                    <option value="4">★★★★☆ (4/5) Very Good</option>
                                    <option value="3">★★★☆☆ (3/5) Average</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700">Your Experience</label>
                                <textarea
                                    value={reviewForm.data.review_text}
                                    onChange={(e) => reviewForm.setData('review_text', e.target.value)}
                                    rows="4"
                                    placeholder="Write feedback about hall cleanliness, parking, staff politeness..."
                                    className="w-full text-sm border-slate-300 rounded-lg"
                                    required
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowReviewModal(false)}
                                    className="px-4 py-2 border border-slate-300 text-xs font-semibold rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={reviewForm.processing}
                                    className="px-4 py-2 bg-amber-500 text-white text-xs font-bold rounded-lg"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}
