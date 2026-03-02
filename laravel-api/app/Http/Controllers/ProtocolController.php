<?php

namespace App\Http\Controllers;

use App\Models\Protocol;
use Illuminate\Http\Request;
use App\Http\Requests\ProtocolRequest;
use Illuminate\Routing\Controller;

class ProtocolController extends Controller
{
    /* ----------------------------- */
    /* INDEX - Paginated list of protocols */
    /* ----------------------------- */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 24);

        $protocols = Protocol::withCount('reviews')->paginate($perPage);

        return response()->json($protocols);
    }

    /* ----------------------------- */
    /* SHOW - Single protocol */
    /* ----------------------------- */
    public function show(Protocol $protocol)
    {
        return response()->json($protocol);
    }

    /* ----------------------------- */
    /* STORE - Create protocol */
    /* ----------------------------- */
    public function store(ProtocolRequest $request)
    {
        $protocol = Protocol::create($request->validated());

        // Observer automatically syncs to Typesense
        return response()->json($protocol, 201);
    }

    /* ----------------------------- */
    /* UPDATE - Update protocol */
    /* ----------------------------- */
    public function update(ProtocolRequest $request, Protocol $protocol)
    {
        $protocol->update($request->validated());

        // Observer automatically syncs to Typesense
        return response()->json($protocol);
    }

    /* ----------------------------- */
    /* DESTROY - Delete protocol */
    /* ----------------------------- */
    public function destroy(Protocol $protocol)
    {
        $protocol->delete();

        // Observer automatically deletes from Typesense
        return response()->json([
            'message' => 'Protocol deleted successfully',
        ]);
    }

    /* ----------------------------- */
    /* SEARCH - Query Typesense */
    /* ----------------------------- */
    public function search(Request $request)
    {
        $sortMap = [
            'recent' => 'created_at:desc',
            'most_reviewed' => 'review_count:desc',
            'top_rated' => 'average_rating:desc',
        ];

        $sort = $sortMap[$request->query('sort')] ?? 'created_at:desc';

        // Call TypesenseSyncService for search
        $results = app()->make(\App\Services\TypesenseSyncService::class)
            ->searchProtocols([
                'q' => $request->query('q', '*'),
                'sort_by' => $sort,
                'per_page' => $request->query('per_page', 14),
                'page' => $request->query('page', 1),
            ]);

        return response()->json($results);
    }
}