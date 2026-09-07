import VendorLayout from '@/Layouts/VendorLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function HallIndex({ halls, canAddHall }) {
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);

    const handleAddClick = (e) => {
        if (!canAddHall) {
            e.preventDefault();
            setShowUpgradeModal(true);
        } else {
            router.get(route('vendor.halls.create'));
        }
    };

    return (
        <VendorLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-bold text-xl text-slate-900 leading-tight">My Wedding Halls</h2>
                        <p className="text-xs text-slate-500 font-normal">Manage hall profiles, pricing, capacity, photos & policies.</p>
                    </div>
                    <button
                        onClick={handleAddClick}
                        className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
                    >
                        + Add New Hall
                    </button>
                </div>
            }
        >
            <Head title="My Halls" />

            <div className="space-y-6">
                {halls.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center border border-slate-200/80 shadow-xs max-w-xl mx-auto">
                        <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">No Halls Added Yet</h3>
                        <p className="text-slate-500 text-sm mt-2 mb-6">Create your hall profile to set seating capacity, daily slot pricing, photos, and policies.</p>
                        <button
                            onClick={handleAddClick}
                            className="px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
                        >
                            + Add Hall Profile
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {halls.map((hall) => (
                            <div key={hall.id} className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <span className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md">
                                                {hall.hall_type || 'Banquet Hall'}
                                            </span>
                                            <h3 className="text-xl font-bold text-slate-900 mt-2">{hall.name}</h3>
                                        </div>
                                        <span className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                                            hall.status === 'live' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {hall.status === 'live' ? 'Live' : 'Pending Review'}
                                        </span>
                                    </div>

                                    <p className="text-slate-500 text-xs line-clamp-2 mb-4">{hall.description}</p>

                                    <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-4">
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 font-medium">Location:</span>
                                            <span className="font-semibold text-slate-800 truncate max-w-[160px]">{hall.city} {hall.area && `(${hall.area})`}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 font-medium">Seating Capacity:</span>
                                            <span className="font-semibold text-slate-800">{hall.seating_capacity || hall.capacity} Guests</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-slate-400 font-medium">Base Price:</span>
                                            <span className="font-bold text-indigo-600 text-sm">₹{Number(hall.pricing?.base_price || 0).toLocaleString('en-IN')} / day</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between gap-2">
                                    <Link
                                        href={route('vendor.halls.preview', hall.id)}
                                        className="text-xs font-bold text-slate-600 hover:text-slate-900 underline"
                                    >
                                        Customer Preview
                                    </Link>
                                    <div className="flex gap-2">
                                        <Link
                                            href={route('vendor.halls.destroy', hall.id)}
                                            method="delete"
                                            as="button"
                                            className="px-3 py-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 font-bold text-xs shadow-xs"
                                            onClick={(e) => {
                                                if (!confirm('Are you sure you want to delete this hall? This action cannot be undone.')) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        >
                                            Delete
                                        </Link>
                                        <Link
                                            href={route('vendor.halls.edit', hall.id)}
                                            className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-xs"
                                        >
                                            Manage & Edit &rarr;
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Upgrade Modal Popup */}
            {showUpgradeModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full border border-slate-200 shadow-2xl text-center">
                        <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">⭐</span>
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 mb-2">Upgrade Required</h3>
                        <p className="text-sm text-slate-500 mb-6">
                            You have reached the hall listing limit for your current subscription plan. Upgrade your plan to list more halls and grow your business!
                        </p>
                        
                        <div className="flex flex-col gap-3">
                            <Link
                                href={route('vendor.subscription.choose')}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-md transition-colors"
                            >
                                View Upgrade Plans
                            </Link>
                            <button
                                onClick={() => setShowUpgradeModal(false)}
                                className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors"
                            >
                                Maybe Later
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </VendorLayout>
    );
}
