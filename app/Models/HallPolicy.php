<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HallPolicy extends Model
{
    protected $fillable = [
        'hall_id', 'event_timing', 'max_duration', 'noise_rules', 'decoration_rules',
        'damage_policy', 'security_rules', 'veg_allowed', 'non_veg_allowed',
        'outside_catering_allowed', 'inhouse_catering_available',
        'outside_decorator_allowed', 'inhouse_decorator_available',
        'alcohol_policy', 'music_policy', 'fireworks_policy', 'parking_rules'
    ];

    protected $casts = [
        'veg_allowed' => 'boolean',
        'non_veg_allowed' => 'boolean',
        'outside_catering_allowed' => 'boolean',
        'inhouse_catering_available' => 'boolean',
        'outside_decorator_allowed' => 'boolean',
        'inhouse_decorator_available' => 'boolean',
    ];

    public function hall()
    {
        return $this->belongsTo(Hall::class);
    }
}
