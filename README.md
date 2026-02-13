# 🎓 CampusCore ERP — Modern College Management System

A full-stack, production-ready college ERP platform that streamlines administration, academics, and campus operations — built with **Next.js 14**, **Node.js/Express**, **Prisma**, and **SQLite**.

---

## 📸 Screenshots

| Login | Dashboard |
|:-----:|:---------:|
| ![Login](https://via.placeholder.com/580x360/f8fafc/1e293b?text=Login+Page) | ![Dashboard](https://via.placeholder.com/580x360/f8fafc/1e293b?text=Admin+Dashboard) |

---

## ⚡ Features at a Glance

| Module | Highlights |
|--------|------------|
| **👨‍🎓 Students** | Registration, admission, profiles, documents, academic records, personal dashboard |
| **👨‍🏫 Faculty** | Profiles, subject/class assignment, HOD designation, leave management |
| **📚 Academics** | Departments, courses, batches, sections, subjects, semester tracking |
| **📅 Timetable** | Class scheduling, day-of-week slots, room allocation, faculty mapping |
| **✅ Attendance** | Subject-wise daily marking by faculty, stats & reports, late/excused tracking |
| **📝 Examinations** | Internal/midterm/final/practical exams, marks entry, grade calculation, result publishing |
| **💰 Fees** | Fee structures per course/semester, payment tracking, receipt numbers, due reminders |
| **📖 Library** | Book catalog with ISBN, issue/return records, fine management, availability tracking |
| **🏠 Hostel** | Buildings, rooms (single/double/triple/dorm), student allocation, rent management |
| **📢 Notices** | Role-targeted announcements, pinned/published state, expiry dates |
| **🔔 Notifications** | Real-time per-user notifications with read/unread status |
| **📊 Analytics** | Dashboard stats, activity logs, system-wide reporting |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| [Next.js 14](https://nextjs.org/) | React framework with App Router |
| [TypeScript](https://www.typescriptlang.org/) | Type-safe development |
| [Tailwind CSS](https://tailwindcss.com/) | Utility-first styling |
| [Redux Toolkit](https://redux-toolkit.js.org/) | Global state management |
| [Recharts](https://recharts.org/) | Dashboard charts & analytics |
| [Framer Motion](https://www.framer.com/motion/) | Smooth UI animations |
| [Axios](https://axios-http.com/) | HTTP client with interceptors |
| [react-hot-toast](https://react-hot-toast.com/) | Toast notifications |

### Backend
| Technology | Purpose |
|------------|---------|
| [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/) | REST API server |
| [Prisma ORM](https://www.prisma.io/) | Type-safe database access |
| [SQLite](https://www.sqlite.org/) | Lightweight embedded database |
| [JWT](https://jwt.io/) | Access + refresh token authentication |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [Winston](https://github.com/winstonjs/winston) | Structured logging |
| [Helmet](https://helmetjs.github.io/) | Security headers |
| [Nodemailer](https://nodemailer.com/) | Email service |

---

## 📁 Project Structure

```
CampusCore/
├── frontend/                   # Next.js 14 application
│   └── src/
│       ├── app/
│       │   ├── page.tsx             # Landing page
│       │   ├── login/               # Authentication
│       │   ├── register/
│       │   └── dashboard/           # Protected dashboard
│       │       ├── students/
│       │       ├── faculty/
│       │       ├── academics/
│       │       ├── attendance/
│       │       ├── exams/
│       │       ├── fees/
│       │       ├── notices/
│       │       ├── notifications/
│       │       ├── timetable/
│       │       ├── analytics/
│       │       └── settings/
│       ├── components/              # Reusable UI components
│       ├── lib/                     # API client & utilities
│       └── store/                   # Redux slices & hooks
│
├── backend/                    # Express.js API server
│   ├── prisma/
│   │   ├── schema.prisma            # Database schema (30+ models)
│   │   └── seed.ts                  # Demo data seeder
│   └── src/
│       ├── index.ts                 # App entry point
│       ├── controllers/             # Route handlers
│       ├── routes/                  # API route definitions
│       ├── services/                # Business logic
│       ├── middleware/              # Auth, validation, logging
│       ├── config/                  # App configuration
│       └── utils/                   # Logger & helpers
│
└── docker-compose.yml          # Container orchestration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x

### 1. Clone the repository

```bash
git clone <repository-url>
cd CampusCore
```

### 2. Backend setup

```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# The default .env uses SQLite — no database server needed

# Generate Prisma client & create database
npx prisma generate
npx prisma db push

# Seed with demo data
npm run db:seed

# Start the server
npm run dev
```

The API will be available at **http://localhost:5000**.

### 3. Frontend setup

```bash
cd frontend
npm install

# Create environment file
cp .env.local.example .env.local

# Start the dev server
npm run dev
```

The app will be available at **http://localhost:3000**.

---

## 🔐 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@college.edu` | `Admin123!` |
| **Faculty** | `faculty@college.edu` | `User123!` |
| **Student** | `student@college.edu` | `Student123!` |

---

## 🔌 API Reference

All endpoints are prefixed with `/api`.

| Module | Base Path | Auth Required |
|--------|-----------|:------------:|
| Auth | `/api/auth` | ❌ (login/register) |
| Users | `/api/users` | ✅ |
| Students | `/api/students` | ✅ |
| Faculty | `/api/faculty` | ✅ |
| Attendance | `/api/attendance` | ✅ |
| Exams | `/api/exams` | ✅ |
| Fees | `/api/fees` | ✅ |
| Academics | `/api/academic` | ✅ |
| Notifications | `/api/notifications` | ✅ |
| Analytics | `/api/analytics` | ✅ |

### Key auth endpoints

```
POST   /api/auth/register        # Create account
POST   /api/auth/login            # Get access + refresh tokens
POST   /api/auth/refresh-token    # Refresh expired access token
POST   /api/auth/logout           # Invalidate refresh token
GET    /api/auth/me               # Get current user profile
POST   /api/auth/change-password  # Update password
```

---

## 👥 Role-Based Access

| Capability | Admin | Faculty | Student | Staff |
|------------|:-----:|:-------:|:-------:|:-----:|
| System settings | ✅ | — | — | — |
| Manage users | ✅ | — | — | — |
| Manage departments/courses | ✅ | — | — | — |
| Mark attendance | ✅ | ✅ | — | — |
| Create exams & enter marks | ✅ | ✅ | — | — |
| View own dashboard | ✅ | ✅ | ✅ | ✅ |
| View attendance & results | ✅ | ✅ | ✅ | — |
| Fee payments | ✅ | — | ✅ | ✅ |
| Library & hostel ops | ✅ | — | — | ✅ |

---

## 🗄️ Database Schema

The Prisma schema contains **30+ models** covering the full college domain:

```
User ─┬─ Student ── Attendance, ExamResult, FeePayment, LibraryRecord,
      │              HostelAllocation, LeaveApplication, Document
      ├─ Faculty ── FacultySubject, ClassSchedule, Exam, Attendance (marker)
      ├─ Staff
      └─ Admin

Department ── Course ── Batch ── Section
                    └── Subject ── FacultySubject, ClassSchedule, Exam

Notice, Notification, ActivityLog, Setting, AcademicYear
FeeStructure, Book, HostelBuilding ── HostelRoom
```

---

## 📜 Available Scripts

### Backend (`cd backend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run production build |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to database |
| `npm run db:seed` | Seed demo data |
| `npm run db:migrate` | Run Prisma migrations |
| `npm test` | Run tests |

### Frontend (`cd frontend`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |

---

## 🔒 Security

- **Helmet.js** for HTTP security headers
- **Rate limiting** — 100 requests per 15 minutes per IP
- **CORS** restricted to configured frontend origin
- **bcrypt** password hashing (12 salt rounds)
- **JWT** access tokens (15 min) + refresh tokens (7 days)
- **Input validation** via express-validator middleware

---

## 📄 License

MIT License — free for educational and commercial use.
