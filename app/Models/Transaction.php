<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;
use App\Observers\TransactionObserver;


#[ObservedBy([TransactionObserver::class])]
class Transaction extends Model
{
    use HasFactory;
    protected $fillable = [
        'amount',
        'idUserExp',
        'idUserDest',
        'type',
        'idOperator',
    ];
}
