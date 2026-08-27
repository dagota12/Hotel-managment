# Hotel Employee Management & Attendance System 🏨

A modern, full-stack Employee Management and Attendance Analytics System engineered for fast-paced hotel operations. Built with **Next.js 16**, **NestJS**, **TypeORM**, **SQLite**, and **Shadcn UI / Recharts**.

![Hotel HR System](https://img.shields.io/badge/Stack-Next.js%2016%20%7C%20NestJS%20%7C%20TypeORM-blue?style=for-the-badge)
![License](https://img.shields.io/badge/Status-Production%20Ready-emerald?style=for-the-badge)

---

## 🌟 Key Features

### 1. 📊 Executive Dashboard & Analytics
- **Live Attendance Trend (Last 7 Days)**: Line chart tracking daily on-time vs. late employee check-ins generated via server-side database aggregations.
- **Department Attendance Rate**: Dynamic horizontal bar chart displaying real-time check-in completion percentages per team (Front Office, Housekeeping, Maintenance, F&B, Security).
- **Key Performance Metrics**: Instant high-contrast KPI cards tracking Total Staff, On-Time Today, Late Today, and Pending Check-Ins.

### 2. ⏱️ Attendance Management & Editing
- **Real-Time Check-In / Check-Out**: Single-click operational attendance marking with shift-based late calculation logic.
- **Log Modification**: Full edit capabilities (`PATCH /attendance/:id`) using native HTML5 `<input type="time">` controls for seamless time adjustment.
- **Standardized 12-Hour Time Format**: Centralized `formatTime` utility rendering all database timestamps in human-readable `AM/PM` standard (`e.g., 9:00 AM`, `5:00 PM`).

### 3. 👥 Employee Management
- **Spreadsheet-Style Registry**: High-density flat data table for browsing staff records.
- **Filtered Search**: Top-bar filtering across Employee Name, Department, Role, and Shift using Shadcn `Select` components.
- **Employee Detail View**: Dedicated employee page (`/employees/:id`) featuring individual attendance history logs, page-level worked hour calculations, and record editing.

### 4. 📈 Paginated Attendance Reports
- **Backend Pagination**: Scalable paginated fetching (`GET /attendance?page=1&limit=10`) using TypeORM `findAndCount`.
- **Date-Range Analytics**: Generate operational reports filtered by date ranges with automated worked-hour totals.

---

## 🛠️ Tech Stack & Architecture

```
                               ┌───────────────────────────┐
                               │     Next.js 16 Frontend   │
                               │  (Turbopack + Tailwind v4)│
                               └─────────────┬─────────────┘
                                             │  Axios / TanStack Query
                                             ▼
                               ┌───────────────────────────┐
                               │      NestJS Backend       │
                               │  (REST API + Swagger)     │
                               └─────────────┬─────────────┘
                                             │  TypeORM
                                             ▼
                               ┌───────────────────────────┐
                               │      SQLite Database      │
                               └───────────────────────────┘
```

| Layer | Technology | Key Libraries / Utilities |
| :--- | :--- | :--- |
| **Frontend** | Next.js 16 (App Router) | React 19, Tailwind CSS v4, Shadcn UI, Recharts, Lucide Icons |
| **Data Fetching** | TanStack React Query | Axios, Optimistic Cache Invalidation |
| **Backend** | NestJS 10 | TypeORM, Class Validator, Class Transformer |
| **Database** | SQLite | Automatic Entity Synchronization (`hotel-employee.sqlite`) |
| **API Docs** | OpenAPI / Swagger | Available natively at `/docs` |

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: `v18.x` or higher
- **npm**: `v9.x` or higher

### 1. Clone & Setup Repository
```bash
git clone <repository-url>
cd "employee Booking"
```

### 2. Start the Backend API Server
```bash
cd backend
npm install
npm run start:dev
```
- Server will run on: `http://localhost:8000`
- Interactive Swagger API Docs: `http://localhost:8000/docs`

### 3. Start the Frontend Application
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
- Web Application will run on: `http://localhost:3000`

---

## 📡 API Reference Overview

### Attendance Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/attendance/today` | Fetch today's snapshot across all active employees |
| `GET` | `/attendance/trend?days=7` | Aggregate attendance counts for the last N days |
| `GET` | `/attendance/department-stats` | Calculate check-in rate (%) by department |
| `GET` | `/attendance` | Paginated attendance query (`?page=1&limit=10&from=...&to=...`) |
| `POST` | `/attendance/check-in` | Mark employee check-in for today |
| `POST` | `/attendance/check-out` | Mark employee check-out for today |
| `PATCH` | `/attendance/:id` | Modify check-in/out times or status of an existing record |

### Employee & Organization Endpoints
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/employees` | List all employees with department, role, and shift relations |
| `POST` | `/employees` | Register a new employee |
| `PATCH` | `/employees/:id` | Update employee information |
| `DELETE` | `/employees/:id` | Remove an employee record |
| `GET` | `/departments` | List organizational departments |
| `GET` | `/roles` | List job roles |
| `GET` | `/shifts` | List work shifts |

---

## 📐 Key Technical & Design Decisions

1. **Database-Driven Visual Analytics**:
   Rather than relying on client-side mock data, the dashboard charts consume live server-side SQL aggregations via dedicated endpoints (`/attendance/trend` and `/attendance/department-stats`).
   
2. **Native Time Inputs & Clean Formatting**:
   Replaced text-based input fields with native HTML5 `<input type="time">` controls to eliminate invalid date formats. Formatted raw 24-hour time strings (`17:00`) into standardized 12-hour AM/PM formats (`5:00 PM`) using a centralized utility.

3. **High-Density Spreadsheet UI**:
   Designed tables with a flat, clean aesthetic emphasizing high data density, clear status badges (On Time, Late, Absent), and inline action buttons to maximize operational efficiency.

4. **React Query Optimistic Updates**:
   All attendance updates automatically trigger cache invalidation across both the today's snapshot query (`["attendance", "today"]`) and overall attendance logs (`["attendance"]`), keeping the UI synchronized across tabs without manual re-fetching.

---

## 📝 License
This project was created as a Full-Stack Engineering Challenge solution. All rights reserved.
