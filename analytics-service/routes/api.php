<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\AnalyticsController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

Route::prefix('v1')->group(function () {
    // Health check
    Route::get('/health', function () {
        return response()->json([
            'status' => 'healthy',
            'service' => 'CampusCore ERP Analytics Service',
            'version' => '1.0.0',
            'timestamp' => now()->toISOString(),
        ]);
    });

    // Analytics endpoints
    Route::prefix('analytics')->group(function () {
        Route::get('/overview', [AnalyticsController::class, 'overview']);
        Route::get('/projects/{projectId}', [AnalyticsController::class, 'projectAnalytics']);
        Route::get('/users/{userId}', [AnalyticsController::class, 'userAnalytics']);
        Route::get('/trends', [AnalyticsController::class, 'trends']);
        Route::get('/productivity', [AnalyticsController::class, 'productivity']);
    });

    // Report endpoints
    Route::prefix('reports')->group(function () {
        Route::get('/summary', [ReportController::class, 'summary']);
        Route::get('/projects', [ReportController::class, 'projectsReport']);
        Route::get('/tasks', [ReportController::class, 'tasksReport']);
        Route::get('/team-performance', [ReportController::class, 'teamPerformance']);
        Route::post('/generate', [ReportController::class, 'generate']);
        Route::get('/export/{format}', [ReportController::class, 'export']);
    });
});
