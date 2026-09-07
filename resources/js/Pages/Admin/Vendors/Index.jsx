import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ vendors = [], currentFilter = 'all' }) {
    const { post, processing } = useForm();

    const handleApprove = (id) => {
        post(route('admin.vendors.approve', id));
    };

    const handleSuspend = (id) => {
        const reason = prompt('Reason for suspending vendor:');
        if (reason) {
            post(route('admin.vendors.suspend', id), { data: { reason } });
        }
    };

    const handleActivate = (id) => {
        post(route('admin.vendors.activate', id));
    };

    const filterOptions = ['all', 'approved', 'pending', 'suspended'];

    return (
        <AdminLayout header="Vendor Management">
            <Head title="Vendor Directory" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                {/* Filter Tabs */}
                <div className="flex space-x-2 border-b border-gray-200 pb-3">
                    {filterOptions.map((filter) => (
                        <Link
                            key={filter}
                            href={route('admin.vendors.index', { status: filter })}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg capitalize transition ${
                                currentFilter === filter
                                    ? 'bg-rose-600 text-white shadow-sm'
                                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            {filter} Vendors
                        </Link>
                    ))}
                </div>

                {/* Vendors Table */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">All Registered Vendors</h3>
                            <p className="text-xs text-gray-500 mt-1">Manage vendor business accounts, status, and associated halls.</p>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                            Total: {vendors.length}
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Business Name</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Owner Contact</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Halls Count</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Subscription</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {vendors.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                                            No vendors found matching filter '{currentFilter}'.
                                        </td>
                                    </tr>
                                ) : (
                                    vendors.map((vendor) => (
                                        <tr key={vendor.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-700 text-sm">
                                                        {vendor.business_name ? vendor.business_name.charAt(0) : 'V'}
                                                    </div>
                                                    <div className="ml-3">
                                                        <div className="text-sm font-bold text-gray-900">{vendor.business_name}</div>
                                                        <div className="text-xs text-gray-500">Joined: {new Date(vendor.created_at).toLocaleDateString()}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">{vendor.user?.name}</div>
                                                <div className="text-xs text-gray-500">{vendor.user?.email}</div>
                                                <div className="text-xs text-gray-400">{vendor.phone}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-700">
                                                {vendor.halls?.length || 0} Halls
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs">
                                                {vendor.subscription ? (
                                                    <span className="px-2.5 py-1 bg-emerald-50 text-emerald-700 font-bold rounded-md">
                                                        {vendor.subscription.plan_name}
                                                    </span>
                                                ) : (
                                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-500 rounded-md">No Plan</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                    vendor.verification_status === 'approved' ? 'bg-emerald-100 text-emerald-800' :
                                                    vendor.verification_status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {vendor.verification_status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <Link href={route('admin.vendors.show', vendor.id)} className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-xs font-semibold rounded-lg text-slate-700 bg-white hover:bg-slate-50">
                                                    View Details
                                                </Link>

                                                {vendor.verification_status === 'pending' && (
                                                    <PrimaryButton onClick={() => handleApprove(vendor.id)} disabled={processing} className="bg-emerald-600 hover:bg-emerald-500 text-xs">
                                                        Approve
                                                    </PrimaryButton>
                                                )}

                                                {vendor.verification_status === 'approved' && (
                                                    <button onClick={() => handleSuspend(vendor.id)} disabled={processing} className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold">
                                                        Suspend
                                                    </button>
                                                )}

                                                {vendor.verification_status === 'suspended' && (
                                                    <button onClick={() => handleActivate(vendor.id)} disabled={processing} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold">
                                                        Activate
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
