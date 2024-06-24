<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Date;
use App\Http\Controllers\FormatTrait;
use App\Models\User;
use App\Http\Resources\TransactionResource;
use App\Http\Requests\TransactionRequest;
use App\Http\Requests\TransactionUpdateRequest;
use DB;
use Auth;

class TransactionController extends Controller
{
    use FormatTrait;
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return $this->format(['Index Trouvé', true, TransactionResource::collection(Transaction::all())]);

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(TransactionRequest $request)
    {
        $dest = User::where('id',$request->idUserDest)->first();
        $exp = User::find($request->idUserExp);
        if ($request->type == 'transfert') {
            if (!$dest->id || $dest->id ==0) {
                return $this->formatError("Utilisateur destinataire non trouvé");
            }}
        if ($request->type == 'transfert' || $request->type == 'retrait') {
            if ($exp->balance < $request->amount) {
                return $this->formatError("Solde insuffisant");
            }}
        
        return DB::transaction(function() use($request){
            $transaction =  Transaction::create([
            'idUserExp' => $request->idUserExp,
            'idUserDest'=>$request->idUserDest,
            'amount' => $request->amount,
            'date' => $request->date,
            'type'=>$request->type,
            'idOperator'=>$request->idOperator
            ]);
            $transactionResource = new TransactionResource($transaction);
            return $this->format(['transaction enregistrée', true, $transactionResource]) ;
     });}
    /**
     * Store a newly created resource in storage.
     */public function store(TransactionRequest $request)
    {
        $dest = null;
        if ($request->idUserDest) {
            $dest = User::find($request->idUserDest);
            if (!$dest) {
                return $this->formatError("Utilisateur destinataire non trouvé");
            }
        }
        $exp = User::find($request->idUserExp);
        if (!$exp) {
            return $this->formatError("Utilisateur expéditeur non trouvé");
        }
        if($request->type == "transfert" && !($dest->typeDeCompte == $exp->typeDeCompte)){
            return $this->formatError('Types de comptes non correspondants') ; 
        }

        if ($request->type == 'transfert' || $request->type == 'retrait') {
            if ($exp->balance < $request->amount) {
                return $this->formatError("Solde insuffisant");
            }
        }
        if($request->amount<0){
            return $this->formatError('Montant négatif');
        }

        return DB::transaction(function() use($request, $dest) {
            $transaction = Transaction::create([
                'idUserExp' => $request->idUserExp,
                'amount' => $request->amount,
                'date' => $request->date,
                'type' => $request->type,
                'idOperator' => $request->idOperator,
                'idUserDest' => $dest ? $dest->id : null,
            ]);

            $transactionResource = new TransactionResource($transaction);
            return $this->format(['transaction enregistrée', true, $transactionResource]);
        });


        
       
       
        /*  return $this->format(['Transaction enregistrée', true,Transaction::create([
            "date"=> new Date(),
            "exp"=> $request->exp, 
            "amount"=>$request->amount,
            "dest"=>$request->dest
                ])]); */
    }

    /**
     * Display the specified resource.
     */
    public function show(Transaction $transaction)
    {
        $response = TransactionResource::make($transaction);
        $data = new TransactionResource($response);
        return $this->format(['Transaction trouvée', true, $data]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Transaction $transaction)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(TransactionUpdateRequest $request, Transaction $transaction)
    {
        $operation = $request ->validate([]);
        $transaction->update($operation);
        return $this->format(['Opération mise à jour',true, $transaction]);
    }


    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Transaction $transaction)
    {

        //-----Ici, au lieu de supprimer la transaction, on la reverse simplement----//
        $transaction->reversed = 1 ; 
        $transaction->save();
        $user = Auth::user();
        
        if($transaction->type =="transfert"){
            $user->balance += $transaction->amount;
            $user->save();
        }

       // $transaction->delete(); 
        return $this->format(['Transaction reversed', true, $transaction]);
    }

    //----------------Autres fonctions-----------------//
    public function reverseTransaction(Request $request){
        $url = explode('/',$request->getPathInfo());
        $id= end($url); 
        $transaction = Transaction::find($id);  
        //$transaction = Transaction::find($request->id);
        $userDest = User::find($transaction->idUserDest);
        $balanceUserDest = $userDest->balance;
        $dateTransaction = $transaction->created_at;
        $date = new Date();
        $amount= $transaction->amount;
        if($transaction){
            if($balanceUserDest>=$amount && $dateTransaction<$date-5*60){
            $transaction->reverse1();
            return $this->format(['Reverse effectué', true, ['amount'=>$amount, 'userDest'=>$userDest]]);
            }
            else{
                return $this->formatError("Solde destinataire non suffisant");
            }
        } 
        else{
            return $this->formatError("Transaction not found");
        }
    }

    public function reverse1(Request $request){
        $transaction= Transaction::find($request->id);
        if($transaction){
            //$transaction->reversed = false; 
            $this->destroy($transaction);
        }
        $transactionRequest = new TransactionRequest($transaction);
        return $this->format(['result', true, $transactionRequest]);
        //$this->update($transactionRequest,Transaction::find($request->id) );
    }

    public function showLogo(){
        return $this->format(['ok', true, 'C:\Users\amaelle.diop\laravel\projetTest\front\src\app\images\logo.png']);
    }
}