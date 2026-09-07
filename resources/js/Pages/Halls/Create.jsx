import VendorLayout from '@/Layouts/VendorLayout';
import { Head, useForm, Link } from '@inertiajs/react';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
        capacity: '',
        location: '',
        base_price: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('vendor.halls.store'));
    };

    return (
        <VendorLayout
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Add New Hall</h2>}
        >
            <Head title="Add Hall" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <form onSubmit={submit} className="max-w-2xl mx-auto space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Hall Name" />
                                    <TextInput
                                        id="name"
                                        className="mt-1 block w-full"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                    <InputError message={errors.name} className="mt-2" />
                                </div>

                                <div>
                                    <InputLabel htmlFor="description" value="Description" />
                                    <textarea
                                        id="description"
                                        className="mt-1 block w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        rows="4"
                                        required
                                    />
                                    <InputError message={errors.description} className="mt-2" />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <InputLabel htmlFor="capacity" value="Capacity (Max Guests)" />
                                        <TextInput
                                            id="capacity"
                                            type="number"
                                            className="mt-1 block w-full"
                                            value={data.capacity}
                                            onChange={(e) => setData('capacity', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.capacity} className="mt-2" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="base_price" value="Base Price (₹ per day)" />
                                        <TextInput
                                            id="base_price"
                                            type="number"
                                            className="mt-1 block w-full"
                                            value={data.base_price}
                                            onChange={(e) => setData('base_price', e.target.value)}
                                            required
                                        />
                                        <InputError message={errors.base_price} className="mt-2" />
                                    </div>
                                </div>

                                <div>
                                    <InputLabel htmlFor="location" value="Location / Address" />
                                    <TextInput
                                        id="location"
                                        className="mt-1 block w-full"
                                        value={data.location}
                                        onChange={(e) => setData('location', e.target.value)}
                                        required
                                    />
                                    <InputError message={errors.location} className="mt-2" />
                                </div>

                                <div className="flex items-center gap-4 border-t pt-6">
                                    <PrimaryButton disabled={processing}>Submit for Review</PrimaryButton>
                                    <Link href={route('vendor.halls.index')} className="text-gray-600 hover:text-gray-900 underline text-sm">Cancel</Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </VendorLayout>
    );
}
