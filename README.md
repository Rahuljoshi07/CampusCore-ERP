<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=nextdotjs" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" />
  <img src="https://img.shields.io/badge/Redux-Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" />
  <img src="https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
</p>

<h1 align="center">🎓 CampusCore ERP</h1>
<p align="center">
  <strong>A Modern, Full-Stack College Management System</strong><br/>
  Streamline administration, academics, and campus operations with a single platform.
</p>

<p align="center">
  <a href="#-features">Features</a> · 
  <a href="#-tech-stack">Tech Stack</a> · 
  <a href="#-getting-started">Getting Started</a> · 
  <a href="#-api-reference">API Reference</a> · 
  <a href="#-demo-credentials">Demo Credentials</a>
</p>

---

## ✨ Features

<table>
<tr>
<td width="50%">

**🎓 Student Management**
- Registration, admission, profiles
- Document uploads and academic records
- Personal dashboard with grades and attendance

**👨‍🏫 Faculty Management**
- Faculty profiles with subject/class assignments
- HOD designation and leave management
- Attendance marking and exam management

**📚 Academics**
- Departments, courses, batches, sections
- Subjects and semester tracking
- Academic year management

**📅 Timetable & Scheduling**
- Class scheduling with day-of-week slots
- Room allocation and faculty mapping

</td>
<td width="50%">

**✅ Attendance System**
- Subject-wise daily marking by faculty
- Stats & reports with late/excused tracking

**📝 Examinations**
- Internal, midterm, final, and practical exams
- Marks entry, grade calculation, result publishing

**💰 Fee Management**
- Fee structures per course/semester
- Payment tracking, receipt numbers, due reminders

**📖 Library & 🏠 Hostel**
- Book catalog (ISBN), issue/return, fine management
- Room allocation (single/double/triple/dorm), rent tracking

**📢 Notices & 🔔 Notifications**
- Role-targeted announcements with pin/publish/expiry
- Real-time per-user notifications with read/unread status

</td>
</tr>
</table>

---

## 🛠 Tech Stack

<table>
<tr>
<td valign="top" width="50%">

### Frontend
| Technology | Purpose |
|:--|:--|
| **Next.js 14** | React framework (App Router) |
| **TypeScript** | Type-safe development |
| **Tailwind CSS** | Utility-first styling |
| **Redux Toolkit** | Global state management |
| **Recharts** | Dashboard charts |
| **Framer Motion** | Smooth animations |
| **Axios** | HTTP client with interceptors |

</td>
<td valign="top" width="50%">

### Backend
| Technology | Purpose |
|:--|:--|
| **Node.js + Express** | REST API server |
| **Prisma ORM** | Type-safe database queries |
| **SQLite** | Lightweight embedded database |
| **JWT** | Access + refresh token auth |
| **bcryptjs** | Password hashing (12 rounds) |
| **Winston** | Structured logging |
| **Helmet** | Security headers |

</td>
</tr>
</table>

---

## 📁 Project Structure

```
CampusCore-ERP/
│
├── frontend/                        # Next.js 14 App
│   └── src/
│       ├── app/
│       │   ├── page.tsx                  # Landing page
│       │   ├── login/ & register/        # Auth pages
│       │   └── dashboard/                # Protected routes
│       │       ├── students/
│       │       ├── faculty/
│       │       ├── academics/
│       │       ├── attendance/
│       │       ├── exams/
│       │       ├── fees/
│       │       ├── notices/
│       │       ├── timetable/
│       │       ├── analytics/
│       │       └── settings/
│       ├── components/                   # Reusable UI components
│       ├── lib/                          # API client & utilities
│       └── store/                        # Redux slices & hooks
│
├── backend/                         # Express.js API
│   ├── prisma/
│   │   ├── schema.prisma                 # 30+ database models
│   │   └── seed.ts                       # Demo data seeder
│   └── src/
│       ├── index.ts                      # Entry point
│       ├── controllers/                  # Route handlers
│       ├── routes/                       # API route definitions
│       ├── services/                     # Business logic
│       ├── middleware/                   # Auth, validation, logging
│       └── config/                       # App configuration
│
├── analytics-service/               # PHP Analytics Microservice
├── docker-compose.yml                # Container orchestration
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Version |
|:--|:--|
| Node.js | >= 18.x |
| npm | >= 9.x |

### 1. Clone the Repository

```bash
git clone https://github.com/Rahuljoshi07/CampusCore-ERP.git
cd CampusCore-ERP
```

### 2. Setup Backend

```bash
cd backend
npm install

# Create environment file
cp .env.example .env
# Default config uses SQLite - no database server needed!

# Generate Prisma client and create database
npx prisma generate
npx prisma db push

# Seed demo data
npm run db:seed

# Start dev server
npm run dev
```

> **Backend runs at** `http://localhost:5000`

### 3. Setup Frontend

```bash
cd frontend
npm install

# Create environment file
cp .env.local.example .env.local

# Start dev server
npm run dev
```

> **Frontend runs at** `http://localhost:3000`

---

## 🔐 Demo Credentials

| Role | Email | Password |
|:--|:--|:--|
| 🔴 Admin | `admin@college.edu` | `Admin123!` |
| 🟡 Faculty | `faculty@college.edu` | `User123!` |
| 🟢 Student | `student@college.edu` | `Student123!` |

---

## 🔌 API Reference

All endpoints are prefixed with `/api`

<details>
<summary><strong>📋 View All API Modules</strong></summary>

| Module | Endpoint | Auth |
|:--|:--|:--:|
| Auth | `/api/auth` | No |
| Users | `/api/users` | Yes |
| Students | `/api/students` | Yes |
| Faculty | `/api/faculty` | Yes |
| Attendance | `/api/attendance` | Yes |
| Exams | `/api/exams` | Yes |
| Fees | `/api/fees` | Yes |
| Academics | `/api/academic` | Yes |
| Notifications | `/api/notifications` | Yes |
| Analytics | `/api/analytics` | Yes |

</details>

### Authentication Endpoints

```http
POST   /api/auth/register          # Create a new account
POST   /api/auth/login              # Get access + refresh tokens
POST   /api/auth/refresh-token      # Refresh expired access token
POST   /api/auth/logout             # Invalidate refresh token
GET    /api/auth/me                 # Get current user profile
POST   /api/auth/change-password    # Update password
```

---

## 👥 Role-Based Access Control

| Capability | Admin | Faculty | Student | Staff |
|:--|:--:|:--:|:--:|:--:|
| System settings | ✅ | - | - | - |
| Manage users | ✅ | - | - | - |
| Manage departments & courses | ✅ | - | - | - |
| Mark attendance | ✅ | ✅ | - | - |
| Create exams & enter marks | ✅ | ✅ | - | - |
| View own dashboard | ✅ | ✅ | ✅ | ✅ |
| View attendance & results | ✅ | ✅ | ✅ | - |
| Fee payments | ✅ | - | ✅ | ✅ |
| Library & hostel operations | ✅ | - | - | ✅ |

---

## 🗄 Database Schema

The Prisma schema includes **30+ models** covering the full college domain:

```
User ─┬─ Student ── Attendance, ExamResult, FeePayment, LibraryRecord,
      │              HostelAllocation, LeaveApplication, Document
      ├─ Faculty ── FacultySubject, ClassSchedule, Exam, Attendance
      ├─ Staff
      └─ Admin

Department ── Course ── Batch ── Section
                    └── Subject ── FacultySubject, ClassSchedule, Exam

Notice, Notification, ActivityLog, Setting, AcademicYear
FeeStructure, Book, HostelBuilding ── HostelRoom
```

---

## 📜 Scripts

<table>
<tr>
<td width="50%">

### Backend (`cd backend`)

| Command | Description |
|:--|:--|
| `npm run dev` | Start with hot reload |
| `npm run build` | Compile TypeScript |
| `npm start` | Run production build |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push schema to DB |
| `npm run db:seed` | Seed demo data |
| `npm run db:migrate` | Run migrations |

</td>
<td width="50%">

### Frontend (`cd frontend`)

| Command | Description |
|:--|:--|
| `npm run dev` | Start Next.js dev server |
| `npm run build` | Production build |
| `npm start` | Serve production build |
| `npm run lint` | Run ESLint |

</td>
</tr>
</table>

---

## 🔒 Security

- **Helmet.js** for HTTP security headers
- **Rate limiting** at 100 requests / 15 min per IP
- **CORS** restricted to configured frontend origin
- **bcrypt** password hashing with 12 salt rounds
- **JWT** access tokens (15 min) + refresh tokens (7 days)
- **Input validation** via express-validator middleware

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

Free for educational and commercial use.

---

<p align="center">
  Built with ❤️ for modern campus management<br/>
  <strong>CampusCore ERP</strong>
</p>
