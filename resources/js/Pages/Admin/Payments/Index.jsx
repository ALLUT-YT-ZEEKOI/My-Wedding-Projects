import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ payments = [], refunds = [] }) {
    const [activeTab, setActiveTab] = useState('payments');
    const { post, processing } = useForm();

    const handleProcessRefund = (id, status) => {
        const reason = prompt(`Optional note for ${status} refund:`);
        post(route('admin.refunds.process', id), {
            data: { status, reason },
        });
    };

    return (
        <AdminLayout header="Payments & Financial Refunds">
            <Head title="Payments Ledger" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                {/* Tabs */}
                <div className="flex space-x-3 border-b border-slate-200 pb-3">
                    <button
                        onClick={() => setActiveTab('payments')}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                            activeTab === 'payments' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                    >
                        💰 Master Payments Ledger ({payments.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('refunds')}
                        className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                            activeTab === 'refunds' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                        }`}
                    >
                        🔄 Refund Requests ({refunds.length})
                    </button>
                </div>

                {activeTab === 'payments' ? (
                    /* Payments Table */
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                        <div className="px-6 py-5 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">All Transaction History</h3>
                            <p className="text-xs text-gray-500 mt-1">Audit online payments, gate fees, and advance booking deposits.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Txn ID / Ref</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Payer</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Amount</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Gateway</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Date</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {payments.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                                                No payment records available.
                                            </td>
                                        </tr>
                                    ) : (
                                        payments.map((p) => (
                                            <tr key={p.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-800">{p.transaction_id || `TXN-${p.id}`}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{p.user?.name || 'Customer'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-extrabold text-emerald-600">₹{(p.amount || 0).toLocaleString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500 capitalize">{p.payment_method || 'Razorpay'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-500">{new Date(p.created_at).toLocaleString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 capitalize">
                                                        {p.status || 'Completed'}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    /* Refunds Table */
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                        <div className="px-6 py-5 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">Refund Claims & Processing</h3>
                            <p className="text-xs text-gray-500 mt-1">Review customer refund requests for cancelled bookings.</p>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Customer</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Hall</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Refund Amount</th>
                                        <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-100">
                                    {refunds.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-6 py-8 text-center text-sm text-gray-500">
                                                No pending refund claims.
                                            </td>
                                        </tr>
                                    ) : (
                                        refunds.map((r) => (
                                            <tr key={r.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{r.user?.name || 'Customer'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{r.booking?.hall?.name || 'Venue'}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-rose-600">₹{(r.amount || 0).toLocaleString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                                                        r.status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                                        r.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                                                    }`}>
                                                        {r.status || 'Pending'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                                                    {r.status === 'pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleProcessRefund(r.id, 'approved')}
                                                                disabled={processing}
                                                                className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold hover:bg-emerald-500"
                                                            >
                                                                Approve Refund
                                                            </button>
                                                            <button
                                                                onClick={() => handleProcessRefund(r.id, 'rejected')}
                                                                disabled={processing}
                                                                className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-xs font-semibold hover:bg-red-500"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
