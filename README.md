# Task Manager App

A modern **Task Management Web Application** built with a clean, responsive UI inspired by the [Streamline Mobile App Design](https://dribbble.com/shots/23472405-Streamline-Mobile-App-Design).  
This app helps users manage their daily tasks, projects, and goals in a beautiful and efficient interface.

---

## Overview

The **Task Manager App** allows users to:
- Create, update, edit and delete tasks
- Assign tasks to specific users
- Track progress visually through charts
- View all tasks on a calendar
- Manage profiles and personal settings
- Stay organized with a minimalist, professional UI

The project consists of a **React + TypeScript frontend** and a **Node.js + Express backend**, connected via REST APIs using **Axios**.

---

## Frontend

### Tech Stack

| Tool / Library | Purpose |
|----------------|----------|
| **React (Vite + TypeScript)** | Frontend framework |
| **Redux Toolkit (Slices)** | Global state management |
| **Tailwind CSS** | Modern utility-first styling |
| **React Router DOM** | Client-side routing |
| **Axios** | API communication |
| **Framer Motion** | Smooth animations for UI elements |

---

## Backend

### Tech Stack

| Tool / Library | Purpose |
|----------------|----------|
| **Node.js + Express.js** | Backend framework |
| **MongoDB + Mongoose** | Database & ORM |
| **TypeScript** | Type safety and maintainability |
| **JWT (Simplified)** | Authentication using access token
| **CORS + dotenv + bcrypt** | Security, configuration, and password hashing |

---

## API Endpoints

<details>
<summary><strong>Authentication</strong></summary>

| Method | Endpoint         | Description      | Access    |
|--------|------------------|------------------|-----------|
| POST   | /signup     | Signup a new user| Public    |
| POST   | /login      | User login       | Public    |

</details>

<details>
<summary><strong>User Profile</strong></summary>

| Method | Endpoint        | Description               | Access        |
|--------|-----------------|---------------------------|---------------|
| GET    | /profile  | Get logged-in user profile| Authenticated |
| PUT    | /profile  | Update user profile       | Authenticated |

</details>

<details>
<summary><strong>Tasks</strong></summary>

| Method | Endpoint    | Description                     | Access        |
|--------|-------------|---------------------------------|---------------|
| GET    | /tasks      | Get all tasks for current user  | Authenticated |
| POST   | /tasks      | Create a new task               | Authenticated |
| PUT    | /tasks/:id  | Update a task (owner/admin)     | Authenticated |
| DELETE | /tasks/:id  | Delete a task (owner/admin)     | Authenticated |

</details>

<details>
<summary><strong>Calendar</strong></summary>

| Method | Endpoint   | Description                   | Access        |
|--------|------------|-------------------------------|---------------|
| GET    | /calendar  | Get user tasks by date        | Authenticated |

</details>

<details>
<summary><strong>Admin</strong></summary>

| Method | Endpoint                  | Description                           | Access    |
|--------|---------------------------|-------------------------------------|-----------|
| GET    | /admin/users              | Get users list with pagination/filtering | Admin only|
| PATCH  | /admin/users/:id/role     | Change user role (promote/demote)   | Admin only|
| GET    | /admin/users/:id/activity | Get activity logs of specified user | Admin only|
| GET    | /admin/tasks              | Get all tasks across users (overview)| Admin only|
| POST   | /admin/tasks              | Admin creates/assigns task to user  | Admin only|

</details>


## Project Setup and Running

### Prerequisites

- Node.js (v18+ recommended)
- MongoDB (local or Atlas)
- Yarn or npm package manager

### Frontend Setup

1. Navigate to the frontend directory: 
cd frontend

2. Install dependencies:  
npm install


3. Run the frontend development server:  
npm run dev


4. Open browser at `http://localhost:5173`

### Backend Setup

1. Navigate to the backend directory:  
cd backend


2. Install dependencies:  
npm install


3. Create `.env` file with variables:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

text
4. Run backend server:  
npm run dev

text
5. Backend listens at `http://localhost:5000`

---

## Features Summary

### Task Management
- Full CRUD tasks with categories, descriptions
- Assign tasks to users with role-based route access
- Tasks display in calendar and progress charts

### User Authentication
- Signup and login with JWT protected routes
- Profile management with avatar upload

### Admin Dashboard
- View and manage users with pagination and filtering
- Assign tasks directly to users
- View task progress statistics for oversight
- Real-time updates via Socket.io integration

### Responsive Design
- Mobile-first with Tailwind CSS
- Adaptive layouts for desktop and mobile

### Animations
- Subtle UI animations with Framer Motion for smooth UX

---

## Live Demo

Link to deployed demo showcasing login-based task management and admin dashboard functionality.
`https://task-manager-frontend-txuw.onrender.com`

---

---

This README provides clear setup steps, project overview, architecture guide, and endpoint reference.  
Feel free to customize per your project.

## Schema Sample Records :

### User: 

{
  "_id": "64f298b6a23f1c00123a4567",
  "username": "johndoe",
  "email": "john.doe@example.com",
  "role": "user",
  "avatar": "https://example.com/avatar/johndoe.png",
  "createdAt": "2025-10-01T10:30:00.000Z"
}

### Task:

{
  "_id": {
    "$oid": "6909d0e2a3c9c1702ebe5a2c"
  },
  "title": "work on api endpoints",
  "description": "",
  "category": "General",
  "date": "2025-11-04T10:09:38.376Z",
  "time": "15:39",
  "progress": 0,
  "completed": false,
  "avatar": [],
  "priority": "Medium",
  "attachments": [],
  "createdBy": {
    "$oid": "6909d0aaa3c9c1702ebe5a03"
  },
  "assignedTo": {
    "$oid": "69085555bb2319e66426ff9b"
  },
  "collaborators": [],
  "visibility": "private",
  "createdAt": {
    "$date": "2025-11-04T10:09:38.407Z"
  },
  "updatedAt": {
    "$date": "2025-11-04T10:09:38.407Z"
  },
  "__v": 0
}

### Activities :

{
  "_id": {
    "$oid": "6909d0b8a3c9c1702ebe5a18"
  },
  "user": {
    "$oid": "6909d0aaa3c9c1702ebe5a03"
  },
  "action": "Changed role of admin2 to user",
  "ip": "::1",
  "meta": {
    "newRole": "user"
  },
  "createdAt": {
    "$date": "2025-11-04T10:08:56.039Z"
  },
  "__v": 0
}
