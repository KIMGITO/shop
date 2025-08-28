<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Reminder;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Validator;

class ReminderController extends Controller
{
    public function process(Request  $request)
    {

        $date = Carbon::create($request->date);


        $rules = [
            'name' => [
                'required',
                'string',
                'min:3',
                'max:100',
                Rule::unique('reminders')->where(function ($query) use ($request) {
                    return $query
                        ->where('repeat', $request->input('repeat'))
                        ->where('complete', false);
                }),
            ],
            'repeat' => 'required',
            'date' => 'required|date|after_or_equal:today',
            'description' => 'required|max:100'
        ];

        $messages = [
            'name.required' => 'Please enter a title.',
            'name.string' => 'The title must be text.',
            'name.min' => 'Title must be at least 3 characters.',
            'name.max' => 'Title must not exceed 100 characters.',
            'name.unique' => 'You already have such a reminder in progress.',
            'repeat.required' => 'Please select a repeat option.',
            'date.after_or_equal' => 'Date must be today or later.',
            'description.required' => 'Describe your reminder.',
            'description.max' => 'Description should have less tan 100 characters.'
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->errors()->first(), // just one message
            ], 422);
        }

        


        $attributes = [
            'name' =>  $request['name'],
            'description' => $request['description'],
            'created_by' => Auth::id(),
            'updated_by' => Auth::id(),
            'repeat' => $request['repeat'],
            'show_on' => $date,
            'complete' => false,
        ];

        $reminder = Reminder::create($attributes);
        if ($reminder) {
            return response()->json(['message' => 'Reminder created successfully'], 200);
        }

        return response()->json(['message' => 'An error occured when creating reminder'], 400);
    }


    public function show($date) {
        $reminders = Reminder::where('show_on', $date)->where('complete', false)->get();
        return response()->json($reminders, 200);
    }

    public function setComplete(Request $request) {

       $complete = Reminder::where('id', $request['id'])->update(['complete' => true]);

       if($complete) {
            return response()->json([
                'message' => 'Reminder completed successfully',
            ]);
       }

        return response()->json(
            [
                'message' => 'failed to complete reminder, try again.'
            ],500
        );

    }


    public function index() {}

    public function store() {}

    public function update() {}
}
