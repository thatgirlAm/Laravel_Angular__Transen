<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Controllers\FormatTrait;
use App\Http\Resources\UserResource;

class AuthController extends Controller
{
    use FormatTrait;
    public function register(Request $request){
        return $this->format(["Enregistrement réussi",true, User::create([
            'name'=>$request->input('name'),
            'number'=>$request->input('number'), 
            'password'=>Hash::make($request->input('password')),
            'surname'=>$request->input('surname'),
            'typeDeCompte'=>$request->input('typeDeCompte'),
            'admin'=>$request->input('admin'),
            'balance'=>0.0,
            "dateOfBirth"=>$request->input('dateOfBirth')
            ])]);
    }

    public function login(Request $request){
        if(!Auth::attempt($request->only('number', 'password'))){
            return response([
                'message'=>'invalid credentials'
            ], Response::HTTP_UNAUTHORIZED);
        }
        
        $user = Auth::user();
        $userRessource = new UserResource($user);
       $token = $user->createToken('token')->plainTextToken ;
        $cookie = cookie('jwt', $token, 60*24);
         return response($this->format(['authentification ok', true, [$userRessource]]))->withCookie($cookie); 
    }

    public function user(){
        return Auth::user();
    }
}
