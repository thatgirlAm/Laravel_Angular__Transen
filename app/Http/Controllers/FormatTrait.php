<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

Trait FormatTrait 
{
    public function format($data){
        return response()->json([
            "message"=>$data[0],
            "status"=>$data[1],
            "data"=>$data[2]
        ]);
    }

    public function formatDelete($thing){
        return response()->json([
            "message"=> $thing. " deleted.",
            "status"=>false,
            "data"=>null
        ])
        ;
    }
    public function formatError(string $thing){
        return response()->json([
            "message"=> $thing. " error.",
            "status"=>false,
            "data"=>null
        ])
        ;

    }
}
