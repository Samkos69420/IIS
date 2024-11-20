<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class examination extends Model
{
    use HasFactory;

    protected $fillable = [
        'request_id',
        'examination',
    ];

    public function examinationRequest()
    {
        return $this->belongsTo(examination_request::class, 'request_id');
    }
}
