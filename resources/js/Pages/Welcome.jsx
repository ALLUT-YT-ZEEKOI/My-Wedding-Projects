import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Welcome({ popularHalls = [], featuredHalls = [], offers = [], reviews = [] }) {
    const { data, setData, get } = useForm({
        location: '',
        date: '',
        guests: '100',
        event_type: 'Wedding',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('halls.index'));
    };

    const eventTypes = [
        {
            name: 'Wedding',
            icon: '💒',
            count: '450+ Venues',
            img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80',
        },
        {
            name: 'Reception',
            icon: '🥂',
            count: '320+ Venues',
            img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80',
        },
        {
            name: 'Engagement',
            icon: '💍',
            count: '210+ Venues',
            img: 'https://images.unsplash.com/photo-1532712938736-59b13998816f?auto=format&fit=crop&w=800&q=80',
        },
        {
            name: 'Corporate',
            icon: '🏢',
            count: '150+ Venues',
            img: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80',
        },
    ];

    const hallsToShow = (popularHalls?.length ? popularHalls : featuredHalls) || [];

    return (
        <CustomerLayout>
            <Head title="LUXEHALLS — Premium Event Venues" />

            {/* Hero */}
            <div className="relative min-h-[78vh] flex items-center overflow-hidden bg-slate-900 mt-[-72px] pt-[72px]">
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2000&q=80"
                        alt="Luxury banquet hall"
                        className="w-full h-full object-cover opacity-45"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-900/50" />
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-10 py-16">
                    <div className="flex-1 text-center lg:text-left space-y-5 max-w-xl">
                        <p className="text-rose-300 text-xs font-bold uppercase tracking-[0.2em]">
                            Premium Venue Booking
                        </p>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
                            LUXE<span className="text-rose-400">HALLS</span>
                        </h1>
                        <p className="text-lg text-slate-300 font-medium leading-relaxed">
                            Find and book luxury banquet halls, gardens, and convention centres across Kerala and India.
                        </p>
                        <div className="flex flex-wrap gap-3 justify-center lg:justify-start pt-2">
                            <Link
                                href={route('halls.index')}
                                className="px-6 py-3 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl shadow-lg transition-colors"
                            >
                                Browse All Venues
                            </Link>
                            <Link
                                href={route('register')}
                                className="px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-sm rounded-xl transition-colors"
                            >
                                List Your Venue
                            </Link>
                        </div>
                    </div>

                    <div className="w-full max-w-md shrink-0">
                        <div className="bg-white rounded-2xl p-6 sm:p-7 shadow-2xl border border-slate-100">
                            <h2 className="text-xl font-black text-slate-900 mb-5">Find Your Venue</h2>
                            <form onSubmit={handleSearch} className="space-y-4">
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">
                                        Location
                                    </label>
                                    <input
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        placeholder="Kochi, Edappally, Kakkanad..."
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-rose-500 focus:border-rose-500"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">
                                        Event Date
                                    </label>
                                    <input
                                        type="date"
                                        value={data.date || ''}
                                        onChange={(e) => setData('date', e.target.value)}
                                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-rose-500 focus:border-rose-500"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">
                                            Guests
                                        </label>
                                        <select
                                            value={data.guests}
                                            onChange={(e) => setData('guests', e.target.value)}
                                            className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-rose-500 focus:border-rose-500"
                                        >
                                            <option value="50">Up to 50</option>
                                            <option value="100">100+</option>
                                            <option value="300">300+</option>
                                            <option value="500">500+</option>
                                            <option value="1000">1000+</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1.5">
                                            Event
                                        </label>
                                        <select
                                            value={data.event_type}
                                            onChange={(e) => setData('event_type', e.target.value)}
                                            className="w-full px-3 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:ring-rose-500 focus:border-rose-500"
                                        >
                                            <option value="Wedding">Wedding</option>
                                            <option value="Reception">Reception</option>
                                            <option value="Engagement">Engagement</option>
                                            <option value="Corporate">Corporate</option>
                                        </select>
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="w-full py-3.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl shadow-md transition-colors mt-1"
                                >
                                    Search Halls
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-24">
                {/* Categories */}
                <section>
                    <div className="mb-10 max-w-2xl">
                        <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">Browse by Event</h2>
                        <p className="text-slate-500 font-medium mt-3">
                            Explore venues curated for weddings, receptions, engagements, and corporate celebrations.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        {eventTypes.map((cat) => (
                            <Link
                                key={cat.name}
                                href={route('halls.index', { event_type: cat.name })}
                                className="group relative h-72 rounded-2xl overflow-hidden shadow-lg"
                            >
                                <img
                                    src={cat.img}
                                    alt={cat.name}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent" />
                                <div className="absolute bottom-0 left-0 w-full p-6">
                                    <span className="text-3xl mb-2 block">{cat.icon}</span>
                                    <h3 className="text-xl font-black text-white">{cat.name}</h3>
                                    <p className="text-rose-300 font-bold text-sm mt-1">{cat.count}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Popular halls */}
                <section>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-10 gap-4">
                        <div>
                            <span className="text-rose-600 font-black tracking-widest uppercase text-xs">Featured</span>
                            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mt-2">
                                Popular Venues
                            </h2>
                        </div>
                        <Link
                            href={route('halls.index')}
                            className="text-sm font-bold text-rose-600 hover:text-rose-500"
                        >
                            View all venues →
                        </Link>
                    </div>

                    {hallsToShow.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {hallsToShow.slice(0, 6).map((hall) => (
                                <Link
                                    key={hall.id}
                                    href={route('halls.show', hall.id)}
                                    className="group flex flex-col bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 transition-all duration-300"
                                >
                                    <div className="relative h-52 overflow-hidden bg-slate-100">
                                        <img
                                            src={
                                                hall.cover_photo ||
                                                'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'
                                            }
                                            alt={hall.name}
                                            onError={(e) => {
                                                e.target.src =
                                                    'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80';
                                            }}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                        <div className="absolute top-3 left-3 bg-white/95 px-3 py-1 rounded-lg text-[11px] font-bold text-slate-800 uppercase tracking-wide">
                                            {hall.hall_type || 'Banquet Hall'}
                                        </div>
                                    </div>
                                    <div className="p-5 flex-1 flex flex-col">
                                        <h3 className="text-lg font-black text-slate-900 group-hover:text-rose-600 transition-colors leading-snug">
                                            {hall.name}
                                        </h3>
                                        <p className="text-slate-500 text-sm font-medium mt-1">
                                            {hall.city || hall.location || 'Kerala'}
                                            {hall.capacity ? ` · Up to ${Number(hall.capacity).toLocaleString()} guests` : ''}
                                        </p>
                                        <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-center">
                                            <div>
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                                    From
                                                </span>
                                                <span className="text-lg font-black text-slate-900">
                                                    ₹{(hall.pricing?.base_price || 35000).toLocaleString()}
                                                </span>
                                            </div>
                                            <span className="text-sm font-bold text-rose-600">View →</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                            <p className="text-slate-500 font-medium">No venues listed yet. Check back soon.</p>
                            <Link href={route('halls.index')} className="inline-block mt-4 text-rose-600 font-bold text-sm">
                                Browse halls →
                            </Link>
                        </div>
                    )}
                </section>

                {/* CTA */}
                <section>
                    <div className="relative rounded-2xl overflow-hidden bg-slate-900 py-16 px-8 text-center">
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-700 to-amber-600 opacity-90" />
                        <div className="relative z-10 max-w-2xl mx-auto space-y-5">
                            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
                                Own a venue? Partner with us
                            </h2>
                            <p className="text-rose-50 text-base font-medium">
                                List your banquet hall on LuxeHalls and reach couples looking for their perfect celebration space.
                            </p>
                            <Link
                                href={route('register')}
                                className="inline-block px-8 py-3.5 bg-white text-rose-600 font-bold text-sm rounded-xl shadow-lg hover:bg-slate-50 transition-colors"
                            >
                                Become a Host
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </CustomerLayout>
    );
}
