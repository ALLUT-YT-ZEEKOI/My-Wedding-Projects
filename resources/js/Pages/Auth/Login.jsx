import { Head, Link, useForm } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import Checkbox from '@/Components/Checkbox';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="min-h-screen bg-[#FAF9F6] flex">
            <Head title="Log in - LUXEHALLS" />

            {/* Left Side - Image / Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-slate-900">
                <img 
                    src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80" 
                    alt="Luxury Hall" 
                    className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                
                <div className="relative z-10 w-full p-12 flex flex-col justify-between">
                    <div>
                        <Link href="/" className="text-3xl font-black text-white tracking-tighter">
                            LUXE<span className="text-rose-500">HALLS</span>
                        </Link>
                    </div>
                    
                    <div className="max-w-md animate-fade-up">
                        <p className="text-rose-400 font-bold tracking-[0.3em] text-xs uppercase mb-4 flex items-center gap-3">
                            <span className="w-8 h-[1px] bg-rose-400"></span>
                            Customer Portal
                        </p>
                        <h1 className="text-5xl font-black text-white tracking-tighter leading-tight mb-6">
                            Plan your <br />
                            <span className="font-serif italic font-light text-rose-300">dream event</span>.
                        </h1>
                        <p className="text-slate-300 font-medium">
                            Log in to browse aesthetic venues, save your favourites, and book the perfect space for your celebration.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12 lg:p-24 relative overflow-hidden">
                {/* Decorative background blurs */}
                <div className="absolute top-0 right-0 w-96 h-96 bg-rose-200/40 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-200/30 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3"></div>

                <div className="w-full max-w-md relative z-10">
                    <div className="lg:hidden mb-12">
                        <Link href="/" className="text-3xl font-black text-slate-900 tracking-tighter">
                            LUXE<span className="text-rose-500">HALLS</span>
                        </Link>
                    </div>

                    <div className="mb-10">
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Customer Sign In</h2>
                        <p className="text-slate-500 font-medium text-sm">
                            Don't have an account?{' '}
                            <Link href={route('register')} className="text-rose-600 font-bold hover:underline">
                                Create one here
                            </Link>
                        </p>
                    </div>

                    {status && (
                        <div className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-600 text-sm font-bold border border-emerald-100">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">
                                Email Address
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="w-full bg-white border border-slate-200 text-slate-900 rounded-2xl focus:ring-rose-500 focus:border-rose-500 font-bold px-4 py-3.5 transition-colors"
                                autoComplete="username"
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <div className="flex justify-between items-center mb-2 ml-1 mr-1">
                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    Password
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-[10px] font-bold text-rose-500 hover:text-rose-600 uppercase tracking-widest"
                                    >
                                        Forgot?
                                    </Link>
                                )}
                            </div>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="w-full bg-white border border-slate-200 text-slate-900 rounded-2xl focus:ring-rose-500 focus:border-rose-500 font-bold px-4 py-3.5 transition-colors"
                                autoComplete="current-password"
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div className="flex items-center ml-1">
                            <label className="flex items-center cursor-pointer group">
                                <Checkbox
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                    className="text-rose-500 focus:ring-rose-500 rounded border-slate-300 w-5 h-5"
                                />
                                <span className="ms-3 text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">
                                    Keep me logged in
                                </span>
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={processing}
                            className="w-full h-14 bg-slate-900 hover:bg-slate-800 text-white font-black tracking-widest uppercase text-sm rounded-2xl shadow-xl shadow-slate-900/20 transition-all transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
                        >
                            {processing ? 'Signing in...' : 'Sign In'}
                            {!processing && <span>→</span>}
                        </button>
                    </form>
                    
                    {/* Back to Home */}
                    <div className="mt-12 text-center">
                        <Link href="/" className="text-xs font-bold text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest flex items-center justify-center gap-2">
                            <span>←</span> Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
