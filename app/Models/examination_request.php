<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class examination_request extends Model
{
    use HasFactory;

    protected $fillable = [
        'animal_id',
        'vet_id',
        'creation_date',
        'description',
    ];

    public function animal()
    {
        return $this->belongsTo(Animal::class);
    }

    public function vet()
    {
        return $this->belongsTo(User::class);
    }

    public function examinations()
    {
        return $this->hasMany(Examination::class, 'request_id');
    }
}
