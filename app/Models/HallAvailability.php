<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HallAvailability extends Model
{
    protected $fillable = [
        'hall_id', 'date', 'slot', 'status', 'reason', 'booking_id'
    ];

    public function hall()
    {
        return $this->belongsTo(Hall::class);
    }

    public function booking()
    {
        return $this->belongsTo(Booking::class);
    }
}
