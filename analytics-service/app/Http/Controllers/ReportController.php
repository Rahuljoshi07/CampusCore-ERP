<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class ReportController extends Controller
{
    /**
     * Get summary report
     */
    public function summary(Request $request): JsonResponse
    {
        $dateFrom = $request->get('from', Carbon::now()->subDays(30)->toDateString());
        $dateTo = $request->get('to', Carbon::now()->toDateString());

        // Overall statistics
        $stats = [
            'projects' => DB::table('projects')->count(),
            'tasks' => DB::table('tasks')->count(),
            'users' => DB::table('users')->count(),
            'completed_tasks' => DB::table('tasks')->where('status', 'COMPLETED')->count(),
        ];

        // Period statistics
        $periodStats = [
            'new_projects' => DB::table('projects')
                ->whereBetween('created_at', [$dateFrom, $dateTo])
                ->count(),
            'new_tasks' => DB::table('tasks')
                ->whereBetween('created_at', [$dateFrom, $dateTo])
                ->count(),
            'completed_tasks' => DB::table('tasks')
                ->where('status', 'COMPLETED')
                ->whereBetween('updated_at', [$dateFrom, $dateTo])
                ->count(),
            'new_users' => DB::table('users')
                ->whereBetween('created_at', [$dateFrom, $dateTo])
                ->count(),
        ];

        return response()->json([
            'report_type' => 'summary',
            'generated_at' => now()->toISOString(),
            'period' => [
                'from' => $dateFrom,
                'to' => $dateTo,
            ],
            'all_time' => $stats,
            'period_stats' => $periodStats,
        ]);
    }

    /**
     * Get detailed projects report
     */
    public function projectsReport(Request $request): JsonResponse
    {
        $projects = DB::table('projects')
            ->leftJoin('users', 'projects.owner_id', '=', 'users.id')
            ->select(
                'projects.*',
                'users.first_name as owner_first_name',
                'users.last_name as owner_last_name',
                DB::raw('(SELECT COUNT(*) FROM tasks WHERE tasks.project_id = projects.id) as total_tasks'),
                DB::raw("(SELECT COUNT(*) FROM tasks WHERE tasks.project_id = projects.id AND tasks.status = 'COMPLETED') as completed_tasks"),
                DB::raw('(SELECT COUNT(*) FROM project_members WHERE project_members.project_id = projects.id) as member_count')
            )
            ->orderByDesc('projects.created_at')
            ->paginate($request->get('limit', 20));

        return response()->json([
            'report_type' => 'projects',
            'generated_at' => now()->toISOString(),
            'data' => $projects,
        ]);
    }

    /**
     * Get detailed tasks report
     */
    public function tasksReport(Request $request): JsonResponse
    {
        $query = DB::table('tasks')
            ->leftJoin('projects', 'tasks.project_id', '=', 'projects.id')
            ->leftJoin('users as assignee', 'tasks.assignee_id', '=', 'assignee.id')
            ->leftJoin('users as creator', 'tasks.created_by_id', '=', 'creator.id')
            ->select(
                'tasks.*',
                'projects.name as project_name',
                'assignee.first_name as assignee_first_name',
                'assignee.last_name as assignee_last_name',
                'creator.first_name as creator_first_name',
                'creator.last_name as creator_last_name'
            );

        // Apply filters
        if ($request->has('status')) {
            $query->where('tasks.status', $request->get('status'));
        }
        if ($request->has('priority')) {
            $query->where('tasks.priority', $request->get('priority'));
        }
        if ($request->has('project_id')) {
            $query->where('tasks.project_id', $request->get('project_id'));
        }
        if ($request->has('assignee_id')) {
            $query->where('tasks.assignee_id', $request->get('assignee_id'));
        }
        if ($request->has('from')) {
            $query->where('tasks.created_at', '>=', $request->get('from'));
        }
        if ($request->has('to')) {
            $query->where('tasks.created_at', '<=', $request->get('to'));
        }

        // Status breakdown
        $statusBreakdown = DB::table('tasks')
            ->select('status', DB::raw('COUNT(*) as count'))
            ->groupBy('status')
            ->pluck('count', 'status');

        // Priority breakdown
        $priorityBreakdown = DB::table('tasks')
            ->select('priority', DB::raw('COUNT(*) as count'))
            ->groupBy('priority')
            ->pluck('count', 'priority');

        $tasks = $query->orderByDesc('tasks.created_at')
            ->paginate($request->get('limit', 20));

        return response()->json([
            'report_type' => 'tasks',
            'generated_at' => now()->toISOString(),
            'breakdown' => [
                'by_status' => $statusBreakdown,
                'by_priority' => $priorityBreakdown,
            ],
            'data' => $tasks,
        ]);
    }

    /**
     * Get team performance report
     */
    public function teamPerformance(Request $request): JsonResponse
    {
        $dateFrom = $request->get('from', Carbon::now()->subDays(30)->toDateString());
        $dateTo = $request->get('to', Carbon::now()->toDateString());

        // Get all users with their task statistics
        $teamStats = DB::table('users')
            ->leftJoin('tasks', 'users.id', '=', 'tasks.assignee_id')
            ->select(
                'users.id',
                'users.first_name',
                'users.last_name',
                'users.email',
                'users.role',
                DB::raw('COUNT(tasks.id) as total_assigned'),
                DB::raw("SUM(CASE WHEN tasks.status = 'COMPLETED' THEN 1 ELSE 0 END) as completed"),
                DB::raw("SUM(CASE WHEN tasks.status = 'IN_PROGRESS' THEN 1 ELSE 0 END) as in_progress"),
                DB::raw("SUM(CASE WHEN tasks.due_date < NOW() AND tasks.status != 'COMPLETED' THEN 1 ELSE 0 END) as overdue")
            )
            ->groupBy('users.id', 'users.first_name', 'users.last_name', 'users.email', 'users.role')
            ->orderByDesc('completed')
            ->get();

        // Calculate team metrics
        $totalTasks = $teamStats->sum('total_assigned');
        $totalCompleted = $teamStats->sum('completed');
        $teamCompletionRate = $totalTasks > 0 ? round(($totalCompleted / $totalTasks) * 100, 2) : 0;

        return response()->json([
            'report_type' => 'team_performance',
            'generated_at' => now()->toISOString(),
            'period' => [
                'from' => $dateFrom,
                'to' => $dateTo,
            ],
            'team_metrics' => [
                'total_members' => $teamStats->count(),
                'total_tasks_assigned' => $totalTasks,
                'total_completed' => $totalCompleted,
                'team_completion_rate' => $teamCompletionRate,
            ],
            'individual_performance' => $teamStats,
        ]);
    }

    /**
     * Generate a custom report
     */
    public function generate(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'type' => 'required|in:summary,projects,tasks,team,custom',
            'from' => 'nullable|date',
            'to' => 'nullable|date',
            'filters' => 'nullable|array',
            'include' => 'nullable|array',
        ]);

        $reportId = uniqid('report_');
        
        // In a real implementation, this would queue a job to generate the report
        // For now, we'll return a mock response
        
        return response()->json([
            'report_id' => $reportId,
            'status' => 'generating',
            'type' => $validated['type'],
            'created_at' => now()->toISOString(),
            'estimated_completion' => now()->addMinutes(2)->toISOString(),
            'message' => 'Report generation started. You can check the status using the report ID.',
        ]);
    }

    /**
     * Export report in specified format
     */
    public function export(Request $request, string $format): JsonResponse
    {
        $validFormats = ['csv', 'pdf', 'xlsx', 'json'];

        if (!in_array($format, $validFormats)) {
            return response()->json([
                'error' => 'Invalid export format',
                'valid_formats' => $validFormats,
            ], 400);
        }

        $reportType = $request->get('type', 'summary');
        
        // In a real implementation, this would generate and return the actual file
        // For now, we'll return a mock download URL
        
        return response()->json([
            'format' => $format,
            'report_type' => $reportType,
            'download_url' => "/api/v1/reports/download/{$format}/" . uniqid(),
            'expires_at' => now()->addHours(24)->toISOString(),
            'message' => 'Report exported successfully. Use the download URL to retrieve the file.',
        ]);
    }
}
