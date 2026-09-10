import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VendorRegister() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        business_name: '',
        phone: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('vendor.register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="min-h-screen flex">
            <Head title="Apply as a Vendor" />

            {/* Left Side: Branding / Imagery */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80" alt="Vendor Registration" className="w-full h-full object-cover opacity-30 mix-blend-luminosity" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
                </div>
                
                <div className="relative z-10 w-full max-w-lg px-12 animate-fade-up">
                    <Link href="/" className="inline-block mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold shadow-lg">
                                L
                            </div>
                            <span className="text-3xl font-black text-white tracking-tight">LUXE<span className="text-rose-500">HALLS</span></span>
                        </div>
                    </Link>
                    
                    <h2 className="text-4xl font-black text-white mb-6 leading-tight">
                        Become a Partner. <br/>Elevate Your Venue.
                    </h2>
                    <p className="text-slate-300 text-lg leading-relaxed mb-8">
                        Unlock powerful tools to manage bookings, track revenue, and showcase your spaces to thousands of prospective clients looking for the perfect venue.
                    </p>

                    <div className="space-y-4">
                        <div className="flex items-center gap-4 text-white">
                            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">✓</div>
                            <span className="font-medium">Free listing on our premium marketplace</span>
                        </div>
                        <div className="flex items-center gap-4 text-white">
                            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">✓</div>
                            <span className="font-medium">Advanced booking & availability calendar</span>
                        </div>
                        <div className="flex items-center gap-4 text-white">
                            <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">✓</div>
                            <span className="font-medium">Direct customer messaging & reviews</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white">
                <div className="w-full max-w-md mx-auto animate-fade-up animation-delay-200">
                    
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-10 flex justify-center">
                        <Link href="/">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold shadow-lg">
                                    L
                                </div>
                                <span className="text-3xl font-black text-slate-900 tracking-tight">LUXE<span className="text-rose-500">HALLS</span></span>
                            </div>
                        </Link>
                    </div>

                    <h1 className="text-3xl font-black text-slate-900 mb-2">Apply as a Vendor</h1>
                    <p className="text-slate-500 mb-8 font-medium">Fill in your details to submit your venue for review.</p>

                    <form onSubmit={submit} className="space-y-5">
                        
                        {/* Name & Email Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Your Full Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-slate-900 font-medium"
                                    onChange={(e) => setData('name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.name} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Email Address</label>
                                <input
                                    type="email"
                                    value={data.email}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-slate-900 font-medium"
                                    onChange={(e) => setData('email', e.target.value)}
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>
                        </div>

                        {/* Business Row */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Business / Venue Name</label>
                                <input
                                    type="text"
                                    value={data.business_name}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-slate-900 font-medium"
                                    onChange={(e) => setData('business_name', e.target.value)}
                                    required
                                />
                                <InputError message={errors.business_name} />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Phone Number</label>
                                <input
                                    type="tel"
                                    value={data.phone}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-slate-900 font-medium"
                                    onChange={(e) => setData('phone', e.target.value)}
                                    required
                                />
                                <InputError message={errors.phone} />
                            </div>
                        </div>

                        {/* Passwords */}
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Password</label>
                            <input
                                type="password"
                                value={data.password}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-slate-900 font-medium"
                                onChange={(e) => setData('password', e.target.value)}
                                required
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">Confirm Password</label>
                            <input
                                type="password"
                                value={data.password_confirmation}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-slate-900 font-medium"
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                required
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 bg-gradient-to-r from-rose-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 text-white font-black text-sm uppercase tracking-widest rounded-xl shadow-[0_0_20px_rgba(225,29,72,0.3)] transition-all transform hover:-translate-y-1 mt-6 disabled:opacity-50"
                        >
                            {processing ? 'Submitting Application...' : 'Submit Application'}
                        </button>

                        <div className="text-center pt-6 border-t border-slate-100">
                            <p className="text-slate-500 text-sm font-medium">
                                Already an approved vendor?{' '}
                                <Link href={route('vendor.login')} className="font-bold text-rose-500 hover:text-rose-600 transition-colors">
                                    Log In Here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
