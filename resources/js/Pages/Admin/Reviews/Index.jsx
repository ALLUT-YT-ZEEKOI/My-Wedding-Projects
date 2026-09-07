import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';

export default function Index({ reviews = [] }) {
    const { post, delete: destroy, processing } = useForm();

    const handleToggleStatus = (id, status) => {
        post(route('admin.reviews.status', id), { data: { status } });
    };

    const handleDelete = (id) => {
        if (confirm('Are you sure you want to permanently delete this review?')) {
            destroy(route('admin.reviews.destroy', id));
        }
    };

    return (
        <AdminLayout header="Customer Reviews & Ratings Moderation">
            <Head title="Reviews Moderation" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                    <div className="px-6 py-5 border-b border-gray-100 flex justify-between items-center">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Submitted Hall Reviews</h3>
                            <p className="text-xs text-gray-500 mt-1">Approve, hide, or remove reviews left by customers for venue halls.</p>
                        </div>
                        <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                            Total Reviews: {reviews.length}
                        </span>
                    </div>

                    <div className="divide-y divide-gray-100">
                        {reviews.length === 0 ? (
                            <div className="p-8 text-center text-sm text-gray-500">
                                No customer reviews submitted yet.
                            </div>
                        ) : (
                            reviews.map((rev) => (
                                <div key={rev.id} className="p-6 hover:bg-slate-50/50 flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                                    <div className="space-y-1 max-w-2xl">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-amber-500 font-bold text-sm">{'★'.repeat(rev.rating)}{'☆'.repeat(5 - rev.rating)}</span>
                                            <span className="text-sm font-bold text-slate-900">{rev.hall?.name || 'Hall'}</span>
                                            <span className="text-xs text-slate-400">by {rev.user?.name || 'Anonymous Customer'}</span>
                                        </div>
                                        <p className="text-sm text-slate-700 leading-relaxed font-medium">"{rev.comment}"</p>
                                        <p className="text-xs text-slate-400">{new Date(rev.created_at).toLocaleString()}</p>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase mr-2 ${
                                            rev.status === 'approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-200 text-slate-700'
                                        }`}>
                                            {rev.status || 'Approved'}
                                        </span>

                                        {rev.status === 'hidden' ? (
                                            <button
                                                onClick={() => handleToggleStatus(rev.id, 'approved')}
                                                disabled={processing}
                                                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold"
                                            >
                                                Approve / Show
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleToggleStatus(rev.id, 'hidden')}
                                                disabled={processing}
                                                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-semibold"
                                            >
                                                Hide Review
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleDelete(rev.id)}
                                            disabled={processing}
                                            className="px-3 py-1.5 bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 rounded-lg text-xs font-semibold"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
