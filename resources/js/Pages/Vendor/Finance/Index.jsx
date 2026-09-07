import VendorLayout from '@/Layouts/VendorLayout';
import { Head } from '@inertiajs/react';

export default function FinanceIndex({ revenueStats, transactions }) {
    return (
        <VendorLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-bold text-xl text-slate-900 leading-tight">Revenue & Finance Dashboard</h2>
                        <p className="text-xs text-slate-500">Track earnings, advance payments, pending dues, and download statements.</p>
                    </div>
                </div>
            }
        >
            <Head title="Revenue & Finance" />

            {/* Revenue Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Today's Revenue</div>
                    <div className="text-3xl font-extrabold text-slate-900">₹{Number(revenueStats.todayRevenue).toLocaleString('en-IN')}</div>
                    <div className="mt-2 text-xs text-slate-500 font-medium">Advance collected today</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="text-xs font-bold uppercase tracking-wider text-indigo-600 mb-1">This Month</div>
                    <div className="text-3xl font-extrabold text-indigo-600">₹{Number(revenueStats.thisMonthRevenue).toLocaleString('en-IN')}</div>
                    <div className="mt-2 text-xs text-indigo-700 font-medium">Booked for this month</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="text-xs font-bold uppercase tracking-wider text-emerald-600 mb-1">Total Revenue</div>
                    <div className="text-3xl font-extrabold text-emerald-600">₹{Number(revenueStats.totalRevenue).toLocaleString('en-IN')}</div>
                    <div className="mt-2 text-xs text-emerald-700 font-medium">All-time confirmed earnings</div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                    <div className="text-xs font-bold uppercase tracking-wider text-rose-600 mb-1">Pending Balance Due</div>
                    <div className="text-3xl font-extrabold text-rose-600">₹{Number(revenueStats.pendingAmount).toLocaleString('en-IN')}</div>
                    <div className="mt-2 text-xs text-rose-700 font-medium">To be collected on event date</div>
                </div>
            </div>

            {/* Transactions & Bookings Ledger Table */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h3 className="font-bold text-slate-900">Financial Ledger & Transactions</h3>
                    <button className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50">
                        📥 Export Financial Statement
                    </button>
                </div>

                {transactions.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <p className="font-bold text-slate-700">No financial transactions recorded yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Booking ID & Customer</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Event & Date</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total Amount</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Advance Paid</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Remaining Due</th>
                                    <th className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Invoice</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white text-xs font-medium">
                                {transactions.map((t) => (
                                    <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-slate-900">{t.booking_code}</div>
                                            <div className="text-slate-500">{t.customer_name}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-bold text-slate-900">{t.event_type}</div>
                                            <div className="text-slate-500">{t.event_date}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-extrabold text-slate-900">₹{Number(t.booking_amount).toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-emerald-600">₹{Number(t.advance_amount).toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-rose-600">₹{Number(t.remaining_amount).toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button className="text-xs font-bold text-indigo-600 hover:underline">
                                                Download Receipt
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </VendorLayout>
    );
}
