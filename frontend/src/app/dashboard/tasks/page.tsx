'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyTasks, updateTask, Task } from '@/store/slices/taskSlice';
import { formatDate, formatRelativeTime, getStatusColor, getPriorityColor } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function TasksPage() {
  const dispatch = useAppDispatch();
  const { myTasks, isLoading } = useAppSelector((state) => state.tasks);
  const [filter, setFilter] = useState<'all' | 'todo' | 'in_progress' | 'completed'>('all');
  const [sort, setSort] = useState<'dueDate' | 'priority' | 'updated'>('updated');

  useEffect(() => {
    dispatch(fetchMyTasks({}));
  }, [dispatch]);

  const filteredTasks = myTasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'todo') return task.status === 'TODO';
    if (filter === 'in_progress') return task.status === 'IN_PROGRESS';
    if (filter === 'completed') return task.status === 'DONE';
    return true;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sort === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    }
    if (sort === 'priority') {
      const priorityOrder = { URGENT: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
      return (priorityOrder[a.priority as keyof typeof priorityOrder] || 0) - 
             (priorityOrder[b.priority as keyof typeof priorityOrder] || 0);
    }
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });

  const handleStatusChange = async (taskId: string, status: string) => {
    const result = await dispatch(updateTask({ id: taskId, data: { status: status as Task['status'] } }));
    if (updateTask.fulfilled.match(result)) {
      toast.success('Task status updated');
    } else {
      toast.error('Failed to update task');
    }
  };

  const todoCount = myTasks.filter(t => t.status === 'TODO').length;
  const inProgressCount = myTasks.filter(t => t.status === 'IN_PROGRESS').length;
  const completedCount = myTasks.filter((t: Task) => t.status === 'DONE').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
        <p className="mt-1 text-gray-500">
          View and manage all tasks assigned to you
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`card p-4 text-left transition-colors ${filter === 'all' ? 'ring-2 ring-primary-500' : ''}`}
        >
          <p className="text-sm text-gray-500">All Tasks</p>
          <p className="text-2xl font-bold text-gray-900">{myTasks.length}</p>
        </button>
        <button
          onClick={() => setFilter('todo')}
          className={`card p-4 text-left transition-colors ${filter === 'todo' ? 'ring-2 ring-primary-500' : ''}`}
        >
          <p className="text-sm text-gray-500">To Do</p>
          <p className="text-2xl font-bold text-gray-900">{todoCount}</p>
        </button>
        <button
          onClick={() => setFilter('in_progress')}
          className={`card p-4 text-left transition-colors ${filter === 'in_progress' ? 'ring-2 ring-primary-500' : ''}`}
        >
          <p className="text-sm text-gray-500">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">{inProgressCount}</p>
        </button>
        <button
          onClick={() => setFilter('completed')}
          className={`card p-4 text-left transition-colors ${filter === 'completed' ? 'ring-2 ring-primary-500' : ''}`}
        >
          <p className="text-sm text-gray-500">Completed</p>
          <p className="text-2xl font-bold text-green-600">{completedCount}</p>
        </button>
      </div>

      {/* Sort */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Showing {sortedTasks.length} {sortedTasks.length === 1 ? 'task' : 'tasks'}
        </p>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="text-sm border-gray-200 rounded-lg focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="updated">Recently Updated</option>
            <option value="dueDate">Due Date</option>
            <option value="priority">Priority</option>
          </select>
        </div>
      </div>

      {/* Task List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      ) : sortedTasks.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No tasks found</h3>
          <p className="text-gray-500">
            {filter !== 'all' ? 'Try changing the filter' : 'Tasks assigned to you will appear here'}
          </p>
        </div>
      ) : (
        <div className="card divide-y divide-gray-100">
          {sortedTasks.map((task) => (
            <div
              key={task.id}
              className="p-4 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <input
                    type="checkbox"
                    checked={task.status === 'DONE'}
                    onChange={() => handleStatusChange(
                      task.id,
                      task.status === 'DONE' ? 'TODO' : 'DONE'
                    )}
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className={`font-medium ${task.status === 'DONE' ? 'text-gray-500 line-through' : 'text-gray-900'}`}>
                      {task.title}
                    </h3>
                    {task.description && (
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{task.description}</p>
                    )}
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 12.75V12A2.25 2.25 0 0 1 4.5 9.75h15A2.25 2.25 0 0 1 21.75 12v.75" />
                        </svg>
                        {task.project?.name || 'Unknown Project'}
                      </span>
                      {task.dueDate && (
                        <span className={`flex items-center ${
                          new Date(task.dueDate) < new Date() && task.status !== 'DONE'
                            ? 'text-red-500'
                            : ''
                        }`}>
                          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25" />
                          </svg>
                          Due {formatDate(task.dueDate)}
                        </span>
                      )}
                      <span>Updated {formatRelativeTime(task.updatedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`badge ${getPriorityColor(task.priority)}`}>
                    {task.priority.toLowerCase()}
                  </span>
                  <span className={`badge ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ').toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
