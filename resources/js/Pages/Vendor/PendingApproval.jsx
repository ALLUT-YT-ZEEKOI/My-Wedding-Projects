import { Head, Link } from '@inertiajs/react';

export default function PendingApproval() {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <Head title="Pending Approval" />
            
            <div className="max-w-md w-full bg-slate-800 rounded-3xl p-8 shadow-2xl border border-slate-700 text-center">
                <div className="w-20 h-20 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                
                <h1 className="text-2xl font-black text-white mb-2">Account Under Review</h1>
                <p className="text-slate-400 mb-8">
                    Thank you for registering as a vendor on LuxeHalls! Your application is currently under review by our administration team. You will be able to manage your halls and bookings once approved.
                </p>
                
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl transition-colors font-bold"
                >
                    Log Out
                </Link>
            </div>
        </div>
    );
}
