<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HallPricing extends Model
{
    protected $fillable = [
        'hall_id', 'base_price', 'pricing_type',
        'morning_price', 'evening_price', 'full_day_price',
        'weekday_price', 'weekend_price', 'holiday_price',
        'security_deposit', 'extra_hour_charge', 'cleaning_charge',
        'electricity_charge', 'room_charge', 'other_charges'
    ];

    public function hall()
    {
        return $this->belongsTo(Hall::class);
    }
}