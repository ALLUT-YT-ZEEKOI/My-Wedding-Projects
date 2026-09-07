import VendorLayout from '@/Layouts/VendorLayout';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

export default function CustomersIndex({ customers, history }) {
    const [selectedPhone, setSelectedPhone] = useState(null);

    const activeHistory = selectedPhone
        ? history.filter(h => h.customer_phone === selectedPhone)
        : [];

    return (
        <VendorLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-bold text-xl text-slate-900 leading-tight">Customer Database</h2>
                        <p className="text-xs text-slate-500">View customer contact directory and event booking history.</p>
                    </div>
                </div>
            }
        >
            <Head title="Customer Directory" />

            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
                {customers.length === 0 ? (
                    <div className="p-12 text-center text-slate-500">
                        <p className="font-bold text-slate-700">No customers registered yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer Name</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Phone & Email</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total Bookings</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total Amount Spent</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Last Event Date</th>
                                    <th className="px-6 py-3.5 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">History</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 bg-white text-xs font-medium">
                                {customers.map((c) => (
                                    <tr key={c.customer_phone} className="hover:bg-slate-50/80 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-slate-900">{c.customer_name}</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-slate-900 font-bold">{c.customer_phone}</div>
                                            <div className="text-slate-400">{c.customer_email || 'N/A'}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap font-bold text-indigo-600">{c.total_bookings} Events</td>
                                        <td className="px-6 py-4 whitespace-nowrap font-extrabold text-slate-900">₹{Number(c.total_spent).toLocaleString('en-IN')}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-slate-600">{c.last_event_date}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => setSelectedPhone(c.customer_phone)}
                                                className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-500"
                                            >
                                                View Booking History &rarr;
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Customer History Modal */}
            {selectedPhone && (
                <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-xl w-full border border-slate-200 shadow-2xl">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
                            <h3 className="text-lg font-bold text-slate-900">Booking History for {selectedPhone}</h3>
                            <button onClick={() => setSelectedPhone(null)} className="text-slate-400 hover:text-slate-700 font-bold">✕</button>
                        </div>

                        <div className="space-y-3 max-h-96 overflow-y-auto text-xs">
                            {activeHistory.map((h) => (
                                <div key={h.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex justify-between items-center">
                                    <div>
                                        <div className="font-bold text-slate-900">{h.hall?.name} &bull; {h.event_type}</div>
                                        <div className="text-slate-500">{h.event_date} ({h.slot.toUpperCase()}) &bull; {h.guest_count} Guests</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-extrabold text-indigo-600">₹{Number(h.booking_amount).toLocaleString('en-IN')}</div>
                                        <span className="text-[10px] font-bold uppercase text-slate-500">{h.status}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </VendorLayout>
    );
}
