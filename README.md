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

### API Endpoints

| Method | Endpoint | Description |
|--------|-----------|-------------|
| `POST` | `/auth/signup` | Signup a new user |
| `POST` | `/auth/login` | User login |
| `GET` | `/users/profile` | Get user profile |
| `GET` | `/tasks` | Get all tasks |
| `POST` | `/tasks` | Create a new task |
| `PUT` | `/tasks/:id` | Update a task |
| `DELETE` | `/tasks/:id` | Delete a task |

---
