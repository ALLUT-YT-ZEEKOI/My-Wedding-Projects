<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\SubscriptionPlan;

class SubscriptionPlanSeeder extends Seeder
{
    public function run(): void
    {
        SubscriptionPlan::create([
            'name' => 'Founding Vendor Plan',
            'price' => 200.00,
            'billing_cycle' => 'yearly',
            'features' => [
                'Hall profile',
                'Photos',
                'Basic availability',
                'Pricing',
                'Enquiries',
                'Booking management'
            ]
        ]);
        
        SubscriptionPlan::create([
            'name' => 'Pro Plan',
            'price' => 999.00,
            'billing_cycle' => 'yearly',
            'features' => []
        ]);
        
        SubscriptionPlan::create([
            'name' => 'Premium Plan',
            'price' => 2499.00,
            'billing_cycle' => 'yearly',
            'features' => []
        ]);
    }
}
