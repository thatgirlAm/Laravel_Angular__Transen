<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\FormatTrait;
use App\Http\Resources\UserResource;
use DB;
use Illuminate\Support\Facades\Auth; 
use App\Http\Requests\UserUpdateRequest;
use App\Models\Transaction;
use App\Http\Requests\UserRequest;
use Psy\Readline\Hoa\Console;


class UserController extends Controller
{
    use FormatTrait;


//---------------------C.R.U.D.------------------//


    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json($this->format(['Utilisateurs', true, UserResource::collection(User::all())]));

    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(UserRequest $request)
    {
            $existingUser = User::where('number', $request->number)->first();
            if (!$existingUser) {
                $user = DB::transaction(function() use($request) {
                    return User::create([
                        'name' => $request->name,
                        'surname' => $request->surname,
                        'number' => $request->number,
                        'dateOfBirth' => $request->dateOfBirth,
                        'admin' => $request->admin,
                        'password' => bcrypt($request->password),
                        'typeDeCompte' => $request->typeDeCompte,
                    ]);
                });
                $data = new UserResource($user);
                return $this->format(["Utilisateur enregistré", true, $data]);
            }
        
            return $this->formatError("Number");
    }

    /**
     * Display the specified resource.
     */
    public function show(UserRequest $request){
        $user = Auth::user();
        if ($user) {
            $data = new UserResource($user);
            return $this->format(['Utilisateur trouvé.', true, $data]);
        }
        else{ return $this->formatError("User");}
    }

    public function show_(UserRequest $request){
        $url = explode('/',$request->getPathInfo());
        $id= end($url);
        $user = User::find($id);
        if ($user) {
            $data = new UserResource($user);
            return $this->format(['Utilisateur trouvé.', true, $data]);
        }
        else{ return $this->formatError("User");}
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(User $user)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UserUpdateRequest $request)
    {
        $user = Auth::user();
        if ($user) {
            $user->update($request->only($request->keys()));
            $userUpdatedResource = new UserResource($user);
            return $this->format(["opération mise à jour", true, $userUpdatedResource]);
        }
        return $this->formatError("User");
        //$user->update($request->only($request->keys()));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        if($user){
            $user->delete();
            return $user->formatDelete("User");
        }
        return $user->formatError("delete");
    }

//-----------------Other functions-------------------------//

public function showHistory(Request $request){
    $url = explode('/',$request->getPathInfo());
    $id= end($url);
    $user = User::find($id);
    $transactionsExp = Transaction::where('idUserExp', $user->id)->get();
    $transactionsDest = Transaction::where('idUserDest', $user->id)->get();
    $transactions = $transactionsExp->merge($transactionsDest);
    if ($transactions){
    return $this->format(['history found',true, $transactions]);
}
return $this->formatError("History");
}
public function getNumber(Request $request){
$user= Auth::user();
if ($user){
      return $this->format(['number found', true, $user->number]);
}
return $this->formatError('Number');
}

public function getBalance(){
$user = Auth::user();
if(Auth::check())
    return $this->format(['balance found',true,$user->balance]); 
else
    return $this->formatError("Authentification");
}
public function findByNumber (Request $request){
    $url = explode('/',$request->getPathInfo());
    $number= end($url);
    $user = User::where('number', $number)->first(); 
    if($user){
        return $this->format(['utilisateur trouvé', true, $user]); 
    }
    else{
        return $this->formatError('User not found');
    }
}

public function findUser(UserRequest $request){
$user=Auth::user();
if ($user)
    return $this->format(['Utilisateur trouvé', true, $user]);
else
    return $this->formatError('User not found');
}

public function confirmPassword(UserRequest $request){
$userData = $request->only('number','password');

 $_Ok = Auth::guard('web')->attempt($userData);
if($_Ok){
        return $this->format(['authentification ok', true, true]);
    }
return $this->formatError("authentification");} 

public function changePassword($password){
    $user = Auth::user();
    if ($user){
        $user->password = bcrypt($password);
        $user->save();
        return $this->format(['password changed', true, true]);
        }
}
}
