import CustomerLayout from '@/Layouts/CustomerLayout';
import VenueCard from '@/Components/VenueCard';
import { Head, Link, router } from '@inertiajs/react';

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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
                        {favourites.map((fav) => {
                            const hall = fav.hall;
                            if (!hall) return null;
                            return (
                                <VenueCard
                                    key={fav.id}
                                    hall={hall}
                                    href={route('halls.show', hall.id)}
                                    fallbackImage="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80"
                                    isFavourite
                                    onToggleFavourite={(e, hallId) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        router.post(route('favourites.toggle', hallId), {}, { preserveScroll: true });
                                    }}
                                />
                            );
                        })}
                    </div>
                )}

            </div>
        </CustomerLayout>
    );
}
