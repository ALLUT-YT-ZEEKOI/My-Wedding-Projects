import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ bookings = [], currentFilter = 'all' }) {
    const filterOptions = ['all', 'confirmed', 'completed', 'cancelled'];

    return (
        <CustomerLayout header="My Reservations & Bookings">
            <Head title="My Bookings" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* Status Tabs */}
                <div className="flex space-x-2 border-b border-slate-200 pb-3 overflow-x-auto">
                    {filterOptions.map((filter) => (
                        <Link
                            key={filter}
                            href={route('customer.bookings.index', { status: filter })}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg capitalize transition ${
                                currentFilter === filter
                                    ? 'bg-rose-600 text-white shadow-sm'
                                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            {filter} Bookings
                        </Link>
                    ))}
                </div>

                {/* Bookings List */}
                <div className="space-y-4">
                    {bookings.length === 0 ? (
                        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                            <p className="text-lg font-bold text-slate-700">No bookings found.</p>
                            <p className="text-xs text-slate-500">You haven't made any reservations matching filter '{currentFilter}'.</p>
                            <Link href={route('halls.index')} className="inline-block mt-2 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl shadow">
                                Explore Halls & Book Now
                            </Link>
                        </div>
                    ) : (
                        bookings.map((b) => (
                            <div key={b.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={b.hall?.cover_photo || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=300&q=80'}
                                        alt={b.hall?.name}
                                        className="w-20 h-20 object-cover rounded-2xl border border-slate-200"
                                    />
                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2">
                                            <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                                                {b.booking_code}
                                            </span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                                                b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                                b.status === 'completed' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
                                            }`}>
                                                {b.status}
                                            </span>
                                        </div>
                                        <h3 className="text-lg font-bold text-slate-900">{b.hall?.name}</h3>
                                        <p className="text-xs text-slate-500">
                                            Event Date: <strong>{b.event_date}</strong> &bull; Slot: <strong className="capitalize">{b.slot}</strong>
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col md:items-end space-y-2">
                                    <span className="text-xl font-extrabold text-emerald-600">₹{(b.booking_amount || 0).toLocaleString()}</span>
                                    <div className="flex space-x-2">
                                        <Link
                                            href={route('customer.bookings.show', b.id)}
                                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl"
                                        >
                                            View Details &rarr;
                                        </Link>
                                        <Link
                                            href={route('customer.bookings.invoice', b.id)}
                                            className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                                        >
                                            📄 Invoice
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

            </div>
        </CustomerLayout>
    );
}
