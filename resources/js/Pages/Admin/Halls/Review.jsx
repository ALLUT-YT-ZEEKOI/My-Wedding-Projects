import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, router } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState } from 'react';

export default function Review({ hall }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [actionModal, setActionModal] = useState(null); // 'request_changes' | 'reject'
    const [reason, setReason] = useState('');

    const handleApprove = () => {
        setIsSubmitting(true);
        router.post(route('admin.halls.approve', hall.id), {}, { onFinish: () => setIsSubmitting(false) });
    };

    const handleActionSubmit = (e) => {
        e.preventDefault();
        if (!reason.trim()) return;

        setIsSubmitting(true);
        const routeName = actionModal === 'request_changes' ? 'admin.halls.request-changes' : 'admin.halls.reject';
        router.post(
            route(routeName, hall.id),
            { reason },
            {
                onSuccess: () => setActionModal(null),
                onFinish: () => setIsSubmitting(false),
            }
        );
    };

    return (
        <AdminLayout header={`Hall Deep Verification: ${hall.name}`}>
            <Head title={`Verify ${hall.name}`} />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                <div className="flex justify-between items-center">
                    <Link href={route('admin.halls.index')} className="text-sm font-semibold text-rose-600 hover:underline">
                        &larr; Back to Halls Directory
                    </Link>
                    <div className="space-x-2">
                        {hall.status !== 'live' && (
                            <PrimaryButton onClick={handleApprove} disabled={processing} className="bg-emerald-600 hover:bg-emerald-500">
                                ✓ Approve & Make Live
                            </PrimaryButton>
                        )}
                        <button
                            onClick={() => { setActionModal('request_changes'); setReason(''); }}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold"
                        >
                            ✏️ Request Changes
                        </button>
                        <button
                            onClick={() => { setActionModal('reject'); setReason(''); }}
                            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold"
                        >
                            ✕ Reject Hall
                        </button>
                    </div>
                </div>

                {hall.rejection_reason && (
                    <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl text-amber-900 text-sm">
                        <strong>Previous Administrative Note:</strong> {hall.rejection_reason}
                    </div>
                )}

                {/* Main Verification Sections */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 2 Cols: Details & Media */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Overview & Description */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h2 className="text-2xl font-bold text-slate-900">{hall.name}</h2>
                                    <p className="text-sm text-slate-500">{hall.hall_type || 'Marriage / Banquet Hall'} &bull; {hall.city || hall.location}</p>
                                </div>
                                <span className="px-3 py-1 bg-slate-100 text-slate-800 text-xs font-bold uppercase rounded-full">
                                    {hall.status}
                                </span>
                            </div>
                            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl">
                                {hall.description || 'No description provided.'}
                            </p>
                        </div>

                        {/* Photos / Media Gallery */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                            <h3 className="text-base font-bold text-slate-900">Venue Media & Photos</h3>
                            {(!hall.media || hall.media.length === 0) ? (
                                <p className="text-sm text-slate-500 italic">No media uploaded yet.</p>
                            ) : (
                                <div className="grid grid-cols-3 gap-3">
                                    {hall.media.map((item, idx) => (
                                        <img key={idx} src={item.file_path || item.url} alt="Hall Preview" className="w-full h-32 object-cover rounded-xl border border-slate-200" />
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Amenities & Features */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                            <h3 className="text-base font-bold text-slate-900">Amenities & Services</h3>
                            {(!hall.amenities || hall.amenities.length === 0) ? (
                                <p className="text-sm text-slate-500 italic">No amenities specified.</p>
                            ) : (
                                <div className="flex flex-wrap gap-2">
                                    {hall.amenities.map((am, idx) => (
                                        <span key={idx} className="px-3 py-1.5 bg-slate-100 text-slate-800 text-xs font-semibold rounded-lg">
                                            ✓ {am.name || am}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Col: Pricing, Vendor, Capacity */}
                    <div className="space-y-6">
                        {/* Vendor Info */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-3">
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Managed By Vendor</h3>
                            <p className="text-lg font-bold text-slate-900">{hall.vendor?.business_name || 'Vendor'}</p>
                            <p className="text-sm text-slate-600">{hall.vendor?.user?.name}</p>
                            <p className="text-xs text-slate-500">{hall.vendor?.user?.email} | {hall.vendor?.phone}</p>
                        </div>

                        {/* Capacity & Pricing */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Capacity & Pricing</h3>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-sm text-slate-600">Seating Capacity</span>
                                <span className="text-sm font-bold text-slate-900">{hall.capacity || 'N/A'} Guests</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-100">
                                <span className="text-sm text-slate-600">Standard Rent</span>
                                <span className="text-lg font-extrabold text-emerald-600">₹{(hall.rent || hall.price || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center py-2">
                                <span className="text-sm text-slate-600">Advance Deposit</span>
                                <span className="text-sm font-bold text-slate-900">₹{(hall.advance_amount || 0).toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Address */}
                        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-2">
                            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Full Address</h3>
                            <p className="text-sm text-slate-800">{hall.address || hall.location || 'Location details pending'}</p>
                            <p className="text-xs text-slate-500">{hall.city} {hall.pincode && `- ${hall.pincode}`}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action Modal */}
            {actionModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
                        <h3 className="text-lg font-bold text-slate-900 capitalize">
                            {actionModal === 'request_changes' ? 'Request Changes from Vendor' : 'Reject Hall Listing'}
                        </h3>
                        <p className="text-xs text-slate-500">Provide clear guidelines or reasons for the vendor.</p>
                        <form onSubmit={handleActionSubmit} className="space-y-4">
                            <textarea
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                                rows="4"
                                placeholder="Enter specific feedback or rejection reason..."
                                className="w-full text-sm border-slate-300 rounded-xl focus:ring-rose-500 focus:border-rose-500"
                                required
                            ></textarea>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    onClick={() => setActionModal(null)}
                                    className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing || !reason.trim()}
                                    className={`px-4 py-2 text-white text-xs font-semibold rounded-lg ${
                                        actionModal === 'request_changes' ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-red-600 hover:bg-red-500'
                                    }`}
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
