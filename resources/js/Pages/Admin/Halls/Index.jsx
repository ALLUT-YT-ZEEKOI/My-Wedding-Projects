import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Index({ halls = [], currentFilter = 'all' }) {
    const { post, processing } = useForm();

    const handleApprove = (id) => {
        post(route('admin.halls.approve', id));
    };

    const filterOptions = ['all', 'live', 'pending_review', 'changes_requested', 'rejected'];

    return (
        <AdminLayout header="Hall Management & Verification">
            <Head title="Hall Verification Directory" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                {/* Filter Tabs */}
                <div className="flex space-x-2 border-b border-gray-200 pb-3 overflow-x-auto">
                    {filterOptions.map((filter) => (
                        <Link
                            key={filter}
                            href={route('admin.halls.index', { status: filter })}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg capitalize whitespace-nowrap transition ${
                                currentFilter === filter
                                    ? 'bg-rose-600 text-white shadow-sm'
                                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            {filter.replace('_', ' ')}
                        </Link>
                    ))}
                </div>

                {/* Halls Table */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Platform Halls Directory</h3>
                            <p className="text-xs text-gray-500 mt-1">Review, approve, or request changes for venue listings.</p>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                            Total: {halls.length}
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hall Details</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Vendor Business</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Price / Rent</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {halls.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                                            No halls found matching filter '{currentFilter}'.
                                        </td>
                                    </tr>
                                ) : (
                                    halls.map((hall) => (
                                        <tr key={hall.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-gray-900">{hall.name}</div>
                                                <div className="text-xs text-gray-500">Capacity: {hall.capacity || 'N/A'} guests</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-semibold text-gray-900">{hall.vendor?.business_name || 'Vendor'}</div>
                                                <div className="text-xs text-gray-500">{hall.vendor?.user?.name}</div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                                {hall.city || hall.location || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-emerald-700">
                                                ₹{(hall.rent || hall.price || 0).toLocaleString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                                                    hall.status === 'live' ? 'bg-emerald-100 text-emerald-800' :
                                                    hall.status === 'pending_review' ? 'bg-amber-100 text-amber-800' :
                                                    hall.status === 'changes_requested' ? 'bg-indigo-100 text-indigo-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {hall.status?.replace('_', ' ')}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                                <Link href={route('admin.halls.review', hall.id)} className="inline-flex items-center px-3 py-1.5 border border-slate-300 text-xs font-semibold rounded-lg text-slate-700 bg-white hover:bg-slate-50">
                                                    Deep Verification
                                                </Link>

                                                {hall.status !== 'live' && (
                                                    <PrimaryButton onClick={() => handleApprove(hall.id)} disabled={processing} className="bg-emerald-600 hover:bg-emerald-500 text-xs">
                                                        Make Live
                                                    </PrimaryButton>
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
