<?php 

namespace App\Http\Controllers;

use App\Models\User;
use Hamcrest\Type\IsNumeric;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Resources\UserResource;
use App\Http\Requests\UserRequest; 

class AuthController extends Controller
{
    use FormatTrait;

    public function register(UserRequest $request)
    {
        /* $number = $request->number ; 
        if (!User::where('number', $number)){
            if($request->number.contains('+')){
                // décomposer et prendre les 4 premiers caractères.
                if( // les number[1:3] == 221
                    ){
                    // $number = $number[4:12] 
                }
                else{
                    return $this->format('Number not ok');
                }
            }
            return $this->format('Number not ok');
        }
        else{
            return $this->formatError('Utilisateur existant'); 
        } */
        $numberExist = User::where("number",$request->number)->first(); 
        if($numberExist){
            if($numberExist->typeDeCompte == $request->typeDeCompte){
                return $this->formatError('Vous possédez déja un compte');
            }
        }
       /*  if($request->number.contains('+')){
           $numberToString = (string)$request->number; 
           if(strlen($numberToString)==9){
                $number = $request->number ;
           }
           elseif(str($numberToString)==13){
                for($i=4 ; $i = 13; $i++){
                    $number = $numberToString[4:13];
                }
           }} */

           
            /*  if((substr((string)$request->number, 0 , length:$request->number) == 2) && (substr((string)$request->number, 1 , length:$request->number) == 2) && (substr((string)$request->number, 2 , length:$request->number) == 1)){
                for(int i , i = 3, i = length:$request->number){
                    
                }
            
        } */
        $numberToString = (string)$request->number ; 
        $number = $request->number ; 
        if(!(strlen($numberToString)==9 || strlen($numberToString)==13)){
            return $this->formatError('number size');
        }
        if(!Is_numeric($numberToString)){
            return $this->formatError('number is not all integers');
        }
        if(!str_starts_with($numberToString,"+221") && strlen($numberToString)==13){
            return $this->formatError("Wrong format: ++221(your number) ou (your number)");
        }

        $user = User::create([
            'name' => $request->name,
            'number' => $request->number,
            'password' => Hash::make($request->password),
            'surname' => $request->surname,
            'typeDeCompte' => $request->typeDeCompte,
            'admin' => $request->admin,
            'dateOfBirth' => $request->dateOfBirth,
            'balance'=>1000 
        ]);
        $userResource = new UserResource($user);
        return $this->format(['Enregistrement réussi', true, $userResource]);
    }

    public function isLoggedIn(){
        return Auth::attempt();
    }

    public function login(Request $request)
    {
        $credentials = $request->only('number', 'password');

        if (!Auth::attempt($credentials)) {
            return response([
                'message' => 'Invalid credentials'
            ], Response::HTTP_UNAUTHORIZED);
        }

        $user = Auth::user();
        $token = $user->createToken('Personal Access Token')->plainTextToken;

        $userResponse = [
            'id' => $user->id,
            'number' => $user->number,
            'name' => $user->name,
            'surname' => $user->surname,
            'typeDeCompte' => $user->typeDeCompte,
            'balance' => $user->balance,
            'token' => $token
        ];

        return $this->format(['Authentification réussie', true, $userResponse]);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        return redirect('/');
    }

    public function user()
    {
        return Auth::user();
    }
}
