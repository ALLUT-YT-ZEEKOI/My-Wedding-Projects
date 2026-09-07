<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'user_name',
        'action',
        'subject_type',
        'subject_id',
        'details',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public static function log($action, $module, $description = null)
    {
        return self::create([
            'user_id' => auth()->id(),
            'user_name' => auth()->user()?->name ?? 'System',
            'action' => $action,
            'subject_type' => $module,
            'details' => $description,
        ]);
    }

    public function getModuleAttribute()
    {
        return $this->attributes['subject_type'] ?? 'System';
    }

    public function getDescriptionAttribute()
    {
        return $this->attributes['details'] ?? '';
    }
}
