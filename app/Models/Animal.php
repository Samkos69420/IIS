<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Animal extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'kind',
        'age',
        'gender',
        'description',
        'date_found',
        'where_found',
        'photo_url',
    ];

    public function examinationRequests()
    {
        return $this->hasMany(examination_request::class);
    }

    public function examinationRecords()
    {
        return $this->hasMany(examination_record::class);
    }

    public function walkPlans()
    {
        return $this->hasMany(walk_plan::class);
    }
}
