/**
 * Standard venue search form — location + date + submit.
 */
export default function HeaderSearchBar({
    location = '',
    setLocation,
    date = '',
    setDate,
    onSearch,
    guests = '',
    setGuests,
    eventType = '',
    setEventType,
    compact = false,
}) {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) onSearch();
    };

    return (
        <form
            onSubmit={handleSubmit}
            className={`w-full bg-white border border-slate-200 shadow-lg shadow-slate-200/40 ${
                compact ? 'rounded-xl p-3' : 'rounded-2xl p-4 sm:p-5'
            }`}
        >
            <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-end">
                <div className="flex-1 min-w-0">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-0.5">
                        Location
                    </label>
                    <input
                        type="text"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="Kochi, Thrissur, Trivandrum..."
                        className="w-full text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-rose-500 focus:border-rose-500 font-semibold px-3 py-2.5"
                    />
                </div>

                <div className="w-full md:w-44">
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-0.5">
                        Event Date
                    </label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-rose-500 focus:border-rose-500 font-semibold px-3 py-2.5"
                    />
                </div>

                {setGuests && (
                    <div className="w-full md:w-36">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-0.5">
                            Guests
                        </label>
                        <select
                            value={guests}
                            onChange={(e) => setGuests(e.target.value)}
                            className="w-full text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-rose-500 focus:border-rose-500 font-semibold px-3 py-2.5"
                        >
                            <option value="">Any size</option>
                            <option value="100">100+</option>
                            <option value="300">300+</option>
                            <option value="500">500+</option>
                            <option value="1000">1000+</option>
                        </select>
                    </div>
                )}

                {setEventType && (
                    <div className="w-full md:w-40">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-0.5">
                            Event
                        </label>
                        <select
                            value={eventType}
                            onChange={(e) => setEventType(e.target.value)}
                            className="w-full text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-rose-500 focus:border-rose-500 font-semibold px-3 py-2.5"
                        >
                            <option value="">All events</option>
                            <option value="Wedding">Wedding</option>
                            <option value="Reception">Reception</option>
                            <option value="Corporate">Corporate</option>
                        </select>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full md:w-auto px-6 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm rounded-xl shadow-md shadow-rose-600/20 transition-colors"
                >
                    Search Halls
                </button>
            </div>
        </form>
    );
}
