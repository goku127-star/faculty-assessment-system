# Faculty Course Assessment Record System

A full-stack web app for recording and tracking faculty course assessments (quizzes, assignments, exams) and student marks.

- **Frontend:** React.js + TypeScript + Vite
- **Backend:** Node.js + TypeScript + NestJS + PostgreSQL + Prisma
- **Auth:** JWT-based faculty login

## Project structure

```
faculty-assessment-system/
├── backend/          # NestJS API
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   └── src/
│       ├── auth/
│       ├── faculty/
│       ├── course/
│       ├── student/
│       ├── assessment/
│       ├── assessment-record/
│       └── prisma/
├── frontend/         # React + Vite app
│   └── src/
│       ├── api/
│       ├── pages/
│       ├── components/
│       ├── context/
│       └── types/
└── docker-compose.yml   # local PostgreSQL
```

## Data model

- **Faculty** — logs in, owns courses
- **Course** — belongs to a faculty member, has a code/title/semester/credits
- **Student** — enrolled in courses via `Enrollment`
- **Assessment** — a quiz/assignment/midterm/final/etc. within a course, with max marks and a grade weightage
- **AssessmentRecord** — a student's marks for a given assessment

## 1. Start PostgreSQL

```bash
docker compose up -d
```

This starts Postgres on `localhost:5432` with database `faculty_assessment_db` (user/pass: `postgres`/`postgres`). No Docker? Point `DATABASE_URL` in `backend/.env` at any Postgres instance instead.

## 2. Backend setup

```bash
cd backend
cp .env.example .env      # adjust DATABASE_URL / JWT_SECRET if needed
npm install
npx prisma migrate dev --name init   # creates tables
npm run prisma:seed                  # optional: adds a sample faculty/course/student
npm run start:dev
```

API runs at `http://localhost:3000/api`.

Seeded login (if you ran the seed script):
- Email: `jane.doe@university.edu`
- Password: `Password@123`

## 3. Frontend setup

```bash
cd frontend
cp .env.example .env      # VITE_API_BASE_URL defaults to http://localhost:3000/api
npm install
npm run dev
```

App runs at `http://localhost:5173`.

## Key API endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Faculty login, returns JWT |
| GET/POST | `/api/faculty` | List / create faculty |
| GET/POST | `/api/courses` | List / create courses |
| GET/POST | `/api/students` | List / create students |
| POST | `/api/students/:id/enroll` | Enroll a student in a course |
| GET/POST | `/api/assessments` | List / create assessments |
| POST | `/api/assessment-records/bulk` | Save marks for a whole class at once |
| GET | `/api/assessment-records/report?studentId=&courseId=` | Weighted score report for a student in a course |

All endpoints except `POST /api/auth/login` and `POST /api/faculty` (registration) require a `Authorization: Bearer <token>` header.

## Notes

- Run `npx prisma studio` inside `backend/` for a GUI to browse/edit the database directly.
- To reset the database: `npx prisma migrate reset`.
- Swap the JWT secret in `backend/.env` before deploying anywhere real.
