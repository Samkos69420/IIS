<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WalkBooking extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'animal_id',
        'start',
        'end',
        'status',
        'booking_date',
        'available',
        'approved',
    ];

    /**
     * Relationships
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function animal()
    {
        return $this->belongsTo(Animal::class);
    }
}

