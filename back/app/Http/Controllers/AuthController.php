<?php 

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;
use App\Http\Resources\UserResource;

class AuthController extends Controller
{
    use FormatTrait;

    public function register(Request $request)
    {
        $user = User::create([
            'name' => $request->input('name'),
            'number' => $request->input('number'),
            'password' => Hash::make($request->input('password')),
            'surname' => $request->input('surname'),
            'typeDeCompte' => $request->input('typeDeCompte'),
            'admin' => $request->input('admin'),
            'balance' => 0.0,
            'dateOfBirth' => $request->input('dateOfBirth')
        ]);

        return $this->format(['Enregistrement réussi', true, $user]);
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
