<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Note;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // Eager load relasi user agar kita bisa mengambil nama user
        return response()->json(Note::with('user')->latest()->get());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'content' => 'required|string',
            'color' => 'required|string'
        ]);

        $note = Note::create([
            'user_id' => $request->user()->id, // Simpan ID pembuat catatan
            'content' => $request->content,
            'color' => $request->color,
            'x' => rand(5, 85),
            'y' => rand(0, 75),
            'rotation' => rand(-10, 10),
        ]);

        // Load relasi user untuk dikirim balik ke React
        $note->load('user');

        return response()->json($note, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Note $note)
    {
        return response()->json($note);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Note $note)
    {
        if ($request->user()->id !== $note->user_id) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $request->validate([
            'content' => 'required|string',
            'color' => 'required|string'
        ]);

        $note->update($request->only(['content', 'color']));

        return response()->json($note);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Note $note)
    {
        if ($request->user()->id !== $note->user_id) {
            return response()->json(['message' => 'Unauthorized action.'], 403);
        }

        $note->delete();
        return response()->json(['message' => 'Note deleted successfully']);
    }
}
