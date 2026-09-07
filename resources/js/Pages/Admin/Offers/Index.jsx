import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState } from 'react';

export default function Index({ offers = [] }) {
    const [showModal, setShowModal] = useState(false);

    const { data, setData, post, delete: destroy, processing, reset, errors } = useForm({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        min_booking_amount: '0',
        valid_from: new Date().toISOString().split('T')[0],
        valid_until: '',
        max_uses: '100',
    });

    const handleCreateOffer = (e) => {
        e.preventDefault();
        post(route('admin.offers.store'), {
            onSuccess: () => {
                setShowModal(false);
                reset();
            },
        });
    };

    const handleToggle = (id) => {
        post(route('admin.offers.toggle', id));
    };

    const handleDelete = (id) => {
        if (confirm('Delete this offer coupon?')) {
            destroy(route('admin.offers.destroy', id));
        }
    };

    return (
        <AdminLayout header="Offers & Promotional Discount Codes">
            <Head title="Promo Codes" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                <div className="flex justify-between items-center bg-slate-900 text-white p-6 rounded-2xl shadow-md">
                    <div>
                        <h3 className="text-xl font-bold">Platform Coupon Engine</h3>
                        <p className="text-xs text-slate-400 mt-1">Create promotional codes (e.g. FESTIVE20, MYHALL10) for booking discounts.</p>
                    </div>
                    <button
                        onClick={() => setShowModal(true)}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl"
                    >
                        + Create Coupon Code
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {offers.length === 0 ? (
                        <div className="col-span-3 bg-white p-8 rounded-2xl border border-slate-200 text-center text-sm text-slate-500">
                            No promotional offers active. Click above to launch a campaign.
                        </div>
                    ) : (
                        offers.map((off) => (
                            <div key={off.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <span className="font-mono font-extrabold text-xl text-rose-600 bg-rose-50 px-3 py-1 rounded-lg tracking-wider">
                                            {off.code}
                                        </span>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                                            off.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-600'
                                        }`}>
                                            {off.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <p className="text-2xl font-black text-slate-900 mt-4">
                                        {off.discount_type === 'percentage' ? `${off.discount_value}% OFF` : `₹${off.discount_value} OFF`}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        Min booking: ₹{(off.min_booking_amount || 0).toLocaleString()}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-2">
                                        Valid: {off.valid_from} &rarr; {off.valid_until}
                                    </p>
                                </div>

                                <div className="flex justify-between items-center pt-2 border-t border-slate-100">
                                    <button
                                        onClick={() => handleToggle(off.id)}
                                        disabled={processing}
                                        className="text-xs font-bold text-slate-700 hover:text-slate-900"
                                    >
                                        {off.is_active ? 'Disable' : 'Enable'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(off.id)}
                                        disabled={processing}
                                        className="text-xs font-bold text-red-600 hover:text-red-700"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Create Coupon Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
                        <h3 className="text-lg font-bold text-slate-900">Create Promo Code</h3>
                        <form onSubmit={handleCreateOffer} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700">Coupon Code</label>
                                <input
                                    type="text"
                                    value={data.code}
                                    onChange={(e) => setData('code', e.target.value.toUpperCase())}
                                    placeholder="MYHALL10"
                                    className="w-full text-sm font-mono uppercase border-slate-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700">Discount Type</label>
                                    <select
                                        value={data.discount_type}
                                        onChange={(e) => setData('discount_type', e.target.value)}
                                        className="w-full text-sm border-slate-300 rounded-lg"
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed">Flat Rate (₹)</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700">Value</label>
                                    <input
                                        type="number"
                                        value={data.discount_value}
                                        onChange={(e) => setData('discount_value', e.target.value)}
                                        placeholder="10"
                                        className="w-full text-sm border-slate-300 rounded-lg"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700">Valid From</label>
                                    <input
                                        type="date"
                                        value={data.valid_from}
                                        onChange={(e) => setData('valid_from', e.target.value)}
                                        className="w-full text-sm border-slate-300 rounded-lg"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700">Valid Until</label>
                                    <input
                                        type="date"
                                        value={data.valid_until}
                                        onChange={(e) => setData('valid_until', e.target.value)}
                                        className="w-full text-sm border-slate-300 rounded-lg"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <PrimaryButton type="submit" disabled={processing} className="bg-rose-600 text-xs">
                                    Publish Coupon
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
