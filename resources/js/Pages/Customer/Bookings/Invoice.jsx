import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head } from '@inertiajs/react';

export default function Invoice({ booking }) {
    const handlePrint = () => {
        window.print();
    };

    return (
        <CustomerLayout header={`Invoice #${booking.booking_code}`}>
            <Head title={`Invoice ${booking.booking_code}`} />

            <div className="max-w-3xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* Print Action Bar */}
                <div className="flex justify-between items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm print:hidden">
                    <span className="text-xs font-bold text-slate-600">Official MY HALL Booking Receipt</span>
                    <button
                        onClick={handlePrint}
                        className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl hover:bg-slate-800"
                    >
                        🖨️ Print / Download PDF
                    </button>
                </div>

                {/* Invoice Document Card */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-8 print:shadow-none print:border-none">
                    
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-slate-200 pb-6">
                        <div>
                            <span className="text-2xl font-black tracking-tight text-rose-600">MY HALL</span>
                            <p className="text-xs text-slate-500 mt-1">Venue Discovery & Instant Booking Platform</p>
                        </div>
                        <div className="text-right text-xs">
                            <h2 className="text-lg font-black text-slate-900 uppercase">OFFICIAL INVOICE</h2>
                            <p className="text-slate-500 font-mono">Invoice #: INV-{booking.booking_code}</p>
                            <p className="text-slate-500">Date: {new Date(booking.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {/* Vendor & Customer Billed To */}
                    <div className="grid grid-cols-2 gap-6 text-xs">
                        <div>
                            <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-1">Customer / Billed To</h4>
                            <p className="font-bold text-slate-900 text-sm">{booking.customer_name || booking.customer?.name}</p>
                            <p className="text-slate-600">{booking.customer_email || booking.customer?.email}</p>
                            <p className="text-slate-600">{booking.customer_phone}</p>
                        </div>
                        <div className="text-right">
                            <h4 className="font-bold text-slate-400 uppercase tracking-wider mb-1">Venue / Managed By</h4>
                            <p className="font-bold text-slate-900 text-sm">{booking.hall?.name}</p>
                            <p className="text-slate-600">{booking.hall?.address || booking.hall?.location}</p>
                            <p className="text-slate-600">Contact: {booking.hall?.contact_number || '+91 98765 43210'}</p>
                        </div>
                    </div>

                    {/* Event & Billing Table */}
                    <table className="min-w-full divide-y divide-slate-200 text-xs">
                        <thead className="bg-slate-50">
                            <tr>
                                <th className="px-4 py-3 text-left font-bold text-slate-700 uppercase">Description</th>
                                <th className="px-4 py-3 text-center font-bold text-slate-700 uppercase">Slot / Date</th>
                                <th className="px-4 py-3 text-right font-bold text-slate-700 uppercase">Amount (₹)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                            <tr>
                                <td className="px-4 py-3 font-bold">{booking.hall?.name} ({booking.event_type})</td>
                                <td className="px-4 py-3 text-center capitalize">{booking.slot} ({booking.event_date})</td>
                                <td className="px-4 py-3 text-right font-bold">₹{(booking.booking_amount || 0).toLocaleString()}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Total Calculation */}
                    <div className="flex justify-end pt-4 border-t border-slate-200 text-xs">
                        <div className="w-64 space-y-2">
                            <div className="flex justify-between text-slate-600">
                                <span>Total Agreed Amount</span>
                                <span className="font-bold text-slate-900">₹{(booking.booking_amount || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-emerald-600 font-bold">
                                <span>Advance Paid Online</span>
                                <span>₹{(booking.advance_amount || 0).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-rose-600 font-bold pt-2 border-t border-slate-200 text-sm">
                                <span>Balance Payable at Hall</span>
                                <span>₹{(booking.remaining_amount || 0).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="pt-8 border-t border-slate-100 text-center text-xs text-slate-400">
                        Thank you for booking with MY HALL! For any queries, contact support@myhall.com.
                    </div>

                </div>

            </div>
        </CustomerLayout>
    );
}
