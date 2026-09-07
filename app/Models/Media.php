<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Media extends Model
{
    //

    protected $fillable = ['hall_id', 'type', 'file_path', 'is_featured'];
    protected $table = 'media';
    public function hall() { return $this->belongsTo(Hall::class); }
}