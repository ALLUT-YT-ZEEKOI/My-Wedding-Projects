import AdminLayout from '@/Layouts/AdminLayout';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Index({ customers = [], currentFilter = 'all' }) {
    const { post, processing } = useForm();

    const handleToggleStatus = (id) => {
        post(route('admin.customers.toggle-status', id));
    };

    const filterOptions = ['all', 'active', 'blocked'];

    return (
        <AdminLayout header="Customer Directory">
            <Head title="Customer Directory" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                {/* Filters */}
                <div className="flex space-x-2 border-b border-gray-200 pb-3">
                    {filterOptions.map((filter) => (
                        <Link
                            key={filter}
                            href={route('admin.customers.index', { status: filter })}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg capitalize transition ${
                                currentFilter === filter
                                    ? 'bg-rose-600 text-white shadow-sm'
                                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            {filter} Users
                        </Link>
                    ))}
                </div>

                {/* Directory Table */}
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Registered Platform Customers</h3>
                            <p className="text-xs text-gray-500 mt-1">Manage user access and block abusive accounts.</p>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                            Total: {customers.length}
                        </span>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer Info</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Bookings Made</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined Date</th>
                                    <th className="px-6 py-3.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Account Status</th>
                                    <th className="px-6 py-3.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-100">
                                {customers.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="px-6 py-8 text-center text-sm text-gray-500">
                                            No customer accounts found.
                                        </td>
                                    </tr>
                                ) : (
                                    customers.map((user) => (
                                        <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-9 w-9 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm">
                                                        {user.name ? user.name.charAt(0) : 'U'}
                                                    </div>
                                                    <div className="ml-3 text-sm font-bold text-gray-900">{user.name}</div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-800">
                                                {user.bookings_count || 0} Bookings
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                                                {new Date(user.created_at).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                                                    user.status === 'blocked' ? 'bg-red-100 text-red-800' : 'bg-emerald-100 text-emerald-800'
                                                }`}>
                                                    {user.status || 'active'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => handleToggleStatus(user.id)}
                                                    disabled={processing}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                                                        user.status === 'blocked'
                                                            ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                                                            : 'bg-red-600 text-white hover:bg-red-500'
                                                    }`}
                                                >
                                                    {user.status === 'blocked' ? 'Unblock Account' : 'Block Customer'}
                                                </button>
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
