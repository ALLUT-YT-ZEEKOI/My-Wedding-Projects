import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default Leaflet marker icons not showing in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function Show({ hall, isFavourite = false }) {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedSlot, setSelectedSlot] = useState('full_day');
    const [guestCount, setGuestCount] = useState('500-1000 guests');
    const [showGalleryModal, setShowGalleryModal] = useState(false);

    const pricing = hall.pricing || {
        base_price: 35000,
        morning_price: 20000,
        evening_price: 28000,
        full_day_price: 35000,
        security_deposit: 5000,
    };

    const policy = hall.policy || {
        event_timing: '08:00 AM - 11:00 PM',
        veg_allowed: true,
        non_veg_allowed: true,
        outside_catering_allowed: true,
        alcohol_policy: 'Permitted with excise license',
        music_policy: 'Allowed till 10:00 PM',
    };

    const bookedSlotsForDate = (hall.availabilities || [])
        .filter((a) => a.date === selectedDate && a.status === 'booked')
        .map((a) => a.slot);

    const toggleFavourite = (e) => {
        e.preventDefault();
        router.post(route('favourites.toggle', hall.id), {}, {
            preserveScroll: true,
        });
    };

    // Gallery image collage URLs
    const defaultGallery = [
        hall.cover_photo || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
        'https://images.unsplash.com/photo-1545232979-fbf34f5ce948?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    ];

    const galleryImages = (hall.media && hall.media.length >= 5) 
        ? hall.media.map(m => m.file_path || m.url)
        : defaultGallery;

    // Venue spaces / "Where you'll celebrate"
    const venueSpaces = [
        { title: 'Grand Central Banquet', desc: `${hall.seating_capacity || 800} AC seating capacity`, img: galleryImages[0] },
        { title: 'Verdant Wedding Lawn', desc: `${hall.floating_capacity || 1200} outdoor capacity`, img: galleryImages[2] },
        { title: 'Luxe Dining Pavilion', desc: `${hall.dining_capacity || 300} dining seats`, img: galleryImages[1] },
        { title: 'VIP & Bridal Suites', desc: '2 Private air-conditioned suites', img: galleryImages[3] },
    ];

    // Calculated slot price
    const currentPrice = selectedSlot === 'morning' 
        ? (pricing.morning_price || 20000)
        : selectedSlot === 'evening'
        ? (pricing.evening_price || 28000)
        : (pricing.full_day_price || pricing.base_price || 35000);

    return (
        <CustomerLayout>
            <Head title={`${hall.name} | LUXEHALLS`} />

            <div className="min-h-screen bg-white text-slate-900 font-sans pb-24">
                <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 pt-6">
                    
                    {/* TITLE & HEADER ACTION BAR */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                                {hall.name}
                            </h1>
                            <p className="text-sm font-medium text-slate-600 mt-1 flex flex-wrap items-center gap-2">
                                <span>📍 {hall.area ? `${hall.area}, ` : ''}{hall.city || 'Kochi, Kerala'}</span>
                                <span>·</span>
                                <span>Up to {(hall.capacity || 1000).toLocaleString()} guests</span>
                                <span>·</span>
                                <span>{hall.hall_type || 'Marriage Hall & Convention Center'}</span>
                            </p>
                        </div>

                        {/* SHARE & SAVE BUTTONS */}
                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                onClick={() => navigator.clipboard?.writeText(window.location.href)}
                                className="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-800 hover:bg-slate-100 px-4 py-2 rounded-xl transition-colors cursor-pointer"
                            >
                                <span className="text-base">↗</span> Share
                            </button>
                            <button
                                onClick={toggleFavourite}
                                className="flex items-center gap-2 text-xs md:text-sm font-bold text-slate-800 hover:bg-slate-100 px-4 py-2 rounded-xl transition-colors cursor-pointer"
                            >
                                <span className={`text-base leading-none ${isFavourite ? 'text-[#FF385C]' : 'text-slate-700'}`}>
                                    {isFavourite ? '♥' : '♡'}
                                </span>
                                {isFavourite ? 'Saved' : 'Save'}
                            </button>
                        </div>
                    </div>

                    {/* AIRBNB 5-PHOTO COLLAGE GRID */}
                    <div className="relative rounded-3xl overflow-hidden shadow-sm bg-slate-100 mb-10 group">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 h-[340px] sm:h-[440px] md:h-[480px]">
                            {/* Main Large Photo (Left 2 cols) */}
                            <div className="md:col-span-2 h-full overflow-hidden">
                                <img
                                    src={galleryImages[0]}
                                    alt={hall.name}
                                    onError={(e) => { e.target.src = defaultGallery[0]; }}
                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer"
                                    onClick={() => setShowGalleryModal(true)}
                                />
                            </div>

                            {/* Right 4 Small Photos (2x2 Grid) */}
                            <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-2 h-full">
                                {galleryImages.slice(1, 5).map((imgUrl, idx) => (
                                    <div key={idx} className="h-full overflow-hidden relative">
                                        <img
                                            src={imgUrl}
                                            alt={`${hall.name} preview ${idx + 2}`}
                                            onError={(e) => { e.target.src = defaultGallery[idx + 1] || defaultGallery[0]; }}
                                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 cursor-pointer"
                                            onClick={() => setShowGalleryModal(true)}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SHOW ALL PHOTOS BUTTON OVERLAY */}
                        <button
                            onClick={() => setShowGalleryModal(true)}
                            className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-md hover:bg-white text-slate-900 px-4 py-2 rounded-xl text-xs font-bold shadow-md border border-slate-200 flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer"
                        >
                            <span>⊞</span> Show all photos
                        </button>
                    </div>

                    {/* MAIN DETAILS GRID (LEFT 7 COLS / RIGHT 5 COLS) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                        
                        {/* LEFT COLUMN: VENUE INFO & HIGHLIGHTS */}
                        <div className="lg:col-span-7 space-y-8">
                            
                            {/* VENUE CAPACITY & CANCEL TAG */}
                            <div className="pb-6 border-b border-slate-200">
                                <h2 className="text-xl font-bold text-slate-900">
                                    Entire venue in {hall.city || 'Kochi'}, India
                                </h2>
                                <p className="text-slate-600 text-sm font-medium mt-1">
                                    {(hall.capacity || 1000).toLocaleString()} guests · {hall.seating_capacity || 800} seating · {hall.dining_capacity || 300} dining · {venueSpaces.length} event zones
                                </p>
                                <div className="mt-3">
                                    <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-md text-xs font-semibold">
                                        Free cancellation available
                                    </span>
                                </div>
                            </div>

                            {/* AIRBNB "GUEST FAVOURITE" BANNER CARD */}
                            <div className="border border-slate-200 rounded-3xl p-6 shadow-sm flex items-center justify-between bg-white gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="text-3xl text-amber-500 shrink-0">🏆</div>
                                    <div>
                                        <h3 className="font-extrabold text-slate-900 text-base">Guest favourite</h3>
                                        <p className="text-slate-500 text-xs font-medium mt-0.5">
                                            One of the most loved venues on LUXEHALLS, according to guests
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right shrink-0 border-l border-slate-200 pl-6">
                                    <div className="text-2xl font-black text-slate-900">5.0</div>
                                    <div className="text-amber-500 text-xs font-bold">★★★★★</div>
                                    <p className="text-slate-400 text-[11px] font-bold mt-0.5">{hall.reviews?.length || 93} Reviews</p>
                                </div>
                            </div>

                            {/* HOST / VENUE MANAGER INFO */}
                            <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
                                <div className="w-12 h-12 rounded-full bg-[#FF385C] text-white flex items-center justify-center font-bold text-lg shadow-md shrink-0">
                                    {hall.vendor?.name ? hall.vendor.name.charAt(0).toUpperCase() : 'L'}
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900 text-base">
                                        Hosted by {hall.vendor?.name || 'Luxe Venue Managers'}
                                    </h3>
                                    <p className="text-slate-500 text-xs font-medium">Superhost · Verified Venue Partner</p>
                                </div>
                            </div>

                            {/* FEATURE HIGHLIGHTS LIST */}
                            <div className="space-y-6 pb-8 border-b border-slate-200">
                                <div className="flex items-start gap-4">
                                    <span className="text-2xl shrink-0">🏆</span>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">Top 1% of venues</h4>
                                        <p className="text-slate-500 text-xs mt-0.5 font-medium leading-relaxed">
                                            This venue is one of the highest ranked based on guest ratings, reviews, and reliability.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <span className="text-2xl shrink-0">❄️</span>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">Designed for grand celebrations</h4>
                                        <p className="text-slate-500 text-xs mt-0.5 font-medium leading-relaxed">
                                            Full central air-conditioning, raised stage setup, acoustic soundproofing, and heavy backup power.
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-4">
                                    <span className="text-2xl shrink-0">🔑</span>
                                    <div>
                                        <h4 className="font-bold text-slate-900 text-sm">Dedicated Venue Manager</h4>
                                        <p className="text-slate-500 text-xs mt-0.5 font-medium leading-relaxed">
                                            Smooth event coordination with on-site staff during your function setup and execution.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* WHERE YOU'LL CELEBRATE (VENUE SPACES CAROUSEL) */}
                            <div className="pb-8 border-b border-slate-200">
                                <h3 className="text-xl font-bold text-slate-900 mb-4">Where you'll celebrate</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {venueSpaces.map((space, idx) => (
                                        <div key={idx} className="border border-slate-200 rounded-2xl p-4 bg-white shadow-sm space-y-3">
                                            <div className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100">
                                                <img
                                                    src={space.img}
                                                    alt={space.title}
                                                    onError={(e) => { e.target.src = defaultGallery[0]; }}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">{space.title}</h4>
                                                <p className="text-slate-500 text-xs font-medium">{space.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* WHAT THIS PLACE OFFERS (AMENITIES GRID) */}
                            <div className="pb-8 border-b border-slate-200">
                                <h3 className="text-xl font-bold text-slate-900 mb-6">What this place offers</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {[
                                        { name: 'Dining Hall & Catering Space', icon: '🍽️' },
                                        { name: 'High-Speed Wi-Fi & Sound System', icon: '📶' },
                                        { name: 'Dedicated Event Staff & Security', icon: '💼' },
                                        { name: 'Free Parking on Premises (200+ cars)', icon: '🅿️' },
                                        { name: 'Central Air Conditioning', icon: '❄️' },
                                        { name: 'Heavy Power Backup Generator', icon: '⚡' },
                                        { name: 'Raised Stage & Backdrop Rigging', icon: '🎭' },
                                        { name: 'Private Dressing & Makeup Rooms', icon: '🚪' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-800">
                                            <span className="text-xl shrink-0">{item.icon}</span>
                                            <span>{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* OPERATIONAL POLICIES */}
                            <div className="pb-8 border-b border-slate-200 space-y-4">
                                <h3 className="text-xl font-bold text-slate-900">Venue Policies</h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="font-bold text-slate-900">Event Timings</p>
                                        <p className="text-slate-600 font-medium mt-0.5">{policy.event_timing}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="font-bold text-slate-900">Catering Policy</p>
                                        <p className="text-slate-600 font-medium mt-0.5">
                                            {policy.veg_allowed ? 'Veg' : ''} {policy.non_veg_allowed ? '& Non-Veg Allowed' : ''}
                                        </p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="font-bold text-slate-900">Alcohol Policy</p>
                                        <p className="text-slate-600 font-medium mt-0.5">{policy.alcohol_policy}</p>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                        <p className="font-bold text-slate-900">Music & DJ</p>
                                        <p className="text-slate-600 font-medium mt-0.5">{policy.music_policy}</p>
                                    </div>
                                </div>
                            </div>

                            {/* LOCATION & GOOGLE MAPS EMBED */}
                            <div className="pb-8 space-y-4">
                                <h3 className="text-xl font-bold text-slate-900">Where you'll be</h3>
                                <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                                    <div>
                                        <p className="font-bold text-slate-900 text-sm">
                                            📍 {hall.address || hall.name}
                                        </p>
                                        <p className="text-slate-500 text-xs font-medium mt-0.5">
                                            {hall.area ? `${hall.area}, ` : ''}{hall.city || 'Kerala'} {hall.pincode ? ` - ${hall.pincode}` : ''}
                                            {hall.landmark ? ` (Near ${hall.landmark})` : ''}
                                        </p>
                                    </div>
                                    <a
                                        href={
                                            hall.map_url ||
                                            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                                                `${hall.name}, ${hall.address || ''} ${hall.area || ''} ${hall.city || ''}`
                                            )}`
                                        }
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-900 text-slate-800 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
                                    >
                                        <span>📍 Open in Google Maps</span>
                                        <span>↗</span>
                                    </a>
                                </div>

                                {/* MAP EMBED OR LEAFLET CONTAINER */}
                                <div className="h-80 w-full rounded-3xl overflow-hidden shadow-sm border border-slate-200 relative bg-slate-100">
                                    {hall.latitude && hall.longitude ? (
                                        <MapContainer center={[hall.latitude, hall.longitude]} zoom={15} scrollWheelZoom={false} className="w-full h-full z-0">
                                            <TileLayer
                                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                            />
                                            <Marker position={[hall.latitude, hall.longitude]}>
                                                <Popup className="rounded-xl font-sans">
                                                    <div className="font-bold text-slate-900">{hall.name}</div>
                                                    <div className="text-xs text-slate-500">{hall.city}</div>
                                                </Popup>
                                            </Marker>
                                        </MapContainer>
                                    ) : (
                                        <iframe
                                            title="Venue Location Map"
                                            width="100%"
                                            height="100%"
                                            style={{ border: 0 }}
                                            loading="lazy"
                                            allowFullScreen
                                            src={
                                                hall.map_url && hall.map_url.includes('google.com/maps/embed')
                                                    ? hall.map_url
                                                    : `https://maps.google.com/maps?q=${encodeURIComponent(
                                                          `${hall.name}, ${hall.address || ''} ${hall.area || ''} ${hall.city || 'Kerala'}`
                                                      )}&t=&z=14&ie=UTF8&iwloc=&output=embed`
                                            }
                                        ></iframe>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: AIRBNB STICKY RESERVE CARD */}
                        <div className="lg:col-span-5 relative">
                            <div className="sticky top-28 space-y-4">
                                
                                {/* TOP FEES INCLUDED BANNER */}
                                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 text-center text-xs font-bold text-slate-700 shadow-sm flex items-center justify-center gap-2">
                                    <span className="text-rose-500">🏷️</span> Prices include all taxes &amp; venue fees
                                </div>

                                {/* RESERVATION CARD BOX */}
                                <div className="bg-white border border-slate-200/90 rounded-3xl p-6 shadow-2xl space-y-6">
                                    
                                    {/* PRICE HEADER */}
                                    <div className="flex justify-between items-baseline">
                                        <div>
                                            <span className="text-2xl font-black text-slate-900">
                                                ₹{currentPrice.toLocaleString()}
                                            </span>
                                            <span className="text-slate-500 text-sm font-normal"> / event day</span>
                                        </div>
                                        <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                                            <span>★</span>
                                            <span>5.0</span>
                                            <span className="text-slate-400 font-normal">({hall.reviews?.length || 93})</span>
                                        </div>
                                    </div>

                                    {/* INPUT BOX CONTAINER */}
                                    <div className="border border-slate-300 rounded-2xl overflow-hidden divide-y divide-slate-300">
                                        
                                        {/* TOP SEGMENT: EVENT DATE & SLOT */}
                                        <div className="grid grid-cols-2 divide-x divide-slate-300 bg-white">
                                            <div className="p-3">
                                                <label className="text-[9px] font-black text-slate-800 tracking-wider uppercase block">Event Date</label>
                                                <input
                                                    type="date"
                                                    value={selectedDate}
                                                    onChange={(e) => setSelectedDate(e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full p-0 border-none bg-transparent text-xs font-bold text-slate-900 focus:ring-0 cursor-pointer"
                                                />
                                            </div>
                                            <div className="p-3">
                                                <label className="text-[9px] font-black text-slate-800 tracking-wider uppercase block">Slot</label>
                                                <select
                                                    value={selectedSlot}
                                                    onChange={(e) => setSelectedSlot(e.target.value)}
                                                    className="w-full p-0 border-none bg-transparent text-xs font-bold text-slate-900 focus:ring-0 cursor-pointer"
                                                >
                                                    <option value="full_day">Full Day (Full Access)</option>
                                                    <option value="morning">Morning (08:00 - 15:00)</option>
                                                    <option value="evening">Evening (16:00 - 23:00)</option>
                                                </select>
                                            </div>
                                        </div>

                                        {/* BOTTOM SEGMENT: GUESTS */}
                                        <div className="p-3 bg-white">
                                            <label className="text-[9px] font-black text-slate-800 tracking-wider uppercase block">Estimated Guests</label>
                                            <select
                                                value={guestCount}
                                                onChange={(e) => setGuestCount(e.target.value)}
                                                className="w-full p-0 border-none bg-transparent text-xs font-bold text-slate-900 focus:ring-0 cursor-pointer"
                                            >
                                                <option value="Up to 500 guests">Up to 500 guests</option>
                                                <option value="500-1000 guests">500 – 1,000 guests</option>
                                                <option value="1000+ guests">1,000+ guests (Grand Hall)</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* CANCELLATION BADGE */}
                                    <div className="bg-slate-100 rounded-xl p-3 text-center text-xs font-medium text-slate-700">
                                        Free cancellation up to 7 days before event date
                                    </div>

                                    {/* AIRBNB SIGNATURE PINK RESERVE BUTTON */}
                                    <Link
                                        href={route('halls.book', { id: hall.id, date: selectedDate, slot: selectedSlot })}
                                        className="w-full bg-[#FF385C] hover:bg-[#e00b41] text-white py-4 rounded-2xl font-bold text-center text-base shadow-lg shadow-rose-500/30 block transition-transform hover:scale-[1.02] cursor-pointer"
                                    >
                                        Reserve
                                    </Link>

                                    <p className="text-center text-xs text-slate-400 font-medium">
                                        You won't be charged yet
                                    </p>

                                    {/* PRICING BREAKDOWN DETAILS */}
                                    <div className="pt-4 border-t border-slate-100 space-y-2 text-xs text-slate-600">
                                        <div className="flex justify-between">
                                            <span className="underline cursor-pointer">₹{currentPrice.toLocaleString()} × 1 event day</span>
                                            <span>₹{currentPrice.toLocaleString()}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="underline cursor-pointer">Refundable Security Deposit</span>
                                            <span>₹{(pricing.security_deposit || 5000).toLocaleString()}</span>
                                        </div>
                                        <div className="pt-2 border-t border-slate-100 flex justify-between font-bold text-slate-900 text-sm">
                                            <span>Total before taxes</span>
                                            <span>₹{(currentPrice + (pricing.security_deposit || 5000)).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* REPORT LISTING FOOTNOTE */}
                                <div className="text-center">
                                    <button className="text-xs text-slate-500 hover:text-slate-800 underline font-medium flex items-center justify-center gap-1 mx-auto cursor-pointer">
                                        <span>🚩</span> Report this listing
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* FULL PHOTO GALLERY MODAL */}
            {showGalleryModal && (
                <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col justify-between p-6 animate-in fade-in duration-200">
                    <div className="flex justify-between items-center text-white mb-4">
                        <span className="font-bold text-lg">{hall.name} - Photo Gallery</span>
                        <button
                            onClick={() => setShowGalleryModal(false)}
                            className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white font-bold flex items-center justify-center text-xl cursor-pointer"
                        >
                            ✕
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto max-w-4xl mx-auto space-y-6 py-4">
                        {galleryImages.map((img, idx) => (
                            <div key={idx} className="rounded-2xl overflow-hidden bg-slate-900">
                                <img src={img} alt={`Gallery ${idx + 1}`} className="w-full h-auto object-cover max-h-[70vh] mx-auto" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </CustomerLayout>
    );
}
