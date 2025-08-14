<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Rider;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\RiderStoreRequest;
use App\Http\Requests\UpdateRiderRequest;
use App\Http\Resources\RiderResource;
use Log;

class RiderController extends Controller
{
    public function index(Request $request)
    {
        $riders = Rider::with(['creator'])->latest()->get();
        if ($request->expectsJson())
        {
            return response()->json([
                'ridersData' => $riders,
            ]);
        }

        // For Inertia requests
        return Inertia::render('Riders/Index', [
            'ridersData' => $riders
        ]);
    }


    public function create()
    {
        // return Inertia::render('Riders/Add', )

    }

    public function store(RiderStoreRequest $request)
    {

        $validated = $request->validated();
        $validated = array_merge($validated, [
            'date' => now(),
            'created_by' => Auth::id(),
            'active' => true,
        ]);


        try
        {

            $message = 'Rider created successfully.';
            $rider = Rider::create($validated);
            if ($request->expectsJson())
            {
                return response()->json([
                    'message' => $message
                ]);
            }

            return back()->with('message', $message);

        } catch (\Exception $e)
        {
            $error = 'Failed to create rider.';
            if ($request->expectsJson())
            {
                return response()->json([
                    'error' => $error
                ]);
            }
            return back()->with('error', $error);
        }
    }

    public function edit()
    {

    }

    public function update(UpdateRiderRequest $request, Rider $rider)
    {
        $validated = $request->validated();
        $success = 'Rider updated successfully.';
        $error = 'Rider not updated, try again.';
        try
        {
            $rider->update($validated);
            if ($request->expectsJson())
            {
                return response()->json([
                    'message' => $success
                ]);
            }
            return back()->with('message', $success);

        } catch (\Exception $e)
        {
            if ($request->expectsJson())
            {
                return response()->json([
                    'error' => $error
                ],500);
            }
            return back()->with('error', $error);
        }


    }

    public function destroy(Request $request, Rider $rider)
    {
        $error = 'Rider not deleted.';
        $message = 'Rider deleted successfully.';


        try
        {

            $rider->delete();

            if ($request->expectsJson())
            {
                return response()->json([
                    'message' => $message,
                ]);

            }
            return back()->with('message', $message);
        } catch (\Exception $e)
        {

            if ($request->expectsJson())
            {
                return response()->json([
                    'error' => $error,
                ],500);
            }

            return back() -> with('error',$error);
        }
    }
}
