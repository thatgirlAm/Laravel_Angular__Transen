<?php

namespace App\Observers;

use App\Http\Controllers\UserController;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
class TransactionObserver
{
    /**
     * Handle the Transaction "created" event.
     */
    public function created(Transaction $transaction): void
    {
        $exp = User::find($transaction->exp);
        $dest = User::find($transaction->dest);
        $exp->balance -= $transaction->amount;
        $dest->balance += $transaction->amount;     
        $dest->save();  
        $exp->save();
    }

    /**
     * Handle the Transaction "updated" event.
     */
    public function updated(Transaction $transaction): void
    {
        //
    }

    /**
     * Handle the Transaction "deleted" event.
     */


     //--Reverse--//
    public function deleted(Transaction $transaction): void
    {
        $exp = User::find($transaction->idUserExp);
        if($transaction->type=="transfert"){
            $dest = User::find($transaction->idUserDest);
            $dest->balance -= $transaction->amount;
        }
        $exp->balance += $transaction->amount; 
}
    /**
     * Handle the Transaction "restored" event.
     */
    public function restored(Transaction $transaction): void
    {
        //
    }

    /**
     * Handle the Transaction "force deleted" event.
     */
    public function forceDeleted(Transaction $transaction): void
    {
        //
    }
}