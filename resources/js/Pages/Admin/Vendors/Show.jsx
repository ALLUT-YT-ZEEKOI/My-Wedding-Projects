import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Show({ vendor }) {
    const { post, processing } = useForm();

    const handleApprove = () => {
        post(route('admin.vendors.approve', vendor.id));
    };

    const handleSuspend = () => {
        const reason = prompt('Reason for suspending vendor:');
        if (reason) {
            post(route('admin.vendors.suspend', vendor.id), { data: { reason } });
        }
    };

    return (
        <AdminLayout header={`Vendor Details: ${vendor.business_name}`}>
            <Head title={`Vendor - ${vendor.business_name}`} />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                <div className="flex justify-between items-center">
                    <Link href={route('admin.vendors.index')} className="text-sm font-semibold text-rose-600 hover:underline">
                        &larr; Back to Vendors
                    </Link>
                    <div className="space-x-3">
                        {vendor.verification_status === 'pending' && (
                            <PrimaryButton onClick={handleApprove} disabled={processing} className="bg-emerald-600 hover:bg-emerald-500">
                                Approve Vendor
                            </PrimaryButton>
                        )}
                        {vendor.verification_status === 'approved' && (
                            <button onClick={handleSuspend} disabled={processing} className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-sm font-semibold">
                                Suspend Vendor
                            </button>
                        )}
                    </div>
                </div>

                {/* Info Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Business Profile</h4>
                        <p className="text-xl font-bold text-slate-900 mt-1">{vendor.business_name}</p>
                        <p className="text-sm text-slate-500 mt-1">{vendor.address || 'Address not provided'}</p>
                        <p className="text-xs text-slate-400 mt-2">GSTIN / Reg: {vendor.gstin || 'N/A'}</p>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Owner Info</h4>
                        <p className="text-base font-bold text-slate-900 mt-1">{vendor.user?.name}</p>
                        <p className="text-sm text-slate-600">{vendor.user?.email}</p>
                        <p className="text-sm text-slate-600">{vendor.phone}</p>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Subscription & Status</h4>
                        <div className="mt-2 flex items-center space-x-2">
                            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full capitalize">
                                {vendor.verification_status}
                            </span>
                            {vendor.subscription && (
                                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded-full">
                                    {vendor.subscription.plan_name}
                                </span>
                            )}
                        </div>
                        {vendor.rejection_reason && (
                            <p className="text-xs text-red-600 bg-red-50 p-2 rounded-lg mt-2">
                                Note: {vendor.rejection_reason}
                            </p>
                        )}
                    </div>
                </div>

                {/* Associated Halls */}
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                    <h3 className="text-lg font-bold text-slate-900">Managed Halls ({vendor.halls?.length || 0})</h3>
                    {(!vendor.halls || vendor.halls.length === 0) ? (
                        <p className="text-sm text-slate-500">No halls added by this vendor yet.</p>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {vendor.halls.map((hall) => (
                                <div key={hall.id} className="p-4 border border-slate-200 rounded-xl flex justify-between items-center bg-slate-50/50">
                                    <div>
                                        <p className="font-bold text-slate-900">{hall.name}</p>
                                        <p className="text-xs text-slate-500">{hall.city || hall.location} | Capacity: {hall.capacity}</p>
                                        <span className={`inline-block mt-2 text-xs font-semibold px-2 py-0.5 rounded capitalize ${
                                            hall.status === 'live' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                        }`}>
                                            {hall.status}
                                        </span>
                                    </div>
                                    <Link href={route('admin.halls.review', hall.id)} className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg">
                                        Review Hall
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
