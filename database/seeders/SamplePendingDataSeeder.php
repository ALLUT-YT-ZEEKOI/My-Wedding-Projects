<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\VendorProfile;
use App\Models\Hall;
use App\Models\Booking;
use App\Models\HallAvailability;
use App\Models\Amenity;
use App\Models\SubscriptionPlan;
use App\Models\Plan;
use App\Models\Subscription;
use App\Models\Payment;
use App\Models\Refund;
use App\Models\Review;
use App\Models\Offer;
use App\Models\SupportTicket;
use App\Models\Notification;
use App\Models\ActivityLog;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Carbon;

class SamplePendingDataSeeder extends Seeder
{
    public function run(): void
    {
        $adminRole = Role::firstOrCreate(['name' => 'Admin']);
        $vendorRole = Role::firstOrCreate(['name' => 'Vendor']);
        $customerRole = Role::firstOrCreate(['name' => 'Customer']);

        // Admin User
        $adminUser = User::firstOrCreate(
            ['email' => 'admin@myhall.com'],
            ['name' => 'Super Admin', 'password' => bcrypt('password')]
        );
        $adminUser->assignRole($adminRole);

        // 1. Seed Default Amenities
        $amenityNames = [
            'Air Conditioning (AC)', 'Parking Space', 'Power Backup Generator',
            'In-house Kitchen', 'Dining Area', 'Decorated Stage', 'Bridal Room',
            'Guest Rooms', 'Clean Washrooms', 'Elevator / Lift', 'Wheelchair Access',
            'High-speed Wi-Fi', 'Professional Sound System', 'Security & CCTV'
        ];
        foreach ($amenityNames as $name) {
            Amenity::firstOrCreate(['name' => $name], ['icon' => 'SparklesIcon']);
        }

        // 2. Vendor User 1 (Approved)
        $vendorUser = User::firstOrCreate(
            ['email' => 'royalhall@vendor.com'],
            [
                'name' => 'Royal Palace Events',
                'password' => bcrypt('password'),
            ]
        );
        $vendorUser->assignRole($vendorRole);

        $vendorProfile1 = VendorProfile::firstOrCreate(
            ['user_id' => $vendorUser->id],
            [
                'business_name' => 'Royal Palace Grand Ballroom',
                'phone' => '+91 98765 43210',
                'verification_status' => 'approved',
            ]
        );

        // 2b. Vendor User 2 (Pending)
        $pendingVendorUser = User::firstOrCreate(
            ['email' => 'majestic@vendor.com'],
            ['name' => 'Majestic Hospitality', 'password' => bcrypt('password')]
        );
        $pendingVendorUser->assignRole($vendorRole);

        VendorProfile::firstOrCreate(
            ['user_id' => $pendingVendorUser->id],
            [
                'business_name' => 'Majestic Imperial Halls',
                'phone' => '+91 91122 33445',
                'verification_status' => 'pending',
            ]
        );

        // 3. Hall Listing 1 (Live)
        $hall = Hall::firstOrCreate(
            ['name' => 'The Crystal Banquet Hall', 'vendor_id' => $vendorUser->id],
            [
                'hall_type' => 'Luxury AC Hall',
                'description' => 'A luxury grand ballroom with chandelier lighting, climate control, and seating for 750 guests.',
                'contact_number' => '+91 98765 43210',
                'email' => 'booking@crystalhall.com',
                'address' => '127 Grand Expressway, Bandra West',
                'city' => 'Mumbai',
                'area' => 'Bandra West',
                'pincode' => '400050',
                'capacity' => 750,
                'seating_capacity' => 500,
                'dining_capacity' => 300,
                'floating_capacity' => 750,
                'min_guests' => 100,
                'max_guests' => 800,
                'location' => 'Bandra West, Mumbai',
                'cover_photo' => 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80',
                'status' => 'live',
            ]
        );

        // Attach Amenities
        $allAmenityIds = Amenity::pluck('id')->toArray();
        $hall->amenities()->sync($allAmenityIds);

        // Pricing
        $hall->pricing()->firstOrCreate([
            'base_price' => 50000.00,
            'morning_price' => 20000.00,
            'evening_price' => 35000.00,
            'full_day_price' => 50000.00,
            'weekday_price' => 45000.00,
            'weekend_price' => 60000.00,
            'security_deposit' => 10000.00,
            'pricing_type' => 'per_day'
        ]);

        // Policy
        $hall->policy()->firstOrCreate([
            'event_timing' => '08:00 AM - 11:00 PM',
            'veg_allowed' => true,
            'non_veg_allowed' => true,
            'outside_catering_allowed' => true,
            'outside_decorator_allowed' => true,
            'alcohol_policy' => 'Permitted with Excise License',
            'music_policy' => 'Allowed till 10:00 PM',
        ]);

        // 3b. Hall Listing 2 (Pending Review)
        $pendingHall = Hall::firstOrCreate(
            ['name' => 'The Pearl Convention Center', 'vendor_id' => $vendorUser->id],
            [
                'hall_type' => 'Convention Hall',
                'description' => 'A spacious multi-purpose venue perfect for grand weddings and business conventions.',
                'contact_number' => '+91 98765 43210',
                'email' => 'pearl@crystalhall.com',
                'address' => '54 Sea Face Road',
                'city' => 'Mumbai',
                'capacity' => 1200,
                'location' => 'Worli, Mumbai',
                'status' => 'pending_review',
            ]
        );

        // 4. Customer User
        $customerUser = User::firstOrCreate(
            ['email' => 'customer@myhall.com'],
            [
                'name' => 'John Customer',
                'password' => bcrypt('password'),
            ]
        );
        $customerUser->assignRole($customerRole);

        // 5. Seed Bookings & Payments
        $b1 = Booking::firstOrCreate(
            ['booking_code' => 'BK-1001'],
            [
                'hall_id' => $hall->id,
                'vendor_id' => $vendorUser->id,
                'customer_id' => $customerUser->id,
                'customer_name' => 'John Customer',
                'customer_phone' => '+91 98989 89898',
                'customer_email' => 'customer@myhall.com',
                'event_type' => 'Wedding',
                'event_date' => Carbon::now()->addDays(5)->toDateString(),
                'slot' => 'full_day',
                'guest_count' => 400,
                'booking_amount' => 50000.00,
                'advance_amount' => 20000.00,
                'remaining_amount' => 30000.00,
                'payment_status' => 'partial',
                'status' => 'confirmed',
                'booking_type' => 'online',
            ]
        );

        Payment::firstOrCreate(
            ['transaction_id' => 'TXN-RZP-991823'],
            [
                'booking_id' => $b1->id,
                'user_id' => $customerUser->id,
                'amount' => 20000.00,
                'payment_method' => 'Razorpay UPI',
                'status' => 'completed',
            ]
        );

        HallAvailability::firstOrCreate(
            ['hall_id' => $hall->id, 'date' => $b1->event_date, 'slot' => 'full_day'],
            ['status' => 'booked', 'booking_id' => $b1->id, 'reason' => 'Confirmed Online Booking']
        );

        // 6. Plans & Subscriptions
        Plan::firstOrCreate(
            ['name' => 'Founding Vendor Plan'],
            [
                'price' => 200.00,
                'billing_cycle' => 'yearly',
                'hall_limit' => 2,
                'features' => ['Full Hall Listing', 'Calendar & Bookings', 'Finance Tracker'],
            ]
        );

        Plan::firstOrCreate(
            ['name' => 'Pro Vendor Tier'],
            [
                'price' => 999.00,
                'billing_cycle' => 'yearly',
                'hall_limit' => 5,
                'features' => ['Priority Verification', '5 Halls Limit', 'Analytics'],
            ]
        );

        Subscription::firstOrCreate(
            ['vendor_profile_id' => $vendorProfile1->id],
            [
                'plan_name' => 'Founding Vendor Plan',
                'amount' => 200.00,
                'billing_cycle' => 'yearly',
                'starts_at' => Carbon::now()->toDateString(),
                'ends_at' => Carbon::now()->addYear()->toDateString(),
                'status' => 'active',
            ]
        );

        // 7. Seed Reviews, Offers, Support & Activity Logs
        Review::firstOrCreate(
            ['hall_id' => $hall->id, 'customer_id' => $customerUser->id],
            [
                'vendor_id' => $vendorUser->id,
                'customer_name' => 'John Customer',
                'rating' => 5,
                'review_text' => 'Outstanding venue! Superb AC cooling, polite staff, and beautiful lighting setup.',
                'status' => 'approved',
            ]
        );

        Offer::firstOrCreate(
            ['promo_code' => 'MYHALL10'],
            [
                'offer_name' => 'Grand Inaugural 10% Discount',
                'discount_type' => 'percentage',
                'discount_amount' => 10.00,
                'start_date' => Carbon::now()->toDateString(),
                'end_date' => Carbon::now()->addMonths(3)->toDateString(),
                'status' => 'active',
            ]
        );

        SupportTicket::firstOrCreate(
            ['ticket_code' => 'TICK-9081'],
            [
                'user_id' => $vendorUser->id,
                'user_name' => 'Royal Palace Events',
                'user_type' => 'vendor',
                'subject' => 'Need help adding extra photos',
                'description' => 'Hello admin team, I would like to upload 4K video walkthroughs for my hall. Is that supported?',
                'priority' => 'medium',
                'status' => 'open',
            ]
        );

        ActivityLog::log('Platform Initialization', 'System', 'Super Admin platform modules initialized successfully.');
    }
}
