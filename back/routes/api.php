<?php

use App\Http\Controllers\TransactionController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;


//-----Routes with no particuliar access needed----//
Route::post("/register", [AuthController::class, 'register']);
Route::post("/login", [AuthController::class, 'login']);
Route::post("/logout", [AuthController::class, 'logout']);
Route::get('/check', [AuthController::class, 'isLoggedIn']);
Route::apiResource("/users", UserController::class)->only('store');

//----Routes with Access required---------//
Route::middleware('auth:sanctum')->group(function(){
    
    //----------Functions-----------/
    
    Route::get("/user", [AuthController::class, 'user']);
    Route::get('users/history/{id}', [UserController::class, 'showHistory']);
    Route::get('/users/number/{id}', [UserController::class, 'getNumber']);
    Route::post('/users/history/{id}/reverse', [UserController::class, 'confirmPassword']);
    Route::post('/users/history/{id}/reverse', [UserController::class, 'changePassword']);
    Route::delete('/users/history/reverse/{idTransaction}', [TransactionController::class, 'reverseTransaction']);
    Route::post('/users/newtransaction/{id}', [TransactionController::class, 'newtransaction']);
    Route::get('users/getBalance/{id}', [UserController::class, 'getBalance']);
    Route::get('/users/findByNumber/{number}', [UserController::class, 'findByNumber']);
    Route::post('/transactions/validateTransaction', [TransactionController::class, 'store']);
    
    //-----APIs RESOURCE------//
    Route::apiResource("/transactions", TransactionController::class);
    Route::apiResource("/users", UserController::class)->except('store');

});


