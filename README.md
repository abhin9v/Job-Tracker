# JobFlow — Job Application Tracker

A full-stack job application tracker with a clean, modern UI. Built with React + Tailwind (frontend) and Node.js + Express + MongoDB (backend).

---

## 🚀 Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, Vite, Tailwind CSS, Framer Motion, Recharts |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB |
| Auth | JWT (jsonwebtoken + bcryptjs) |

---

## 📁 Folder Structure

```
job-tracker/
├── backend/
│   ├── middleware/auth.js        # JWT middleware
│   ├── models/
│   │   ├── User.js               # User schema + password hashing
│   │   └── Application.js        # Full application schema (20+ fields)
│   ├── routes/
│   │   ├── auth.js               # Register / Login / Me
│   │   ├── applications.js       # CRUD + export + star + filters
│   │   └── stats.js              # Dashboard stats + follow-ups
│   ├── server.js                 # Express app entry point
│   ├── .env.example
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── applications/
    │   │   │   ├── ApplicationCard.jsx   # Card with hover actions
    │   │   │   ├── ApplicationForm.jsx   # Full tabbed modal form
    │   │   │   └── FilterBar.jsx         # Search + filter + sort bar
    │   │   ├── dashboard/
    │   │   │   ├── StatsGrid.jsx         # Stat cards row
    │   │   │   ├── Charts.jsx            # Area, Pie, Bar charts
    │   │   │   └── FollowUpReminders.jsx # Upcoming follow-ups
    │   │   ├── kanban/
    │   │   │   └── KanbanBoard.jsx       # Status-grouped kanban
    │   │   ├── layout/
    │   │   │   └── Layout.jsx            # Sidebar + outlet
    │   │   └── ui/
    │   │       └── StatusBadge.jsx
    │   ├── context/
    │   │   ├── AuthContext.jsx    # Login / Register / Logout
    │   │   └── ThemeContext.jsx   # Dark mode toggle
    │   ├── hooks/
    │   │   └── useApplications.js # All API calls
    │   ├── pages/
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── ApplicationsPage.jsx
    │   │   └── KanbanPage.jsx
    │   ├── utils/
    │   │   ├── api.js             # Axios instance with JWT interceptor
    │   │   └── constants.js       # Enums: statuses, sources, etc.
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css              # Design system + CSS variables
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## ⚙️ Setup & Running

### Prerequisites
- Node.js 18+
- MongoDB running locally OR MongoDB Atlas URI

### Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MONGO_URI and JWT_SECRET
npm install
npm run dev
```

Server starts at `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

App opens at `http://localhost:5173`

---

## ✨ Features

### Core
- ✅ Add / Edit / Delete / View applications
- ✅ 20+ fields per application (company, role, status, OA, interviews, referral, HR contact, resume version, etc.)
- ✅ JWT-based authentication (register/login)
- ✅ Dark mode (system preference + toggle)

### Dashboard
- ✅ Stat cards (total, interview, offer, rejected, OA, ghosted)
- ✅ Interview conversion rate
- ✅ Applications over time (area chart, 30 days)
- ✅ Status breakdown (pie chart)
- ✅ Source breakdown (bar chart)
- ✅ Follow-up reminders (next 7 days)

### Applications View
- ✅ Card grid with hover actions
- ✅ Filter by status, location type, source
- ✅ Search by company or role (debounced)
- ✅ Sort by date, company, status
- ✅ Star / favourite applications
- ✅ Export to CSV

### Pipeline (Kanban)
- ✅ Kanban board grouped by status
- ✅ Card counts per column
- ✅ Edit / delete inline

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user |

### Applications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/applications` | List (filters: status, search, locationType, source, starred, sort, page, limit) |
| POST | `/api/applications` | Create application |
| GET | `/api/applications/:id` | Get single application |
| PUT | `/api/applications/:id` | Update application |
| DELETE | `/api/applications/:id` | Delete application |
| PATCH | `/api/applications/:id/star` | Toggle star |
| GET | `/api/applications/export` | Download CSV |

### Stats
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stats` | Dashboard stats (status counts, timeline, sources, follow-ups) |

---

## 💡 Suggested Improvements

1. **Chrome Extension** — One-click "Add to JobFlow" from LinkedIn/Naukri
2. **Email Parsing** — Auto-detect rejection/interview emails via Gmail API
3. **Offer Comparison** — Side-by-side table for evaluating multiple offers
4. **ATS Resume Match** — Paste JD to get keyword match % against your resume
5. **Weekly Digest** — Sunday cron email summarizing your pipeline
6. **Interview Prep Links** — Attach LeetCode/system design resources per round
7. **Drag-and-Drop Kanban** — Move cards between columns to update status

---

## 📄 License
MIT
