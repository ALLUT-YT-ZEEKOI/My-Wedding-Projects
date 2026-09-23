import { useState, useEffect, useRef } from 'react';

const POPULAR_LOCATIONS = [
    { city: 'Kochi', area: 'MG Road / Marine Drive', state: 'Kerala', icon: '📍' },
    { city: 'Ernakulam', area: 'Edappally & Kakkanad', state: 'Kerala', icon: '📍' },
    { city: 'Trivandrum', area: 'Kovalam & Kowdiar', state: 'Kerala', icon: '📍' },
    { city: 'Thrissur', area: 'Round West & Punkunnam', state: 'Kerala', icon: '📍' },
    { city: 'Kozhikode', area: 'Beach Road & Mavoor', state: 'Kerala', icon: '📍' },
    { city: 'Kottayam', area: 'Kumarakom & Pala', state: 'Kerala', icon: '📍' },
    { city: 'Alappuzha', area: 'Punnamada & Lake View', state: 'Kerala', icon: '📍' },
    { city: 'Guruvayur', area: 'Temple Road', state: 'Kerala', icon: '📍' },
    { city: 'Mumbai', area: 'Bandra West & Worli', state: 'Maharashtra', icon: '📍' },
];

export default function LocationAutocompleteInput({
    value = '',
    onChange,
    placeholder = 'Kochi, Edappally, Trivandrum...',
    className = '',
    inputClassName = '',
    onSelect,
}) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    // Filter suggestions based on typed value
    const query = (value || '').trim().toLowerCase();
    const suggestions = POPULAR_LOCATIONS.filter((loc) => {
        if (!query) return true;
        const text = `${loc.city} ${loc.area} ${loc.state}`.toLowerCase();
        return text.includes(query);
    });

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelectLocation = (locName) => {
        if (onChange) onChange(locName);
        if (onSelect) onSelect(locName);
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={value}
                    onChange={(e) => {
                        if (onChange) onChange(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    placeholder={placeholder}
                    className={
                        inputClassName ||
                        'w-full text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-rose-500 focus:border-rose-500 font-semibold px-3 py-2.5 pr-8'
                    }
                />
                {value && (
                    <button
                        type="button"
                        onClick={() => {
                            if (onChange) onChange('');
                            setIsOpen(true);
                        }}
                        className="absolute right-3 text-slate-400 hover:text-slate-700 text-xs font-bold"
                    >
                        ✕
                    </button>
                )}
            </div>

            {/* Suggestions Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white rounded-2xl border border-slate-200 shadow-2xl overflow-hidden max-h-72 overflow-y-auto animate-in fade-in duration-150">
                    <div className="p-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            {query ? 'Matching Locations' : 'Popular Search Locations'}
                        </span>
                        <span className="text-[10px] font-bold text-rose-600">LUXEHALLS Verified</span>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {suggestions.length > 0 ? (
                            suggestions.map((loc, idx) => (
                                <button
                                    key={idx}
                                    type="button"
                                    onClick={() => handleSelectLocation(loc.city)}
                                    className="w-full text-left px-4 py-3 hover:bg-rose-50/60 transition-colors flex items-center justify-between group cursor-pointer"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-rose-100 flex items-center justify-center text-sm transition-colors">
                                            {loc.icon}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900 text-sm group-hover:text-rose-600 transition-colors">
                                                {loc.city}
                                            </p>
                                            <p className="text-[11px] text-slate-500 font-medium">
                                                {loc.area} · {loc.state}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 group-hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all">
                                        Select →
                                    </span>
                                </button>
                            ))
                        ) : (
                            <div className="p-4 text-center">
                                <p className="text-xs font-bold text-slate-800">Search for "{value}"</p>
                                <p className="text-[11px] text-slate-500 mt-0.5">Press Enter or Search to find venues in this area</p>
                            </div>
                        )}
                    </div>

                    {/* Quick City Pills Footer */}
                    <div className="p-3 bg-slate-50 border-t border-slate-100 flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-bold text-slate-500">Quick Select:</span>
                        {['Kochi', 'Trivandrum', 'Thrissur', 'Ernakulam', 'Kozhikode'].map((c) => (
                            <button
                                key={c}
                                type="button"
                                onClick={() => handleSelectLocation(c)}
                                className="px-2.5 py-1 bg-white hover:bg-slate-200 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-700 transition-colors"
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
