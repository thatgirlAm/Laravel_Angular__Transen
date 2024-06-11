<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class AuthController extends Controller
{

    public function register(Request $request){
        return User::create([
            'name'=>$request->input('name'),
            'number'=>$request->input('number'), 
            'password'=>Hash::make($request->input('password'))
                ]);
    }

    public function login(Request $request){
        if(!Auth::attempt($request->only('number', 'password'))){
            return response([
                'message'=>'invalid credentials'
            ], Response::HTTP_UNAUTHORIZED);
        }
        
        $user = Auth::user();
        $token = $user->createToken('token')->plainTextToken ;
        $cookie = cookie('jwt', $token, 60*24);
         return response([
            'message'=> 'sucess'
         ])->withCookie($cookie);
    }

    public function user(){
        return Auth::user();
    }
}
