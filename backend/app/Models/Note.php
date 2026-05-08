<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Note extends Model
{
    protected $fillable = ['user_id', 'content', 'color', 'x', 'y', 'rotation'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
