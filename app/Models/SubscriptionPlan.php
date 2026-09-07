<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SubscriptionPlan extends Model
{
    //

    protected $fillable = ['name', 'price', 'billing_cycle', 'features'];
    protected function casts(): array { return ['features' => 'array']; }
    public function vendorSubscriptions() { return $this->hasMany(VendorSubscription::class, 'plan_id'); }
}