<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class examination_record extends Model
{
    use HasFactory;

    protected $fillable = [
        'animal_id',
        'vet_id',
        'examination_date',
        'examination_type',
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



}
