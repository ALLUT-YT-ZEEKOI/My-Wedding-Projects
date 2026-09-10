import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function VendorLogin({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('vendor.login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen flex">
            <Head title="Vendor Portal Login" />

            {/* Left Side: Branding / Imagery */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-slate-900 items-center justify-center overflow-hidden">
                <div className="absolute inset-0">
                    <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80" alt="Vendor Portal" className="w-full h-full object-cover opacity-30 mix-blend-luminosity" />
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
                        Grow Your Venue <br/>Business With Us.
                    </h2>
                    <p className="text-slate-300 text-lg leading-relaxed">
                        Join India's most exclusive network of premium banquet halls, royal gardens, and elite convention centers. Manage your bookings, view analytics, and connect with thousands of customers seamlessly.
                    </p>
                </div>
            </div>

            {/* Right Side: Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 bg-white">
                <div className="w-full max-w-md animate-fade-up animation-delay-200">
                    
                    {/* Mobile Logo (visible only on small screens) */}
                    <div className="lg:hidden mb-12 flex justify-center">
                        <Link href="/">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center text-white font-bold shadow-lg">
                                    L
                                </div>
                                <span className="text-3xl font-black text-slate-900 tracking-tight">LUXE<span className="text-rose-500">HALLS</span></span>
                            </div>
                        </Link>
                    </div>

                    <h1 className="text-3xl font-black text-slate-900 mb-2">Vendor Portal</h1>
                    <p className="text-slate-500 mb-8 font-medium">Log in to manage your event spaces.</p>

                    {status && (
                        <div className="mb-6 p-4 bg-green-50 rounded-xl text-sm font-bold text-green-700 border border-green-200">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Email Address</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-slate-900 font-medium"
                                autoComplete="username"
                                onChange={(e) => setData('email', e.target.value)}
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">Password</label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-rose-500 focus:border-rose-500 transition-all text-slate-900 font-medium"
                                autoComplete="current-password"
                                onChange={(e) => setData('password', e.target.value)}
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <label className="flex items-center cursor-pointer group">
                                <div className="relative flex items-center justify-center">
                                    <input
                                        type="checkbox"
                                        name="remember"
                                        className="peer sr-only"
                                        checked={data.remember}
                                        onChange={(e) => setData('remember', e.target.checked)}
                                    />
                                    <div className="w-5 h-5 border-2 border-slate-300 rounded peer-checked:bg-rose-500 peer-checked:border-rose-500 transition-all"></div>
                                    <svg className="absolute w-3 h-3 text-white pointer-events-none opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                    </svg>
                                </div>
                                <span className="ms-3 text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">Remember me</span>
                            </label>

                            {canResetPassword && (
                                <Link
                                    href={route('password.request')}
                                    className="text-sm font-bold text-rose-500 hover:text-rose-600 transition-colors"
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm uppercase tracking-widest rounded-xl transition-colors disabled:opacity-50 mt-6"
                        >
                            {processing ? 'Logging In...' : 'Log In Securely'}
                        </button>

                        <div className="text-center pt-6 border-t border-slate-100">
                            <p className="text-slate-500 text-sm font-medium">
                                Don't have a vendor account?{' '}
                                <Link href={route('vendor.register')} className="font-bold text-rose-500 hover:text-rose-600 transition-colors">
                                    Apply Now
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
