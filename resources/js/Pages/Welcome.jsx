import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { useState, useEffect } from 'react';

export default function Welcome({ popularHalls = [], featuredHalls = [], offers = [], reviews = [] }) {
    const { data, setData, get } = useForm({
        location: '',
        lat: '',
        lng: '',
        date: '',
    });

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        get(route('halls.index'));
    };

    const handleGetLocation = () => {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by your browser');
            return;
        }
        
        setData('location', 'Detecting...');
        
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
        { name: 'Wedding', subtitle: 'The Grand Celebration', icon: '💍', img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80' },
        { name: 'Reception', subtitle: 'An Elegant Evening', icon: '✨', img: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80' },
        { name: 'Engagement', subtitle: 'A Beautiful Beginning', icon: '💑', img: 'https://images.unsplash.com/photo-1532712938736-59b13998816f?auto=format&fit=crop&w=800&q=80' },
    ];

    return (
        <CustomerLayout>
            <Head title="LUXEHALLS — Aesthetic Event Spaces" />

            {/* Aesthetic Hero Section */}
            <div className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#FAF9F6] mt-[-80px] pt-[80px]">
                
                {/* Artistic Background Elements */}
                <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-rose-200/40 rounded-full blur-[120px] mix-blend-multiply translate-x-1/3 -translate-y-1/4 animate-pulse-slow"></div>
                <div className="absolute bottom-0 left-0 w-[40vw] h-[40vw] bg-amber-200/40 rounded-full blur-[100px] mix-blend-multiply -translate-x-1/4 translate-y-1/4 animate-pulse-slow animation-delay-2000"></div>
                
                <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24">
                    <div className="text-center max-w-4xl mx-auto animate-fade-up">
                        <p className="text-rose-500 font-bold tracking-[0.3em] text-xs uppercase mb-6 flex items-center justify-center gap-3">
                            <span className="w-8 h-[1px] bg-rose-500"></span>
                            Bespoke Venues
                            <span className="w-8 h-[1px] bg-rose-500"></span>
                        </p>
                        
                        <h1 className="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter leading-[1.05] mb-8">
                            Curating <span className="font-serif italic font-light text-rose-500">Moments</span> <br className="hidden md:block" />
                            Beyond Ordinary.
                        </h1>
                        
                        <p className="text-lg md:text-xl text-slate-500 font-medium max-w-2xl mx-auto mb-16 leading-relaxed">
                            Discover spaces that resonate with your aesthetic. From minimalist galleries to opulent heritage properties.
                        </p>
                    </div>

                    {/* Floating Glassmorphic Search Bar */}
                    <div className="max-w-5xl mx-auto animate-fade-up animation-delay-200">
                        <div className="bg-white/70 backdrop-blur-2xl p-3 md:p-4 rounded-[2.5rem] border border-white shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)]">
                            <form onSubmit={handleSearch} className="flex flex-col md:flex-row items-center gap-2">
                                
                                {/* Location */}
                                <div className="flex-1 w-full bg-slate-50/50 hover:bg-slate-50 rounded-full px-6 py-4 transition-colors border border-transparent hover:border-slate-100 flex items-center gap-3 group relative">
                                    <span className="text-xl group-hover:scale-110 transition-transform">📍</span>
                                    <div className="flex-1">
                                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block mb-0.5">Location</label>
                                        <input
                                            type="text"
                                            value={data.location}
                                            onChange={(e) => setData('location', e.target.value)}
                                            placeholder="Where to?"
                                            className="w-full bg-transparent border-none text-slate-900 placeholder-slate-400 focus:ring-0 p-0 text-sm font-bold"
                                        />
                                    </div>
                                    <button type="button" onClick={handleGetLocation} className="absolute right-4 text-slate-400 hover:text-rose-500 transition-colors">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                        </svg>
                                    </button>
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
                    </div>
                </div>

                {/* Decorative Gallery Peek */}
                <div className="w-full mt-24 overflow-hidden flex gap-4 px-4 pb-12 translate-y-12">
                    {[
                        'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80',
                        'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
                        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=600&q=80',
                        'https://images.unsplash.com/photo-1522413452208-996ff3f3e740?auto=format&fit=crop&w=600&q=80',
                        'https://images.unsplash.com/photo-1532712938736-59b13998816f?auto=format&fit=crop&w=600&q=80'
                    ].map((img, i) => (
                        <div key={i} className={`relative w-64 h-80 rounded-[2rem] overflow-hidden shrink-0 shadow-2xl ${i % 2 === 0 ? '-translate-y-8' : 'translate-y-8'} transform transition-transform hover:scale-105 hover:z-10`}>
                            <img src={img} alt="Gallery" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-slate-900/10 hover:bg-transparent transition-colors"></div>
                        </div>
                    ))}
                </div>
            </div>
        </CustomerLayout>
    );
}
