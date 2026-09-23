import VendorLayout from '@/Layouts/VendorLayout';
import { Head, useForm, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Calendar({ halls = [], selectedHallId, month = '2026-09', availabilities = [] }) {
    const [showOfflineModal, setShowOfflineModal] = useState(false);
    const [showBlockModal, setShowBlockModal] = useState(false);
    const [activeDateModal, setActiveDateModal] = useState(null);

    // Current selected hall
    const currentHall = halls.find((h) => h.id === Number(selectedHallId)) || halls[0];

    // Block Form
    const blockForm = useForm({
        hall_id: selectedHallId || halls[0]?.id || '',
        date: '',
        slot: 'full_day',
        reason: 'Blocked by Vendor / Private Event'
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
        notes: '',
    });

    const handleBlockSubmit = (e) => {
        e.preventDefault();
        blockForm.post(route('vendor.availability.block'), {
            onSuccess: () => {
                setShowBlockModal(false);
                setActiveDateModal(null);
            },
        });
    };

    const handleOfflineSubmit = (e) => {
        e.preventDefault();
        offlineForm.post(route('vendor.bookings.offline'), {
            onSuccess: () => {
                setShowOfflineModal(false);
                setActiveDateModal(null);
            },
        });
    };

    const handleUnblock = (date, slot) => {
        router.post(
            route('vendor.availability.unblock'),
            {
                hall_id: selectedHallId || halls[0]?.id,
                date: date,
                slot: slot,
            },
            {
                preserveScroll: true,
                onSuccess: () => setActiveDateModal(null),
            }
        );
    };

    // Month Navigation
    const handleMonthChange = (offset) => {
        const [yStr, mStr] = month.split('-');
        const date = new Date(parseInt(yStr), parseInt(mStr) - 1 + offset, 1);
        const newMonth = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        router.get(route('vendor.availability.index'), { hall_id: selectedHallId, month: newMonth }, { preserveState: true });
    };

    // Days in current month grid generator with weekday padding
    const getCalendarGrid = () => {
        const [yearStr, monthStr] = month.split('-');
        const year = parseInt(yearStr);
        const monthIdx = parseInt(monthStr) - 1;

        const firstDayOfMonth = new Date(year, monthIdx, 1);
        const lastDayOfMonth = new Date(year, monthIdx + 1, 0);

        // Day of week index (0=Sun, 1=Mon, ..., 6=Sat)
        // Convert to Mon=0, ..., Sun=6
        let startDay = firstDayOfMonth.getDay() - 1;
        if (startDay === -1) startDay = 6;

        const days = [];
        // Padding days before
        for (let i = 0; i < startDay; i++) {
            days.push(null);
        }

        // Days of month
        for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
            const dateObj = new Date(year, monthIdx, d);
            const dateStr = `${year}-${String(monthIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
            days.push({ dayNum: d, dateStr, dateObj });
        }

        return days;
    };

    const gridDays = getCalendarGrid();

    // Helper: Compute real slot availability logic
    const getSlotBreakdown = (dateStr) => {
        const daySlots = availabilities.filter((a) => a.date === dateStr);

        const fullDayRecord = daySlots.find((s) => s.slot === 'full_day');
        const morningRecord = daySlots.find((s) => s.slot === 'morning');
        const eveningRecord = daySlots.find((s) => s.slot === 'evening');

        let morningStatus = morningRecord ? morningRecord.status : 'available';
        let eveningStatus = eveningRecord ? eveningRecord.status : 'available';
        let fullDayStatus = fullDayRecord ? fullDayRecord.status : 'available';

        let morningReason = morningRecord ? morningRecord.reason : null;
        let eveningReason = eveningRecord ? eveningRecord.reason : null;
        let fullDayReason = fullDayRecord ? fullDayRecord.reason : null;

        let morningBooking = morningRecord?.booking;
        let eveningBooking = eveningRecord?.booking;
        let fullDayBooking = fullDayRecord?.booking;

        // CRITICAL LOGIC: If full_day is booked/blocked, Morning & Evening are automatically booked/blocked by Full Day!
        if (fullDayRecord) {
            morningStatus = fullDayRecord.status;
            eveningStatus = fullDayRecord.status;
            morningReason = `Full Day ${fullDayRecord.status === 'booked' ? 'Booked' : 'Blocked'}`;
            eveningReason = `Full Day ${fullDayRecord.status === 'booked' ? 'Booked' : 'Blocked'}`;
            morningBooking = fullDayBooking;
            eveningBooking = fullDayBooking;
        } else {
            // If morning OR evening is booked/blocked, Full Day cannot be booked as a whole!
            if (morningRecord || eveningRecord) {
                fullDayStatus = 'unavailable';
                fullDayReason = 'Partial Day Booked';
            }
        }

        // Overall day badge calculation
        let dayBadge = { label: 'Available', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' };
        if (fullDayStatus === 'booked') {
            dayBadge = { label: 'Booked (Full Day)', color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' };
        } else if (fullDayStatus === 'blocked') {
            dayBadge = { label: 'Blocked', color: 'bg-slate-900 text-white border-slate-900', dot: 'bg-slate-400' };
        } else if (morningStatus !== 'available' && eveningStatus !== 'available') {
            dayBadge = { label: 'Fully Booked', color: 'bg-rose-50 text-rose-700 border-rose-200', dot: 'bg-rose-500' };
        } else if (morningStatus !== 'available') {
            dayBadge = { label: 'Morning Booked', color: 'bg-amber-50 text-amber-800 border-amber-200', dot: 'bg-amber-500' };
        } else if (eveningStatus !== 'available') {
            dayBadge = { label: 'Evening Booked', color: 'bg-indigo-50 text-indigo-800 border-indigo-200', dot: 'bg-indigo-500' };
        }

        return {
            morning: { status: morningStatus, reason: morningReason, booking: morningBooking, record: morningRecord || fullDayRecord },
            evening: { status: eveningStatus, reason: eveningReason, booking: eveningBooking, record: eveningRecord || fullDayRecord },
            fullDay: { status: fullDayStatus, reason: fullDayReason, booking: fullDayBooking, record: fullDayRecord },
            dayBadge,
            isFullyOccupied: fullDayStatus === 'booked' || fullDayStatus === 'blocked' || (morningStatus !== 'available' && eveningStatus !== 'available'),
        };
    };

    const formattedMonthName = new Date(month + '-01').toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

    return (
        <VendorLayout
            header={
                <div className="flex flex-wrap justify-between items-center w-full gap-4">
                    <div>
                        <h2 className="font-bold text-xl text-slate-900 leading-tight">Availability &amp; Calendar</h2>
                        <p className="text-xs text-slate-500">Manage bookings, block maintainence dates, and review slot status.</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setShowOfflineModal(true)}
                            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition cursor-pointer"
                        >
                            + Add Offline Booking
                        </button>
                        <button
                            onClick={() => setShowBlockModal(true)}
                            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-md transition cursor-pointer"
                        >
                            🚫 Block Date / Slot
                        </button>
                    </div>
                </div>
            }
        >
            <Head title="Availability Calendar" />

            {/* Controls Bar */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs mb-6 flex flex-wrap justify-between items-center gap-4">
                <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-slate-500 uppercase">Select Hall:</label>
                        <select
                            className="text-xs font-bold border-slate-300 rounded-xl py-2 px-3 focus:ring-rose-500 focus:border-rose-500 bg-white"
                            value={selectedHallId || halls[0]?.id || ''}
                            onChange={(e) =>
                                router.get(route('vendor.availability.index'), { hall_id: e.target.value, month }, { preserveState: true })
                            }
                        >
                            {halls.map((h) => (
                                <option key={h.id} value={h.id}>
                                    {h.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Month Switcher */}
                    <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl">
                        <button
                            onClick={() => handleMonthChange(-1)}
                            className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold text-sm transition"
                        >
                            ‹
                        </button>
                        <span className="px-3 text-sm font-bold text-slate-900 min-w-[140px] text-center">
                            {formattedMonthName}
                        </span>
                        <button
                            onClick={() => handleMonthChange(1)}
                            className="w-8 h-8 rounded-lg bg-white shadow-xs flex items-center justify-center text-slate-700 hover:bg-slate-200 font-bold text-sm transition"
                        >
                            ›
                        </button>
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Available</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span> Partial</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span> Booked</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-slate-900"></span> Blocked</span>
                </div>
            </div>

            {/* Calendar Container */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden p-4 sm:p-6">
                {/* Weekday Labels Header */}
                <div className="grid grid-cols-7 gap-2 mb-3 text-center border-b border-slate-100 pb-3">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((wd) => (
                        <div key={wd} className="text-xs font-bold uppercase tracking-wider text-slate-400">
                            {wd}
                        </div>
                    ))}
                </div>

                {/* Calendar Days Grid */}
                <div className="grid grid-cols-7 gap-2 sm:gap-3">
                    {gridDays.map((item, idx) => {
                        if (!item) {
                            return <div key={`empty-${idx}`} className="aspect-[4/3] rounded-2xl bg-slate-50/50 border border-transparent"></div>;
                        }

                        const { dayNum, dateStr } = item;
                        const breakdown = getSlotBreakdown(dateStr);
                        const { morning, evening, fullDay, dayBadge, isFullyOccupied } = breakdown;

                        return (
                            <div
                                key={dateStr}
                                onClick={() => setActiveDateModal({ dateStr, dayNum, breakdown })}
                                className={`group relative min-h-[110px] sm:min-h-[130px] p-2.5 sm:p-3 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${isFullyOccupied
                                        ? 'bg-slate-50/80 border-slate-200 hover:border-slate-400'
                                        : 'bg-white border-slate-200/90 hover:border-rose-400 hover:shadow-md'
                                    }`}
                            >
                                {/* Top Row: Date Number & Badge */}
                                <div className="flex justify-between items-start gap-1">
                                    <span className="text-base sm:text-lg font-black text-slate-900 group-hover:text-rose-600 transition-colors">
                                        {dayNum}
                                    </span>
                                    <span
                                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border truncate ${dayBadge.color}`}
                                    >
                                        <span className={`w-1.5 h-1.5 rounded-full ${dayBadge.dot} shrink-0`}></span>
                                        <span className="truncate">{dayBadge.label}</span>
                                    </span>
                                </div>

                                {/* Slot Breakdown Rows */}
                                <div className="space-y-1 my-2 text-[10px]">
                                    {/* Morning Slot */}
                                    <div className="flex justify-between items-center px-2 py-1 rounded-md bg-slate-100/70 text-slate-700 font-semibold">
                                        <span>Morning</span>
                                        {morning.status === 'available' && <span className="text-emerald-700 font-bold">🟢 Free</span>}
                                        {morning.status === 'booked' && <span className="text-rose-600 font-bold">🔴 Booked</span>}
                                        {morning.status === 'blocked' && <span className="text-slate-900 font-bold">⚫ Blocked</span>}
                                    </div>

                                    {/* Evening Slot */}
                                    <div className="flex justify-between items-center px-2 py-1 rounded-md bg-slate-100/70 text-slate-700 font-semibold">
                                        <span>Evening</span>
                                        {evening.status === 'available' && <span className="text-emerald-700 font-bold">🟢 Free</span>}
                                        {evening.status === 'booked' && <span className="text-rose-600 font-bold">🔴 Booked</span>}
                                        {evening.status === 'blocked' && <span className="text-slate-900 font-bold">⚫ Blocked</span>}
                                    </div>

                                    {/* Full Day Slot */}
                                    <div className="flex justify-between items-center px-2 py-1 rounded-md bg-slate-100/70 text-slate-700 font-semibold">
                                        <span>Full Day</span>
                                        {fullDay.status === 'available' && <span className="text-emerald-700 font-bold">🟢 Free</span>}
                                        {fullDay.status === 'booked' && <span className="text-rose-600 font-bold">🔴 Booked</span>}
                                        {fullDay.status === 'blocked' && <span className="text-slate-900 font-bold">⚫ Blocked</span>}
                                        {fullDay.status === 'unavailable' && <span className="text-amber-700 font-bold">🚫 N/A</span>}
                                    </div>
                                </div>

                                <div className="text-[9px] text-slate-400 font-bold text-right group-hover:text-rose-600 transition-colors">
                                    Click to manage →
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* MODAL: Day Details & Slot Management */}
            {activeDateModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-lg w-full border border-slate-200 shadow-2xl space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                            <div>
                                <h3 className="text-xl font-black text-slate-900">
                                    {new Date(activeDateModal.dateStr).toLocaleDateString('en-US', {
                                        weekday: 'long',
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric',
                                    })}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium">Slot management for {currentHall?.name}</p>
                            </div>
                            <button
                                onClick={() => setActiveDateModal(null)}
                                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold flex items-center justify-center"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Slots Detailed Breakdown */}
                        <div className="space-y-3">
                            {[
                                { title: 'Morning Slot', key: 'morning', ...activeDateModal.breakdown.morning },
                                { title: 'Evening Slot', key: 'evening', ...activeDateModal.breakdown.evening },
                                { title: 'Full Day Slot', key: 'fullDay', ...activeDateModal.breakdown.fullDay },
                            ].map((slotInfo) => (
                                <div
                                    key={slotInfo.key}
                                    className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h4 className="font-bold text-slate-900 text-sm">{slotInfo.title}</h4>
                                            {slotInfo.status === 'available' && (
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                                                    🟢 Available
                                                </span>
                                            )}
                                            {slotInfo.status === 'booked' && (
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800">
                                                    🔴 Booked
                                                </span>
                                            )}
                                            {slotInfo.status === 'blocked' && (
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-900 text-white">
                                                    ⚫ Blocked
                                                </span>
                                            )}
                                            {slotInfo.status === 'unavailable' && (
                                                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                                                    🚫 Partial N/A
                                                </span>
                                            )}
                                        </div>
                                        {slotInfo.reason && <p className="text-xs text-slate-500 mt-1 font-medium">{slotInfo.reason}</p>}
                                        {slotInfo.booking && (
                                            <p className="text-xs text-indigo-700 mt-1 font-semibold">
                                                Customer: {slotInfo.booking.customer_name} ({slotInfo.booking.booking_code})
                                            </p>
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <div className="shrink-0">
                                        {slotInfo.status === 'blocked' && (
                                            <button
                                                onClick={() => handleUnblock(activeDateModal.dateStr, slotInfo.key === 'fullDay' ? 'full_day' : slotInfo.key)}
                                                className="px-3 py-1.5 bg-slate-900 text-white hover:bg-slate-800 text-xs font-bold rounded-xl transition"
                                            >
                                                Unblock Slot
                                            </button>
                                        )}
                                        {slotInfo.status === 'available' && (
                                            <button
                                                onClick={() => {
                                                    blockForm.setData({
                                                        hall_id: selectedHallId || halls[0]?.id,
                                                        date: activeDateModal.dateStr,
                                                        slot: slotInfo.key === 'fullDay' ? 'full_day' : slotInfo.key,
                                                        reason: 'Blocked by Vendor',
                                                    });
                                                    setShowBlockModal(true);
                                                }}
                                                className="px-3 py-1.5 bg-slate-200 text-slate-800 hover:bg-slate-300 text-xs font-bold rounded-xl transition"
                                            >
                                                Block Slot
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-slate-100">
                            <button
                                onClick={() => {
                                    offlineForm.setData({
                                        ...offlineForm.data,
                                        hall_id: selectedHallId || halls[0]?.id,
                                        event_date: activeDateModal.dateStr,
                                    });
                                    setShowOfflineModal(true);
                                }}
                                className="px-4 py-2 bg-emerald-600 text-white hover:bg-emerald-500 font-bold text-xs rounded-xl shadow-sm transition"
                            >
                                + Add Offline Booking
                            </button>
                            <button
                                onClick={() => setActiveDateModal(null)}
                                className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 font-bold text-xs rounded-xl transition"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL: Block Date / Slot */}
            {showBlockModal && (
                <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-white rounded-3xl p-6 max-w-md w-full border border-slate-200 shadow-2xl">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">🚫 Block Date or Slot</h3>
                        <form onSubmit={handleBlockSubmit} className="space-y-4">
                            <div>
                                <InputLabel value="Select Date *" />
                                <TextInput
                                    type="date"
                                    className="mt-1 block w-full"
                                    value={blockForm.data.date}
                                    onChange={(e) => blockForm.setData('date', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <InputLabel value="Select Slot *" />
                                <select
                                    className="mt-1 block w-full border-slate-300 rounded-xl text-sm font-semibold"
                                    value={blockForm.data.slot}
                                    onChange={(e) => blockForm.setData('slot', e.target.value)}
                                >
                                    <option value="morning">Morning Slot</option>
                                    <option value="evening">Evening Slot</option>
                                    <option value="full_day">Full Day</option>
                                </select>
                            </div>
                            <div>
                                <InputLabel value="Reason for Blocking" />
                                <TextInput
                                    className="mt-1 block w-full"
                                    value={blockForm.data.reason}
                                    onChange={(e) => blockForm.setData('reason', e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowBlockModal(false)} className="text-xs font-bold text-slate-500">
                                    Cancel
                                </button>
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
                                    <TextInput
                                        className="mt-1 block w-full"
                                        value={offlineForm.data.customer_name}
                                        onChange={(e) => offlineForm.setData('customer_name', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Phone Number *" />
                                    <TextInput
                                        className="mt-1 block w-full"
                                        value={offlineForm.data.customer_phone}
                                        onChange={(e) => offlineForm.setData('customer_phone', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Event Type *" />
                                    <select
                                        className="mt-1 block w-full border-slate-300 rounded-xl text-sm font-semibold"
                                        value={offlineForm.data.event_type}
                                        onChange={(e) => offlineForm.setData('event_type', e.target.value)}
                                    >
                                        <option value="Wedding">Wedding</option>
                                        <option value="Reception">Reception</option>
                                        <option value="Birthday">Birthday Party</option>
                                        <option value="Corporate">Corporate Event</option>
                                    </select>
                                </div>
                                <div>
                                    <InputLabel value="Event Date *" />
                                    <TextInput
                                        type="date"
                                        className="mt-1 block w-full"
                                        value={offlineForm.data.event_date}
                                        onChange={(e) => offlineForm.setData('event_date', e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Slot *" />
                                    <select
                                        className="mt-1 block w-full border-slate-300 rounded-xl text-sm font-semibold"
                                        value={offlineForm.data.slot}
                                        onChange={(e) => offlineForm.setData('slot', e.target.value)}
                                    >
                                        <option value="morning">Morning</option>
                                        <option value="evening">Evening</option>
                                        <option value="full_day">Full Day</option>
                                    </select>
                                </div>
                                <div>
                                    <InputLabel value="Guest Count" />
                                    <TextInput
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={offlineForm.data.guest_count}
                                        onChange={(e) => offlineForm.setData('guest_count', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <InputLabel value="Total Amount (₹) *" />
                                    <TextInput
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={offlineForm.data.booking_amount}
                                        onChange={(e) => offlineForm.setData('booking_amount', e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <InputLabel value="Advance Paid (₹)" />
                                    <TextInput
                                        type="number"
                                        className="mt-1 block w-full"
                                        value={offlineForm.data.advance_amount}
                                        onChange={(e) => offlineForm.setData('advance_amount', e.target.value)}
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                                <button type="button" onClick={() => setShowOfflineModal(false)} className="text-xs font-bold text-slate-500">
                                    Cancel
                                </button>
                                <PrimaryButton className="bg-emerald-600 hover:bg-emerald-500">Save Booking &amp; Block Calendar</PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </VendorLayout>
    );
}

