<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class walk_plan extends Model
{
    use HasFactory;

    protected $fillable = [
        'animal_id',
        'start',
        'end',
        'available',
    ];

    public function animal()
    {
        return $this->belongsTo(Animal::class);
    }

    public function walkBookings()
    {
        return $this->hasMany(walk_booking::class, 'walk_id');
    }
}
