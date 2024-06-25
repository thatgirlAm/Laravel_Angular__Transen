<?php

namespace App\Observers;

use App\Models\Transaction;
use App\Models\User;

class TransactionObserver
{
    /**
     * Handle the Transaction "created" event.
     */
    public function created(Transaction $transaction): void
    {

        $exp = User::find($transaction->idUserExp);
        if ($exp) {
            if($transaction->type=="transfert" || $transaction->type=="retrait"){
            $exp->balance -= $transaction->amount;
        }
            elseif($transaction->type=="depot"){
                $exp->balance += $transaction->amount;}
            
        $exp->save();
    }
        if ($transaction->idUserDest) {
            $dest = User::find($transaction->idUserDest);
            if ($dest) {
                $dest->balance += $transaction->amount;
                $dest->save();
            }
        }
    }

    /**
     * Handle the Transaction "updated" event.
     */
    public function updated(Transaction $transaction): void
    {
        // Logic for updated event if needed
    }

    /**
     * Handle the Transaction "deleted" event.
     */
    public function deleted(Transaction $transaction): void
    {
        //--Reverser la transaction--//
        $exp = User::find($transaction->idUserExp);
        if ($exp) {
            $exp->balance += $transaction->amount;
            $exp->save();
        }

        if ($transaction->idUserDest) {
            $dest = User::find($transaction->idUserDest);
            if ($dest) {
                $dest->balance -= $transaction->amount;
                $dest->save();
            }
        }
    }

    /**
     * Handle the Transaction "restored" event.
     */
    public function restored(Transaction $transaction): void
    {
        // Logic for restored event if needed
    }

    /**
     * Handle the Transaction "force deleted" event.
     */
    public function forceDeleted(Transaction $transaction): void
    {
        // Logic for force deleted event if needed
    }
}
