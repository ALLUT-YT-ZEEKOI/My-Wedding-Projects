<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class VendorProfile extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'business_name',
        'phone',
        'verification_status',
        'documents_path',
        'rejection_reason',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function halls()
    {
        return $this->hasMany(Hall::class, 'vendor_id', 'user_id');
    }

    public function subscription()
    {
        return $this->hasOne(Subscription::class, 'vendor_profile_id');
    }
}