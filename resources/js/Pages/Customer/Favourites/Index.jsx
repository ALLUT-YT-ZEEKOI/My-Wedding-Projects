import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, Link } from '@inertiajs/react';

export default function Index({ favourites = [] }) {
    return (
        <CustomerLayout header="My Saved Wishlist ❤️">
            <Head title="My Favourites" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                {favourites.length === 0 ? (
                    <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                        <p className="text-lg font-bold text-slate-700">Your wishlist is empty.</p>
                        <p className="text-xs text-slate-500">Click ❤️ on any hall card while browsing to save it to your wishlist.</p>
                        <Link href={route('halls.index')} className="inline-block mt-2 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl shadow">
                            Browse Halls Now
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {favourites.map((fav) => {
                            const hall = fav.hall;
                            if (!hall) return null;
                            return (
                                <div key={fav.id} className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden hover:shadow-xl transition group flex flex-col justify-between">
                                    <div className="relative h-56 bg-slate-100 overflow-hidden">
                                        <img
                                            src={hall.cover_photo || 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80'}
                                            alt={hall.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                        />
                                        <span className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            {hall.hall_type || 'Banquet Hall'}
                                        </span>

                                        <Link
                                            href={route('favourites.toggle', hall.id)}
                                            method="post"
                                            as="button"
                                            className="absolute top-4 right-4 h-9 w-9 bg-rose-600 text-white rounded-full flex items-center justify-center shadow-md transition"
                                        >
                                            ❤️
                                        </Link>
                                    </div>

                                    <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                                        <div>
                                            <h3 className="text-lg font-extrabold text-slate-900 group-hover:text-rose-600 transition">{hall.name}</h3>
                                            <p className="text-xs text-slate-500 mt-1">📍 {hall.city || hall.location}</p>
                                            <p className="text-xs text-slate-600 mt-2 line-clamp-2">{hall.description}</p>
                                        </div>

                                        <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                                            <div>
                                                <span className="text-xs text-slate-400 block">Rent starts from</span>
                                                <span className="text-xl font-extrabold text-emerald-600">₹{(hall.pricing?.base_price || 35000).toLocaleString()}</span>
                                            </div>
                                            <Link
                                                href={route('halls.show', hall.id)}
                                                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow transition"
                                            >
                                                View & Book
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </CustomerLayout>
    );
}
