import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Welcome({ popularHalls = [], featuredHalls = [], offers = [], reviews = [] }) {
    const { data, setData, get } = useForm({
        location: '',
        lat: '',
        lng: '',
        date: '',
        guests: '100',
        event_type: 'Wedding',
    });

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('halls.index'));
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }
        
        setData('location', 'Detecting location...');
        
        navigator.geolocation.getCurrentPosition((position) => {
            setData(data => ({
                ...data,
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                location: 'Current Location'
            }));
        }, () => {
            alert('Unable to retrieve your location');
            setData('location', '');
        });
    };

    const eventTypes = [
        { name: 'Wedding', icon: '💍', count: '450+ Venues', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' },
        { name: 'Reception', icon: '✨', count: '320+ Venues', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80' },
        { name: 'Engagement', icon: '💑', count: '210+ Venues', img: 'https://images.unsplash.com/photo-1532712938736-59b13998816f?auto=format&fit=crop&w=800&q=80' },
        { name: 'Corporate', icon: '💼', count: '150+ Venues', img: 'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=800&q=80' },
    ];

    return (
        <CustomerLayout>
            <Head title="LUXEHALLS — Premium Event Venues" />

            {/* Immersive Hero Section */}
            <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-slate-900 mt-[-80px] pt-[80px]">
                {/* Background Image & Overlay */}
                <div className="absolute inset-0 z-0">
                    <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2000&q=80" alt="Hero" className="w-full h-full object-cover opacity-50" />
                    <div className="absolute inset-0 bg-slate-950/60"></div>
                </div>

                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-12 mt-12">
                    <div className="animate-fade-up space-y-6 flex-1 text-center md:text-left">
                        <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-[0.2em]">
                            Premium Venue Booking
                        </span>
                        
                        <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
                            Find the Perfect <br/>
                            <span className="text-white font-serif italic font-medium">Setting for your</span> <br/>
                            Special Day.
                        </h1>
                        
                        <p className="text-lg text-slate-300 max-w-md font-medium leading-relaxed mx-auto md:mx-0">
                            Discover India's most exclusive collection of luxury banquet halls, royal gardens, and elite convention centers.
                        </p>
                    </div>

                    {/* Smart Search Form */}
                    <div className="w-full max-w-md animate-fade-up">
                        <div className="bg-[#1A1C29] p-6 md:p-8 rounded-3xl border border-white/10 shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-6">Find Your Venue</h3>
                            
                            <form onSubmit={handleSearch} className="space-y-4">
                                {/* Location */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">📍 Where do you need a hall?</label>
                                    <div className="flex items-center px-4 py-3 bg-[#242736] rounded-xl border border-white/5 hover:border-white/10 transition-colors focus-within:border-rose-500">
                                        <input
                                            type="text"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            placeholder="Kochi, Edappally, Kakkanad..."
                                            className="w-full bg-transparent border-none text-white placeholder-slate-400 focus:ring-0 p-0 text-sm font-medium"
                                        />
                                        <button type="button" onClick={handleGetLocation} className="text-rose-400 hover:text-rose-300" title="Use my current location">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>

                                {/* Date */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">📅 Event Date</label>
                                    <div className="flex items-center px-4 py-3 bg-[#242736] rounded-xl border border-white/5 hover:border-white/10 transition-colors focus-within:border-rose-500">
                                        <input
                                            type="date"
                                            value={data.date || ''}
                                            onChange={(e) => setData('date', e.target.value)}
                                            className="w-full bg-transparent border-none text-white placeholder-slate-400 focus:ring-0 p-0 text-sm font-medium [color-scheme:dark]"
                                        />
                                    </div>
                                </div>

                                {/* Guests */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">👥 Guests</label>
                                    <div className="flex items-center px-4 py-3 bg-[#242736] rounded-xl border border-white/5 hover:border-white/10 transition-colors focus-within:border-rose-500">
                                        <select
                                            value={data.guests}
                                            onChange={(e) => setData('guests', e.target.value)}
                                            className="w-full bg-transparent border-none text-white focus:ring-0 p-0 text-sm font-medium cursor-pointer [&>option]:text-slate-900"
                                        >
                                            <option value="50">Up to 50 Guests</option>
                                            <option value="100">100+ Guests</option>
                                            <option value="300">300+ Guests</option>
                                            <option value="500">500+ Guests</option>
                                            <option value="1000">1000+ Guests</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Event Type */}
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-rose-400 uppercase tracking-widest block">🎉 Event Type</label>
                                    <div className="flex items-center px-4 py-3 bg-[#242736] rounded-xl border border-white/5 hover:border-white/10 transition-colors focus-within:border-rose-500">
                                        <select
                                            value={data.event_type}
                                            onChange={(e) => setData('event_type', e.target.value)}
                                            className="w-full bg-transparent border-none text-white focus:ring-0 p-0 text-sm font-medium cursor-pointer [&>option]:text-slate-900"
                                        >
                                            <option value="Wedding">Wedding</option>
                                            <option value="Reception">Reception</option>
                                            <option value="Engagement">Engagement</option>
                                            <option value="Corporate">Corporate Events</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <button
                                        type="submit"
                                        className="w-full py-3.5 bg-[#f97316] hover:bg-[#ea580c] text-white font-bold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                                    >
                                        🔍 Search Halls
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-32">
                
                {/* Categories */}
                <section className="relative">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div className="max-w-2xl">
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Curated Experiences</h2>
                            <p className="text-slate-500 font-medium mt-4 text-lg">Browse our exclusive collection categorized by the nature of your grand celebration.</p>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {eventTypes.map((cat, idx) => (
                            <Link
                                key={cat.name}
                                href={route('halls.index', { event_type: cat.name })}
                                className="group relative h-[400px] rounded-[2rem] overflow-hidden shadow-xl"
                            >
                                <img src={cat.img} alt={cat.name} className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                                <div className="absolute bottom-0 left-0 w-full p-8 flex flex-col justify-end">
                                    <span className="text-4xl mb-3 transform transition-transform group-hover:-translate-y-2">{cat.icon}</span>
                                    <h3 className="text-2xl font-black text-white">{cat.name}</h3>
                                    <p className="text-rose-300 font-bold text-sm mt-1">{cat.count}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Popular Halls */}
                <section>
                    <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                        <div>
                            <span className="text-rose-600 font-black tracking-widest uppercase text-xs">Exquisite Choices</span>
                            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mt-2">Signature Venues</h2>
                        </div>
                        <Link href={route('halls.index')} className="group flex items-center gap-2 text-sm font-black text-slate-900 hover:text-rose-600 uppercase tracking-wider">
                            View Collection <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {popularHalls.map((hall) => (
                            <Link href={route('halls.show', hall.id)} key={hall.id} className="group flex flex-col bg-white rounded-[2rem] p-4 shadow-sm hover:shadow-2xl hover:shadow-rose-600/10 transition-all duration-500 border border-slate-100">
                                <div className="relative h-64 rounded-3xl overflow-hidden mb-6">
                                    <img
                                        src={hall.cover_photo || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'}
                                        alt={hall.name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute top-4 left-4 glass px-4 py-1.5 rounded-full text-xs font-black text-slate-900 uppercase tracking-widest">
                                        {hall.hall_type || 'Banquet Hall'}
                                    </div>
                                    <div className="absolute bottom-4 right-4 bg-white px-3 py-1.5 rounded-xl shadow-lg flex items-center gap-1">
                                        <span className="text-amber-500 text-sm">★</span>
                                        <span className="font-bold text-slate-900 text-xs">4.9</span>
                                    </div>
                                </div>
                                <div className="px-4 pb-4 flex-1 flex flex-col">
                                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-rose-600 transition-colors leading-tight mb-2">{hall.name}</h3>
                                    <p className="text-slate-500 font-medium text-sm flex items-center gap-1 mb-4">
                                        <span>📍</span> {hall.city || hall.location}
                                    </p>
                                    <div className="mt-auto pt-4 border-t border-slate-100 flex justify-between items-end">
                                        <div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">Starting from</span>
                                            <span className="text-xl font-black text-slate-900">₹{(hall.pricing?.base_price || 35000).toLocaleString()}</span>
                                        </div>
                                        <div className="h-10 w-10 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-rose-600 group-hover:text-white transition-colors">
                                            →
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Promo Banner */}
                <section>
                    <div className="relative rounded-[3rem] overflow-hidden bg-slate-900 py-20 px-8 text-center shadow-2xl">
                        <div className="absolute inset-0 bg-gradient-to-br from-rose-600 to-amber-500 opacity-90"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
                        
                        <div className="relative z-10 max-w-3xl mx-auto space-y-8 animate-float">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-black uppercase tracking-[0.2em] border border-white/30">
                                Exclusive Member Benefits
                            </span>
                            <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">Unlock Royal Packages</h2>
                            <p className="text-rose-100 text-lg font-medium">
                                Join LuxeHalls today and get access to unadvertised pricing, complimentary decor consultations, and priority booking dates.
                            </p>
                            <Link href={route('register')} className="inline-block px-10 py-4 bg-white text-rose-600 font-black text-sm uppercase tracking-widest rounded-full shadow-2xl hover:scale-105 transition-transform">
                                Claim VIP Access
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </CustomerLayout>
    );
}
