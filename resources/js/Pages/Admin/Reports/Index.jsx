import AdminLayout from '@/Layouts/AdminLayout';
import { Head } from '@inertiajs/react';

export default function Index({ summary = {}, monthlyRevenue = [], recentLogs = [] }) {
    return (
        <AdminLayout header="Platform Reports & Audit Activity Trail">
            <Head title="Reports & Audits" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                
                {/* Summary Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gross Platform Revenue</p>
                        <p className="text-3xl font-black text-emerald-600 mt-2">₹{(summary.revenue || 0).toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Bookings Count</p>
                        <p className="text-3xl font-black text-slate-900 mt-2">{summary.bookings || 0}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Active Halls</p>
                        <p className="text-3xl font-black text-slate-900 mt-2">{summary.halls || 0}</p>
                    </div>
                    <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Onboarded Vendors</p>
                        <p className="text-3xl font-black text-slate-900 mt-2">{summary.vendors || 0}</p>
                    </div>
                </div>

                {/* Revenue Trend breakdown table */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-slate-900">Monthly Revenue Stream Breakdown</h3>
                    {monthlyRevenue.length === 0 ? (
                        <p className="text-sm text-slate-500 italic">No monthly revenue data compiled yet.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 uppercase">Billing Period</th>
                                        <th className="px-6 py-3 text-right text-xs font-semibold text-slate-500 uppercase">Total Collected</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {monthlyRevenue.map((m, idx) => (
                                        <tr key={idx} className="hover:bg-slate-50">
                                            <td className="px-6 py-3 text-sm font-semibold text-slate-800">{m.month}</td>
                                            <td className="px-6 py-3 text-sm font-extrabold text-right text-emerald-600">₹{(m.total || 0).toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>

                {/* Audit Logs */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                    <div className="px-6 py-5 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900">Administrative System Audit Logs</h3>
                        <p className="text-xs text-gray-500 mt-1">Trace all approval actions, status toggles, and financial changes.</p>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Time</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Administrator</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Module</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Action</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Description</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">IP Address</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100 text-xs">
                                {recentLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No activity logs recorded.</td>
                                    </tr>
                                ) : (
                                    recentLogs.map((log) => (
                                        <tr key={log.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-3 whitespace-nowrap text-gray-500">{new Date(log.created_at).toLocaleString()}</td>
                                            <td className="px-6 py-3 whitespace-nowrap font-bold text-gray-900">{log.user?.name || 'System'}</td>
                                            <td className="px-6 py-3 whitespace-nowrap font-bold text-rose-600">{log.module}</td>
                                            <td className="px-6 py-3 whitespace-nowrap font-semibold text-slate-800">{log.action}</td>
                                            <td className="px-6 py-3 text-slate-600">{log.description}</td>
                                            <td className="px-6 py-3 text-right font-mono text-gray-400">{log.ip_address || '127.0.0.1'}</td>
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
