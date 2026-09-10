import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ halls = [], allAmenities = [], filters = {}, favouriteHallIds = [] }) {
    const { data, setData, get } = useForm({
        location: filters.location || '',
        lat: filters.lat || '',
        lng: filters.lng || '',
        date: filters.date || '',
        sort: filters.sort || 'recommended',
    });

    const handleFilterSubmit = (e) => {
        e.preventDefault();
        get(route('halls.index'));
    };

    return (
        <CustomerLayout header="The Venue Collection">
            <Head title="Browse Premium Halls - LUXEHALLS" />

            <div className="min-h-screen bg-[#FAF9F6] pb-32">
                {/* Header Background */}
                <div className="bg-slate-900 text-white pt-10 pb-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[40vw] h-[40vw] bg-rose-500/20 rounded-full blur-[100px] translate-x-1/3 -translate-y-1/2"></div>
                    <div className="max-w-[1600px] mx-auto relative z-10">
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-4">
                            The <span className="font-serif italic font-light text-rose-400">Collection</span>
                        </h1>
                        <p className="text-slate-400 text-lg md:text-xl font-medium max-w-2xl">
                            A curated selection of the most exquisite venues tailored for your grandest celebrations.
                        </p>
                    </div>
                </div>

                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
                    
                    {/* Floating Glassmorphic Search Bar */}
                    <div className="bg-white/80 backdrop-blur-2xl p-3 md:p-4 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] mb-12">
                        <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row items-center gap-2">
                            
                            {/* Location */}
                            <div className="flex-1 w-full bg-slate-50/50 hover:bg-slate-50 rounded-full px-6 py-4 transition-colors border border-transparent hover:border-slate-100 flex items-center gap-3 group relative">
                                <span className="text-xl group-hover:scale-110 transition-transform">📍</span>
                                <div className="flex-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Location</label>
                                    <input
                                        type="text"
                                        value={data.location}
                                        onChange={(e) => { setData('location', e.target.value); setData('lat', ''); setData('lng', ''); }}
                                        placeholder="Where to?"
                                        className="w-full bg-transparent border-none text-slate-900 placeholder-slate-400 focus:ring-0 p-0 text-sm font-bold"
                                    />
                                </div>
                            </div>

                            <div className="hidden md:block w-[1px] h-10 bg-slate-200"></div>

                            {/* Date */}
                            <div className="flex-1 w-full bg-slate-50/50 hover:bg-slate-50 rounded-full px-6 py-4 transition-colors border border-transparent hover:border-slate-100 flex items-center gap-3 group">
                                <span className="text-xl group-hover:scale-110 transition-transform">🗓️</span>
                                <div className="flex-1">
                                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">When</label>
                                    <input
                                        type="date"
                                        value={data.date || ''}
                                        onChange={(e) => setData('date', e.target.value)}
                                        className="w-full bg-transparent border-none text-slate-900 placeholder-slate-400 focus:ring-0 p-0 text-sm font-bold"
                                    />
                                </div>
                            </div>

                            {/* Search Button */}
                            <button
                                type="submit"
                                className="w-full md:w-auto h-16 px-10 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold tracking-wider text-sm flex items-center justify-center gap-2 transition-transform hover:scale-105 shadow-xl shadow-slate-900/20 shrink-0"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Results Header */}
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <p className="text-sm font-black text-slate-500 uppercase tracking-widest">
                                Found <span className="text-slate-900">{halls.length}</span> venues
                            </p>
                        </div>
                        <select
                            value={data.sort}
                            onChange={(e) => {
                                setData('sort', e.target.value);
                                get(route('halls.index', { ...data, sort: e.target.value }));
                            }}
                            className="bg-transparent border-none text-slate-900 font-bold focus:ring-0 cursor-pointer"
                        >
                            <option value="recommended">Recommended</option>
                            <option value="price_asc">Lowest Price</option>
                            <option value="price_desc">Highest Price</option>
                        </select>
                    </div>

                    {/* Aesthetic Grid */}
                    {halls.length === 0 ? (
                        <div className="bg-white p-20 rounded-[3rem] text-center space-y-6 shadow-sm mt-10">
                            <div className="text-6xl">🗺️</div>
                            <h3 className="text-3xl font-black text-slate-900">No Venues Found</h3>
                            <p className="text-lg text-slate-500 font-medium">Try adjusting your search location or date.</p>
                            <button onClick={() => get(route('halls.index'))} className="mt-4 px-8 py-4 bg-slate-900 text-white rounded-full font-bold hover:bg-slate-800 transition-colors">
                                Clear Filters
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {halls.map((hall) => {
                                const isFav = favouriteHallIds.includes(hall.id);
                                return (
                                    <Link key={hall.id} href={route('halls.show', hall.id)} className="group block">
                                        <div className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden mb-5 bg-slate-100">
                                            <img
                                                src={hall.cover_photo || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'}
                                                alt={hall.name}
                                                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                                            />
                                            
                                            {/* Type Badge */}
                                            <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-lg">
                                                {hall.hall_type || 'Banquet Hall'}
                                            </div>

                                            {/* Heart Icon */}
                                            <div className="absolute top-5 right-5 w-10 h-10 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110">
                                                <span className={`text-xl leading-none mt-1 ${isFav ? 'text-rose-600' : 'text-slate-400'}`}>
                                                    {isFav ? '♥' : '♡'}
                                                </span>
                                            </div>

                                            {/* Gradient Overlay for Text */}
                                            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
                                            
                                            {/* Bottom Content */}
                                            <div className="absolute bottom-5 left-5 right-5 text-white">
                                                <h3 className="text-2xl font-black leading-tight mb-1">{hall.name}</h3>
                                                <p className="text-white/80 text-sm font-medium flex items-center gap-1">
                                                    <span>📍</span> {hall.area ? `${hall.area}, ${hall.city}` : hall.city}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Details below card */}
                                        <div className="px-2 flex justify-between items-start">
                                            <div>
                                                <p className="text-slate-500 font-bold text-sm mb-1">
                                                    Up to {hall.capacity || 500} Guests
                                                </p>
                                                <p className="text-xl font-black text-slate-900">
                                                    ₹{(hall.pricing?.base_price || 35000).toLocaleString()} <span className="text-xs text-slate-400 font-medium">/ event</span>
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1 bg-rose-50 px-3 py-1.5 rounded-lg text-rose-700 font-bold text-sm">
                                                ★ 4.9
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
