'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Exam {
  id: string;
  name: string;
  subject: { name: string; code: string };
  examType: string;
  date: string;
  startTime: string;
  endTime: string;
  totalMarks: number;
  passingMarks: number;
  venue: string;
  status: 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
  resultsPublished: boolean;
}

export default function ExamsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'upcoming' | 'ongoing' | 'completed'>('upcoming');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const mockExams: Exam[] = [
      {
        id: '1',
        name: 'Mid-Term Examination',
        subject: { name: 'Data Structures', code: 'CS301' },
        examType: 'MID_TERM',
        date: '2025-01-20',
        startTime: '10:00',
        endTime: '12:00',
        totalMarks: 50,
        passingMarks: 20,
        venue: 'Exam Hall A',
        status: 'SCHEDULED',
        resultsPublished: false,
      },
      {
        id: '2',
        name: 'Mid-Term Examination',
        subject: { name: 'Database Management', code: 'CS302' },
        examType: 'MID_TERM',
        date: '2025-01-22',
        startTime: '10:00',
        endTime: '12:00',
        totalMarks: 50,
        passingMarks: 20,
        venue: 'Exam Hall B',
        status: 'SCHEDULED',
        resultsPublished: false,
      },
      {
        id: '3',
        name: 'End-Sem Examination',
        subject: { name: 'Operating Systems', code: 'CS303' },
        examType: 'END_TERM',
        date: '2024-12-15',
        startTime: '09:00',
        endTime: '12:00',
        totalMarks: 100,
        passingMarks: 40,
        venue: 'Exam Hall A',
        status: 'COMPLETED',
        resultsPublished: true,
      },
      {
        id: '4',
        name: 'Class Test 1',
        subject: { name: 'Computer Networks', code: 'CS304' },
        examType: 'CLASS_TEST',
        date: '2024-12-10',
        startTime: '14:00',
        endTime: '15:00',
        totalMarks: 25,
        passingMarks: 10,
        venue: 'Room 301',
        status: 'COMPLETED',
        resultsPublished: true,
      },
      {
        id: '5',
        name: 'Lab Practical',
        subject: { name: 'Data Structures Lab', code: 'CS351' },
        examType: 'PRACTICAL',
        date: '2025-01-25',
        startTime: '14:00',
        endTime: '17:00',
        totalMarks: 50,
        passingMarks: 20,
        venue: 'Computer Lab 2',
        status: 'SCHEDULED',
        resultsPublished: false,
      },
    ];

    setTimeout(() => {
      setExams(mockExams);
      setLoading(false);
    }, 500);
  }, []);

  const filteredExams = exams.filter(exam => {
    const matchesSearch = 
      exam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.subject.code.toLowerCase().includes(searchTerm.toLowerCase());

    if (activeTab === 'upcoming') return matchesSearch && exam.status === 'SCHEDULED';
    if (activeTab === 'ongoing') return matchesSearch && exam.status === 'ONGOING';
    if (activeTab === 'completed') return matchesSearch && exam.status === 'COMPLETED';
    return matchesSearch;
  });

  const getStatusBadge = (status: string, resultsPublished: boolean) => {
    if (status === 'COMPLETED' && resultsPublished) {
      return { color: 'bg-green-100 text-green-700', label: 'Results Published' };
    }
    const badges: Record<string, { color: string; label: string }> = {
      SCHEDULED: { color: 'bg-blue-100 text-blue-700', label: 'Scheduled' },
      ONGOING: { color: 'bg-amber-100 text-amber-700', label: 'Ongoing' },
      COMPLETED: { color: 'bg-purple-100 text-purple-700', label: 'Completed' },
      CANCELLED: { color: 'bg-red-100 text-red-700', label: 'Cancelled' },
    };
    return badges[status] || { color: 'bg-gray-100 text-gray-700', label: status };
  };

  const getExamTypeBadge = (type: string) => {
    const badges: Record<string, string> = {
      MID_TERM: 'bg-indigo-50 text-indigo-600',
      END_TERM: 'bg-purple-50 text-purple-600',
      CLASS_TEST: 'bg-cyan-50 text-cyan-600',
      PRACTICAL: 'bg-emerald-50 text-emerald-600',
      ASSIGNMENT: 'bg-amber-50 text-amber-600',
    };
    return badges[type] || 'bg-gray-50 text-gray-600';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Examinations</h1>
          <p className="text-gray-500">Schedule and manage examinations</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/dashboard/exams/results"
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z" />
            </svg>
            Enter Results
          </Link>
          <Link
            href="/dashboard/exams/new"
            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Schedule Exam
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Upcoming</p>
              <p className="text-2xl font-bold text-gray-900">{exams.filter(e => e.status === 'SCHEDULED').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ongoing</p>
              <p className="text-2xl font-bold text-gray-900">{exams.filter(e => e.status === 'ONGOING').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{exams.filter(e => e.status === 'COMPLETED').length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.125 2.25h-4.5c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125v-9M10.125 2.25h.375a9 9 0 0 1 9 9v.375M10.125 2.25A3.375 3.375 0 0 1 13.5 5.625v1.5c0 .621.504 1.125 1.125 1.125h1.5a3.375 3.375 0 0 1 3.375 3.375M9 15l2.25 2.25L15 12" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Results Published</p>
              <p className="text-2xl font-bold text-gray-900">{exams.filter(e => e.resultsPublished).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4 border-b border-gray-100">
          <div className="flex gap-2">
            {(['upcoming', 'ongoing', 'completed'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === tab
                    ? 'bg-indigo-100 text-indigo-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
          <div className="relative w-full sm:w-64">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              type="text"
              placeholder="Search exams..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Exam List */}
        <div className="divide-y divide-gray-100">
          {filteredExams.map(exam => {
            const badge = getStatusBadge(exam.status, exam.resultsPublished);
            return (
              <div key={exam.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">{exam.subject.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getExamTypeBadge(exam.examType)}`}>
                        {exam.examType.replace('_', ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-3">{exam.name} • {exam.subject.code}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                        </svg>
                        {new Date(exam.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                        {exam.startTime} - {exam.endTime}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                        </svg>
                        {exam.venue}
                      </span>
                      <span>
                        Marks: {exam.totalMarks} (Pass: {exam.passingMarks})
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${badge.color}`}>
                      {badge.label}
                    </span>
                    <Link
                      href={`/dashboard/exams/${exam.id}`}
                      className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredExams.length === 0 && (
          <div className="p-12 text-center">
            <svg className="w-12 h-12 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
            </svg>
            <p className="mt-4 text-gray-500">No {activeTab} exams found</p>
          </div>
        )}
      </div>
    </div>
  );
}
