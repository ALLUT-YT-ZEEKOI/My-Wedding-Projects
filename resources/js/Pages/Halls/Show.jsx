import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';
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

    const pricing = hall.pricing || {
        base_price: 50000,
        morning_price: 20000,
        evening_price: 35000,
        full_day_price: 50000,
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

    return (
        <CustomerLayout>
            <Head title={`${hall.name} | LUXEHALLS`} />

            {/* Immersive Hero Header */}
            <div className="relative h-[60vh] min-h-[500px] w-full mt-[-80px] bg-slate-900 overflow-hidden">
                <img
                    src={hall.cover_photo || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=2000&q=80'}
                    alt={hall.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent"></div>
                
                <div className="absolute bottom-0 w-full pb-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-end gap-6 animate-fade-up">
                        <div className="max-w-3xl">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="px-4 py-1.5 glass border-white/20 text-white text-xs font-black rounded-full uppercase tracking-widest shadow-lg">
                                    {hall.hall_type || 'Marriage Hall'}
                                </span>
                                <span className="flex items-center gap-1 bg-amber-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg">
                                    ★ 4.9 <span className="font-medium opacity-80">({hall.reviews?.length || 0} Reviews)</span>
                                </span>
                            </div>
                            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-tight text-glow">
                                {hall.name}
                            </h1>
                            <p className="text-lg text-slate-300 mt-2 font-medium flex items-center gap-2">
                                <span className="text-rose-500">📍</span> {hall.address || hall.location || hall.city}
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <Link
                                href={route('favourites.toggle', hall.id)}
                                method="post"
                                as="button"
                                className={`flex items-center gap-2 px-6 py-3 rounded-full text-sm font-bold shadow-2xl transition-all transform hover:scale-105 ${
                                    isFavourite ? 'bg-rose-600 text-white shadow-rose-600/30' : 'glass text-white hover:bg-white/20 border-white/30'
                                }`}
                            >
                                {isFavourite ? '♥ Saved to Wishlist' : '♡ Add to Wishlist'}
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    
                    {/* Left Column - Details */}
                    <div className="lg:col-span-8 space-y-12">
                        
                        {/* Gallery Preview */}
                        {hall.media && hall.media.length > 0 && (
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 animate-fade-up">
                                {hall.media.slice(0, 4).map((m, idx) => (
                                    <div key={idx} className="h-32 rounded-2xl overflow-hidden shadow-md group">
                                        <img src={m.file_path || m.url} alt="Gallery" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Description & Capacity */}
                        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 animate-fade-up animation-delay-2000">
                            <h3 className="text-2xl font-black text-slate-900 mb-6">About the Venue</h3>
                            <p className="text-slate-600 leading-relaxed font-medium mb-8 text-lg">
                                {hall.description}
                            </p>
                            
                            <h4 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4">Capacity Breakdown</h4>
                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 hover:border-rose-200 hover:bg-rose-50/30 transition-colors">
                                    <div className="text-3xl mb-2">🪑</div>
                                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">Seating</span>
                                    <span className="text-2xl font-black text-slate-900">{hall.seating_capacity || hall.capacity || 500}</span>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 hover:border-rose-200 hover:bg-rose-50/30 transition-colors">
                                    <div className="text-3xl mb-2">🍽️</div>
                                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">Dining</span>
                                    <span className="text-2xl font-black text-slate-900">{hall.dining_capacity || 300}</span>
                                </div>
                                <div className="bg-slate-50 p-6 rounded-[1.5rem] border border-slate-100 hover:border-rose-200 hover:bg-rose-50/30 transition-colors">
                                    <div className="text-3xl mb-2">🚶</div>
                                    <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block mb-1">Floating</span>
                                    <span className="text-2xl font-black text-slate-900">{hall.floating_capacity || 750}</span>
                                </div>
                            </div>
                        </section>

                        {/* Amenities */}
                        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 animate-fade-up animation-delay-2000">
                            <h3 className="text-2xl font-black text-slate-900 mb-6">Premium Amenities</h3>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {(!hall.amenities || hall.amenities.length === 0) ? (
                                    <p className="text-sm text-slate-500 italic col-span-3">Standard premium amenities included.</p>
                                ) : (
                                    hall.amenities.map((am) => (
                                        <div key={am.id} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="h-8 w-8 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center font-bold">✓</div>
                                            <span className="text-sm font-bold text-slate-700">{am.name}</span>
                                        </div>
                                    ))
                                )}
                            </div>
                        </section>

                        {/* Policies */}
                        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 animate-fade-up animation-delay-2000">
                            <h3 className="text-2xl font-black text-slate-900 mb-6">Operational Policies</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-1">
                                    <span className="text-xs font-black uppercase tracking-widest text-rose-500">Event Timings</span>
                                    <p className="font-bold text-slate-700">{policy.event_timing}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-black uppercase tracking-widest text-rose-500">Catering</span>
                                    <p className="font-bold text-slate-700">{policy.veg_allowed ? 'Veg' : ''} {policy.non_veg_allowed ? '& Non-Veg Allowed' : ''}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-black uppercase tracking-widest text-rose-500">Alcohol Policy</span>
                                    <p className="font-bold text-slate-700">{policy.alcohol_policy}</p>
                                </div>
                                <div className="space-y-1">
                                    <span className="text-xs font-black uppercase tracking-widest text-rose-500">Music & DJ</span>
                                    <p className="font-bold text-slate-700">{policy.music_policy}</p>
                                </div>
                            </div>
                        </section>

                        {/* Location Map */}
                        {hall.latitude && hall.longitude && (
                            <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 animate-fade-up animation-delay-2000">
                                <h3 className="text-2xl font-black text-slate-900 mb-6">Location</h3>
                                <div className="h-64 sm:h-96 w-full rounded-2xl overflow-hidden shadow-inner border border-slate-200 relative z-0">
                                    <MapContainer center={[hall.latitude, hall.longitude]} zoom={15} scrollWheelZoom={false} className="w-full h-full z-0">
                                        <TileLayer
                                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                        />
                                        <Marker position={[hall.latitude, hall.longitude]}>
                                            <Popup className="rounded-xl overflow-hidden font-sans">
                                                <div className="font-bold text-slate-900">{hall.name}</div>
                                                <div className="text-xs text-slate-500 mt-1">{hall.address || hall.area || hall.city}</div>
                                            </Popup>
                                        </Marker>
                                    </MapContainer>
                                </div>
                            </section>
                        )}

                        {/* Reviews */}
                        <section className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
                            <h3 className="text-2xl font-black text-slate-900 mb-6">Customer Reviews</h3>
                            {(!hall.reviews || hall.reviews.length === 0) ? (
                                <div className="bg-slate-50 rounded-2xl p-8 text-center border border-slate-100">
                                    <span className="text-4xl mb-2 block">✨</span>
                                    <p className="text-slate-600 font-medium">Be the first to celebrate and review this venue.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {hall.reviews.map((rev) => (
                                        <div key={rev.id} className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="flex justify-between items-center mb-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-10 w-10 bg-rose-200 text-rose-700 rounded-full flex items-center justify-center font-black">
                                                        {(rev.user?.name || rev.customer_name).charAt(0)}
                                                    </div>
                                                    <span className="font-black text-slate-900">{rev.user?.name || rev.customer_name}</span>
                                                </div>
                                                <span className="text-amber-500 font-black text-lg tracking-widest">{'★'.repeat(rev.rating)}</span>
                                            </div>
                                            <p className="text-slate-600 font-medium italic">"{rev.review_text || rev.comment}"</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>
                    </div>

                    {/* Right Column - Booking Widget */}
                    <div className="lg:col-span-4 relative">
                        <div className="sticky top-28 bg-slate-950 text-white p-8 rounded-[2rem] shadow-2xl overflow-hidden">
                            {/* Glass background effect inside widget */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-600/20 blur-[80px] rounded-full pointer-events-none"></div>
                            
                            <div className="relative z-10 space-y-8">
                                <div>
                                    <h3 className="text-2xl font-black tracking-tight">Reserve Venue</h3>
                                    <p className="text-slate-400 text-sm mt-1">Select date and slot to lock the price.</p>
                                </div>
                                
                                <div>
                                    <label className="block text-xs font-black uppercase text-rose-400 tracking-widest mb-2">Event Date</label>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={(e) => setSelectedDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full text-sm font-bold bg-white/10 border-white/20 text-white rounded-xl focus:ring-rose-500 focus:border-rose-500 [color-scheme:dark]"
                                    />
                                </div>

                                <div className="space-y-3">
                                    <label className="block text-xs font-black uppercase text-rose-400 tracking-widest">Select Slot</label>
                                    
                                    {[
                                        { id: 'morning', label: 'Morning (08:00 AM - 03:00 PM)', price: pricing.morning_price || 20000 },
                                        { id: 'evening', label: 'Evening (04:00 PM - 11:00 PM)', price: pricing.evening_price || 35000 },
                                        { id: 'full_day', label: 'Full Day (08:00 AM - 11:00 PM)', price: pricing.full_day_price || pricing.base_price || 50000 }
                                    ].map((slot) => {
                                        const isBooked = bookedSlotsForDate.includes(slot.id);
                                        const isSelected = selectedSlot === slot.id;
                                        
                                        return (
                                            <div
                                                key={slot.id}
                                                onClick={() => !isBooked && setSelectedSlot(slot.id)}
                                                className={`p-4 rounded-2xl border-2 transition-all cursor-pointer ${
                                                    isBooked ? 'bg-white/5 border-transparent opacity-50 cursor-not-allowed' :
                                                    isSelected ? 'bg-rose-600 border-rose-500 shadow-[0_0_20px_rgba(225,29,72,0.4)] transform scale-[1.02]' : 'bg-white/5 border-white/10 hover:bg-white/10'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start mb-1">
                                                    <span className="text-xs font-bold uppercase tracking-wider">{slot.label.split('(')[0]}</span>
                                                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${isBooked ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                                                        {isBooked ? 'UNAVAILABLE' : 'AVAILABLE'}
                                                    </span>
                                                </div>
                                                <div className="text-xl font-black">₹{slot.price.toLocaleString()}</div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <Link
                                    href={route('halls.book', { id: hall.id, date: selectedDate, slot: selectedSlot })}
                                    className="block w-full text-center py-4 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black uppercase tracking-widest text-sm rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.3)] transition transform hover:-translate-y-1"
                                >
                                    Proceed to Booking
                                </Link>

                                <div className="pt-6 border-t border-white/10 text-center">
                                    <p className="text-xs text-slate-400 mb-1 uppercase tracking-widest font-bold">Direct Contact</p>
                                    <p className="font-bold text-white text-lg">{hall.contact_number || '+91 1800-LUXE-HALL'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
}
