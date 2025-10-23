# Students Attendance Tracking (MERN)

> **Repository:** `Students_Attendance_Tracking_MERN_App`

## Overview

This repository contains a **MERN** (MongoDB, Express, React, Node.js) application for tracking student attendance. The project is split into two main parts: `server/` (backend API and database logic) and `client/` (React frontend). A `setup.js` script is included in the repository root to help seed or configure initial data.



---

## Features

* Student CRUD (Create / Read / Update / Delete)
* Mark attendance for a student / class
* View attendance history and summaries
* Authentication (JWT-based, typical for MERN apps)
* React-based UI for managing students and attendance


---

## Tech stack

* Frontend: React (create-react-app or Vite style structure under `client/`)
* Backend: Node.js + Express
* Database: MongoDB (MongoDB Atlas or local)
* Auth: JSON Web Tokens (JWT)
* Package manager: `npm` (or `yarn` if you prefer)

---

## Prerequisites

* Node.js (v16+ recommended)
* npm (or yarn)
* MongoDB (local or Atlas cluster)

---

## Repository structure (high-level)

```
Students_Attendance_Tracking_MERN_App/
├─ client/                # React frontend
├─ server/                # Express API, models, controllers, routes
├─ .gitignore
├─ setup.js               # seed or setup helper script
└─ README.md              # <- you are here
```


---

## Installation & setup

### Clone

```bash
git clone https://github.com/akilesh234/Students_Attendance_Tracking_MERN_App.git
cd Students_Attendance_Tracking_MERN_App
```

### Server setup

1. `cd server`
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file in `server/` with the required environment variables (see example below).

### Client setup

1. `cd client`
2. Install dependencies:

   ```bash
   npm install
   ```
3. If the client needs an env variable for the API base URL, create `.env` in `client/` (see example below).

---


## Running (development)

Run the server and client concurrently (typical approaches below):

**Option A — run server and client in separate terminals**

Terminal 1 (server):

```bash
cd server
npm run dev    # or `npm start` depending on package.json
```

Terminal 2 (client):

```bash
cd client
npm start
```

**Option B — single combined command**
If the repo has a root `package.json` that uses `concurrently` to run both, you can run from the repo root:

```bash
npm install
npm run dev
```

Check `package.json` files in `server/` and `client/` for the exact script names (`start`, `dev`, `build`).

---

## Building & deploying (production)

1. Build the React app:

```bash
cd client
npm run build
```

2. Serve the `client/build` static files from Express (common approach):

* Ensure the server's Express app is configured to serve static files (e.g. `app.use(express.static(path.join(__dirname, '../client/build')))`), and that `server` is pointing to `client/build` in production.

3. Deploy server to a host (Heroku, Render, DigitalOcean, Railway, VPS) and set environment variables accordingly.

---

## Environment variables (.env examples)

### Example for `server/.env`

```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/attendance_db?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
NODE_ENV=development
```

### Example for `client/.env` (if used)

```
REACT_APP_API_URL=http://localhost:5000/api
```

Adjust values to match your deployment and security practices.

---

## API & routes (overview)

The repo contains `server/` where typical routes are:

* `POST /api/auth/register` — register a user (admin/teacher)
* `POST /api/auth/login` — login and receive a JWT
* `GET /api/students` — list students
* `POST /api/students` — create student
* `PUT /api/students/:id` — update student
* `DELETE /api/students/:id` — delete student
* `POST /api/attendance` — mark attendance / create attendance record
* `GET /api/attendance` — get attendance records or summaries

> These are common MERN patterns. Check the `server/routes` and `server/controllers` folders to confirm exact endpoints and payload shapes. If you want, I can parse those files and add a precise API reference to this README.

---

## Testing

* If tests are present, run `npm test` from the `server/` or `client/` directories as appropriate.
* If no test runner is configured, consider adding unit tests for server controllers and integration tests for API endpoints.

---

## Contributing

Thanks for your interest in contributing! Suggested steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/some-feature`
3. Make changes and add tests where possible
4. Commit and push your branch
5. Open a pull request describing the change

Please follow the existing code style and include descriptive commit messages.

---


