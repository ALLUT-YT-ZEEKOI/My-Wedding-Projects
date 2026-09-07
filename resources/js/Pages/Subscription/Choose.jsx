import VendorLayout from '@/Layouts/VendorLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Choose({ plans, currentSubscription }) {
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('upi');
    const [showCheckoutModal, setShowCheckoutModal] = useState(false);
    const [targetPlanId, setTargetPlanId] = useState(null);

    const { post, processing } = useForm();

    const openCheckout = (planId) => {
        setTargetPlanId(planId);
        setShowCheckoutModal(true);
    };

    const handleConfirmPayment = (e) => {
        e.preventDefault();
        post(route('vendor.subscription.process', { plan_id: targetPlanId, method: selectedPaymentMethod }), {
            onSuccess: () => setShowCheckoutModal(false)
        });
    };

    return (
        <VendorLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-bold text-xl text-slate-900 leading-tight">Founding Vendor Subscription Plan</h2>
                        <p className="text-xs text-slate-500">Unlock full hall management, pricing control, calendar blocking, and bookings.</p>
                    </div>
                </div>
            }
        >
            <Head title="Subscription Plans" />

            {/* Current Active Subscription Banner if Active */}
            {currentSubscription && (
                <div className="bg-gradient-to-r from-emerald-900 via-slate-900 to-emerald-950 text-white p-6 rounded-3xl mb-8 border border-emerald-500/30 shadow-xl flex justify-between items-center">
                    <div>
                        <span className="text-xs font-bold uppercase text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-full border border-emerald-500/30">
                            Active Subscription
                        </span>
                        <h3 className="text-2xl font-bold mt-2">Founding Vendor Plan (₹200/Year)</h3>
                        <p className="text-xs text-slate-300 mt-1">
                            Started: {currentSubscription.start_date} &bull; Valid Until: {currentSubscription.end_date} &bull; Payment ID: <span className="font-mono text-emerald-300">{currentSubscription.payment_id}</span>
                        </p>
                    </div>
                    <button className="px-4 py-2 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs">
                        Download Invoice
                    </button>
                </div>
            )}

            {/* Plan Card */}
            <div className="max-w-xl mx-auto bg-white rounded-3xl border-2 border-indigo-600 shadow-xl p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-gradient-to-l from-indigo-600 to-indigo-500 text-white text-[10px] font-extrabold uppercase px-6 py-1.5 rounded-bl-xl tracking-wider">
                    Special Launch Offer
                </div>

                <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-3xl mx-auto mb-4 font-bold">
                    👑
                </div>

                <h3 className="text-2xl font-extrabold text-slate-900">Founding Vendor Plan</h3>
                <p className="text-xs text-slate-500 mt-1 mb-6">Complete suite for hall owners and event space managers.</p>

                <div className="text-5xl font-black text-indigo-600 mb-6">
                    ₹200 <span className="text-sm font-bold text-slate-400">/ Year</span>
                </div>

                <ul className="text-xs space-y-3 text-slate-700 text-left bg-slate-50 p-6 rounded-2xl border border-slate-100 mb-8 font-medium">
                    <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Full Hall Profile & Capacity Breakdown</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Photos, Video Links & Customer Preview</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Amenities Checklist + Custom Facilities</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Catering, Decorator & Timing Policies</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Slot Pricing (Morning/Evening/Full Day, Weekend, Charges)</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Interactive Availability Calendar & Date Blocking</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Online & Offline Booking Management</li>
                    <li className="flex items-center gap-2"><span className="text-emerald-500 font-bold">✓</span> Customer Directory & Revenue Ledger</li>
                </ul>

                <button
                    onClick={() => openCheckout(plans[0]?.id || 1)}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-extrabold text-base shadow-lg shadow-indigo-600/25 transition-all"
                >
                    Subscribe for ₹200/Year &rarr;
                </button>
            </div>

            {/* Checkout Modal (UPI / Card / Net Banking) */}
            {showCheckoutModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3 mb-4">
                            <h3 className="text-lg font-bold text-slate-900">Secure Payment Checkout</h3>
                            <button onClick={() => setShowCheckoutModal(false)} className="text-slate-400 font-bold">✕</button>
                        </div>

                        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 mb-6 flex justify-between items-center">
                            <div>
                                <div className="text-xs font-bold text-slate-900">Founding Vendor Plan</div>
                                <div className="text-[10px] text-slate-500">1 Year Validity</div>
                            </div>
                            <div className="text-xl font-extrabold text-indigo-600">₹200</div>
                        </div>

                        <form onSubmit={handleConfirmPayment} className="space-y-4">
                            <div className="text-xs font-bold text-slate-700">Select Payment Method:</div>
                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { id: 'upi', label: 'UPI / GPay' },
                                    { id: 'card', label: 'Debit / Credit Card' },
                                    { id: 'netbanking', label: 'Net Banking' },
                                ].map((method) => (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => setSelectedPaymentMethod(method.id)}
                                        className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                                            selectedPaymentMethod === method.id
                                                ? 'border-indigo-600 bg-indigo-50 text-indigo-900'
                                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                    >
                                        {method.label}
                                    </button>
                                ))}
                            </div>

                            <div className="pt-4 border-t border-slate-100">
                                <PrimaryButton disabled={processing} className="w-full justify-center bg-emerald-600 hover:bg-emerald-500 py-3 text-sm font-bold">
                                    Pay ₹200 & Activate Subscription
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </VendorLayout>
    );
}
