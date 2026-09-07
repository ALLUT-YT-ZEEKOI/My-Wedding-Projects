import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ offers = [] }) {
    return (
        <CustomerLayout header="Active Discounts & Promo Codes">
            <Head title="Promotional Offers" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-8">
                
                <div className="bg-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col md:flex-row justify-between items-center">
                    <div>
                        <span className="text-xs uppercase font-extrabold tracking-widest text-amber-400">Save Big On Venues</span>
                        <h2 className="text-3xl font-black mt-1">Exclusive MY HALL Discounts</h2>
                        <p className="text-xs text-slate-300 mt-2">Use promotional coupon codes during checkout to enjoy special discounts on banquet bookings.</p>
                    </div>
                    <span className="text-5xl mt-4 md:mt-0">🏷️</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {offers.length === 0 ? (
                        <div className="col-span-3 bg-white p-8 rounded-3xl border border-slate-200 text-center text-sm text-slate-500">
                            No active promo codes available right now. Check back soon!
                        </div>
                    ) : (
                        offers.map((off) => (
                            <div key={off.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <span className="font-mono font-black text-xl text-rose-600 bg-rose-50 px-3.5 py-1.5 rounded-xl border border-rose-200 tracking-wider">
                                            {off.code || off.promo_code}
                                        </span>
                                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full uppercase">
                                            Active
                                        </span>
                                    </div>

                                    <p className="text-3xl font-black text-slate-900 mt-6">
                                        {off.discount_type === 'percentage' ? `${off.discount_value || off.discount_amount}% OFF` : `₹${off.discount_value || off.discount_amount} OFF`}
                                    </p>
                                    <p className="text-xs text-slate-600 font-medium mt-2">
                                        {off.offer_name || 'Festive Booking Special'}
                                    </p>
                                    <p className="text-xs text-slate-400 mt-2">
                                        Valid Until: {off.valid_until || off.end_date}
                                    </p>
                                </div>

                                <Link
                                    href={route('halls.index')}
                                    className="block text-center py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow transition"
                                >
                                    Browse Eligible Halls &rarr;
                                </Link>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
