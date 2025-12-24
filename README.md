# SkillForge - AI-Driven Learning Platform

## Quick Start

### Option 1: Automatic Start
```bash
# Double-click START.bat or run:
START.bat
```

### Option 2: Manual Start

**Backend:**
```bash
cd backend
set JAVA_HOME=C:\Program Files\Java\jdk-17
.\mvnw.cmd spring-boot:run
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Access Application
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8080

## Features
- ✅ JWT Authentication
- ✅ User Management (Student, Teacher, Admin)
- ✅ Course Management
- ✅ Interactive Dashboards
- ✅ Learning Content (PDF, Video, Quiz, Blog)
- ✅ Progress Tracking
- ✅ AI Assistant

## Test Users
Register any user or use these test credentials:
- **Student:** student@test.com / password123
- **Admin:** admin@test.com / password123
- **Teacher:** teacher@test.com / password123

## Tech Stack
- **Backend:** Spring Boot, JWT, H2 Database
- **Frontend:** React, Vite
- **Authentication:** JWT Tokens