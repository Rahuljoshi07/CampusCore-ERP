'use client';

import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);

  const getRoleDisplay = () => {
    const role = user?.role || 'USER';
    const roleMap: Record<string, string> = {
      'SUPER_ADMIN': 'Super Administrator',
      'ADMIN': 'Administrator',
      'FACULTY': 'Faculty Member',
      'STUDENT': 'Student',
      'STAFF': 'Staff Member',
    };
    return roleMap[role] || role;
  };

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome {user?.firstName || 'User'}!
          </h1>
          <p className="text-sm text-gray-500 mt-0.5">
            Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
            Jan 1 — Dec 31
          </div>
          <select className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 focus:ring-2 focus:ring-indigo-500">
            <option>Yearly</option>
            <option>Monthly</option>
            <option>Weekly</option>
          </select>
          <button className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" /></svg>
            Filter
          </button>
          <button className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" /></svg>
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Total Students */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.26 10.147a60.438 60.438 0 00-.491 6.347A48.62 48.62 0 0112 20.904a48.62 48.62 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.636 50.636 0 00-2.658-.813A59.906 59.906 0 0112 3.493a59.903 59.903 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0112 13.489a50.702 50.702 0 017.74-3.342" /></svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">2,450</p>
              <p className="text-sm text-gray-500">Total number of students</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-0.5">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                120 more than last year
              </p>
            </div>
          </div>
        </div>

        {/* Total Applications */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">380</p>
              <p className="text-sm text-gray-500">Total admissions</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-0.5">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                0.5% more than last semester
              </p>
            </div>
          </div>
        </div>

        {/* Total Courses */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">75</p>
              <p className="text-sm text-gray-500">Total courses</p>
              <p className="text-xs text-green-600 mt-1 flex items-center gap-0.5">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
                4% more than last semester
              </p>
            </div>
          </div>
        </div>

        {/* Total Departments */}
        <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center flex-shrink-0">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" /></svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">12</p>
              <p className="text-sm text-gray-500">Total departments</p>
              <p className="text-xs text-gray-500 mt-1 flex items-center gap-0.5">
                <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                Without changes
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Middle Row - 3 Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Student Admissions Card (Donut Chart) */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Student admissions</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
            </button>
          </div>
          {/* Donut Chart */}
          <div className="flex items-center justify-center py-4">
            <div className="relative">
              <svg width="180" height="180" viewBox="0 0 180 180">
                <circle cx="90" cy="90" r="70" fill="none" stroke="#f3f4f6" strokeWidth="24" />
                {/* Pending - Yellow */}
                <circle cx="90" cy="90" r="70" fill="none" stroke="#f59e0b" strokeWidth="24"
                  strokeDasharray="220 440" strokeDashoffset="0" transform="rotate(-90 90 90)" />
                {/* Approved - Green */}
                <circle cx="90" cy="90" r="70" fill="none" stroke="#10b981" strokeWidth="24"
                  strokeDasharray="132 528" strokeDashoffset="-220" transform="rotate(-90 90 90)" />
                {/* Rejected - Red */}
                <circle cx="90" cy="90" r="70" fill="none" stroke="#ef4444" strokeWidth="24"
                  strokeDasharray="88 572" strokeDashoffset="-352" transform="rotate(-90 90 90)" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-gray-900">380</span>
                <span className="text-xs text-gray-500">Total applications</span>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">190</p>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <span className="text-xs text-gray-500">Pending</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">120</p>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
                <span className="text-xs text-gray-500">Approved</span>
              </div>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-gray-900">70</p>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                <span className="text-xs text-gray-500">Rejected</span>
              </div>
            </div>
          </div>
        </div>

        {/* Annual Fee Collection (Bar Chart) */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-base font-semibold text-gray-900">Annual fee collection</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
            </button>
          </div>
          {/* Bar Chart */}
          <div className="flex items-end gap-3 h-48 mt-4 px-2">
            {[
              { month: 'Jul', tuition: 85, hostel: 40, lab: 20 },
              { month: 'Aug', tuition: 70, hostel: 35, lab: 25 },
              { month: 'Sep', tuition: 90, hostel: 50, lab: 30 },
              { month: 'Oct', tuition: 95, hostel: 45, lab: 35 },
              { month: 'Nov', tuition: 80, hostel: 55, lab: 25 },
              { month: 'Dec', tuition: 100, hostel: 60, lab: 40 },
            ].map((item) => (
              <div key={item.month} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col items-center gap-0.5" style={{ height: '160px', justifyContent: 'flex-end' }}>
                  <div className="w-full max-w-[28px] bg-red-400 rounded-t-sm" style={{ height: `${item.lab}%` }}></div>
                  <div className="w-full max-w-[28px] bg-amber-400 rounded-none" style={{ height: `${item.hostel}%` }}></div>
                  <div className="w-full max-w-[28px] bg-indigo-500 rounded-b-sm" style={{ height: `${item.tuition}%` }}></div>
                </div>
                <span className="text-[10px] text-gray-500 mt-1">{item.month}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-indigo-500"></div>
              <span className="text-xs text-gray-500">Tuition</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-amber-400"></div>
              <span className="text-xs text-gray-500">Hostel</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2.5 h-2.5 rounded-sm bg-red-400"></div>
              <span className="text-xs text-gray-500">Lab</span>
            </div>
          </div>
        </div>

        {/* Total Fee Income (Line Chart) */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-base font-semibold text-gray-900">Total fee income</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
            </button>
          </div>
          <p className="text-3xl font-bold text-gray-900 mb-0.5">₹1,18,00,000</p>
          <p className="text-xs text-green-600 flex items-center gap-1 mb-4">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" /></svg>
            21% vs last semester
          </p>
          {/* Area chart visualization */}
          <div className="relative h-36">
            <svg className="w-full h-full" viewBox="0 0 300 120" preserveAspectRatio="none">
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#818cf8" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#818cf8" stopOpacity="0.02" />
                </linearGradient>
              </defs>
              <path d="M0,100 L50,85 L100,90 L150,60 L200,40 L250,20 L300,25 L300,120 L0,120 Z" fill="url(#areaGrad)" />
              <path d="M0,100 L50,85 L100,90 L150,60 L200,40 L250,20 L300,25" fill="none" stroke="#6366f1" strokeWidth="2.5" />
              <circle cx="250" cy="20" r="4" fill="#6366f1" stroke="white" strokeWidth="2" />
              {/* Tooltip */}
              <rect x="215" y="24" width="70" height="22" rx="4" fill="#6366f1" />
              <text x="250" y="39" textAnchor="middle" fill="white" fontSize="10" fontWeight="600">₹34,00,849</text>
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-gray-400 px-1">
              <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row - 2 Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Fee Receipts Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-gray-900">Fee receipts</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">S/N</th>
                  <th className="pb-3 font-medium">Subject</th>
                  <th className="pb-3 font-medium">Date</th>
                  <th className="pb-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { sn: '01', student: 'Tuition Fee — Semester 6', date: '25/01/2026', status: 'Pending' },
                  { sn: '02', student: 'Lab Fee — Computer Science', date: '19/01/2026', status: 'Paid' },
                  { sn: '03', student: 'Hostel Fee — Block A', date: '10/01/2026', status: 'Paid' },
                  { sn: '04', student: 'Library Security Deposit', date: '03/01/2026', status: 'Pending' },
                ].map((row) => (
                  <tr key={row.sn} className="hover:bg-gray-50">
                    <td className="py-3 text-gray-500">{row.sn}</td>
                    <td className="py-3 text-gray-900 font-medium">{row.student}</td>
                    <td className="py-3 text-gray-500">{row.date}</td>
                    <td className="py-3">
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                        row.status === 'Paid'
                          ? 'bg-green-50 text-green-600'
                          : 'bg-amber-50 text-amber-600'
                      }`}>
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Department Budget Table */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-base font-semibold text-gray-900">Department budget</h3>
            <button className="text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" /></svg>
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-xs text-gray-500 border-b border-gray-100">
                  <th className="pb-3 font-medium">S/N</th>
                  <th className="pb-3 font-medium">Dept. Code</th>
                  <th className="pb-3 font-medium">Budgeted (₹)</th>
                  <th className="pb-3 font-medium">Actual (₹)</th>
                  <th className="pb-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {[
                  { sn: '01', dept: 'CSE-001', budgeted: '14,00,000', actual: '13,80,000', date: '25/01/2026' },
                  { sn: '02', dept: 'ECE-002', budgeted: '4,00,000', actual: '5,00,000', date: '22/01/2026' },
                  { sn: '03', dept: 'MEC-003', budgeted: '20,00,000', actual: '14,00,000', date: '20/01/2026' },
                  { sn: '04', dept: 'CIV-004', budgeted: '8,00,000', actual: '18,00,000', date: '20/01/2026' },
                ].map((row) => (
                  <tr key={row.sn} className="hover:bg-gray-50">
                    <td className="py-3 text-gray-500">{row.sn}</td>
                    <td className="py-3 text-gray-900 font-medium">{row.dept}</td>
                    <td className="py-3 text-gray-500">₹{row.budgeted}</td>
                    <td className="py-3 text-gray-500">₹{row.actual}</td>
                    <td className="py-3 text-gray-500">{row.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
