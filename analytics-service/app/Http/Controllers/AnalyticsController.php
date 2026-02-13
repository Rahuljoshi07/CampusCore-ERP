<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AnalyticsController extends Controller
{
    /**
     * Get overall analytics overview
     */
    public function overview(Request $request): JsonResponse
    {
        $dateFrom = $request->get('from', Carbon::now()->subDays(30)->toDateString());
        $dateTo = $request->get('to', Carbon::now()->toDateString());

        // Get task statistics
        $taskStats = DB::table('tasks')
            ->select([
                DB::raw('COUNT(*) as total_tasks'),
                DB::raw("COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed_tasks"),
                DB::raw("COUNT(CASE WHEN status = 'IN_PROGRESS' THEN 1 END) as in_progress_tasks"),
                DB::raw("COUNT(CASE WHEN status = 'TODO' THEN 1 END) as todo_tasks"),
                DB::raw("COUNT(CASE WHEN status = 'IN_REVIEW' THEN 1 END) as in_review_tasks"),
            ])
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->first();

        // Get project statistics
        $projectStats = DB::table('projects')
            ->select([
                DB::raw('COUNT(*) as total_projects'),
            ])
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->first();

        // Get user statistics
        $userStats = DB::table('users')
            ->select([
                DB::raw('COUNT(*) as total_users'),
                DB::raw("COUNT(CASE WHEN role = 'ADMIN' THEN 1 END) as admin_users"),
            ])
            ->first();

        // Calculate completion rate
        $completionRate = $taskStats->total_tasks > 0 
            ? round(($taskStats->completed_tasks / $taskStats->total_tasks) * 100, 2)
            : 0;

        // Get tasks by priority
        $tasksByPriority = DB::table('tasks')
            ->select('priority', DB::raw('COUNT(*) as count'))
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->groupBy('priority')
            ->pluck('count', 'priority')
            ->toArray();

        // Get activity trends (tasks created per day)
        $activityTrends = DB::table('tasks')
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as created'),
                DB::raw("COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed")
            )
            ->whereBetween('created_at', [$dateFrom, $dateTo])
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();

        return response()->json([
            'period' => [
                'from' => $dateFrom,
                'to' => $dateTo,
            ],
            'overview' => [
                'total_projects' => $projectStats->total_projects ?? 0,
                'total_tasks' => $taskStats->total_tasks ?? 0,
                'completed_tasks' => $taskStats->completed_tasks ?? 0,
                'in_progress_tasks' => $taskStats->in_progress_tasks ?? 0,
                'todo_tasks' => $taskStats->todo_tasks ?? 0,
                'in_review_tasks' => $taskStats->in_review_tasks ?? 0,
                'completion_rate' => $completionRate,
                'total_users' => $userStats->total_users ?? 0,
            ],
            'tasks_by_priority' => $tasksByPriority,
            'activity_trends' => $activityTrends,
        ]);
    }

    /**
     * Get analytics for a specific project
     */
    public function projectAnalytics(Request $request, string $projectId): JsonResponse
    {
        $project = DB::table('projects')->where('id', $projectId)->first();

        if (!$project) {
            return response()->json(['error' => 'Project not found'], 404);
        }

        // Task statistics for project
        $taskStats = DB::table('tasks')
            ->where('project_id', $projectId)
            ->select([
                DB::raw('COUNT(*) as total'),
                DB::raw("COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed"),
                DB::raw("COUNT(CASE WHEN status = 'IN_PROGRESS' THEN 1 END) as in_progress"),
                DB::raw("COUNT(CASE WHEN status = 'TODO' THEN 1 END) as todo"),
                DB::raw("COUNT(CASE WHEN due_date < NOW() AND status != 'COMPLETED' THEN 1 END) as overdue"),
            ])
            ->first();

        // Tasks by assignee
        $tasksByAssignee = DB::table('tasks')
            ->join('users', 'tasks.assignee_id', '=', 'users.id')
            ->where('tasks.project_id', $projectId)
            ->select(
                'users.id',
                'users.first_name',
                'users.last_name',
                DB::raw('COUNT(*) as total_tasks'),
                DB::raw("COUNT(CASE WHEN tasks.status = 'COMPLETED' THEN 1 END) as completed_tasks")
            )
            ->groupBy('users.id', 'users.first_name', 'users.last_name')
            ->get();

        // Recent activity
        $recentActivity = DB::table('activity_logs')
            ->join('users', 'activity_logs.user_id', '=', 'users.id')
            ->where('activity_logs.project_id', $projectId)
            ->select(
                'activity_logs.*',
                'users.first_name',
                'users.last_name'
            )
            ->orderBy('activity_logs.created_at', 'desc')
            ->limit(20)
            ->get();

        return response()->json([
            'project' => [
                'id' => $project->id,
                'name' => $project->name,
                'created_at' => $project->created_at,
            ],
            'task_statistics' => $taskStats,
            'tasks_by_assignee' => $tasksByAssignee,
            'recent_activity' => $recentActivity,
        ]);
    }

    /**
     * Get analytics for a specific user
     */
    public function userAnalytics(Request $request, string $userId): JsonResponse
    {
        $user = DB::table('users')->where('id', $userId)->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        // Task statistics for user
        $taskStats = DB::table('tasks')
            ->where('assignee_id', $userId)
            ->select([
                DB::raw('COUNT(*) as total_assigned'),
                DB::raw("COUNT(CASE WHEN status = 'COMPLETED' THEN 1 END) as completed"),
                DB::raw("COUNT(CASE WHEN status = 'IN_PROGRESS' THEN 1 END) as in_progress"),
                DB::raw("COUNT(CASE WHEN due_date < NOW() AND status != 'COMPLETED' THEN 1 END) as overdue"),
            ])
            ->first();

        // Tasks completed over time
        $completionTrend = DB::table('tasks')
            ->where('assignee_id', $userId)
            ->where('status', 'COMPLETED')
            ->select(
                DB::raw('DATE(updated_at) as date'),
                DB::raw('COUNT(*) as completed')
            )
            ->where('updated_at', '>=', Carbon::now()->subDays(30))
            ->groupBy(DB::raw('DATE(updated_at)'))
            ->orderBy('date')
            ->get();

        // Projects user is involved in
        $projects = DB::table('project_members')
            ->join('projects', 'project_members.project_id', '=', 'projects.id')
            ->where('project_members.user_id', $userId)
            ->select('projects.*', 'project_members.role as member_role')
            ->get();

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->first_name . ' ' . $user->last_name,
                'email' => $user->email,
            ],
            'task_statistics' => $taskStats,
            'completion_trend' => $completionTrend,
            'projects' => $projects,
        ]);
    }

    /**
     * Get trend analytics
     */
    public function trends(Request $request): JsonResponse
    {
        $period = $request->get('period', '30d'); // 7d, 30d, 90d, 1y
        
        $days = match($period) {
            '7d' => 7,
            '30d' => 30,
            '90d' => 90,
            '1y' => 365,
            default => 30,
        };

        $startDate = Carbon::now()->subDays($days);

        // Tasks created trend
        $tasksCreated = DB::table('tasks')
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', $startDate)
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();

        // Tasks completed trend
        $tasksCompleted = DB::table('tasks')
            ->select(
                DB::raw('DATE(updated_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->where('status', 'COMPLETED')
            ->where('updated_at', '>=', $startDate)
            ->groupBy(DB::raw('DATE(updated_at)'))
            ->orderBy('date')
            ->get();

        // Projects created trend
        $projectsCreated = DB::table('projects')
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', $startDate)
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();

        return response()->json([
            'period' => $period,
            'trends' => [
                'tasks_created' => $tasksCreated,
                'tasks_completed' => $tasksCompleted,
                'projects_created' => $projectsCreated,
            ],
        ]);
    }

    /**
     * Get team productivity metrics
     */
    public function productivity(Request $request): JsonResponse
    {
        $dateFrom = $request->get('from', Carbon::now()->subDays(30)->toDateString());
        $dateTo = $request->get('to', Carbon::now()->toDateString());

        // Top performers (most tasks completed)
        $topPerformers = DB::table('tasks')
            ->join('users', 'tasks.assignee_id', '=', 'users.id')
            ->where('tasks.status', 'COMPLETED')
            ->whereBetween('tasks.updated_at', [$dateFrom, $dateTo])
            ->select(
                'users.id',
                'users.first_name',
                'users.last_name',
                DB::raw('COUNT(*) as completed_tasks')
            )
            ->groupBy('users.id', 'users.first_name', 'users.last_name')
            ->orderByDesc('completed_tasks')
            ->limit(10)
            ->get();

        // Average time to complete tasks
        $avgCompletionTime = DB::table('tasks')
            ->where('status', 'COMPLETED')
            ->whereBetween('updated_at', [$dateFrom, $dateTo])
            ->select(
                DB::raw('AVG(EXTRACT(EPOCH FROM (updated_at - created_at)) / 3600) as avg_hours')
            )
            ->first();

        // Most active projects
        $activeProjects = DB::table('tasks')
            ->join('projects', 'tasks.project_id', '=', 'projects.id')
            ->whereBetween('tasks.created_at', [$dateFrom, $dateTo])
            ->select(
                'projects.id',
                'projects.name',
                DB::raw('COUNT(*) as task_count')
            )
            ->groupBy('projects.id', 'projects.name')
            ->orderByDesc('task_count')
            ->limit(10)
            ->get();

        return response()->json([
            'period' => [
                'from' => $dateFrom,
                'to' => $dateTo,
            ],
            'top_performers' => $topPerformers,
            'average_completion_time_hours' => round($avgCompletionTime->avg_hours ?? 0, 2),
            'most_active_projects' => $activeProjects,
        ]);
    }
}
