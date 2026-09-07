import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

// Helper component to recenter map when markers change
function MapUpdater({ halls, center }) {
    const map = useMap();
    useEffect(() => {
        if (halls.length > 0) {
            const validHalls = halls.filter(h => h.latitude && h.longitude);
            if (validHalls.length > 0) {
                const bounds = L.latLngBounds(validHalls.map(h => [h.latitude, h.longitude]));
                map.fitBounds(bounds, { padding: [50, 50] });
            }
        } else if (center) {
            map.setView(center, 12);
        }
    }, [halls, center, map]);
    return null;
}

export default function Index({ halls = [], allAmenities = [], filters = {}, favouriteHallIds = [] }) {
    const { data, setData, get } = useForm({
        location: filters.location || '',
        lat: filters.lat || '',
        lng: filters.lng || '',
        radius: filters.radius || '',
        date: filters.date || '',
        guests: filters.guests || '',
        event_type: filters.event_type || '',
        sort: filters.sort || 'recommended',
    });

    const [viewMode, setViewMode] = useState('split'); // 'split', 'list', 'map'
    
    // Default center (e.g. Center of India or User's search center)
    const mapCenter = data.lat && data.lng ? [parseFloat(data.lat), parseFloat(data.lng)] : [19.0760, 72.8777]; // Default Mumbai

    const handleFilterSubmit = (e) => {
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

    return (
        <CustomerLayout header="The Venue Collection">
            <Head title="Browse Premium Halls - LUXEHALLS" />

            <div className="max-w-[1600px] mx-auto sm:px-6 lg:px-8 space-y-6 pb-20">
                
                {/* Advanced Search & Filter Bar */}
                <div className="sticky top-[72px] z-40 bg-white/90 backdrop-blur-md p-4 rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50">
                    <form onSubmit={handleFilterSubmit} className="flex flex-col md:flex-row gap-3 items-end">
                        <div className="flex-1 w-full relative group">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">📍 Location</label>
                            <div className="relative flex items-center">
                                <input
                                    type="text"
                                    value={data.location}
                                    onChange={(e) => { setData('location', e.target.value); setData('lat', ''); setData('lng', ''); }}
                                    placeholder="Search area..."
                                    className="w-full text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-rose-500 focus:border-rose-500 font-bold pl-3 pr-10 py-2.5"
                                />
                                <button type="button" onClick={handleGetLocation} className="absolute right-2 text-rose-500 hover:text-rose-600" title="Use my current location">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>

                        {data.lat && (
                            <div className="w-full md:w-32">
                                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">Distance</label>
                                <select
                                    value={data.radius}
                                    onChange={(e) => setData('radius', e.target.value)}
                                    className="w-full text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-rose-500 focus:border-rose-500 font-bold py-2.5"
                                >
                                    <option value="5">Within 5 km</option>
                                    <option value="10">Within 10 km</option>
                                    <option value="25">Within 25 km</option>
                                    <option value="50">Within 50 km</option>
                                </select>
                            </div>
                        )}

                        <div className="w-full md:w-40">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">📅 Date</label>
                            <input
                                type="date"
                                value={data.date}
                                onChange={(e) => setData('date', e.target.value)}
                                className="w-full text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-rose-500 focus:border-rose-500 font-bold py-2.5"
                            />
                        </div>

                        <div className="w-full md:w-32">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">👥 Guests</label>
                            <select
                                value={data.guests}
                                onChange={(e) => setData('guests', e.target.value)}
                                className="w-full text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-rose-500 focus:border-rose-500 font-bold py-2.5"
                            >
                                <option value="">Any Size</option>
                                <option value="100">100+</option>
                                <option value="300">300+</option>
                                <option value="500">500+</option>
                                <option value="1000">1000+</option>
                            </select>
                        </div>

                        <div className="w-full md:w-40">
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5 ml-1">🎉 Event</label>
                            <select
                                value={data.event_type}
                                onChange={(e) => setData('event_type', e.target.value)}
                                className="w-full text-sm bg-slate-50 border border-slate-200 text-slate-900 rounded-xl focus:ring-rose-500 focus:border-rose-500 font-bold py-2.5"
                            >
                                <option value="">All Events</option>
                                <option value="Wedding">Wedding</option>
                                <option value="Reception">Reception</option>
                                <option value="Corporate">Corporate</option>
                            </select>
                        </div>

                        <div className="w-full md:w-auto flex space-x-2">
                            <button
                                type="submit"
                                className="flex-1 md:flex-none px-6 py-2.5 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-lg transition-transform transform hover:-translate-y-0.5"
                            >
                                Search
                            </button>
                            <Link
                                href={route('halls.index')}
                                className="px-4 py-2.5 bg-slate-100 text-slate-600 font-bold text-sm rounded-xl hover:bg-slate-200 transition-colors"
                            >
                                ✕
                            </Link>
                        </div>
                    </form>
                </div>

                <div className="flex justify-between items-center px-2 md:hidden">
                    <p className="text-sm font-bold text-slate-500">{halls.length} venues</p>
                    <div className="flex bg-slate-200 p-1 rounded-lg">
                        <button onClick={() => setViewMode('list')} className={`px-3 py-1 text-xs font-bold rounded-md ${viewMode === 'list' ? 'bg-white shadow' : 'text-slate-500'}`}>List</button>
                        <button onClick={() => setViewMode('map')} className={`px-3 py-1 text-xs font-bold rounded-md ${viewMode === 'map' ? 'bg-white shadow' : 'text-slate-500'}`}>Map</button>
                    </div>
                </div>

                {/* Map + List Split View */}
                <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-220px)] min-h-[600px]">
                    
                    {/* List Section */}
                    <div className={`w-full md:w-1/2 lg:w-5/12 xl:w-1/3 flex flex-col h-full ${viewMode === 'map' ? 'hidden md:flex' : 'flex'}`}>
                        <div className="flex justify-between items-center mb-4">
                            <p className="hidden md:block text-sm font-bold text-slate-500">
                                Found <span className="text-slate-900">{halls.length}</span> venues
                            </p>
                            <select
                                value={data.sort}
                                onChange={(e) => {
                                    setData('sort', e.target.value);
                                    get(route('halls.index', { ...data, sort: e.target.value }));
                                }}
                                className="text-xs font-bold border-none bg-white text-slate-900 rounded-lg py-1.5 focus:ring-0 cursor-pointer shadow-sm border border-slate-100"
                            >
                                <option value="recommended">Recommended</option>
                                <option value="price_asc">Lowest Price</option>
                                <option value="price_desc">Highest Price</option>
                            </select>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-10 custom-scrollbar">
                            {halls.length === 0 ? (
                                <div className="bg-white p-12 rounded-[2rem] border border-slate-100 text-center space-y-4 shadow-sm">
                                    <div className="text-4xl">🗺️</div>
                                    <h3 className="text-xl font-black text-slate-900">No Venues in Area</h3>
                                    <p className="text-sm text-slate-500 font-medium">Try increasing your search radius or changing the date.</p>
                                </div>
                            ) : (
                                halls.map((hall) => {
                                    const isFav = favouriteHallIds.includes(hall.id);
                                    return (
                                        <div key={hall.id} className="group flex flex-col sm:flex-row bg-white rounded-3xl p-3 shadow-sm hover:shadow-xl hover:shadow-rose-600/10 transition-all duration-300 border border-slate-100">
                                            <div className="relative w-full sm:w-40 h-48 sm:h-full rounded-2xl overflow-hidden shrink-0">
                                                <img
                                                    src={hall.cover_photo || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&q=80'}
                                                    alt={hall.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                                {hall.distance && (
                                                    <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[10px] font-black tracking-wider">
                                                        {hall.distance} km away
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="px-4 py-2 flex-1 flex flex-col relative">
                                                <Link
                                                    href={route('favourites.toggle', hall.id)}
                                                    method="post"
                                                    as="button"
                                                    className={`absolute top-2 right-0 h-8 w-8 rounded-full flex items-center justify-center transition-all ${
                                                        isFav ? 'text-rose-600' : 'text-slate-300 hover:text-rose-600'
                                                    }`}
                                                >
                                                    <span className="text-2xl leading-none mb-1">{isFav ? '♥' : '♡'}</span>
                                                </Link>

                                                <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">{hall.hall_type || 'Banquet Hall'}</p>
                                                <Link href={route('halls.show', hall.id)}>
                                                    <h3 className="text-lg font-black text-slate-900 group-hover:text-rose-600 transition-colors leading-tight mb-1 pr-6">{hall.name}</h3>
                                                </Link>
                                                <p className="text-slate-500 font-medium text-xs flex items-center gap-1 mb-3">
                                                    <span>📍</span> {hall.area ? `${hall.area}, ${hall.city}` : hall.city}
                                                </p>
                                                
                                                <div className="flex gap-2 mb-3">
                                                    <span className="bg-slate-50 text-slate-600 text-[10px] font-bold px-2 py-1 rounded-md">
                                                        👥 {hall.capacity || 500} max
                                                    </span>
                                                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-1 rounded-md flex items-center gap-0.5">
                                                        ★ 4.9
                                                    </span>
                                                </div>

                                                <div className="mt-auto pt-3 border-t border-slate-100 flex justify-between items-center">
                                                    <div>
                                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Starts from</span>
                                                        <span className="text-lg font-black text-slate-900">₹{(hall.pricing?.base_price || 35000).toLocaleString()}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>

                    {/* Map Section */}
                    <div className={`w-full md:w-1/2 lg:w-7/12 xl:w-2/3 h-full rounded-[2rem] overflow-hidden border border-slate-200 shadow-inner relative z-0 ${viewMode === 'list' ? 'hidden md:block' : 'block'}`}>
                        <MapContainer center={mapCenter} zoom={12} scrollWheelZoom={true} className="w-full h-full z-0">
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            {halls.map(hall => hall.latitude && hall.longitude && (
                                <Marker key={hall.id} position={[hall.latitude, hall.longitude]}>
                                    <Popup className="rounded-xl overflow-hidden">
                                        <div className="w-48">
                                            <img src={hall.cover_photo || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=400&q=80'} className="w-full h-24 object-cover rounded-t-lg -mt-4 -mx-5 mb-2 max-w-[calc(100%+40px)]" />
                                            <h4 className="font-black text-slate-900">{hall.name}</h4>
                                            <p className="text-xs text-slate-500 mb-2">⭐ 4.9 • {hall.area || hall.city}</p>
                                            <p className="text-sm font-bold text-slate-900 mb-2">₹{(hall.pricing?.base_price || 35000).toLocaleString()}</p>
                                            <Link href={route('halls.show', hall.id)} className="block w-full text-center py-1.5 bg-rose-600 text-white text-xs font-bold rounded-lg hover:bg-rose-700">
                                                View Details
                                            </Link>
                                        </div>
                                    </Popup>
                                </Marker>
                            ))}
                            {data.lat && data.lng && (
                                <Marker position={[data.lat, data.lng]} icon={L.divIcon({className: 'bg-transparent', html: '<div class="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-[0_0_10px_rgba(59,130,246,0.8)] animate-pulse"></div>'})}>
                                    <Popup>Your Search Location</Popup>
                                </Marker>
                            )}
                            <MapUpdater halls={halls} center={data.lat && data.lng ? [data.lat, data.lng] : null} />
                        </MapContainer>
                    </div>

                </div>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #cbd5e1;
                    border-radius: 20px;
                }
                .leaflet-popup-content-wrapper {
                    border-radius: 1rem;
                    overflow: hidden;
                    padding: 0;
                }
                .leaflet-popup-content {
                    margin: 16px;
                    width: 192px !important;
                }
            `}</style>
        </CustomerLayout>
    );
}
