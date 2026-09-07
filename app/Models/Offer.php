<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Offer extends Model
{
    use HasFactory;

    protected $fillable = [
        'offer_name',
        'promo_code',
        'code',
        'discount_type',
        'discount_amount',
        'discount_value',
        'min_booking_amount',
        'start_date',
        'end_date',
        'valid_from',
        'valid_until',
        'max_uses',
        'is_active',
        'status',
    ];

    public function getCodeAttribute()
    {
        return $this->attributes['code'] ?? $this->attributes['promo_code'] ?? 'PROMO';
    }

    public function getDiscountValueAttribute()
    {
        return $this->attributes['discount_value'] ?? $this->attributes['discount_amount'] ?? 0;
    }

    public function getValidFromAttribute()
    {
        return $this->attributes['valid_from'] ?? $this->attributes['start_date'] ?? null;
    }

    public function getValidUntilAttribute()
    {
        return $this->attributes['valid_until'] ?? $this->attributes['end_date'] ?? null;
    }
}
