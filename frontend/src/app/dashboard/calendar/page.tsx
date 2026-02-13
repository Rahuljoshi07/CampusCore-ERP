'use client';

import { useState, useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { fetchMyTasks, Task } from '@/store/slices/taskSlice';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

interface CalendarTask {
  id: string;
  title: string;
  dueDate?: string;
  status: string;
  priority: string;
  projectId?: string;
}

export default function CalendarPage() {
  const dispatch = useAppDispatch();
  const { myTasks: tasks } = useAppSelector((state) => state.tasks);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  useEffect(() => {
    dispatch(fetchMyTasks({}));
  }, [dispatch]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  const startingDayOfWeek = firstDayOfMonth.getDay();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(new Date(year, month + (direction === 'next' ? 1 : -1), 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const getTasksForDate = (day: number): CalendarTask[] => {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      return task.dueDate.startsWith(dateStr);
    });
  };

  const isToday = (day: number) => {
    const today = new Date();
    return day === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    return day === selectedDate.getDate() && month === selectedDate.getMonth() && year === selectedDate.getFullYear();
  };

  const selectedDateTasks = selectedDate
    ? getTasksForDate(selectedDate.getDate())
    : [];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': case 'URGENT': return 'bg-red-500';
      case 'MEDIUM': return 'bg-yellow-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendar</h1>
          <p className="mt-1 text-gray-500">
            View and manage your task schedule
          </p>
        </div>
        <button onClick={goToToday} className="btn-secondary">
          Today
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar */}
        <div className="flex-1 card">
          {/* Month Navigation */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h2 className="text-lg font-semibold text-gray-900">
              {monthNames[month]} {year}
            </h2>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Day Names */}
          <div className="grid grid-cols-7 border-b border-gray-200">
            {dayNames.map((day) => (
              <div key={day} className="py-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7">
            {/* Empty cells for days before the first day */}
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="min-h-[100px] p-2 border-b border-r border-gray-100 bg-gray-50" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayTasks = getTasksForDate(day);
              const isCurrentDay = isToday(day);
              const isSelectedDay = isSelected(day);

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDate(new Date(year, month, day))}
                  className={`min-h-[100px] p-2 border-b border-r border-gray-100 cursor-pointer transition-colors ${
                    isSelectedDay ? 'bg-primary-50' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className={`w-7 h-7 flex items-center justify-center rounded-full text-sm ${
                    isCurrentDay
                      ? 'bg-primary-600 text-white font-bold'
                      : isSelectedDay
                      ? 'bg-primary-100 text-primary-700 font-semibold'
                      : 'text-gray-700'
                  }`}>
                    {day}
                  </div>
                  <div className="mt-1 space-y-1">
                    {dayTasks.slice(0, 3).map((task) => (
                      <div
                        key={task.id}
                        className={`px-1 py-0.5 rounded text-xs text-white truncate ${getPriorityColor(task.priority)}`}
                      >
                        {task.title}
                      </div>
                    ))}
                    {dayTasks.length > 3 && (
                      <p className="text-xs text-gray-500">+{dayTasks.length - 3} more</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Tasks */}
        <div className="lg:w-80 card p-4">
          <h3 className="font-semibold text-gray-900 mb-4">
            {selectedDate
              ? formatDate(selectedDate.toISOString())
              : 'Select a date'}
          </h3>
          {selectedDate ? (
            selectedDateTasks.length > 0 ? (
              <div className="space-y-3">
                {selectedDateTasks.map((task) => (
                  <Link
                    key={task.id}
                    href={`/dashboard/projects/${task.projectId}`}
                    className="block p-3 border border-gray-200 rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-2 h-2 mt-1.5 rounded-full ${getPriorityColor(task.priority)}`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{task.title}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded ${
                            task.status === 'DONE'
                              ? 'bg-green-100 text-green-700'
                              : task.status === 'IN_PROGRESS'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">No tasks due on this date</p>
            )
          ) : (
            <p className="text-gray-500 text-sm">Click on a date to see tasks</p>
          )}

          {selectedDate && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <Link
                href={`/dashboard/tasks`}
                className="text-sm text-primary-600 hover:text-primary-700 font-medium"
              >
                View all tasks →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="card p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Upcoming Due Dates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tasks
            .filter((task: Task) => task.dueDate && new Date(task.dueDate) >= new Date() && task.status !== 'DONE')
            .sort((a: Task, b: Task) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
            .slice(0, 6)
            .map((task: Task) => (
              <div key={task.id} className="p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`} />
                  <p className="font-medium text-gray-900 truncate">{task.title}</p>
                </div>
                <p className="text-sm text-gray-500">
                  Due: {formatDate(task.dueDate!)}
                </p>
              </div>
            ))}
          {tasks.filter((t: Task) => t.dueDate && new Date(t.dueDate) >= new Date() && t.status !== 'DONE').length === 0 && (
            <p className="text-gray-500 text-sm col-span-full">No upcoming tasks</p>
          )}
        </div>
      </div>
    </div>
  );
}
