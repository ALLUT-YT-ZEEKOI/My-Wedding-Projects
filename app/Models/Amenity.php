<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Amenity extends Model
{
    //

    protected $fillable = ['name', 'icon'];
    public function halls() { return $this->belongsToMany(Hall::class, 'hall_amenities'); }
}