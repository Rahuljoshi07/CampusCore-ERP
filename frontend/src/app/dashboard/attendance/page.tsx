'use client';

import { useState } from 'react';

interface AttendanceRecord {
  studentId: string;
  studentName: string;
  registrationNumber: string;
  status: 'PRESENT' | 'ABSENT' | 'LATE' | null;
}

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedSection, setSelectedSection] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([
    { studentId: '1', studentName: 'Rahul Sharma', registrationNumber: 'STU2024001', status: null },
    { studentId: '2', studentName: 'Priya Patel', registrationNumber: 'STU2024002', status: null },
    { studentId: '3', studentName: 'Amit Kumar', registrationNumber: 'STU2024003', status: null },
    { studentId: '4', studentName: 'Sneha Gupta', registrationNumber: 'STU2024004', status: null },
    { studentId: '5', studentName: 'Vikram Singh', registrationNumber: 'STU2024005', status: null },
    { studentId: '6', studentName: 'Neha Verma', registrationNumber: 'STU2024006', status: null },
    { studentId: '7', studentName: 'Rohan Joshi', registrationNumber: 'STU2024007', status: null },
    { studentId: '8', studentName: 'Anjali Rao', registrationNumber: 'STU2024008', status: null },
  ]);
  const [saving, setSaving] = useState(false);

  const markAllPresent = () => {
    setAttendanceRecords(prev => prev.map(r => ({ ...r, status: 'PRESENT' })));
  };

  const markAllAbsent = () => {
    setAttendanceRecords(prev => prev.map(r => ({ ...r, status: 'ABSENT' })));
  };

  const updateStatus = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE') => {
    setAttendanceRecords(prev => 
      prev.map(r => r.studentId === studentId ? { ...r, status } : r)
    );
  };

  const handleSave = async () => {
    setSaving(true);
    // API call here
    setTimeout(() => {
      setSaving(false);
      alert('Attendance saved successfully!');
    }, 1500);
  };

  const presentCount = attendanceRecords.filter(r => r.status === 'PRESENT').length;
  const absentCount = attendanceRecords.filter(r => r.status === 'ABSENT').length;
  const lateCount = attendanceRecords.filter(r => r.status === 'LATE').length;
  const unmarkedCount = attendanceRecords.filter(r => r.status === null).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-500">Mark and manage student attendance</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.location.href = '/dashboard/attendance/reports'}
            className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
            Reports
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Course / Batch</label>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Course</option>
              <option value="btcs-2024-a">B.Tech CS 2024 - Section A</option>
              <option value="btcs-2024-b">B.Tech CS 2024 - Section B</option>
              <option value="btec-2024-a">B.Tech EC 2024 - Section A</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Subject</option>
              <option value="ds">Data Structures</option>
              <option value="dbms">Database Systems</option>
              <option value="os">Operating Systems</option>
              <option value="cn">Computer Networks</option>
            </select>
          </div>
          <div className="flex items-end">
            <button className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
              Load Students
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m4.5 12.75 6 6 9-13.5" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{presentCount}</p>
              <p className="text-sm text-gray-500">Present</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18 18 6M6 6l12 12" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-red-600">{absentCount}</p>
              <p className="text-sm text-gray-500">Absent</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-600">{lateCount}</p>
              <p className="text-sm text-gray-500">Late</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">{unmarkedCount}</p>
              <p className="text-sm text-gray-500">Unmarked</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="font-semibold text-gray-900">Student List</h2>
          <div className="flex gap-2">
            <button
              onClick={markAllPresent}
              className="px-3 py-1.5 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
            >
              Mark All Present
            </button>
            <button
              onClick={markAllAbsent}
              className="px-3 py-1.5 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
            >
              Mark All Absent
            </button>
          </div>
        </div>

        <div className="divide-y divide-gray-100">
          {attendanceRecords.map((record, index) => (
            <div key={record.studentId} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-medium text-gray-600">
                  {index + 1}
                </span>
                <div>
                  <p className="font-medium text-gray-900">{record.studentName}</p>
                  <p className="text-sm text-gray-500">{record.registrationNumber}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateStatus(record.studentId, 'PRESENT')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    record.status === 'PRESENT'
                      ? 'bg-green-500 text-white ring-2 ring-green-500 ring-offset-2'
                      : 'bg-green-50 text-green-700 hover:bg-green-100'
                  }`}
                >
                  Present
                </button>
                <button
                  onClick={() => updateStatus(record.studentId, 'ABSENT')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    record.status === 'ABSENT'
                      ? 'bg-red-500 text-white ring-2 ring-red-500 ring-offset-2'
                      : 'bg-red-50 text-red-700 hover:bg-red-100'
                  }`}
                >
                  Absent
                </button>
                <button
                  onClick={() => updateStatus(record.studentId, 'LATE')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    record.status === 'LATE'
                      ? 'bg-amber-500 text-white ring-2 ring-amber-500 ring-offset-2'
                      : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                  }`}
                >
                  Late
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving || unmarkedCount > 0}
            className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {saving ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Saving...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m4.5 12.75 6 6 9-13.5" />
                </svg>
                Save Attendance
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
