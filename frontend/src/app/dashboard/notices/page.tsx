'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Notice {
  id: string;
  title: string;
  content: string;
  type: 'GENERAL' | 'ACADEMIC' | 'EXAM' | 'EVENT' | 'URGENT';
  targetAudience: string[];
  attachments: { name: string; url: string }[];
  publishedAt: string;
  expiresAt: string | null;
  author: { name: string; designation: string };
  isPinned: boolean;
}

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const mockNotices: Notice[] = [
      {
        id: '1',
        title: 'End Semester Examination Schedule - Dec 2024',
        content: 'The end semester examinations for the academic year 2024-25 (Odd Semester) will commence from 15th December 2024. Students are advised to check their hall tickets and exam centers carefully. All examinations will start at 9:00 AM sharp. Late entry will not be permitted after 15 minutes.',
        type: 'EXAM',
        targetAudience: ['STUDENT'],
        attachments: [{ name: 'Exam_Schedule.pdf', url: '#' }],
        publishedAt: '2024-12-20T10:30:00',
        expiresAt: '2024-12-25',
        author: { name: 'Dr. S.K. Sharma', designation: 'Controller of Examinations' },
        isPinned: true,
      },
      {
        id: '2',
        title: 'Annual Sports Meet 2025 - Registration Open',
        content: 'The Annual Sports Meet 2025 will be held from 15th to 20th January 2025. Students interested in participating are requested to register through the sports portal or contact the Physical Education Department. Last date for registration is 10th January 2025.',
        type: 'EVENT',
        targetAudience: ['STUDENT', 'FACULTY'],
        attachments: [],
        publishedAt: '2024-12-19T09:00:00',
        expiresAt: '2025-01-10',
        author: { name: 'Prof. R.K. Verma', designation: 'Director of Sports' },
        isPinned: true,
      },
      {
        id: '3',
        title: 'Library Closed on Saturday',
        content: 'The Central Library will remain closed on Saturday, 21st December 2024 due to annual maintenance work. Digital library services will be available as usual.',
        type: 'GENERAL',
        targetAudience: ['STUDENT', 'FACULTY', 'STAFF'],
        attachments: [],
        publishedAt: '2024-12-18T14:00:00',
        expiresAt: null,
        author: { name: 'Ms. Priya Gupta', designation: 'Chief Librarian' },
        isPinned: false,
      },
      {
        id: '4',
        title: 'Faculty Meeting - All HODs',
        content: 'A faculty meeting is scheduled for 22nd December 2024 at 3:00 PM in the Board Room. All HODs are requested to attend with their departmental reports.',
        type: 'GENERAL',
        targetAudience: ['FACULTY'],
        attachments: [{ name: 'Meeting_Agenda.pdf', url: '#' }],
        publishedAt: '2024-12-17T11:00:00',
        expiresAt: null,
        author: { name: 'Dr. A.K. Patel', designation: 'Dean Academics' },
        isPinned: false,
      },
      {
        id: '5',
        title: 'Fee Payment Deadline Extended',
        content: 'Due to technical issues in the payment portal, the last date for fee payment has been extended to 31st December 2024. Students are advised to complete their fee payment before the deadline to avoid late fee charges.',
        type: 'URGENT',
        targetAudience: ['STUDENT'],
        attachments: [],
        publishedAt: '2024-12-16T16:30:00',
        expiresAt: '2024-12-31',
        author: { name: 'Mr. V.K. Singh', designation: 'Finance Officer' },
        isPinned: true,
      },
      {
        id: '6',
        title: 'Placement Drive - TCS',
        content: 'TCS will be conducting campus placement drive on 5th January 2025. Eligible students (B.Tech/M.Tech with 60%+ aggregate) are requested to register on the placement portal by 30th December 2024.',
        type: 'ACADEMIC',
        targetAudience: ['STUDENT'],
        attachments: [{ name: 'TCS_JD.pdf', url: '#' }, { name: 'Eligibility_Criteria.pdf', url: '#' }],
        publishedAt: '2024-12-15T10:00:00',
        expiresAt: '2024-12-30',
        author: { name: 'Dr. M.K. Joshi', designation: 'Training & Placement Officer' },
        isPinned: false,
      },
    ];

    setTimeout(() => {
      setNotices(mockNotices);
      setLoading(false);
    }, 500);
  }, []);

  const getTypeBadge = (type: string) => {
    const badges: Record<string, { color: string; bg: string }> = {
      GENERAL: { color: 'text-gray-700', bg: 'bg-gray-100' },
      ACADEMIC: { color: 'text-blue-700', bg: 'bg-blue-100' },
      EXAM: { color: 'text-purple-700', bg: 'bg-purple-100' },
      EVENT: { color: 'text-green-700', bg: 'bg-green-100' },
      URGENT: { color: 'text-red-700', bg: 'bg-red-100' },
    };
    return badges[type] || badges.GENERAL;
  };

  const filteredNotices = notices.filter(notice => {
    const matchesSearch = 
      notice.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notice.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || notice.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const pinnedNotices = filteredNotices.filter(n => n.isPinned);
  const regularNotices = filteredNotices.filter(n => !n.isPinned);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) {
      const hours = Math.floor(diff / (1000 * 60 * 60));
      if (hours === 0) {
        const minutes = Math.floor(diff / (1000 * 60));
        return `${minutes} minutes ago`;
      }
      return `${hours} hours ago`;
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return `${days} days ago`;
    }
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
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
          <h1 className="text-2xl font-bold text-gray-900">Notices & Announcements</h1>
          <p className="text-gray-500">Stay updated with important announcements</p>
        </div>
        <Link
          href="/dashboard/notices/new"
          className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-sm"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Post Notice
        </Link>
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
                placeholder="Search notices..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex gap-2 overflow-x-auto">
            {['all', 'URGENT', 'EXAM', 'ACADEMIC', 'EVENT', 'GENERAL'].map(type => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  typeFilter === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {type === 'all' ? 'All' : type.charAt(0) + type.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Pinned Notices */}
      {pinnedNotices.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M16 4v12l-4-2.667L8 16V4h8z" />
            </svg>
            Pinned Notices
          </h2>
          <div className="space-y-4">
            {pinnedNotices.map(notice => {
              const badge = getTypeBadge(notice.type);
              return (
                <div key={notice.id} className="bg-white rounded-xl shadow-sm border-2 border-amber-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.color}`}>
                          {notice.type}
                        </span>
                        <span className="text-sm text-gray-500">{formatDate(notice.publishedAt)}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{notice.title}</h3>
                      <p className="text-gray-600 text-sm line-clamp-2">{notice.content}</p>
                      
                      {notice.attachments.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {notice.attachments.map((att, i) => (
                            <a
                              key={i}
                              href={att.url}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                            >
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                              </svg>
                              {att.name}
                            </a>
                          ))}
                        </div>
                      )}

                      <div className="mt-3 text-xs text-gray-500">
                        Posted by {notice.author.name}, {notice.author.designation}
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/notices/${notice.id}`}
                      className="flex-shrink-0 inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                    >
                      Read More
                      <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Regular Notices */}
      <div>
        {pinnedNotices.length > 0 && <h2 className="text-lg font-semibold text-gray-900 mb-4">All Notices</h2>}
        <div className="space-y-4">
          {regularNotices.map(notice => {
            const badge = getTypeBadge(notice.type);
            return (
              <div key={notice.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${badge.bg} ${badge.color}`}>
                        {notice.type}
                      </span>
                      <span className="text-sm text-gray-500">{formatDate(notice.publishedAt)}</span>
                      {notice.targetAudience.length > 0 && (
                        <span className="text-xs text-gray-400">
                          • For: {notice.targetAudience.join(', ')}
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{notice.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{notice.content}</p>
                    
                    {notice.attachments.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {notice.attachments.map((att, i) => (
                          <a
                            key={i}
                            href={att.url}
                            className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs hover:bg-gray-200 transition-colors"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13" />
                            </svg>
                            {att.name}
                          </a>
                        ))}
                      </div>
                    )}

                    <div className="mt-3 text-xs text-gray-500">
                      Posted by {notice.author.name}, {notice.author.designation}
                    </div>
                  </div>
                  <Link
                    href={`/dashboard/notices/${notice.id}`}
                    className="flex-shrink-0 inline-flex items-center px-4 py-2 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                  >
                    Read More
                    <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {filteredNotices.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
          <svg className="w-12 h-12 text-gray-300 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
          </svg>
          <p className="mt-4 text-gray-500">No notices found</p>
        </div>
      )}
    </div>
  );
}
