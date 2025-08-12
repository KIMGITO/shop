<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class RiderController extends Controller
{
    public function index(){
        return Inertia::render('Rider/Index');
    }

    public function create(){
        // return Inertia::render('Riders/Add', )

    }

    public function store(){

    }

    public function edit(){

    }

    public function update(){

    }

}
