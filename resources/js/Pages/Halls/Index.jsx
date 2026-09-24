import CustomerLayout from '@/Layouts/CustomerLayout';
import HeaderSearchBar from '@/Components/HeaderSearchBar';
import VenueCard from '@/Components/VenueCard';
import { Head, useForm, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ halls = [], allAmenities = [], filters = {}, favouriteHallIds = [] }) {
    const [activeCategory, setActiveCategory] = useState('all');

    const { data, setData, get } = useForm({
        location: filters.location || '',
        date: filters.date || '',
        guests: filters.guests || '',
        event_type: filters.event_type || '',
        sort: filters.sort || 'recommended',
    });

    const handleSearch = () => {
        get(route('halls.index'), {
            preserveState: false,
            preserveScroll: true,
        });
    };

    const toggleFavourite = (e, hallId) => {
        e.preventDefault();
        e.stopPropagation();
        router.post(
            route('favourites.toggle', hallId),
            {},
            {
                preserveScroll: true,
            }
        );
    };

    const categories = [
        { id: 'all', label: 'All Venues' },
        { id: 'banquet', label: 'Banquet Halls' },
        { id: 'lawn', label: 'Lawns & Outdoor' },
        { id: 'heritage', label: 'Heritage' },
        { id: 'resort', label: 'Resorts' },
        { id: 'beach', label: 'Beachfront' },
    ];

    // Location / date / guests / event are filtered on the server.
    // Only apply category chips client-side so we don't hide valid API results.
    const filteredHalls = halls.filter((hall) => {
        if (!activeCategory || activeCategory === 'all') return true;

        const cat = activeCategory.toLowerCase();
        const hallCat = (hall.category || '').toLowerCase();
        const hallName = (hall.name || '').toLowerCase();
        const hallType = (hall.hall_type || '').toLowerCase();
        const blob = `${hallCat} ${hallName} ${hallType}`;

        if (cat === 'banquet') return blob.includes('banquet') || blob.includes('hall');
        if (cat === 'lawn') return ['lawn', 'outdoor', 'garden'].some((k) => blob.includes(k));
        if (cat === 'heritage') return ['heritage', 'palace'].some((k) => blob.includes(k));
        if (cat === 'resort') return blob.includes('resort');
        if (cat === 'beach') return ['ocean', 'beach'].some((k) => blob.includes(k));
        return true;
    });

    const isFiltered = Boolean(
        (data.location || filters.location) || data.date || data.guests || data.event_type || (activeCategory && activeCategory !== 'all')
    );

    const handleClearFilters = () => {
        setData({
            location: '',
            date: '',
            guests: '',
            event_type: '',
            sort: 'recommended',
        });
        setActiveCategory('all');
        router.get(route('halls.index'), {}, { preserveState: false });
    };

    return (
        <CustomerLayout header="The Venue Collection">
            <Head title="Browse Premium Halls - LUXEHALLS" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 pb-20">
                <div className="sticky top-[72px] z-40">
                    <HeaderSearchBar
                        location={data.location}
                        setLocation={(val) => setData('location', val)}
                        date={data.date}
                        setDate={(val) => setData('date', val)}
                        guests={data.guests}
                        setGuests={(val) => setData('guests', val)}
                        eventType={data.event_type}
                        setEventType={(val) => setData('event_type', val)}
                        onSearch={handleSearch}
                        compact
                    />
                </div>

                {/* Category tabs */}
                <div className="flex flex-wrap items-center gap-2">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => setActiveCategory(cat.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                                activeCategory === cat.id
                                    ? 'bg-rose-600 text-white shadow-sm'
                                    : 'bg-white text-slate-600 border border-slate-200 hover:border-rose-300 hover:text-rose-600'
                            }`}
                        >
                            {cat.label}
                        </button>
                    ))}
                    {isFiltered && (
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="px-4 py-2 rounded-lg text-sm font-bold text-slate-500 hover:text-slate-800 border border-dashed border-slate-300"
                        >
                            Clear filters
                        </button>
                    )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-black text-slate-900">
                            {data.location || filters.location
                                ? `Venues in ${data.location || filters.location}`
                                : activeCategory !== 'all'
                                  ? categories.find((c) => c.id === activeCategory)?.label
                                  : 'All wedding halls'}
                        </h2>
                        <p className="text-sm text-slate-500 font-medium mt-0.5">
                            {filteredHalls.length} venue{filteredHalls.length !== 1 ? 's' : ''} found
                        </p>
                    </div>
                    <select
                        value={data.sort}
                        onChange={(e) => {
                            setData('sort', e.target.value);
                            get(route('halls.index', { ...data, sort: e.target.value }), {
                                preserveState: true,
                                preserveScroll: true,
                            });
                        }}
                        className="text-sm font-bold bg-white border border-slate-200 text-slate-800 rounded-lg py-2 px-3 focus:ring-rose-500 focus:border-rose-500"
                    >
                        <option value="recommended">Recommended</option>
                        <option value="price_asc">Lowest Price</option>
                        <option value="price_desc">Highest Price</option>
                    </select>
                </div>

                {filteredHalls.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                        {filteredHalls.map((hall, idx) => (
                            <VenueCard
                                key={hall.id}
                                hall={hall}
                                href={route('halls.show', hall.id)}
                                fallbackImage="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1000&q=80"
                                featured={idx === 0 && !isFiltered}
                                isFavourite={favouriteHallIds.includes(hall.id)}
                                onToggleFavourite={toggleFavourite}
                                ratingFallback={(4.7 + (idx % 3) * 0.1).toFixed(1)}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="py-16 text-center max-w-md mx-auto space-y-4 bg-white rounded-2xl border border-slate-100 px-8">
                        <div className="w-14 h-14 rounded-xl bg-slate-100 flex items-center justify-center text-2xl mx-auto text-slate-400">
                            🏰
                        </div>
                        <h3 className="text-xl font-black text-slate-900">No venues found</h3>
                        <p className="text-slate-500 text-sm">
                            Try another city or clear your filters to see all available halls.
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                            {['Kochi', 'Trivandrum', 'Thrissur', 'Ernakulam', 'Kozhikode'].map((city) => (
                                <button
                                    key={city}
                                    type="button"
                                    onClick={() => {
                                        setData('location', city);
                                        get(route('halls.index', { ...data, location: city }), {
                                            preserveState: true,
                                        });
                                    }}
                                    className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 transition-colors"
                                >
                                    {city}
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={handleClearFilters}
                            className="bg-rose-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-rose-500 transition-colors"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>
        </CustomerLayout>
    );
}
