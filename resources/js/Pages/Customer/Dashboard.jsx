import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Dashboard({ stats = {}, upcomingBooking, notifications = [] }) {
    const user = usePage().props.auth.user;

    return (
        <CustomerLayout header="My Personal Suite">
            <Head title="Dashboard | LUXEHALLS" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-12">
                
                {/* Welcome Card */}
                <div className="relative rounded-[3rem] overflow-hidden bg-slate-950 p-10 md:p-16 shadow-2xl animate-fade-up">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/20 blur-[100px] rounded-full pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/20 blur-[100px] rounded-full pointer-events-none"></div>
                    
                    <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="text-xs font-black tracking-widest text-rose-400 uppercase mb-4 block">Welcome Back</span>
                            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
                                Hello, {user.name.split(' ')[0]}
                            </h2>
                            <p className="text-slate-300 font-medium text-lg max-w-md leading-relaxed">
                                Your luxury event planning command center. Track bookings, explore premium venues, and access exclusive VIP offers.
                            </p>
                        </div>

                        {/* Upcoming Event Highlight */}
                        <div className="flex justify-end">
                            {upcomingBooking ? (
                                <div className="glass-dark p-6 rounded-[2rem] border border-white/20 max-w-sm w-full relative group hover:border-rose-500/50 transition-colors duration-500">
                                    <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500 to-amber-500 rounded-[2rem] opacity-0 group-hover:opacity-100 transition duration-500 blur-sm"></div>
                                    <div className="relative glass-dark p-6 rounded-[2rem] h-full flex flex-col">
                                        <div className="flex justify-between items-start mb-6">
                                            <span className="bg-rose-500/20 text-rose-300 text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest border border-rose-500/30">
                                                Next Event
                                            </span>
                                            <span className="text-2xl">✨</span>
                                        </div>
                                        <h3 className="text-xl font-black text-white mb-2 leading-tight">{upcomingBooking.hall?.name}</h3>
                                        <div className="space-y-1 mb-6 text-sm font-medium text-slate-300">
                                            <p className="flex items-center gap-2"><span className="text-rose-400">📅</span> {new Date(upcomingBooking.event_date).toLocaleDateString('en-IN', { dateStyle: 'medium' })}</p>
                                            <p className="flex items-center gap-2"><span className="text-rose-400">🕒</span> <span className="capitalize">{upcomingBooking.slot.replace('_', ' ')}</span></p>
                                        </div>
                                        <Link
                                            href={route('customer.bookings.show', upcomingBooking.id)}
                                            className="mt-auto block text-center py-3 bg-white text-slate-900 font-black text-sm uppercase tracking-widest rounded-xl hover:bg-rose-600 hover:text-white transition-all shadow-xl"
                                        >
                                            View Itinerary
                                        </Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="glass-dark p-8 rounded-[2rem] border border-white/20 max-w-sm w-full text-center flex flex-col items-center justify-center">
                                    <div className="text-5xl mb-4">🥂</div>
                                    <h3 className="text-xl font-black text-white mb-2">No Upcoming Events</h3>
                                    <p className="text-sm font-medium text-slate-400 mb-6">Ready to plan your next grand celebration?</p>
                                    <Link
                                        href={route('halls.index')}
                                        className="w-full py-3 bg-gradient-to-r from-rose-600 to-amber-500 text-white font-black text-sm uppercase tracking-widest rounded-xl hover:shadow-[0_0_20px_rgba(225,29,72,0.4)] transition-all transform hover:-translate-y-1"
                                    >
                                        Explore Venues
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Platinum Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-up animation-delay-2000">
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-rose-600/5 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-12 w-12 rounded-2xl bg-slate-50 flex items-center justify-center text-2xl group-hover:bg-rose-50 group-hover:scale-110 transition-all">📑</div>
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Total Bookings</span>
                        <p className="text-4xl font-black text-slate-900">{stats.total_bookings || 0}</p>
                    </div>
                    
                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-rose-600/5 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-12 w-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-all">✅</div>
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Confirmed</span>
                        <p className="text-4xl font-black text-emerald-600">{stats.upcoming_bookings || 0}</p>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-rose-600/5 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-12 w-12 rounded-2xl bg-rose-50 flex items-center justify-center text-2xl group-hover:scale-110 transition-all">❤️</div>
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Wishlist</span>
                        <p className="text-4xl font-black text-rose-600">{stats.favourites_count || 0}</p>
                    </div>

                    <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-rose-600/5 transition-all group">
                        <div className="flex justify-between items-start mb-6">
                            <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-2xl group-hover:scale-110 transition-all text-amber-400">👑</div>
                        </div>
                        <span className="text-xs font-black text-slate-400 uppercase tracking-widest block mb-1">Status</span>
                        <p className="text-3xl font-black text-slate-900 uppercase tracking-tight">VIP Member</p>
                    </div>
                </div>

                {/* Notifications & System Announcements */}
                {notifications.length > 0 && (
                    <div className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="h-12 w-12 rounded-full bg-slate-50 flex items-center justify-center text-xl shadow-inner">🔔</div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Concierge Updates</h3>
                        </div>
                        
                        <div className="space-y-4">
                            {notifications.map((n) => (
                                <div key={n.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-slate-200 transition-colors">
                                    <div className="flex items-start gap-4">
                                        <div className="h-2 w-2 rounded-full bg-rose-500 mt-2"></div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-base">{n.title}</p>
                                            <p className="text-slate-500 text-sm font-medium mt-1 leading-relaxed">{n.message}</p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100 shrink-0">
                                        {new Date(n.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
