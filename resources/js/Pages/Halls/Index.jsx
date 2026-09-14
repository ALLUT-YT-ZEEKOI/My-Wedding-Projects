import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, useForm, router } from '@inertiajs/react';
import { useState, useRef, useEffect } from 'react';

export default function Index({ halls = [], allAmenities = [], filters = {}, favouriteHallIds = [] }) {
    const [activeSection, setActiveSection] = useState(null); // 'where', 'when', null
    const [dateTab, setDateTab] = useState('dates');
    const [flexRange, setFlexRange] = useState('exact');
    const [activeCategory, setActiveCategory] = useState('all');

    const { data, setData, get } = useForm({
        location: filters.location || '',
        date: filters.date || '',
        sort: filters.sort || 'recommended',
    });

    const searchRef = useRef(null);

    // Close popups on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setActiveSection(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        setActiveSection(null);
        get(route('halls.index'), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const toggleFavourite = (e, hallId) => {
        e.preventDefault();
        e.stopPropagation();
        router.post(route('favourites.toggle', hallId), {}, {
            preserveScroll: true,
        });
    };

    // Quick location suggestions
    const locations = [
        { title: 'Kochi (Ernakulam)', desc: 'Commercial Capital, Kerala', icon: '📍' },
        { title: 'Thiruvananthapuram', desc: 'Capital Territory, Kerala', icon: '🏡' },
        { title: 'Cochin International Airport (COK)', desc: 'Airport Convention Venues', icon: '✈️' },
        { title: 'Thrissur', desc: 'Cultural Capital, Kerala', icon: '📍' },
        { title: 'Nearby', desc: 'Hotels & halls near your location', icon: '📍' },
    ];

    // Categories with icons
    const categories = [
        { id: 'all', label: 'All Venues', icon: '🌐' },
        { id: 'banquet', label: 'Banquet Halls', icon: '🏰' },
        { id: 'lawn', label: 'Lawns & Outdoor', icon: '🌿' },
        { id: 'heritage', label: 'Heritage Palaces', icon: '🏛️' },
        { id: 'resort', label: 'Luxury Resorts', icon: '💎' },
        { id: 'beach', label: 'Beachfront', icon: '⛵' },
        { id: 'ac', label: 'Air-Conditioned', icon: '❄️' },
        { id: 'poolside', label: 'Poolside Venues', icon: '🏊' },
    ];

    const septemberDays = Array.from({ length: 30 }, (_, i) => i + 1);
    const octoberDays = Array.from({ length: 31 }, (_, i) => i + 1);

    // Responsive Filtering Pipeline on REAL Backend Halls Only
    const filteredHalls = halls.filter((hall) => {
        // Location filter
        const queryLoc = (data.location || filters.location || '').trim().toLowerCase();
        if (queryLoc) {
            const hallText = `${hall.name || ''} ${hall.city || ''} ${hall.area || ''} ${hall.location || ''} ${hall.address || ''}`.toLowerCase();
            const searchWords = queryLoc.split(/\s+/).filter(w => w.length > 1);
            const matches = searchWords.some(word => hallText.includes(word));
            if (!matches) return false;
        }

        // Category filter
        if (activeCategory && activeCategory !== 'all') {
            const cat = activeCategory.toLowerCase();
            const hallCat = (hall.category || '').toLowerCase();
            const hallName = (hall.name || '').toLowerCase();
            const hallType = (hall.hall_type || '').toLowerCase();

            if (cat === 'banquet' && !hallName.includes('banquet') && !hallCat.includes('banquet') && !hallType.includes('banquet')) return false;
            if (cat === 'lawn' && !hallName.includes('lawn') && !hallName.includes('outdoor') && !hallName.includes('garden') && !hallCat.includes('lawn') && !hallType.includes('lawn')) return false;
            if (cat === 'heritage' && !hallName.includes('heritage') && !hallName.includes('palace') && !hallCat.includes('heritage') && !hallType.includes('heritage')) return false;
            if (cat === 'resort' && !hallName.includes('resort') && !hallCat.includes('resort') && !hallType.includes('resort')) return false;
            if (cat === 'beach' && !hallName.includes('ocean') && !hallName.includes('beach') && !hallCat.includes('beach') && !hallType.includes('beach')) return false;
            if (cat === 'ac' && !hallName.includes('suite') && !hallName.includes('ac') && !hallName.includes('conditioned') && !hallCat.includes('ac') && !hallType.includes('ac')) return false;
            if (cat === 'poolside' && !hallName.includes('pool') && !hallCat.includes('poolside') && !hallType.includes('pool')) return false;
        }

        return true;
    });

    const isFiltered = Boolean((data.location || filters.location) || data.date || (activeCategory && activeCategory !== 'all'));

    const handleClearFilters = () => {
        setData('location', '');
        setData('date', '');
        setActiveCategory('all');
        setActiveSection(null);
    };

    return (
        <CustomerLayout activeCategory={activeCategory} onSelectCategory={setActiveCategory}>
            <Head title="LUXEHALLS | Search Venues, Banquets & Palaces" />

            <div className="min-h-screen bg-white pb-24 text-slate-900 font-sans">

                {/* AIRBNB EXPANDED SEARCH CONTAINER BAR */}
                <div className="max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 pt-5 pb-6">
                    <div ref={searchRef} className="relative max-w-4xl mx-auto z-40">
                        <div
                            className={`flex flex-col md:flex-row items-center bg-white rounded-full border border-slate-200/90 shadow-[0_4px_20px_rgba(0,0,0,0.08)] transition-all ${
                                activeSection ? 'ring-2 ring-slate-900/10' : 'hover:shadow-[0_6px_24px_rgba(0,0,0,0.12)]'
                            }`}
                        >
                            {/* WHERE SEGMENT */}
                            <div
                                onClick={() => setActiveSection(activeSection === 'where' ? null : 'where')}
                                className={`flex-1 w-full px-7 py-3.5 rounded-full cursor-pointer transition-all ${
                                    activeSection === 'where' ? 'bg-white shadow-xl rounded-full' : 'hover:bg-slate-50'
                                }`}
                            >
                                <label className="text-[10px] font-black text-slate-800 tracking-wider block uppercase mb-0.5">Where</label>
                                <input
                                    type="text"
                                    placeholder="Search destinations (e.g. Kochi, Trivandrum)"
                                    value={data.location}
                                    onChange={(e) => setData('location', e.target.value)}
                                    onFocus={() => setActiveSection('where')}
                                    className="w-full bg-transparent border-none p-0 text-sm font-semibold text-slate-900 placeholder-slate-400 focus:ring-0 cursor-pointer truncate"
                                />
                            </div>

                            <div className="hidden md:block w-[1px] h-8 bg-slate-200"></div>

                            {/* WHEN SEGMENT */}
                            <div
                                onClick={() => setActiveSection(activeSection === 'when' ? null : 'when')}
                                className={`flex-1 w-full px-7 py-3.5 rounded-full cursor-pointer transition-all flex items-center justify-between gap-3 ${
                                    activeSection === 'when' ? 'bg-white shadow-xl rounded-full' : 'hover:bg-slate-50'
                                }`}
                            >
                                <div>
                                    <label className="text-[10px] font-black text-slate-800 tracking-wider block uppercase mb-0.5">When</label>
                                    <p className="text-sm font-semibold text-slate-900 truncate">
                                        {data.date ? new Date(data.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }) : 'Add dates'}
                                    </p>
                                </div>

                                {/* AIRBNB PINK SEARCH BUTTON */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleSearch();
                                    }}
                                    className="bg-[#FF385C] hover:bg-[#e00b41] text-white px-6 py-3 rounded-full font-bold text-sm flex items-center gap-2 transition-transform hover:scale-105 shadow-md shadow-rose-500/30 shrink-0 cursor-pointer"
                                >
                                    <span>🔍</span>
                                    <span className="hidden sm:inline">Search</span>
                                </button>
                            </div>
                        </div>

                        {/* WHERE POPUP DROPDOWN */}
                        {activeSection === 'where' && (
                            <div className="absolute top-full left-0 mt-3 w-full md:w-[480px] bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 px-2">Popular destinations</p>
                                <div className="space-y-1">
                                    {locations.map((loc, idx) => (
                                        <div
                                            key={idx}
                                            onClick={() => {
                                                const searchCity = loc.title.includes('Kochi') ? 'Kochi' : loc.title.includes('Thiruvananthapuram') ? 'Trivandrum' : loc.title.includes('Thrissur') ? 'Thrissur' : 'Kochi';
                                                setData('location', searchCity);
                                                setActiveSection('when');
                                            }}
                                            className="flex items-center gap-4 p-3.5 hover:bg-slate-50 rounded-2xl cursor-pointer transition-colors"
                                        >
                                            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-xl shrink-0">
                                                {loc.icon}
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-900 text-sm">{loc.title}</p>
                                                <p className="text-xs text-slate-500 font-medium">{loc.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* WHEN DATE PICKER POPUP */}
                        {activeSection === 'when' && (
                            <div className="absolute top-full right-0 mt-3 w-full md:w-[720px] bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="flex justify-center mb-6">
                                    <div className="bg-slate-100 p-1 rounded-full flex gap-1">
                                        <button
                                            onClick={() => setDateTab('dates')}
                                            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
                                                dateTab === 'dates' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            Dates
                                        </button>
                                        <button
                                            onClick={() => setDateTab('flexible')}
                                            className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
                                                dateTab === 'flexible' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                        >
                                            Flexible
                                        </button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
                                    <div>
                                        <h4 className="text-center font-bold text-slate-900 text-sm mb-4">September 2026</h4>
                                        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-2">
                                            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                                        </div>
                                        <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                            <span className="p-2"></span><span className="p-2"></span>
                                            {septemberDays.map((day) => (
                                                <button
                                                    key={`sept-${day}`}
                                                    onClick={() => {
                                                        const selDate = `2026-09-${String(day).padStart(2, '0')}`;
                                                        setData('date', selDate);
                                                        setActiveSection(null);
                                                    }}
                                                    className={`p-2 rounded-full hover:bg-slate-100 font-semibold transition-all ${
                                                        data.date === `2026-09-${String(day).padStart(2, '0')}`
                                                            ? 'bg-slate-900 text-white hover:bg-slate-900'
                                                            : 'text-slate-800'
                                                    }`}
                                                >
                                                    {day}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-center font-bold text-slate-900 text-sm mb-4">October 2026</h4>
                                        <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 mb-2">
                                            <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
                                        </div>
                                        <div className="grid grid-cols-7 gap-1 text-center text-xs">
                                            <span className="p-2"></span><span className="p-2"></span><span className="p-2"></span><span className="p-2"></span>
                                            {octoberDays.map((day) => (
                                                <button
                                                    key={`oct-${day}`}
                                                    onClick={() => {
                                                        const selDate = `2026-10-${String(day).padStart(2, '0')}`;
                                                        setData('date', selDate);
                                                        setActiveSection(null);
                                                    }}
                                                    className={`p-2 rounded-full hover:bg-slate-100 font-semibold transition-all ${
                                                        data.date === `2026-10-${String(day).padStart(2, '0')}`
                                                            ? 'bg-slate-900 text-white hover:bg-slate-900'
                                                            : 'text-slate-800'
                                                    }`}
                                                >
                                                    {day}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center justify-center gap-2 pt-4 border-t border-slate-100">
                                    {['Exact dates', '± 1 day', '± 2 days', '± 3 days', '± 7 days', '± 14 days'].map((range, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setFlexRange(range)}
                                            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                                                flexRange === range
                                                    ? 'border-slate-900 bg-slate-900 text-white'
                                                    : 'border-slate-200 text-slate-700 hover:border-slate-900'
                                            }`}
                                        >
                                            {range}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* CATEGORY SCROLLER BAR */}
                <div className="max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 py-3 border-b border-slate-100 mb-8">
                    <div className="flex items-center justify-between gap-4 overflow-x-auto scrollbar-none">
                        <div className="flex items-center gap-8 min-w-max">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => setActiveCategory(cat.id)}
                                    className={`flex flex-col items-center gap-2 py-2 border-b-2 transition-all cursor-pointer ${
                                        activeCategory === cat.id
                                            ? 'border-slate-900 text-slate-900 font-bold'
                                            : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300 font-medium'
                                    }`}
                                >
                                    <span className="text-2xl leading-none">{cat.icon}</span>
                                    <span className="text-xs tracking-tight">{cat.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="hidden md:flex items-center gap-3 pl-6 border-l border-slate-200 shrink-0">
                            <button className="flex items-center gap-2 border border-slate-300 rounded-xl px-4 py-2.5 text-xs font-bold hover:border-slate-900 transition-colors cursor-pointer">
                                <span>🎛️</span> Filters
                            </button>
                        </div>
                    </div>
                </div>

                {/* MAIN VENUES SECTION */}
                <div className="max-w-[1760px] mx-auto px-4 sm:px-8 lg:px-12 space-y-12">
                    
                    {/* DYNAMIC TITLE BAR */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
                        <div>
                            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                                {data.location || filters.location ? (
                                    <>
                                        Venues in <span className="text-[#FF385C]">{data.location || filters.location}</span>
                                        {data.date && <span className="text-slate-500 font-normal"> · {new Date(data.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</span>}
                                    </>
                                ) : activeCategory !== 'all' ? (
                                    <>
                                        {categories.find(c => c.id === activeCategory)?.label || 'Venues'} in Kerala
                                    </>
                                ) : (
                                    <>Popular wedding halls in Kerala →</>
                                )}
                            </h2>
                            <p className="text-xs text-slate-500 font-medium mt-1">
                                {filteredHalls.length} venue{filteredHalls.length !== 1 ? 's' : ''} available in database
                            </p>
                        </div>

                        {/* CLEAR FILTERS BUTTON */}
                        {isFiltered && (
                            <button
                                onClick={handleClearFilters}
                                className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-300 hover:border-slate-900 text-xs font-bold text-slate-700 transition-colors cursor-pointer self-start sm:self-auto shrink-0"
                            >
                                <span>✕</span> Clear filters
                            </button>
                        )}
                    </div>

                    {/* VENUE CARD GRID OR EMPTY STATE */}
                    {filteredHalls.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredHalls.map((hall, idx) => {
                                const isFav = favouriteHallIds.includes(hall.id);
                                return (
                                    <Link key={hall.id || idx} href={route('halls.show', hall.id)} className="group block space-y-3">
                                        <div className="relative aspect-[20/19] rounded-2xl overflow-hidden bg-slate-100 shadow-sm">
                                            <img
                                                src={hall.cover_photo || hall.img || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80'}
                                                alt={hall.name}
                                                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80'; }}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-[11px] font-bold text-slate-900 shadow-sm border border-slate-200/50">
                                                Guest favourite
                                            </div>
                                            <button
                                                onClick={(e) => toggleFavourite(e, hall.id)}
                                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-md hover:bg-white flex items-center justify-center shadow-sm transition-transform hover:scale-110"
                                            >
                                                <span className={`text-base leading-none ${isFav ? 'text-[#FF385C]' : 'text-slate-600'}`}>
                                                    {isFav ? '♥' : '♡'}
                                                </span>
                                            </button>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex justify-between items-start">
                                                <h3 className="font-bold text-slate-900 text-base leading-snug group-hover:text-[#FF385C] transition-colors truncate">
                                                    {hall.name}
                                                </h3>
                                                <div className="flex items-center gap-1 text-sm font-semibold text-slate-900 shrink-0">
                                                    <span>★</span>
                                                    <span>{hall.rating || '4.98'}</span>
                                                </div>
                                            </div>
                                            <p className="text-slate-500 text-sm font-medium">{hall.city || (hall.area ? `${hall.area}, ${hall.city}` : 'Kerala')}</p>
                                            <p className="text-slate-500 text-sm font-medium">Up to {(hall.capacity || 1000).toLocaleString()} guests · Available</p>
                                            <div className="pt-1">
                                                <span className="font-bold text-slate-900 text-base">
                                                    ₹{(hall.pricing?.base_price || 35000).toLocaleString()}
                                                </span>
                                                <span className="text-slate-600 text-sm font-normal"> / event</span>
                                            </div>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    ) : (
                        /* ELEGANT EMPTY STATE */
                        <div className="py-16 text-center max-w-md mx-auto space-y-4">
                            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-3xl mx-auto text-slate-400">
                                🏰
                            </div>
                            <h3 className="text-xl font-bold text-slate-900">
                                No venues found in "{data.location || filters.location}"
                            </h3>
                            <p className="text-slate-500 text-sm">
                                Try searching for popular Kerala cities or reset your search filters.
                            </p>
                            
                            {/* Suggestion Pills */}
                            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                                {['Kochi', 'Trivandrum', 'Thrissur', 'Ernakulam', 'Kozhikode'].map((city) => (
                                    <button
                                        key={city}
                                        onClick={() => {
                                            setData('location', city);
                                            setActiveSection(null);
                                        }}
                                        className="px-4 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                                    >
                                        📍 {city}
                                    </button>
                                ))}
                            </div>

                            <div className="pt-4">
                                <button
                                    onClick={handleClearFilters}
                                    className="bg-[#FF385C] text-white px-6 py-2.5 rounded-full font-bold text-xs shadow-md hover:bg-[#e00b41] transition-colors cursor-pointer"
                                >
                                    Clear Filters &amp; View All Venues
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </CustomerLayout>
    );
}
