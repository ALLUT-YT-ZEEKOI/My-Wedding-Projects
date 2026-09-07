<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'booking_code', 'hall_id', 'vendor_id', 'customer_id',
        'customer_name', 'customer_phone', 'customer_email',
        'event_type', 'event_date', 'slot', 'guest_count',
        'booking_amount', 'advance_amount', 'remaining_amount',
        'payment_status', 'status', 'booking_type', 'notes'
    ];

    public function hall()
    {
        return $this->belongsTo(Hall::class);
    }

    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    public function customer()
    {
        return $this->belongsTo(User::class, 'customer_id');
    }
}
