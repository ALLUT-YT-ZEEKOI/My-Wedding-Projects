<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = [
        'hall_id',
        'vendor_id',
        'customer_id',
        'user_id',
        'customer_name',
        'rating',
        'review_text',
        'comment',
        'status',
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'customer_id')->withDefault(['name' => $this->customer_name ?? 'Customer']);
    }

    public function hall()
    {
        return $this->belongsTo(Hall::class);
    }
}
