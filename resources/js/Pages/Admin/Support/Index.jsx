import AdminLayout from '@/Layouts/AdminLayout';
import { Head, useForm } from '@inertiajs/react';
import PrimaryButton from '@/Components/PrimaryButton';
import { useState } from 'react';

export default function Index({ tickets = [], notifications = [] }) {
    const [activeTab, setActiveTab] = useState('tickets');
    const [showBroadcastModal, setShowBroadcastModal] = useState(false);

    const ticketForm = useForm({
        status: 'in_progress',
        admin_notes: '',
    });

    const broadcastForm = useForm({
        title: '',
        message: '',
        target_group: 'all',
        type: 'info',
    });

    const handleUpdateTicket = (id, newStatus) => {
        const notes = prompt('Optional response / administrative note:');
        ticketForm.post(route('admin.support.update', id), {
            data: { status: newStatus, admin_notes: notes },
        });
    };

    const handleSendBroadcast = (e) => {
        e.preventDefault();
        broadcastForm.post(route('admin.notifications.send'), {
            onSuccess: () => {
                setShowBroadcastModal(false);
                broadcastForm.reset();
            },
        });
    };

    return (
        <AdminLayout header="Support Desk & Broadcast Center">
            <Head title="Support & Notifications" />

            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                {/* Header Switch */}
                <div className="flex justify-between items-center border-b border-slate-200 pb-3">
                    <div className="flex space-x-3">
                        <button
                            onClick={() => setActiveTab('tickets')}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                                activeTab === 'tickets' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            🎧 Customer Support Tickets ({tickets.length})
                        </button>
                        <button
                            onClick={() => setActiveTab('broadcasts')}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition ${
                                activeTab === 'broadcasts' ? 'bg-rose-600 text-white shadow-sm' : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                            }`}
                        >
                            📢 System Broadcasts ({notifications.length})
                        </button>
                    </div>

                    <button
                        onClick={() => setShowBroadcastModal(true)}
                        className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl"
                    >
                        + Send Broadcast Notification
                    </button>
                </div>

                {activeTab === 'tickets' ? (
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                        <div className="px-6 py-5 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">Platform Complaints & Helpdesk</h3>
                            <p className="text-xs text-gray-500 mt-1">Manage open customer and vendor inquiries.</p>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {tickets.length === 0 ? (
                                <div className="p-8 text-center text-sm text-gray-500">
                                    No support tickets registered.
                                </div>
                            ) : (
                                tickets.map((t) => (
                                    <div key={t.id} className="p-6 hover:bg-slate-50/50 flex flex-col md:flex-row justify-between items-start space-y-4 md:space-y-0">
                                        <div className="space-y-2 max-w-2xl">
                                            <div className="flex items-center space-x-2">
                                                <span className="font-mono text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">{t.ticket_number || `TICK-${t.id}`}</span>
                                                <span className="text-sm font-bold text-slate-900">{t.subject}</span>
                                                <span className="text-xs px-2 py-0.5 rounded font-bold uppercase bg-slate-100 text-slate-700">{t.category}</span>
                                            </div>
                                            <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-xl">{t.message}</p>
                                            {t.admin_notes && (
                                                <p className="text-xs text-indigo-700 bg-indigo-50 p-2.5 rounded-lg">
                                                    <strong>Admin Reply:</strong> {t.admin_notes}
                                                </p>
                                            )}
                                            <p className="text-xs text-slate-400">By {t.user?.name} ({t.user?.email}) &bull; {new Date(t.created_at).toLocaleString()}</p>
                                        </div>

                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                                                t.status === 'resolved' ? 'bg-emerald-100 text-emerald-800' :
                                                t.status === 'in_progress' ? 'bg-indigo-100 text-indigo-800' : 'bg-amber-100 text-amber-800'
                                            }`}>
                                                {t.status}
                                            </span>

                                            {t.status !== 'resolved' && (
                                                <button
                                                    onClick={() => handleUpdateTicket(t.id, 'resolved')}
                                                    disabled={ticketForm.processing}
                                                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg"
                                                >
                                                    Mark Resolved
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-2xl border border-gray-100">
                        <div className="px-6 py-5 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-gray-900">Broadcast History</h3>
                            <p className="text-xs text-gray-500 mt-1">Platform-wide notifications sent to vendors or customers.</p>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-sm text-gray-500">
                                    No broadcast notifications sent yet.
                                </div>
                            ) : (
                                notifications.map((n) => (
                                    <div key={n.id} className="p-5 hover:bg-slate-50 flex justify-between items-center">
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-bold text-slate-900">{n.title}</span>
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-xs font-semibold rounded capitalize">To: {n.target_group}</span>
                                            </div>
                                            <p className="text-xs text-slate-600 mt-1">{n.message}</p>
                                            <p className="text-xs text-slate-400 mt-1">Sent by {n.sender?.name || 'Admin'} &bull; {new Date(n.created_at).toLocaleString()}</p>
                                        </div>
                                        <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-700 text-xs font-bold rounded uppercase">
                                            {n.type}
                                        </span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Broadcast Modal */}
            {showBroadcastModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
                    <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl space-y-4">
                        <h3 className="text-lg font-bold text-slate-900">Send System Broadcast</h3>
                        <form onSubmit={handleSendBroadcast} className="space-y-3">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700">Headline Title</label>
                                <input
                                    type="text"
                                    value={broadcastForm.data.title}
                                    onChange={(e) => broadcastForm.setData('title', e.target.value)}
                                    placeholder="Platform Maintenance Notice"
                                    className="w-full text-sm border-slate-300 rounded-lg"
                                    required
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700">Target Audience</label>
                                    <select
                                        value={broadcastForm.data.target_group}
                                        onChange={(e) => broadcastForm.setData('target_group', e.target.value)}
                                        className="w-full text-sm border-slate-300 rounded-lg"
                                    >
                                        <option value="all">Everyone</option>
                                        <option value="vendors">Vendors Only</option>
                                        <option value="customers">Customers Only</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700">Notification Level</label>
                                    <select
                                        value={broadcastForm.data.type}
                                        onChange={(e) => broadcastForm.setData('type', e.target.value)}
                                        className="w-full text-sm border-slate-300 rounded-lg"
                                    >
                                        <option value="info">Info</option>
                                        <option value="warning">Warning</option>
                                        <option value="urgent">Urgent</option>
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-700">Message Content</label>
                                <textarea
                                    value={broadcastForm.data.message}
                                    onChange={(e) => broadcastForm.setData('message', e.target.value)}
                                    rows="4"
                                    placeholder="Enter full notification details..."
                                    className="w-full text-sm border-slate-300 rounded-lg"
                                    required
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowBroadcastModal(false)}
                                    className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-lg hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <PrimaryButton type="submit" disabled={broadcastForm.processing} className="bg-rose-600 text-xs">
                                    Broadcast Now
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
}
