'use client';

import { useState } from 'react';

interface ScheduleSlot {
  id: string;
  subject: string;
  subjectCode: string;
  faculty: string;
  room: string;
  type: 'LECTURE' | 'LAB' | 'TUTORIAL';
}

interface DaySchedule {
  day: string;
  slots: { [key: string]: ScheduleSlot | null };
}

const timeSlots = [
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '12:00 - 01:00',
  '02:00 - 03:00',
  '03:00 - 04:00',
  '04:00 - 05:00',
];

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export default function TimetablePage() {
  const [selectedSection, setSelectedSection] = useState('btcs-2024-a');
  const [viewMode, setViewMode] = useState<'week' | 'day'>('week');
  const [selectedDay, setSelectedDay] = useState('Monday');

  // Mock timetable data
  const timetable: DaySchedule[] = [
    {
      day: 'Monday',
      slots: {
        '09:00 - 10:00': { id: '1', subject: 'Data Structures', subjectCode: 'CS301', faculty: 'Dr. Sharma', room: '301', type: 'LECTURE' },
        '10:00 - 11:00': { id: '2', subject: 'Data Structures', subjectCode: 'CS301', faculty: 'Dr. Sharma', room: '301', type: 'LECTURE' },
        '11:00 - 12:00': { id: '3', subject: 'DBMS', subjectCode: 'CS302', faculty: 'Prof. Verma', room: '302', type: 'LECTURE' },
        '12:00 - 01:00': null,
        '02:00 - 03:00': { id: '4', subject: 'OS', subjectCode: 'CS303', faculty: 'Dr. Patel', room: '205', type: 'LECTURE' },
        '03:00 - 04:00': { id: '5', subject: 'DS Lab', subjectCode: 'CS351', faculty: 'Dr. Sharma', room: 'Lab 2', type: 'LAB' },
        '04:00 - 05:00': { id: '6', subject: 'DS Lab', subjectCode: 'CS351', faculty: 'Dr. Sharma', room: 'Lab 2', type: 'LAB' },
      },
    },
    {
      day: 'Tuesday',
      slots: {
        '09:00 - 10:00': { id: '7', subject: 'Computer Networks', subjectCode: 'CS304', faculty: 'Dr. Singh', room: '303', type: 'LECTURE' },
        '10:00 - 11:00': { id: '8', subject: 'Computer Networks', subjectCode: 'CS304', faculty: 'Dr. Singh', room: '303', type: 'LECTURE' },
        '11:00 - 12:00': { id: '9', subject: 'OS', subjectCode: 'CS303', faculty: 'Dr. Patel', room: '205', type: 'LECTURE' },
        '12:00 - 01:00': null,
        '02:00 - 03:00': { id: '10', subject: 'DBMS', subjectCode: 'CS302', faculty: 'Prof. Verma', room: '302', type: 'LECTURE' },
        '03:00 - 04:00': { id: '11', subject: 'DBMS Tutorial', subjectCode: 'CS302', faculty: 'Prof. Verma', room: '302', type: 'TUTORIAL' },
        '04:00 - 05:00': null,
      },
    },
    {
      day: 'Wednesday',
      slots: {
        '09:00 - 10:00': { id: '12', subject: 'Data Structures', subjectCode: 'CS301', faculty: 'Dr. Sharma', room: '301', type: 'LECTURE' },
        '10:00 - 11:00': { id: '13', subject: 'Theory of Computation', subjectCode: 'CS305', faculty: 'Dr. Gupta', room: '204', type: 'LECTURE' },
        '11:00 - 12:00': { id: '14', subject: 'Theory of Computation', subjectCode: 'CS305', faculty: 'Dr. Gupta', room: '204', type: 'LECTURE' },
        '12:00 - 01:00': null,
        '02:00 - 03:00': { id: '15', subject: 'CN Lab', subjectCode: 'CS354', faculty: 'Dr. Singh', room: 'Lab 3', type: 'LAB' },
        '03:00 - 04:00': { id: '16', subject: 'CN Lab', subjectCode: 'CS354', faculty: 'Dr. Singh', room: 'Lab 3', type: 'LAB' },
        '04:00 - 05:00': { id: '17', subject: 'CN Lab', subjectCode: 'CS354', faculty: 'Dr. Singh', room: 'Lab 3', type: 'LAB' },
      },
    },
    {
      day: 'Thursday',
      slots: {
        '09:00 - 10:00': { id: '18', subject: 'DBMS', subjectCode: 'CS302', faculty: 'Prof. Verma', room: '302', type: 'LECTURE' },
        '10:00 - 11:00': { id: '19', subject: 'OS', subjectCode: 'CS303', faculty: 'Dr. Patel', room: '205', type: 'LECTURE' },
        '11:00 - 12:00': { id: '20', subject: 'Computer Networks', subjectCode: 'CS304', faculty: 'Dr. Singh', room: '303', type: 'LECTURE' },
        '12:00 - 01:00': null,
        '02:00 - 03:00': { id: '21', subject: 'OS Lab', subjectCode: 'CS353', faculty: 'Dr. Patel', room: 'Lab 1', type: 'LAB' },
        '03:00 - 04:00': { id: '22', subject: 'OS Lab', subjectCode: 'CS353', faculty: 'Dr. Patel', room: 'Lab 1', type: 'LAB' },
        '04:00 - 05:00': null,
      },
    },
    {
      day: 'Friday',
      slots: {
        '09:00 - 10:00': { id: '23', subject: 'Theory of Computation', subjectCode: 'CS305', faculty: 'Dr. Gupta', room: '204', type: 'LECTURE' },
        '10:00 - 11:00': { id: '24', subject: 'Data Structures', subjectCode: 'CS301', faculty: 'Dr. Sharma', room: '301', type: 'LECTURE' },
        '11:00 - 12:00': { id: '25', subject: 'OS', subjectCode: 'CS303', faculty: 'Dr. Patel', room: '205', type: 'LECTURE' },
        '12:00 - 01:00': null,
        '02:00 - 03:00': { id: '26', subject: 'DBMS Lab', subjectCode: 'CS352', faculty: 'Prof. Verma', room: 'Lab 2', type: 'LAB' },
        '03:00 - 04:00': { id: '27', subject: 'DBMS Lab', subjectCode: 'CS352', faculty: 'Prof. Verma', room: 'Lab 2', type: 'LAB' },
        '04:00 - 05:00': { id: '28', subject: 'DBMS Lab', subjectCode: 'CS352', faculty: 'Prof. Verma', room: 'Lab 2', type: 'LAB' },
      },
    },
    {
      day: 'Saturday',
      slots: {
        '09:00 - 10:00': { id: '29', subject: 'Computer Networks', subjectCode: 'CS304', faculty: 'Dr. Singh', room: '303', type: 'LECTURE' },
        '10:00 - 11:00': { id: '30', subject: 'Theory of Computation', subjectCode: 'CS305', faculty: 'Dr. Gupta', room: '204', type: 'LECTURE' },
        '11:00 - 12:00': null,
        '12:00 - 01:00': null,
        '02:00 - 03:00': null,
        '03:00 - 04:00': null,
        '04:00 - 05:00': null,
      },
    },
  ];

  const getSlotColor = (type: string) => {
    switch (type) {
      case 'LECTURE':
        return 'bg-indigo-100 border-indigo-300 text-indigo-800';
      case 'LAB':
        return 'bg-emerald-100 border-emerald-300 text-emerald-800';
      case 'TUTORIAL':
        return 'bg-amber-100 border-amber-300 text-amber-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const currentDaySchedule = timetable.find(d => d.day === selectedDay);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timetable</h1>
          <p className="text-gray-500">View and manage class schedules</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="btcs-2024-a">B.Tech CSE 2024 - Section A</option>
            <option value="btcs-2024-b">B.Tech CSE 2024 - Section B</option>
            <option value="btec-2024-a">B.Tech ECE 2024 - Section A</option>
          </select>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'week' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'day' ? 'bg-white shadow text-gray-900' : 'text-gray-500'
              }`}
            >
              Day
            </button>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <span className="text-sm font-medium text-gray-700">Legend:</span>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-indigo-100 border border-indigo-300"></span>
          <span className="text-sm text-gray-600">Lecture</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-emerald-100 border border-emerald-300"></span>
          <span className="text-sm text-gray-600">Lab</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-amber-100 border border-amber-300"></span>
          <span className="text-sm text-gray-600">Tutorial</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-4 rounded bg-gray-100 border border-gray-300"></span>
          <span className="text-sm text-gray-600">Break</span>
        </div>
      </div>

      {/* Day selector for day view */}
      {viewMode === 'day' && (
        <div className="flex flex-wrap gap-2">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedDay === day
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {day}
            </button>
          ))}
        </div>
      )}

      {/* Timetable Grid - Week View */}
      {viewMode === 'week' && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider w-28">
                    Time
                  </th>
                  {days.map(day => (
                    <th key={day} className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      {day}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {timeSlots.map((slot, slotIndex) => (
                  <tr key={slot} className={slotIndex === 3 ? 'bg-gray-50' : ''}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-700 whitespace-nowrap">
                      {slot}
                      {slotIndex === 3 && <span className="ml-2 text-xs text-gray-400">(Lunch)</span>}
                    </td>
                    {days.map(day => {
                      const daySchedule = timetable.find(d => d.day === day);
                      const classSlot = daySchedule?.slots[slot];
                      
                      if (slotIndex === 3) {
                        return (
                          <td key={day} className="px-2 py-2 text-center">
                            <span className="text-xs text-gray-400">Break</span>
                          </td>
                        );
                      }

                      return (
                        <td key={day} className="px-2 py-2">
                          {classSlot ? (
                            <div className={`p-2 rounded-lg border ${getSlotColor(classSlot.type)} text-xs`}>
                              <p className="font-semibold truncate">{classSlot.subject}</p>
                              <p className="opacity-75">{classSlot.room}</p>
                            </div>
                          ) : (
                            <div className="h-12"></div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Day View */}
      {viewMode === 'day' && currentDaySchedule && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{selectedDay}&apos;s Schedule</h2>
          <div className="space-y-3">
            {timeSlots.map((slot, index) => {
              const classSlot = currentDaySchedule.slots[slot];
              
              if (index === 3) {
                return (
                  <div key={slot} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-28 text-sm font-medium text-gray-500">{slot}</div>
                    <div className="flex-1 text-center text-gray-400">Lunch Break</div>
                  </div>
                );
              }

              return (
                <div key={slot} className={`flex items-center gap-4 p-4 rounded-lg ${classSlot ? getSlotColor(classSlot.type) : 'bg-gray-50'}`}>
                  <div className="w-28 text-sm font-medium">{slot}</div>
                  {classSlot ? (
                    <div className="flex-1 flex items-center justify-between">
                      <div>
                        <p className="font-semibold">{classSlot.subject}</p>
                        <p className="text-sm opacity-75">{classSlot.subjectCode} • {classSlot.faculty}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{classSlot.room}</p>
                        <p className="text-xs opacity-75">{classSlot.type}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 text-gray-400">Free Period</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
