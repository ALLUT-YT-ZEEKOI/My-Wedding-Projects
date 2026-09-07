import CustomerLayout from '@/Layouts/CustomerLayout';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';

export default function Checkout({ hall, bookingData = {}, costs = {} }) {
    const [promoInput, setPromoInput] = useState('');
    const [appliedDiscount, setAppliedDiscount] = useState(0);
    const [promoMsg, setPromoMsg] = useState('');

    const baseRent = costs.baseRent || 50000;
    const securityDeposit = costs.securityDeposit || 5000;
    const initialTotal = baseRent + securityDeposit;
    const currentTotal = initialTotal - appliedDiscount;
    const advancePayable = currentTotal * 0.4;

    const { post, processing } = useForm({
        ...bookingData,
        total_amount: currentTotal,
        advance_amount: advancePayable,
        promo_code: promoInput,
    });

    const handleApplyPromo = (e) => {
        e.preventDefault();
        if (promoInput.trim().toUpperCase() === 'MYHALL10') {
            const discount = baseRent * 0.1;
            setAppliedDiscount(discount);
            setPromoMsg('🎉 Coupon MYHALL10 applied! 10% discount applied to base rent.');
        } else {
            setPromoMsg('❌ Invalid promo code. Try using MYHALL10');
        }
    };

    const handlePayNow = () => {
        post(route('halls.pay', hall.id));
    };

    return (
        <CustomerLayout header="Checkout & Payment Summary">
            <Head title="Booking Checkout" />

            <div className="max-w-4xl mx-auto sm:px-6 lg:px-8 space-y-6">
                
                <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg flex justify-between items-center">
                    <div>
                        <span className="text-xs uppercase tracking-wider text-rose-400 font-bold">Step 2 of 2: Review & Deposit Payment</span>
                        <h2 className="text-xl font-bold mt-1">{hall.name}</h2>
                        <p className="text-xs text-slate-400">Date: {bookingData.event_date} &bull; Slot: {bookingData.slot}</p>
                    </div>
                    <span className="text-2xl">💳</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    
                    {/* Itemized Cost Breakdown */}
                    <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                        <h3 className="text-base font-bold text-slate-900">Itemized Billing Summary</h3>
                        
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-600">Venue Slot Rent ({bookingData.slot})</span>
                                <span className="font-bold text-slate-900">₹{baseRent.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-slate-100">
                                <span className="text-slate-600">Refundable Security Deposit</span>
                                <span className="font-bold text-slate-900">₹{securityDeposit.toLocaleString()}</span>
                            </div>
                            {appliedDiscount > 0 && (
                                <div className="flex justify-between py-2 border-b border-slate-100 text-emerald-600">
                                    <span className="font-bold">Promo Code Discount (10%)</span>
                                    <span className="font-black">- ₹{appliedDiscount.toLocaleString()}</span>
                                </div>
                            )}
                            <div className="flex justify-between py-3 border-b border-slate-200 text-base font-extrabold">
                                <span className="text-slate-900">Total Hall Price</span>
                                <span className="text-slate-900">₹{currentTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between py-3 bg-rose-50 p-4 rounded-2xl border border-rose-100">
                                <div>
                                    <span className="text-xs font-bold uppercase text-rose-800 block">Advance Deposit Payable Now (40%)</span>
                                    <span className="text-xs text-rose-600">Remaining 60% payable to vendor on event date</span>
                                </div>
                                <span className="text-2xl font-black text-rose-600">₹{advancePayable.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Promo Code Box */}
                        <div className="pt-2">
                            <label className="block text-xs font-bold uppercase text-slate-500 mb-1">Have a Promo Code?</label>
                            <div className="flex space-x-2">
                                <input
                                    type="text"
                                    value={promoInput}
                                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                                    placeholder="MYHALL10"
                                    className="flex-1 text-sm font-mono uppercase border-slate-300 rounded-xl"
                                />
                                <button
                                    onClick={handleApplyPromo}
                                    type="button"
                                    className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl"
                                >
                                    Apply
                                </button>
                            </div>
                            {promoMsg && <p className="text-xs font-semibold mt-2">{promoMsg}</p>}
                        </div>
                    </div>

                    {/* Payment Gateway Box */}
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
                        <div>
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payment Gateway</h3>
                            <div className="mt-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
                                <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
                                    <span>🔒 Secured by Razorpay</span>
                                </div>
                                <p className="text-xs text-slate-500">Supports UPI (GPay, PhonePe, Paytm), Credit & Debit Cards, Netbanking.</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={handlePayNow}
                                disabled={processing}
                                className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-2xl shadow-xl transition transform hover:-translate-y-0.5"
                            >
                                💳 Pay ₹{advancePayable.toLocaleString()} & Confirm
                            </button>
                            <p className="text-center text-xs text-slate-400">Instant confirmation & invoice generation</p>
                        </div>
                    </div>

                </div>
            </div>
        </CustomerLayout>
    );
}
