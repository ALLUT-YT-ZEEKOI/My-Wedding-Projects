import VendorLayout from '@/Layouts/VendorLayout';
import { Head, Link } from '@inertiajs/react';

export default function Preview({ hall }) {
    return (
        <VendorLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-bold text-xl text-slate-900 leading-tight">Customer Preview Mode: {hall.name}</h2>
                        <p className="text-xs text-slate-500">This is exactly how your venue will appear to customers searching for event spaces.</p>
                    </div>
                    <Link
                        href={route('vendor.halls.edit', hall.id)}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md"
                    >
                        &larr; Back to Edit Mode
                    </Link>
                </div>
            }
        >
            <Head title={`Preview - ${hall.name}`} />

            <div className="max-w-5xl mx-auto space-y-8 bg-white rounded-3xl p-8 border border-slate-200 shadow-sm">
                
                {/* Hero / Cover Image Banner */}
                <div className="relative h-80 rounded-2xl overflow-hidden bg-slate-900">
                    <img
                        src={hall.cover_photo || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80'}
                        alt={hall.name}
                        className="w-full h-full object-cover opacity-85"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
                    <div className="absolute bottom-6 left-6 text-white">
                        <span className="text-xs font-bold uppercase tracking-wider bg-rose-500 text-white px-3 py-1 rounded-full mb-2 inline-block">
                            {hall.hall_type || 'Banquet Hall'}
                        </span>
                        <h1 className="text-3xl font-extrabold">{hall.name}</h1>
                        <p className="text-sm text-slate-300 flex items-center gap-1 mt-1">
                            📍 {hall.address ? `${hall.address}, ${hall.city}` : hall.location}
                        </p>
                    </div>
                </div>

                {/* Info Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center">
                    <div>
                        <div className="text-xs text-slate-400 font-bold uppercase">Seating</div>
                        <div className="text-xl font-extrabold text-slate-900">{hall.seating_capacity || hall.capacity} Guests</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 font-bold uppercase">Dining</div>
                        <div className="text-xl font-extrabold text-slate-900">{hall.dining_capacity || 300} Guests</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 font-bold uppercase">Floating</div>
                        <div className="text-xl font-extrabold text-slate-900">{hall.floating_capacity || 700} Guests</div>
                    </div>
                    <div>
                        <div className="text-xs text-slate-400 font-bold uppercase">Full Day Price</div>
                        <div className="text-xl font-extrabold text-indigo-600">₹{Number(hall.pricing?.full_day_price || hall.pricing?.base_price || 0).toLocaleString('en-IN')}</div>
                    </div>
                </div>

                {/* Description & Slot Pricing */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">About Venue</h3>
                            <p className="text-slate-600 text-sm leading-relaxed">{hall.description}</p>
                        </div>

                        {/* Amenities */}
                        <div>
                            <h3 className="text-lg font-bold text-slate-900 mb-3">Amenities & Facilities</h3>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {hall.amenities?.map((a) => (
                                    <div key={a.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700 flex items-center gap-2">
                                        <span className="text-emerald-500">✓</span> {a.name}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Policies */}
                        {hall.policy && (
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 mb-3">Rules & Policies</h3>
                                <div className="space-y-2 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl border border-slate-100">
                                    <div><strong>Event Timing:</strong> {hall.policy.event_timing}</div>
                                    <div><strong>Catering:</strong> {hall.policy.veg_allowed ? 'Veg Allowed' : ''} {hall.policy.non_veg_allowed ? '& Non-Veg Allowed' : ''}</div>
                                    <div><strong>Alcohol:</strong> {hall.policy.alcohol_policy}</div>
                                    <div><strong>Music/DJ:</strong> {hall.policy.music_policy}</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Booking Card Preview Sidebar */}
                    <div className="bg-slate-900 text-white rounded-2xl p-6 h-fit border border-slate-800 space-y-4">
                        <h3 className="font-bold text-lg text-white">Slot Pricing Breakdown</h3>
                        <div className="space-y-2 text-xs border-b border-slate-800 pb-4">
                            <div className="flex justify-between">
                                <span className="text-slate-400">Morning Slot:</span>
                                <span className="font-bold text-white">₹{Number(hall.pricing?.morning_price || 0).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Evening Slot:</span>
                                <span className="font-bold text-white">₹{Number(hall.pricing?.evening_price || 0).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Full Day:</span>
                                <span className="font-bold text-emerald-400">₹{Number(hall.pricing?.full_day_price || 0).toLocaleString('en-IN')}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400">Security Deposit:</span>
                                <span className="font-bold text-amber-400">₹{Number(hall.pricing?.security_deposit || 0).toLocaleString('en-IN')}</span>
                            </div>
                        </div>

                        <button disabled className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl text-xs opacity-90">
                            Request Booking (Customer View)
                        </button>
                    </div>
                </div>

            </div>
        </VendorLayout>
    );
}
