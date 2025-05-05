<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;


Route::post('/form', function (Request $request) {
    $validated = $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email|max:255',
    ]);
    
    return response()->json([
        'message' => 'Form submitted successfully!',
        'data' => $validated
    ]);
});


Route::get('/sanctum/csrf-cookie', function (Request $request) {
    return response()->json(['message' => 'CSRF cookie set']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', function (Request $request) {
        return $request->user();
    });
    
    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Logged out']);
    });
});


// Add your other API routes here