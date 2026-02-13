'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Faculty {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  designation: string;
  department: { name: string; code: string };
  status: string;
  joiningDate: string;
}

export default function FacultyPage() {
  const [faculty, setFaculty] = useState<Faculty[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');

  useEffect(() => {
    const mockFaculty: Faculty[] = [
      {
        id: '1',
        employeeId: 'FAC001',
        firstName: 'Dr. Anil',
        lastName: 'Sharma',
        email: 'anil.sharma@college.edu',
        phone: '+91 98765 11111',
        designation: 'Professor',
        department: { name: 'Computer Science & Engineering', code: 'CSE' },
        status: 'ACTIVE',
        joiningDate: '2015-07-01',
      },
      {
        id: '2',
        employeeId: 'FAC002',
        firstName: 'Dr. Priya',
        lastName: 'Verma',
        email: 'priya.verma@college.edu',
        phone: '+91 98765 22222',
        designation: 'Associate Professor',
        department: { name: 'Computer Science & Engineering', code: 'CSE' },
        status: 'ACTIVE',
        joiningDate: '2018-01-15',
      },
      {
        id: '3',
        employeeId: 'FAC003',
        firstName: 'Dr. Rajesh',
        lastName: 'Patel',
        email: 'rajesh.patel@college.edu',
        phone: '+91 98765 33333',
        designation: 'Professor',
        department: { name: 'Electronics & Communication', code: 'ECE' },
        status: 'ACTIVE',
        joiningDate: '2012-08-20',
      },
      {
        id: '4',
        employeeId: 'FAC004',
        firstName: 'Prof. Sunita',
        lastName: 'Gupta',
        email: 'sunita.gupta@college.edu',
        phone: '+91 98765 44444',
        designation: 'Assistant Professor',
        department: { name: 'Mechanical Engineering', code: 'ME' },
        status: 'ACTIVE',
        joiningDate: '2020-02-10',
      },
      {
        id: '5',
        employeeId: 'FAC005',
        firstName: 'Dr. Vikram',
        lastName: 'Singh',
        email: 'vikram.singh@college.edu',
        phone: '+91 98765 55555',
        designation: 'HOD',
        department: { name: 'Civil Engineering', code: 'CE' },
        status: 'ACTIVE',
        joiningDate: '2010-06-01',
      },
    ];

    setTimeout(() => {
      setFaculty(mockFaculty);
      setLoading(false);
    }, 500);
  }, []);

  const departments = Array.from(new Set(faculty.map(f => f.department.code)));

  const filteredFaculty = faculty.filter(f => {
    const matchesSearch = 
      f.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      f.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = departmentFilter === 'all' || f.department.code === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  const getDesignationBadge = (designation: string) => {
    const colors: Record<string, string> = {
      'Professor': 'bg-purple-100 text-purple-700',
      'Associate Professor': 'bg-blue-100 text-blue-700',
      'Assistant Professor': 'bg-green-100 text-green-700',
      'HOD': 'bg-amber-100 text-amber-700',
      'Lecturer': 'bg-gray-100 text-gray-700',
    };
    return colors[designation] || 'bg-gray-100 text-gray-700';
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
          <h1 className="text-2xl font-bold text-gray-900">Faculty</h1>
          <p className="text-gray-500">Manage faculty members and their assignments</p>
        </div>
        <Link
          href="/dashboard/faculty/new"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Faculty
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{faculty.length}</p>
              <p className="text-sm text-gray-500">Total Faculty</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{faculty.filter(f => f.designation === 'Professor').length}</p>
              <p className="text-sm text-gray-500">Professors</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Zm0 3h.008v.008h-.008v-.008Z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{departments.length}</p>
              <p className="text-sm text-gray-500">Departments</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center">
              <svg className="w-5 h-5 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{faculty.filter(f => f.designation === 'HOD').length}</p>
              <p className="text-sm text-gray-500">HODs</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name, employee ID, or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="all">All Departments</option>
            {departments.map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Faculty Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredFaculty.map((f) => (
          <Link
            key={f.id}
            href={`/dashboard/faculty/${f.id}`}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-indigo-200 transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xl font-bold group-hover:scale-105 transition-transform">
                {f.firstName.split(' ').pop()?.[0]}{f.lastName[0]}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{f.firstName} {f.lastName}</h3>
                <p className="text-sm text-gray-500 truncate">{f.employeeId}</p>
              </div>
            </div>
            
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDesignationBadge(f.designation)}`}>
                  {f.designation}
                </span>
                <span className="text-xs text-gray-500">{f.department.code}</span>
              </div>
              <p className="text-sm text-gray-500 truncate">{f.email}</p>
              <p className="text-sm text-gray-500">{f.phone}</p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
              <span className={`inline-flex items-center gap-1 text-xs ${
                f.status === 'ACTIVE' ? 'text-green-600' : 'text-gray-500'
              }`}>
                <span className={`w-2 h-2 rounded-full ${
                  f.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400'
                }`}></span>
                {f.status}
              </span>
              <span className="text-xs text-gray-400">Since {new Date(f.joiningDate).getFullYear()}</span>
            </div>
          </Link>
        ))}
      </div>

      {filteredFaculty.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
          </svg>
          <p className="mt-4 text-gray-500">No faculty members found</p>
        </div>
      )}
    </div>
  );
}
