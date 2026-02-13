'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

interface StudentDetails {
  id: string;
  registrationNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  guardianName: string;
  guardianPhone: string;
  guardianRelation: string;
  section: {
    name: string;
    batch: {
      name: string;
      course: {
        name: string;
        code: string;
        department: { name: string };
      };
    };
  };
  status: string;
  admissionDate: string;
  attendance: { percentage: number; present: number; absent: number; total: number };
  fees: { paid: number; pending: number; total: number };
  cgpa: number;
}

export default function StudentDetailPage() {
  const params = useParams();
  const [student, setStudent] = useState<StudentDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'attendance' | 'fees' | 'results'>('overview');

  useEffect(() => {
    // Mock API call
    const mockStudent: StudentDetails = {
      id: params.id as string,
      registrationNumber: 'STU2024001',
      firstName: 'Rahul',
      lastName: 'Sharma',
      email: 'rahul.sharma@college.edu',
      phone: '+91 98765 43210',
      dateOfBirth: '2004-05-15',
      gender: 'MALE',
      bloodGroup: 'B+',
      address: '123, Green Park Colony, Near City Mall',
      city: 'Jaipur',
      state: 'Rajasthan',
      pincode: '302001',
      guardianName: 'Mr. Rajesh Sharma',
      guardianPhone: '+91 98765 43211',
      guardianRelation: 'Father',
      section: {
        name: 'A',
        batch: {
          name: '2024-28',
          course: {
            name: 'B.Tech Computer Science',
            code: 'BTCS',
            department: { name: 'Computer Science & Engineering' },
          },
        },
      },
      status: 'ACTIVE',
      admissionDate: '2024-07-15',
      attendance: { percentage: 92, present: 46, absent: 4, total: 50 },
      fees: { paid: 125000, pending: 25000, total: 150000 },
      cgpa: 8.7,
    };

    setTimeout(() => {
      setStudent(mockStudent);
      setLoading(false);
    }, 500);
  }, [params.id]);

  if (loading || !student) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/dashboard/students"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
          </svg>
        </Link>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-gray-900">Student Profile</h1>
          <p className="text-gray-500">{student.registrationNumber}</p>
        </div>
        <Link
          href={`/dashboard/students/${student.id}/edit`}
          className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
          </svg>
          Edit
        </Link>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 h-32"></div>
        <div className="px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-12">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-3xl font-bold border-4 border-white shadow-lg">
              {student.firstName[0]}{student.lastName[0]}
            </div>
            <div className="flex-1 sm:pb-2">
              <h2 className="text-2xl font-bold text-gray-900">{student.firstName} {student.lastName}</h2>
              <p className="text-gray-500">{student.section.batch.course.name} • {student.section.batch.name}</p>
            </div>
            <div className="flex flex-wrap gap-2 sm:pb-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                student.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {student.status}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-700">
                Section {student.section.name}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Attendance</p>
              <p className="text-2xl font-bold text-gray-900">{student.attendance.percentage}%</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">CGPA</p>
              <p className="text-2xl font-bold text-gray-900">{student.cgpa}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Fees Paid</p>
              <p className="text-2xl font-bold text-gray-900">₹{(student.fees.paid / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pending Fees</p>
              <p className="text-2xl font-bold text-red-600">₹{(student.fees.pending / 1000).toFixed(0)}K</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100">
          <nav className="flex -mb-px">
            {(['overview', 'attendance', 'fees', 'results'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-indigo-600 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500">Date of Birth</dt>
                    <dd className="font-medium text-gray-900">{new Date(student.dateOfBirth).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500">Gender</dt>
                    <dd className="font-medium text-gray-900">{student.gender}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500">Blood Group</dt>
                    <dd className="font-medium text-gray-900">{student.bloodGroup || '-'}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500">Email</dt>
                    <dd className="font-medium text-gray-900">{student.email}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500">Phone</dt>
                    <dd className="font-medium text-gray-900">{student.phone}</dd>
                  </div>
                </dl>
              </div>

              {/* Academic Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Academic Information</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500">Department</dt>
                    <dd className="font-medium text-gray-900">{student.section.batch.course.department.name}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500">Course</dt>
                    <dd className="font-medium text-gray-900">{student.section.batch.course.code}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500">Batch</dt>
                    <dd className="font-medium text-gray-900">{student.section.batch.name}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500">Section</dt>
                    <dd className="font-medium text-gray-900">{student.section.name}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500">Admission Date</dt>
                    <dd className="font-medium text-gray-900">{new Date(student.admissionDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</dd>
                  </div>
                </dl>
              </div>

              {/* Address */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Address</h3>
                <p className="text-gray-700">
                  {student.address}<br />
                  {student.city}, {student.state} - {student.pincode}
                </p>
              </div>

              {/* Guardian Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Guardian Information</h3>
                <dl className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500">Name</dt>
                    <dd className="font-medium text-gray-900">{student.guardianName}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500">Relation</dt>
                    <dd className="font-medium text-gray-900">{student.guardianRelation}</dd>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <dt className="text-gray-500">Phone</dt>
                    <dd className="font-medium text-gray-900">{student.guardianPhone}</dd>
                  </div>
                </dl>
              </div>
            </div>
          )}

          {activeTab === 'attendance' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">{student.attendance.present}</p>
                  <p className="text-sm text-green-700">Present Days</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-red-600">{student.attendance.absent}</p>
                  <p className="text-sm text-red-700">Absent Days</p>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-indigo-600">{student.attendance.total}</p>
                  <p className="text-sm text-indigo-700">Total Classes</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Subject-wise Attendance</h4>
                <p className="text-gray-500">Detailed attendance records will be displayed here.</p>
              </div>
            </div>
          )}

          {activeTab === 'fees' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-blue-600">₹{student.fees.total.toLocaleString()}</p>
                  <p className="text-sm text-blue-700">Total Fees</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-green-600">₹{student.fees.paid.toLocaleString()}</p>
                  <p className="text-sm text-green-700">Paid Amount</p>
                </div>
                <div className="bg-red-50 rounded-lg p-4 text-center">
                  <p className="text-3xl font-bold text-red-600">₹{student.fees.pending.toLocaleString()}</p>
                  <p className="text-sm text-red-700">Pending Amount</p>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-4">Payment History</h4>
                <p className="text-gray-500">Fee payment records will be displayed here.</p>
              </div>
            </div>
          )}

          {activeTab === 'results' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold text-gray-900">Academic Results</h4>
                <span className="text-2xl font-bold text-indigo-600">CGPA: {student.cgpa}</span>
              </div>
              <p className="text-gray-500">Semester-wise exam results will be displayed here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
