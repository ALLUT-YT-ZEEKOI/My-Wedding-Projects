import { Link } from '@inertiajs/react';

function formatPrice(value) {
    return Number(value || 0).toLocaleString('en-IN');
}

function averageRating(reviews, fallback) {
    if (Array.isArray(reviews) && reviews.length) {
        const sum = reviews.reduce((acc, review) => acc + Number(review.rating || 0), 0);
        return (sum / reviews.length).toFixed(1);
    }
    return fallback;
}

export default function VenueCard({
    hall,
    href,
    image,
    fallbackImage,
    featured = false,
    isFavourite = false,
    onToggleFavourite,
    ratingFallback = '4.8',
}) {
    const reviews = hall.reviews || [];
    const rating = averageRating(reviews, ratingFallback);
    const reviewCount = reviews.length;
    const location = hall.area
        ? `${hall.area}, ${hall.city}`
        : hall.city || hall.location || 'Kerala';
    const capacity = Number(hall.capacity || 500);
    const price = hall.pricing?.base_price || 50000;
    const typeLabel = hall.hall_type || 'Banquet Hall';
    const photo = image || hall.cover_photo || hall.img || fallbackImage;

    return (
        <Link href={href} className="group block h-full">
            <article className="relative h-full overflow-hidden rounded-[1.75rem] bg-slate-950 shadow-[0_22px_50px_-28px_rgba(15,23,42,0.65)] ring-1 ring-white/10 transition-all duration-500 ease-out group-hover:-translate-y-1.5 group-hover:shadow-[0_36px_70px_-28px_rgba(190,18,60,0.45)] group-hover:ring-rose-300/30">
                <div className="relative aspect-[4/3] min-h-[280px]">
                    <img
                        src={photo}
                        alt={hall.name}
                        onError={(e) => {
                            if (fallbackImage) {
                                e.currentTarget.src = fallbackImage;
                            }
                        }}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-slate-950/15" />
                    <div className="absolute inset-0 bg-gradient-to-t from-rose-950/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                    <div className="absolute left-4 right-4 top-4 flex items-start justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                            {featured && (
                                <span className="inline-flex items-center rounded-full bg-amber-400 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-slate-950 shadow-sm">
                                    Featured
                                </span>
                            )}
                            <span className="inline-flex items-center rounded-full bg-white/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-md ring-1 ring-white/20">
                                {typeLabel}
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-bold text-slate-900 shadow-sm backdrop-blur">
                                <svg className="h-3.5 w-3.5 text-amber-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                {rating}
                                {reviewCount > 0 && (
                                    <span className="font-semibold text-slate-400">({reviewCount})</span>
                                )}
                            </span>

                            {typeof onToggleFavourite === 'function' && (
                                <button
                                    type="button"
                                    onClick={(e) => onToggleFavourite(e, hall.id)}
                                    className={`flex h-9 w-9 items-center justify-center rounded-full shadow-sm backdrop-blur-md transition-colors ${
                                        isFavourite
                                            ? 'bg-rose-600 text-white'
                                            : 'bg-white/90 text-slate-500 hover:bg-white hover:text-rose-600'
                                    }`}
                                    aria-label={isFavourite ? 'Remove from wishlist' : 'Save to wishlist'}
                                >
                                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill={isFavourite ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733C11.285 4.876 9.623 3.75 7.688 3.75 5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                    </svg>
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="absolute inset-x-0 bottom-0 p-5">
                        <p className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/70">
                            <svg className="h-3.5 w-3.5 shrink-0 text-rose-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                            </svg>
                            <span className="truncate">{location}</span>
                        </p>

                        <h3 className="text-[1.35rem] font-black leading-tight tracking-tight text-white line-clamp-2 drop-shadow-sm">
                            {hall.name}
                        </h3>

                        <div className="mt-3 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white/85 ring-1 ring-white/10 backdrop-blur-sm">
                                <svg className="h-3.5 w-3.5 text-rose-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                                </svg>
                                Up to {capacity.toLocaleString('en-IN')} guests
                            </span>
                        </div>

                        <div className="mt-4 flex items-end justify-between gap-3">
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/55">Starts from</p>
                                <p className="text-2xl font-black tracking-tight text-white">
                                    ₹{formatPrice(price)}
                                    <span className="ml-1 text-xs font-semibold text-white/55">/ event</span>
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 text-xs font-bold text-slate-950 shadow-lg transition-all duration-300 group-hover:bg-rose-600 group-hover:text-white">
                                View venue
                                <svg className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </span>
                        </div>
                    </div>
                </div>
            </article>
        </Link>
    );
}
