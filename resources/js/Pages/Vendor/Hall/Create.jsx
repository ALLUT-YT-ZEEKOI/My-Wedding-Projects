import VendorLayout from '@/Layouts/VendorLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Create({ allAmenities }) {
    const { data, setData, post, processing, errors } = useForm({
        cover_photo: null,
        name: '',
        hall_type: 'Banquet Hall',
        description: '',
        contact_number: '',
        email: '',
        address: '',
        city: '',
        area: '',
        pincode: '',
        map_url: '',
        landmark: '',

        // Capacity
        seating_capacity: '500',
        dining_capacity: '300',
        floating_capacity: '700',
        min_guests: '100',
        max_guests: '800',

        // Pricing
        base_price: '50000',
        morning_price: '20000',
        evening_price: '30000',
        full_day_price: '50000',
        weekday_price: '45000',
        weekend_price: '60000',
        security_deposit: '10000',

        // Rules
        event_timing: '08:00 AM - 11:00 PM',
        veg_allowed: true,
        non_veg_allowed: true,
        outside_catering_allowed: true,
        outside_decorator_allowed: true,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('vendor.halls.store'));
    };

    return (
        <VendorLayout header="Add New Wedding Hall">
            <Head title="Create Hall Profile" />

            <div className="max-w-4xl mx-auto bg-white rounded-2xl border border-slate-200/80 shadow-xs p-8">
                <form onSubmit={submit} className="space-y-8">
                    
                    {/* Section 1: Basic Information */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
                            <span>🏛️</span> Basic Hall Information
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="md:col-span-2">
                                <InputLabel htmlFor="cover_photo" value="Cover Photo" />
                                <input
                                    type="file"
                                    id="cover_photo"
                                    accept="image/*"
                                    className="mt-1 block w-full border border-slate-300 rounded-lg shadow-xs focus:border-indigo-500 focus:ring-indigo-500 text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                                    onChange={(e) => setData('cover_photo', e.target.files[0])}
                                />
                                <InputError message={errors.cover_photo} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="name" value="Hall Name *" />
                                <TextInput
                                    id="name"
                                    className="mt-1 block w-full"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g. Royal Palace Banquet"
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>

                            <div>
                                <InputLabel htmlFor="hall_type" value="Hall Type *" />
                                <select
                                    id="hall_type"
                                    className="mt-1 block w-full border-slate-300 rounded-lg shadow-xs focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                    value={data.hall_type}
                                    onChange={(e) => setData('hall_type', e.target.value)}
                                >
                                    <option value="Banquet Hall">Banquet Hall</option>
                                    <option value="Marriage Lawn">Marriage Lawn / Garden</option>
                                    <option value="Luxury AC Hall">Luxury AC Hall</option>
                                    <option value="Resort Venue">Resort Venue</option>
                                    <option value="Convention Center">Convention Center</option>
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <InputLabel htmlFor="description" value="Description *" />
                                <textarea
                                    id="description"
                                    rows="3"
                                    className="mt-1 block w-full border-slate-300 rounded-lg shadow-xs focus:border-indigo-500 focus:ring-indigo-500 text-sm"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Describe your hall, ambiance, interior, and special features..."
                                    required
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="contact_number" value="Contact Number *" />
                                <TextInput
                                    id="contact_number"
                                    className="mt-1 block w-full"
                                    value={data.contact_number}
                                    onChange={(e) => setData('contact_number', e.target.value)}
                                    placeholder="+91 9876543210"
                                    required
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="email" value="Business Email" />
                                <TextInput
                                    id="email"
                                    type="email"
                                    className="mt-1 block w-full"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="contact@hall.com"
                                />
                            </div>

                            <div className="md:col-span-2">
                                <InputLabel htmlFor="address" value="Full Address" />
                                <TextInput
                                    id="address"
                                    className="mt-1 block w-full"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    placeholder="Street Address, Plot No."
                                />
                            </div>

                            <div>
                                <InputLabel htmlFor="city" value="Searchable Location / City *" />
                                <TextInput
                                    id="city"
                                    className="mt-1 block w-full"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    placeholder="e.g. Kochi, Ernakulam"
                                    required
                                />
                                <p className="text-[10px] text-slate-500 mt-1">Customers will search for your hall using this location.</p>
                            </div>

                            <div>
                                <InputLabel htmlFor="area" value="Specific Area / Landmark" />
                                <TextInput
                                    id="area"
                                    className="mt-1 block w-full"
                                    value={data.area}
                                    onChange={(e) => setData('area', e.target.value)}
                                    placeholder="e.g. Edappally, Kakkanad"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 2: Capacity */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
                            <span>👥</span> Hall Capacity Breakdown
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <InputLabel htmlFor="seating_capacity" value="Seating Capacity (Guests)" />
                                <TextInput
                                    id="seating_capacity"
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={data.seating_capacity}
                                    onChange={(e) => setData('seating_capacity', e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="dining_capacity" value="Dining Capacity (Guests)" />
                                <TextInput
                                    id="dining_capacity"
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={data.dining_capacity}
                                    onChange={(e) => setData('dining_capacity', e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="floating_capacity" value="Floating Capacity (Guests)" />
                                <TextInput
                                    id="floating_capacity"
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={data.floating_capacity}
                                    onChange={(e) => setData('floating_capacity', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 3: Pricing */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3 mb-6 flex items-center gap-2">
                            <span>💰</span> Slot Pricing & Deposit (₹)
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <div>
                                <InputLabel htmlFor="morning_price" value="Morning Slot Price (₹)" />
                                <TextInput
                                    id="morning_price"
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={data.morning_price}
                                    onChange={(e) => setData('morning_price', e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="evening_price" value="Evening Slot Price (₹)" />
                                <TextInput
                                    id="evening_price"
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={data.evening_price}
                                    onChange={(e) => setData('evening_price', e.target.value)}
                                />
                            </div>
                            <div>
                                <InputLabel htmlFor="full_day_price" value="Full Day Price (₹) *" />
                                <TextInput
                                    id="full_day_price"
                                    type="number"
                                    className="mt-1 block w-full"
                                    value={data.full_day_price}
                                    onChange={(e) => {
                                        setData('full_day_price', e.target.value);
                                        setData('base_price', e.target.value);
                                    }}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end gap-4 border-t border-slate-100 pt-6">
                        <Link href={route('vendor.halls.index')} className="text-sm font-semibold text-slate-600 hover:text-slate-900">
                            Cancel
                        </Link>
                        <PrimaryButton disabled={processing} className="bg-indigo-600 hover:bg-indigo-500">
                            Save Hall & Submit for Review &rarr;
                        </PrimaryButton>
                    </div>
                </form>
            </div>
        </VendorLayout>
    );
}
