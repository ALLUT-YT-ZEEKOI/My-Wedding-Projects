import VendorLayout from '@/Layouts/VendorLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import { useState } from 'react';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import PrimaryButton from '@/Components/PrimaryButton';

export default function Edit({ hall, allAmenities }) {
    const [activeTab, setActiveTab] = useState('profile');
    const [customAmenityName, setCustomAmenityName] = useState('');

    const { data, setData, post, processing, errors } = useForm({
        _method: 'put',
        name: hall.name || '',
        hall_type: hall.hall_type || 'Banquet Hall',
        description: hall.description || '',
        contact_number: hall.contact_number || '',
        email: hall.email || '',
        address: hall.address || '',
        city: hall.city || '',
        area: hall.area || '',
        pincode: hall.pincode || '',
        map_url: hall.map_url || '',
        landmark: hall.landmark || '',
        video_url: hall.video_url || '',
        cover_photo: null, // Keep null to not send string, we only send file if changed

        // Capacity
        seating_capacity: hall.seating_capacity || hall.capacity || 500,
        dining_capacity: hall.dining_capacity || 300,
        floating_capacity: hall.floating_capacity || 700,
        min_guests: hall.min_guests || 100,
        max_guests: hall.max_guests || 800,

        // Pricing
        pricing: {
            base_price: hall.pricing?.base_price || 50000,
            morning_price: hall.pricing?.morning_price || 20000,
            evening_price: hall.pricing?.evening_price || 30000,
            full_day_price: hall.pricing?.full_day_price || 50000,
            weekday_price: hall.pricing?.weekday_price || 45000,
            weekend_price: hall.pricing?.weekend_price || 60000,
            holiday_price: hall.pricing?.holiday_price || 65000,
            security_deposit: hall.pricing?.security_deposit || 10000,
            extra_hour_charge: hall.pricing?.extra_hour_charge || 2000,
            cleaning_charge: hall.pricing?.cleaning_charge || 3000,
            electricity_charge: hall.pricing?.electricity_charge || 0,
            room_charge: hall.pricing?.room_charge || 1500,
            other_charges: hall.pricing?.other_charges || 0,
        },

        // Policy
        policy: {
            event_timing: hall.policy?.event_timing || '08:00 AM - 11:00 PM',
            max_duration: hall.policy?.max_duration || '12 Hours',
            noise_rules: hall.policy?.noise_rules || 'Music allowed till 10:00 PM',
            decoration_rules: hall.policy?.decoration_rules || 'Only fire-proof decor materials allowed',
            damage_policy: hall.policy?.damage_policy || 'Deducted from Security Deposit',
            security_rules: hall.policy?.security_rules || 'CCTV & Security guards active',
            veg_allowed: hall.policy?.veg_allowed ?? true,
            non_veg_allowed: hall.policy?.non_veg_allowed ?? true,
            outside_catering_allowed: hall.policy?.outside_catering_allowed ?? true,
            inhouse_catering_available: hall.policy?.inhouse_catering_available ?? false,
            outside_decorator_allowed: hall.policy?.outside_decorator_allowed ?? true,
            inhouse_decorator_available: hall.policy?.inhouse_decorator_available ?? false,
            alcohol_policy: hall.policy?.alcohol_policy || 'Permitted with Excise License',
            music_policy: hall.policy?.music_policy || 'Allowed till 10:00 PM',
            fireworks_policy: hall.policy?.fireworks_policy || 'Cold pyros outdoors only',
            parking_rules: hall.policy?.parking_rules || 'Valet parking available',
        },

        // Amenities
        amenities: hall.amenities?.map(a => a.id) || [],
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('vendor.halls.update', hall.id));
    };

    const toggleAmenity = (id) => {
        const current = [...data.amenities];
        if (current.includes(id)) {
            setData('amenities', current.filter(a => a !== id));
        } else {
            setData('amenities', [...current, id]);
        }
    };

    const { post: postCustom } = useForm();
    const handleAddCustomAmenity = (e) => {
        e.preventDefault();
        if (!customAmenityName.trim()) return;
        postCustom(route('vendor.halls.custom-amenity'), {
            data: { name: customAmenityName },
            onSuccess: () => setCustomAmenityName('')
        });
    };

    return (
        <VendorLayout
            header={
                <div className="flex justify-between items-center w-full">
                    <div>
                        <h2 className="font-bold text-xl text-slate-900 leading-tight">Edit Hall: {hall.name}</h2>
                        <p className="text-xs text-slate-500">Update capacity, photos, policies, amenities & pricing.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href={route('vendor.halls.preview', hall.id)}
                            className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 font-bold text-xs shadow-xs hover:bg-slate-50"
                        >
                            👁️ Preview Customer View
                        </Link>
                        <PrimaryButton onClick={submit} disabled={processing} className="bg-indigo-600 hover:bg-indigo-500">
                            Save Changes
                        </PrimaryButton>
                    </div>
                </div>
            }
        >
            <Head title={`Edit - ${hall.name}`} />

            {/* Navigation Tabs */}
            <div className="flex space-x-2 border-b border-slate-200 mb-8 bg-white p-2 rounded-xl shadow-xs">
                {[
                    { id: 'profile', label: 'Basic Profile & Location', icon: '🏛️' },
                    { id: 'capacity', label: 'Capacity Breakdown', icon: '👥' },
                    { id: 'photos', label: 'Photos & Video', icon: '📷' },
                    { id: 'amenities', label: 'Amenities & Facilities', icon: '✨' },
                    { id: 'policies', label: 'Rules & Policies', icon: '📜' },
                    { id: 'pricing', label: 'Slot Pricing & Charges', icon: '💰' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                            activeTab === tab.id
                                ? 'bg-indigo-600 text-white shadow-sm'
                                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                    >
                        <span>{tab.icon}</span> {tab.label}
                    </button>
                ))}
            </div>

            <form onSubmit={submit} className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-8">
                
                {/* TAB 1: PROFILE & LOCATION */}
                {activeTab === 'profile' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Basic Info & Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel value="Hall Name *" />
                                <TextInput className="mt-1 block w-full" value={data.name} onChange={e => setData('name', e.target.value)} required />
                            </div>
                            <div>
                                <InputLabel value="Hall Type *" />
                                <select className="mt-1 block w-full border-slate-300 rounded-lg shadow-xs text-sm" value={data.hall_type} onChange={e => setData('hall_type', e.target.value)}>
                                    <option value="Banquet Hall">Banquet Hall</option>
                                    <option value="Marriage Lawn">Marriage Lawn</option>
                                    <option value="Luxury AC Hall">Luxury AC Hall</option>
                                    <option value="Resort Venue">Resort Venue</option>
                                </select>
                            </div>
                            <div className="md:col-span-2">
                                <InputLabel value="Description *" />
                                <textarea rows="4" className="mt-1 block w-full border-slate-300 rounded-lg shadow-xs text-sm" value={data.description} onChange={e => setData('description', e.target.value)} required />
                            </div>
                            <div>
                                <InputLabel value="Contact Phone *" />
                                <TextInput className="mt-1 block w-full" value={data.contact_number} onChange={e => setData('contact_number', e.target.value)} required />
                            </div>
                            <div>
                                <InputLabel value="Email" />
                                <TextInput className="mt-1 block w-full" value={data.email} onChange={e => setData('email', e.target.value)} />
                            </div>
                            <div className="md:col-span-2">
                                <InputLabel value="Full Address *" />
                                <TextInput className="mt-1 block w-full" value={data.address} onChange={e => setData('address', e.target.value)} />
                            </div>
                            <div>
                                <InputLabel value="Searchable Location / City *" />
                                <TextInput className="mt-1 block w-full" value={data.city} onChange={e => setData('city', e.target.value)} placeholder="e.g. Kochi, Ernakulam" required />
                                <p className="text-[10px] text-slate-500 mt-1">Customers will search for your hall using this location.</p>
                            </div>
                            <div>
                                <InputLabel value="Specific Area / Landmark" />
                                <TextInput className="mt-1 block w-full" value={data.area} onChange={e => setData('area', e.target.value)} placeholder="e.g. Edappally, Kakkanad" />
                            </div>
                            <div>
                                <InputLabel value="Google Map Embed / Link URL" />
                                <TextInput className="mt-1 block w-full" value={data.map_url} onChange={e => setData('map_url', e.target.value)} placeholder="https://maps.google.com/..." />
                            </div>
                            <div>
                                <InputLabel value="Landmark" />
                                <TextInput className="mt-1 block w-full" value={data.landmark} onChange={e => setData('landmark', e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 2: CAPACITY */}
                {activeTab === 'capacity' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Seating & Dining Capacity Breakdown</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <InputLabel value="Seating Capacity (Guests)" />
                                <TextInput type="number" className="mt-1 block w-full" value={data.seating_capacity} onChange={e => setData('seating_capacity', e.target.value)} />
                            </div>
                            <div>
                                <InputLabel value="Dining Capacity (Guests)" />
                                <TextInput type="number" className="mt-1 block w-full" value={data.dining_capacity} onChange={e => setData('dining_capacity', e.target.value)} />
                            </div>
                            <div>
                                <InputLabel value="Floating Capacity (Guests)" />
                                <TextInput type="number" className="mt-1 block w-full" value={data.floating_capacity} onChange={e => setData('floating_capacity', e.target.value)} />
                            </div>
                            <div>
                                <InputLabel value="Minimum Guest Limit" />
                                <TextInput type="number" className="mt-1 block w-full" value={data.min_guests} onChange={e => setData('min_guests', e.target.value)} />
                            </div>
                            <div>
                                <InputLabel value="Maximum Guest Limit" />
                                <TextInput type="number" className="mt-1 block w-full" value={data.max_guests} onChange={e => setData('max_guests', e.target.value)} />
                            </div>
                        </div>
                    </div>
                )}

                {/* TAB 3: PHOTOS & VIDEO */}
                {activeTab === 'photos' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Hall Photos & Video Link</h3>
                        <div>
                            <InputLabel htmlFor="cover_photo" value="Upload New Cover Photo (Leaves existing if blank)" />
                            <input
                                type="file"
                                id="cover_photo"
                                accept="image/*"
                                className="mt-1 block w-full border border-slate-300 rounded-lg shadow-xs focus:border-indigo-500 focus:ring-indigo-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                onChange={(e) => setData('cover_photo', e.target.files[0])}
                            />
                            {errors?.cover_photo && <p className="mt-2 text-sm text-red-600">{errors.cover_photo}</p>}
                            {hall.cover_photo && (
                                <div className="mt-3">
                                    <p className="text-xs text-slate-500 mb-1">Current Photo:</p>
                                    <img src={hall.cover_photo} alt="Current Cover" className="w-full h-48 object-cover rounded-xl border border-slate-200" />
                                </div>
                            )}
                        </div>
                        <div>
                            <InputLabel value="Hall Video Embed URL (YouTube/Vimeo)" />
                            <TextInput className="mt-1 block w-full" value={data.video_url} onChange={e => setData('video_url', e.target.value)} placeholder="https://youtube.com/embed/..." />
                        </div>
                    </div>
                )}

                {/* TAB 4: AMENITIES & FACILITIES */}
                {activeTab === 'amenities' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                            <h3 className="text-lg font-bold text-slate-900">Select Available Facilities</h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="+ Add Custom Facility"
                                    className="text-xs border-slate-300 rounded-lg px-3 py-1.5"
                                    value={customAmenityName}
                                    onChange={e => setCustomAmenityName(e.target.value)}
                                />
                                <button type="button" onClick={handleAddCustomAmenity} className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold">
                                    Add
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {allAmenities.map((amenity) => {
                                const checked = data.amenities.includes(amenity.id);
                                return (
                                    <button
                                        key={amenity.id}
                                        type="button"
                                        onClick={() => toggleAmenity(amenity.id)}
                                        className={`p-3.5 rounded-xl border text-left flex items-center gap-3 transition-all ${
                                            checked ? 'border-indigo-600 bg-indigo-50/50 font-bold text-indigo-900' : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                                        }`}
                                    >
                                        <div className={`w-5 h-5 rounded-md flex items-center justify-center text-xs ${checked ? 'bg-indigo-600 text-white' : 'border border-slate-300'}`}>
                                            {checked && '✓'}
                                        </div>
                                        <span className="text-xs font-semibold">{amenity.name}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* TAB 5: POLICIES */}
                {activeTab === 'policies' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Catering, Decoration & Timing Policies</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <InputLabel value="Event Timing Window" />
                                <TextInput className="mt-1 block w-full" value={data.policy.event_timing} onChange={e => setData('policy', {...data.policy, event_timing: e.target.value})} />
                            </div>
                            <div>
                                <InputLabel value="Max Duration" />
                                <TextInput className="mt-1 block w-full" value={data.policy.max_duration} onChange={e => setData('policy', {...data.policy, max_duration: e.target.value})} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-100">
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                <input type="checkbox" checked={data.policy.veg_allowed} onChange={e => setData('policy', {...data.policy, veg_allowed: e.target.checked})} className="rounded text-indigo-600" />
                                Veg Food Allowed
                            </label>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                <input type="checkbox" checked={data.policy.non_veg_allowed} onChange={e => setData('policy', {...data.policy, non_veg_allowed: e.target.checked})} className="rounded text-indigo-600" />
                                Non-Veg Allowed
                            </label>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                <input type="checkbox" checked={data.policy.outside_catering_allowed} onChange={e => setData('policy', {...data.policy, outside_catering_allowed: e.target.checked})} className="rounded text-indigo-600" />
                                Outside Catering
                            </label>
                            <label className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                <input type="checkbox" checked={data.policy.outside_decorator_allowed} onChange={e => setData('policy', {...data.policy, outside_decorator_allowed: e.target.checked})} className="rounded text-indigo-600" />
                                Outside Decorator
                            </label>
                        </div>
                    </div>
                )}

                {/* TAB 6: PRICING */}
                {activeTab === 'pricing' && (
                    <div className="space-y-6">
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Slot Pricing & Additional Charges (₹)</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <InputLabel value="Morning Price (₹)" />
                                <TextInput type="number" className="mt-1 block w-full" value={data.pricing.morning_price} onChange={e => setData('pricing', {...data.pricing, morning_price: e.target.value})} />
                            </div>
                            <div>
                                <InputLabel value="Evening Price (₹)" />
                                <TextInput type="number" className="mt-1 block w-full" value={data.pricing.evening_price} onChange={e => setData('pricing', {...data.pricing, evening_price: e.target.value})} />
                            </div>
                            <div>
                                <InputLabel value="Full Day Price (₹) *" />
                                <TextInput type="number" className="mt-1 block w-full" value={data.pricing.full_day_price} onChange={e => setData('pricing', {...data.pricing, full_day_price: e.target.value, base_price: e.target.value})} required />
                            </div>
                            <div>
                                <InputLabel value="Weekend Price (₹)" />
                                <TextInput type="number" className="mt-1 block w-full" value={data.pricing.weekend_price} onChange={e => setData('pricing', {...data.pricing, weekend_price: e.target.value})} />
                            </div>
                            <div>
                                <InputLabel value="Security Deposit (₹)" />
                                <TextInput type="number" className="mt-1 block w-full" value={data.pricing.security_deposit} onChange={e => setData('pricing', {...data.pricing, security_deposit: e.target.value})} />
                            </div>
                            <div>
                                <InputLabel value="Extra Hour Charge (₹)" />
                                <TextInput type="number" className="mt-1 block w-full" value={data.pricing.extra_hour_charge} onChange={e => setData('pricing', {...data.pricing, extra_hour_charge: e.target.value})} />
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-8 pt-6 border-t border-slate-100 flex justify-end gap-3">
                    <PrimaryButton disabled={processing} className="bg-indigo-600 hover:bg-indigo-500">
                        Save Changes
                    </PrimaryButton>
                </div>
            </form>
        </VendorLayout>
    );
}
