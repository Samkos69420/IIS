<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class walk_booking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'walk_id',
        'approved',
        'booking_date',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function walkPlan()
    {
        return $this->belongsTo(walk_plan::class, 'walk_id');
    }
}
