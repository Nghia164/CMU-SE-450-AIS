<?php

namespace App\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Throwable;

class DatabaseHealthController extends Controller
{
    public function __invoke(): JsonResponse
    {
        try {
            DB::connection()->getPdo();

            return response()->json([
                'database' => 'ok',
                'connection' => config('database.default'),
                'database_name' => DB::connection()->getDatabaseName(),
            ]);
        } catch (Throwable $e) {
            report($e);

            return response()->json([
                'database' => 'error',
                'message' => 'Database connection failed',
            ], 503);
        }
    }
}
