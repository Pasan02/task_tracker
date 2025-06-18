
# Personal Task & Habit Tracker

## Overview
This is a full-stack web application that allows users to manage their personal tasks and track habits. It supports full CRUD operations and includes a clean, user-friendly interface.

---

## 🌟 Features

### ✅ Task Management
- Add, edit, delete personal tasks
- Set due dates, priorities, and statuses (To Do, In Progress, Done)
- Categorize and filter tasks
- Sort tasks by date, status, or priority

### ✅ Habit Tracker
- Create daily or weekly recurring habits
- Track habit completion for specific days
- View progress with streak counters or calendar view

### ✅ Dashboard
- Summary of upcoming tasks and overdue items
- Visual overview of habit streaks and task status

### ✅ Optional Enhancements
- Recurring tasks
- Dark mode
- Simple statistics: task completion rate, habit success rate
- Drag-and-drop task sorting

---

## 🛠 Tech Stack

### Frontend
- **Library**: ReactJS
- **Language**: JavaScript (or TypeScript if preferred)
- **Styling**: CSS / SCSS (optionally styled-components or Tailwind CSS)
- **Extras**: React Router, React Hook Form, Context API or Redux (if needed)

### Backend
- **Framework**: Spring Boot
- **Language**: Java
- **Database**: H2 (for dev) or PostgreSQL/MySQL (for production)
- **API**: RESTful API using Spring Web
- **Security**: Spring Security (if authentication is included)

### Dev Tools
- **IDE**: Visual Studio Code
- **Build Tools**: Maven or Gradle (Java), Vite or Create React App (React)
- **Version Control**: Git

---

## 🔁 User Journeys

### 1. New User Onboarding
- User opens the app
- Optionally registers/logs in (if authentication is implemented)
- Lands on dashboard with prompt to add first task or habit

### 2. Task Management Flow
- User creates a new task with title, due date, priority
- Task appears on dashboard or task list
- User updates task status as work progresses
- User deletes task when no longer needed

### 3. Habit Tracking Flow
- User creates a habit with frequency (daily/weekly)
- Habit appears on tracker page or calendar view
- User marks habit as done each day/week
- User views progress (e.g., streaks or calendar dots)

### 4. Dashboard View
- User sees today's tasks, upcoming deadlines, and active habits
- Quickly adds or edits tasks/habits from this view

---

## 🚀 Future Improvements (Optional)
- Google Calendar integration (event sync)
- Reminder notifications
- Analytics & productivity insights
