import VendorLayout from '@/Layouts/VendorLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Calendar({ halls, selectedHallId, month, availabilities }) {
    const [showOfflineModal, setShowOfflineModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('full_day');

    // Block Form
    const blockForm = useForm({
        hall_id: selectedHallId || halls[0]?.id || '',
        date: '',
        slot: 'full_day',
        reason: 'Blocked for Maintenance / Private Event'
    });

    // Offline Booking Form
    const offlineForm = useForm({
        hall_id: selectedHallId || halls[0]?.id || '',
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        event_type: 'Wedding',
        event_date: '',
        slot: 'full_day',
        guest_count: 250,
        booking_amount: 50000,
        advance_amount: 20000,
        notes: ''
    });

    const handleBlockSubmit = (e) => {
        e.preventDefault();
        blockForm.post(route('vendor.availability.block'), {
            onSuccess: () => setShowBlockModal(false)
        });
    };

    const handleOfflineSubmit = (e) => {
        e.preventDefault();
        offlineForm.post(route('vendor.bookings.offline'), {
            onSuccess: () => setShowOfflineModal(false)
        });
    };

    const handleUnblock = (date, slot) => {
        useForm({
            hall_id: selectedHallId,
            date: date,
            slot: slot
        }).post(route('vendor.availability.unblock'));
    };

    // Days in current month grid generator
    const getDaysInMonth = () => {
        const [yearStr, monthStr] = month.split('-');
        const dateObj = new Date(yearStr, monthStr - 1, 1);
        const days = [];
        while (dateObj.getMonth() === monthStr - 1) {
            const dateStr = dateObj.toISOString().split('T')[0];
            days.push(dateStr);
            dateObj.setDate(dateObj.getDate() + 1);
        }
        return days;
    };

    const days = getDaysInMonth();

    return (
        <VendorLayout
            header={
                <div className="flex flex-wrap justify-between items-center w-full gap-4">
                    <div>
                        <h2 className="font-bold text-xl text-slate-900 leading-tight">Availability Calendar</h2>
                        <p className="text-xs text-slate-500">Track 🟢 Available, 🟡 Pending, 🔴 Booked, and ⚫ Blocked date slots.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowOfflineModal(true)}
                            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20"
                        >
                            + Add Offline Booking
                        </button>
                        <button
                            onClick={() => setShowBlockModal(true)}
                            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md"
                        >
                            🚫 Block Date / Slot
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Availability Calendar" />

            {/* Controls Bar */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-6 flex flex-wrap justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <label className="text-xs font-bold text-slate-500 uppercase">Select Hall:</label>
                    <select
                        className="text-xs font-bold border-slate-300 rounded-lg"
                        value={selectedHallId}
                        onChange={(e) => window.location.href = route('vendor.availability.index') + `?hall_id=${e.target.value}&month=${month}`}
                    >
                        {halls.map((h) => (
                            <option key={h.id} value={h.id}>{h.name}</option>
                        ))}
                    </select>
                </div>

                {/* Status Legend */}
                <div className="flex items-center gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> 🟢 Available</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> 🟡 Pending</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> 🔴 Booked</span>
                    <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span> ⚫ Blocked</span>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {days.map((dateStr) => {
                    const dayNum = dateStr.split('-')[2];
                    const slots = availabilities.filter(a => a.date === dateStr);
                    const morningSlot = slots.find(s => s.slot === 'morning');
                    const eveningSlot = slots.find(s => s.slot === 'evening');
                    const fullDaySlot = slots.find(s => s.slot === 'full_day');

                    const isFullDayBooked = fullDaySlot?.status === 'booked' || fullDaySlot?.status === 'blocked';

                    return (
                        <div key={dateStr} className={`bg-white rounded-2xl p-4 border transition-all ${isFullDayBooked ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200/80 hover:border-indigo-500/50'}`}>
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-lg font-black text-slate-900">{dayNum}</span>
                                <span className="text-[10px] font-bold text-slate-400 uppercase">{new Date(dateStr).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                            </div>

                            {/* Slot status badges */}
                            <div className="space-y-2 text-[11px]">
                                {['morning', 'evening', 'full_day'].map((slotName) => {
                                    const match = slots.find(s => s.slot === slotName);
                                    const status = match ? match.status : 'available';

                                    return (
                                        <div key={slotName} className="flex items-center justify-between p-1.5 rounded-lg bg-slate-50 border border-slate-100">
                                            <span className="capitalize font-bold text-slate-700">{slotName.replace('_', ' ')}:</span>
                                            {status === 'available' && (
                                                <span className="text-emerald-600 font-bold">🟢 Free</span>
                                            )}
                                            {status === 'booked' && (
                                                <span className="text-rose-600 font-bold">🔴 Booked</span>
                                            )}
                                            {status === 'blocked' && (
                                                <button onClick={() => handleUnblock(dateStr, slotName)} className="text-slate-900 font-bold hover:underline">
                                                    ⚫ Blocked (Unblock)
                                                </button>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* MODAL: Block Date / Slot */}
            {showBlockModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">🚫 Block Date or Slot</h3>
                        <form onSubmit={handleBlockSubmit} className="space-y-4">
                            <div>
                                <InputLabel value="Select Date *" />
                                <TextInput type="date" className="mt-1 block w-full" value={blockForm.data.date} onChange={e => blockForm.setData('date', e.target.value)} required />
                            </div>
                            <div>
                                <InputLabel value="Select Slot *" />
                                <select className="mt-1 block w-full border-slate-300 rounded-lg text-sm" value={blockForm.data.slot} onChange={e => blockForm.setData('slot', e.target.value)}>
                                    <option value="morning">Morning Slot</option>
                                    <option value="evening">Evening Slot</option>
                                    <option value="full_day">Full Day</option>
                                </select>
                            </div>
                            <div>
                                <InputLabel value="Reason for Blocking" />
                                <TextInput className="mt-1 block w-full" value={blockForm.data.reason} onChange={e => blockForm.setData('reason', e.target.value)} />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowBlockModal(false)} className="text-xs font-bold text-slate-500">Cancel</button>
                                <PrimaryButton className="bg-slate-900">Confirm Block</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* MODAL: Offline Booking */}
            {showOfflineModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl max-h-[90vh] overflow-y-auto">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">📝 Add Offline Booking (Walk-in / Phone)</h3>
                        <form onSubmit={handleOfflineSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Customer Name *" />
                                    <TextInput className="mt-1 block w-full" value={offlineForm.data.customer_name} onChange={e => offlineForm.setData('customer_name', e.target.value)} required />
                                </div>
                                <div>
                                    <InputLabel value="Phone Number *" />
                                    <TextInput className="mt-1 block w-full" value={offlineForm.data.customer_phone} onChange={e => offlineForm.setData('customer_phone', e.target.value)} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Event Type *" />
                                    <select className="mt-1 block w-full border-slate-300 rounded-lg text-sm" value={offlineForm.data.event_type} onChange={e => offlineForm.setData('event_type', e.target.value)}>
                                        <option value="Wedding">Wedding</option>
                                        <option value="Reception">Reception</option>
                                        <option value="Birthday">Birthday Party</option>
                                        <option value="Corporate">Corporate Event</option>
                                    </select>
                                </div>
                                <div>
                                    <InputLabel value="Event Date *" />
                                    <TextInput type="date" className="mt-1 block w-full" value={offlineForm.data.event_date} onChange={e => offlineForm.setData('event_date', e.target.value)} required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Slot *" />
                                    <select className="mt-1 block w-full border-slate-300 rounded-lg text-sm" value={offlineForm.data.slot} onChange={e => offlineForm.setData('slot', e.target.value)}>
                                        <option value="morning">Morning</option>
                                        <option value="evening">Evening</option>
                                        <option value="full_day">Full Day</option>
                                    </select>
                                </div>
                                <div>
                                    <InputLabel value="Guest Count" />
                                    <TextInput type="number" className="mt-1 block w-full" value={offlineForm.data.guest_count} onChange={e => offlineForm.setData('guest_count', e.target.value)} />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Total Amount (₹) *" />
                                    <TextInput type="number" className="mt-1 block w-full" value={offlineForm.data.booking_amount} onChange={e => offlineForm.setData('booking_amount', e.target.value)} required />
                                </div>
                                <div>
                                    <InputLabel value="Advance Paid (₹)" />
                                    <TextInput type="number" className="mt-1 block w-full" value={offlineForm.data.advance_amount} onChange={e => offlineForm.setData('advance_amount', e.target.value)} />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowOfflineModal(false)} className="text-xs font-bold text-slate-500">Cancel</button>
                                <PrimaryButton className="bg-emerald-600 hover:bg-emerald-500">Save Booking & Block Calendar</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </VendorLayout>
    );
}
