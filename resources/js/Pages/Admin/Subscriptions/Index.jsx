import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState } from 'react';

export default function Index({ subscriptions = [], plans = [] }) {
    const [showPlanModal, setShowPlanModal] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        price: '',
        billing_cycle: 'yearly',
        hall_limit: '1',
    });

    const handleCreatePlan = (e) => {
        e.preventDefault();
        post(route('admin.plans.store'), {
            onSuccess: () => {
                setShowPlanModal(false);
                reset();
            },
        });
    };

    return (
        <AdminLayout header="Vendor Subscriptions & Plan Manager">
            <Head title="Subscriptions & Plans" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                
                {/* Plan Manager Header */}
                <div className="flex justify-between items-center bg-slate-900 text-white p-6 rounded-2xl shadow-md">
                    <div>
                        <h3 className="text-xl font-bold">Platform Subscription Plans</h3>
                        <p className="text-xs text-slate-400 mt-1">Configure pricing tiers and features for hall vendors.</p>
                    </div>
                    <button
                        onClick={() => setShowPlanModal(true)}
                        className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl"
                    >
                        + Create New Plan
                    </button>
                </div>

                {/* Active Plans Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {plans.map((p) => (
                        <div key={p.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
                            <div>
                                <span className="text-xs uppercase tracking-wider font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-md">{p.billing_cycle}</span>
                                <h4 className="text-xl font-extrabold text-slate-900 mt-2">{p.name}</h4>
                                <div className="text-3xl font-black text-slate-900 mt-3">
                                    ₹{Number(p.price).toLocaleString()} <span className="text-xs font-normal text-slate-500">/{p.billing_cycle}</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-2">Allows up to <strong>{p.hall_limit} Hall Listing(s)</strong></p>
                            </div>
                            <button className="w-full py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg hover:bg-slate-200">
                                Edit Tier Settings
                            </button>
                        </div>
                    ))}
                </div>

                {/* Subscriptions Table */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="text-lg font-bold text-gray-900">Vendor Active Subscriptions</h3>
                        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                            Total: {subscriptions.length}
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor Business</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan Name</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price / Billing</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Starts</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Expires</th>
                                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {subscriptions.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                                            No active vendor subscriptions recorded yet.
                                        </td>
                                    </tr>
                                ) : (
                                    subscriptions.map((sub) => (
                                        <tr key={sub.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">{sub.vendor_profile?.business_name || 'Vendor'}</div>
                                                <div className="text-xs text-gray-500">{sub.vendor_profile?.user?.email}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-slate-800">{sub.plan_name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-600">₹{(sub.amount || 0).toLocaleString()}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{sub.starts_at ? new Date(sub.starts_at).toLocaleDateString() : 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">{sub.ends_at ? new Date(sub.ends_at).toLocaleDateString() : 'N/A'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 uppercase">
                                                    {sub.status || 'Active'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            {/* Create Plan Modal */}
            {showPlanModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
                        <h3 className="text-lg font-bold text-slate-900">Create Subscription Plan</h3>
                        <form onSubmit={handleCreatePlan} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700">Plan Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Premium Tier"
                                    className="w-full text-sm border-slate-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700">Price (₹)</label>
                                <input
                                    type="number"
                                    value={data.price}
                                    onChange={(e) => setData('price', e.target.value)}
                                    placeholder="2499"
                                    className="w-full text-sm border-slate-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700">Billing Cycle</label>
                                    <select
                                        value={data.billing_cycle}
                                        onChange={(e) => setData('billing_cycle', e.target.value)}
                                        className="w-full text-sm border-slate-300 rounded-lg"
                                    >
                                        <option value="yearly">Yearly</option>
                                        <option value="monthly">Monthly</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700">Hall Limit</label>
                                    <input
                                        type="number"
                                        value={data.hall_limit}
                                        onChange={(e) => setData('hall_limit', e.target.value)}
                                        className="w-full text-sm border-slate-300 rounded-lg"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end space-x-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowPlanModal(false)}
                                    className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <PrimaryButton type="submit" disabled={processing} className="bg-rose-600 text-xs">
                                    Save Plan
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
