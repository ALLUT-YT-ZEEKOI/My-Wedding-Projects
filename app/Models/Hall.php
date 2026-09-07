<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Hall extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_id', 'name', 'hall_type', 'description', 'capacity', 'location',
        'contact_number', 'email', 'address', 'city', 'area', 'pincode', 'map_url', 'landmark',
        'seating_capacity', 'dining_capacity', 'floating_capacity', 'min_guests', 'max_guests',
        'status', 'cover_photo', 'video_url', 'rejection_reason', 'latitude', 'longitude'
    ];

    public function vendor()
    {
        return $this->belongsTo(User::class, 'vendor_id');
    }

    public function pricing()
    {
        return $this->hasOne(HallPricing::class);
    }

    public function policy()
    {
        return $this->hasOne(HallPolicy::class);
    }

    public function amenities()
    {
        return $this->belongsToMany(Amenity::class, 'hall_amenities');
    }

    public function media()
    {
        return $this->hasMany(Media::class);
    }

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }

    public function availabilities()
    {
        return $this->hasMany(HallAvailability::class);
    }

    public function reviews()
    {
        return $this->hasMany(Review::class);
    }
}