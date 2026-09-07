import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, useForm, usePage } from '@inertiajs/react';

export default function Book({ hall, selectedDate = '', selectedSlot = 'full_day' }) {
    const user = usePage().props.auth.user;

    const { data, setData, post, processing, errors } = useForm({
        event_type: 'Wedding',
        event_date: selectedDate || new Date().toISOString().split('T')[0],
        slot: selectedSlot || 'full_day',
        guest_count: '300',
        customer_name: user?.name || '',
        customer_phone: user?.phone || '+91 98989 89898',
        customer_email: user?.email || '',
        special_requirements: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post(route('halls.checkout', hall.id));
    };

    return (
        <CustomerLayout header={`Book Venue: ${hall.name}`}>
            <Head title={`Book ${hall.name}`} />

            <div className="max-w-3xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {/* Header Summary */}
                <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg flex justify-between items-center">
                    <div>
                        <span className="text-xs uppercase tracking-wider text-rose-400 font-bold">Step 1 of 2: Event Details</span>
                        <h2 className="text-xl font-bold mt-1">{hall.name}</h2>
                        <p className="text-xs text-slate-400">📍 {hall.city || hall.location}</p>
                    </div>
                    <span className="text-2xl">🎉</span>
                </div>

                {/* Form Card */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Occasion / Event Type</label>
                                <select
                                    value={data.event_type}
                                    onChange={(e) => setData('event_type', e.target.value)}
                                    className="w-full text-sm border-slate-300 rounded-xl"
                                    required
                                >
                                    <option value="Wedding">Wedding</option>
                                    <option value="Reception">Reception</option>
                                    <option value="Engagement">Engagement</option>
                                    <option value="Birthday">Birthday</option>
                                    <option value="Corporate">Corporate Event</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Expected Guest Count</label>
                                <input
                                    type="number"
                                    value={data.guest_count}
                                    onChange={(e) => setData('guest_count', e.target.value)}
                                    placeholder="300"
                                    className="w-full text-sm border-slate-300 rounded-xl"
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Event Date</label>
                                <input
                                    type="date"
                                    value={data.event_date}
                                    onChange={(e) => setData('event_date', e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full text-sm border-slate-300 rounded-xl"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Booking Slot</label>
                                <select
                                    value={data.slot}
                                    onChange={(e) => setData('slot', e.target.value)}
                                    className="w-full text-sm border-slate-300 rounded-xl"
                                    required
                                >
                                    <option value="morning">Morning Slot (08:00 AM - 03:00 PM)</option>
                                    <option value="evening">Evening Slot (04:00 PM - 11:00 PM)</option>
                                    <option value="full_day">Full Day (08:00 AM - 11:00 PM)</option>
                                </select>
                            </div>
                        </div>

                        <hr className="border-slate-100 my-4" />
                        <h3 className="text-sm font-bold text-slate-900">Primary Contact Information</h3>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Full Name</label>
                                <input
                                    type="text"
                                    value={data.customer_name}
                                    onChange={(e) => setData('customer_name', e.target.value)}
                                    className="w-full text-sm border-slate-300 rounded-xl"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Mobile Number</label>
                                <input
                                    type="text"
                                    value={data.customer_phone}
                                    onChange={(e) => setData('customer_phone', e.target.value)}
                                    className="w-full text-sm border-slate-300 rounded-xl"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Email Address</label>
                                <input
                                    type="email"
                                    value={data.customer_email}
                                    onChange={(e) => setData('customer_email', e.target.value)}
                                    className="w-full text-sm border-slate-300 rounded-xl"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Special Requirements / Notes</label>
                            <textarea
                                value={data.special_requirements}
                                onChange={(e) => setData('special_requirements', e.target.value)}
                                rows="3"
                                placeholder="e.g. Stage decoration preference, vegetarian dining setup..."
                                className="w-full text-sm border-slate-300 rounded-xl"
                            ></textarea>
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-3 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl shadow-lg transition"
                            >
                                Continue to Cost Breakdown & Checkout &rarr;
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </CustomerLayout>
    );
}
