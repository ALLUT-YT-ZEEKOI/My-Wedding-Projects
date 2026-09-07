import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function Guest({ children, title = 'Welcome to My Hall', subtitle = 'The premium platform for managing your event spaces.' }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100 via-gray-50 to-white py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8 relative z-10">
                <div className="flex flex-col items-center justify-center text-center">
                    <Link href="/">
                        <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg mb-4 hover:scale-105 transition-transform duration-300">
                            <ApplicationLogo className="w-10 h-10 fill-current text-white" />
                        </div>
                    </Link>
                    <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
                        {title}
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        {subtitle}
                    </p>
                </div>

                <div className="bg-white/80 backdrop-blur-xl py-8 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-white/50">
                    {children}
                </div>
            </div>
            
            {/* Decorative background blobs */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-purple-200/50 blur-[100px]"></div>
                <div className="absolute top-[20%] -right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-200/50 blur-[100px]"></div>
                <div className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-[120px]"></div>
            </div>
        </div>
    );
}
