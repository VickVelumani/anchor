# Anchor

Anchor is a full-stack web application designed to help users build self-discipline and resist impulsive behaviors by guiding them through structured, pre-planned responses.

Instead of just tracking habits, Anchor focuses on **in-the-moment intervention**, reconnecting users with their intentions when they are most vulnerable.

---

## 🚀 Features

### 🔐 Authentication
- User registration and login
- JWT-based authentication
- Protected routes and user-specific data

### 🧠 Urge Systems
- Create custom urge types (e.g. Alcohol, Junk Food, Scrolling)
- Define for each urge:
  - Past self message
  - Reasons to resist
  - Action plan

### ⚡ Real-Time Intervention
- Log an urge with intensity and trigger
- Immediately redirected to a **"Help Me Resist"** screen
- Displays urge-specific support content to guide decisions

### 📊 Tracking & Analytics
- Track outcomes (resisted vs gave in)
- Post-urge reflection
- Dashboard includes:
  - Success rate
  - Current streak
  - Total urges
  - Charts for outcomes and categories

### 🔄 Full Flow
1. Create urge systems
2. Log an urge
3. Get guided support
4. Record outcome
5. Analyze patterns on dashboard

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- React Router DOM
- Axios (with JWT interceptor)
- Component-based UI

### Backend
- Flask (Python)
- SQLAlchemy (ORM)
- Flask-JWT-Extended (authentication)
- Flask-CORS

### Database
- SQLite

---

## 📸 Screenshots

Examples:
- Dashboard
- Log Urge page
- Help Me Resist screen
- My Urges page

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/VickVelumani/anchor.git
cd anchor