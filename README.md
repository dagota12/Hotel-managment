# Hotel Employee Management

Mini hotel HR system built with NestJS, SQLite, and a small static frontend.

## Tech Stack

- NestJS for the API
- SQLite for persistence
- TypeORM for database access
- Swagger for API exploration
- Vanilla HTML, CSS, and JavaScript for the frontend dashboard

## Project Structure

- `backend/` NestJS application, database models, API, and Swagger setup
- `frontend/` static dashboard served by the backend

## Database Structure

- `departments` stores hotel departments such as Reception and Housekeeping
- `roles` stores job roles such as Receptionist and Chef
- `shifts` stores shift schedules such as Morning, Evening, and Night
- `employees` links each employee to one department, one role, and one shift
- `attendance_records` stores daily attendance with check-in, check-out, and status

The relationships are intentionally normalized so employees can be managed independently while still belonging to the operational structure of the hotel.

## How to Run

1. Install dependencies from the repository root.
2. Start the backend from the repository root.
3. Open the app in your browser.

```bash
npm install
npm run start:dev
```

The application runs at `http://localhost:3000`.

Swagger is available at `http://localhost:3000/docs`.

## API Overview

- `POST /employees`
- `GET /employees`
- `GET /employees/:id`
- `PATCH /employees/:id`
- `DELETE /employees/:id`
- `POST /departments`
- `GET /departments`
- `PATCH /departments/:id`
- `DELETE /departments/:id`
- `POST /roles`
- `GET /roles`
- `PATCH /roles/:id`
- `DELETE /roles/:id`
- `POST /shifts`
- `GET /shifts`
- `PATCH /shifts/:id`
- `DELETE /shifts/:id`
- `POST /attendance`
- `GET /attendance`
- `GET /reports/attendance?from=YYYY-MM-DD&to=YYYY-MM-DD`

## How to Use

1. Create departments, roles, and shifts first.
2. Create employees and assign each one to a department, role, and shift.
3. Record daily attendance for employees.
4. Use the attendance report to review present, absent, and late totals across a date range.

## Testing

This scaffold focuses on the runtime application. The Swagger UI is the quickest way to test each endpoint manually.
