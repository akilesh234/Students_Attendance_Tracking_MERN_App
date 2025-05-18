// setup.js
const fs = require('fs');
const paths = [
  "client/public",
  "client/src/components",
  "client/src/contexts",
  "client/src/pages",
  "client/src/services",
  "server/config",
  "server/controllers",
  "server/middleware",
  "server/models",
  "server/routes"
];

const files = [
  "client/package.json",
  "client/src/App.js",
  "client/src/index.css",
  "client/src/index.js",
  "client/src/components/ProtectedRoute.js",
  "client/src/components/StudentForm.js",
  "client/src/components/StudentTable.js",
  "client/src/contexts/AuthContext.js",
  "client/src/pages/AttendanceEntryPage.js",
  "client/src/pages/AttendanceViewPage.js",
  "client/src/pages/DashboardPage.js",
  "client/src/pages/LoginPage.js",
  "client/src/pages/NotFoundPage.js",
  "client/src/pages/StudentManagementPage.js",
  "client/src/services/api.js",
  "client/src/services/attendanceService.js",
  "client/src/services/authService.js",
  "client/src/services/studentService.js",
  "server/package.json",
  "server/.env",
  "server/server.js",
  "server/config/db.js",
  "server/controllers/attendanceController.js",
  "server/controllers/authController.js",
  "server/controllers/studentController.js",
  "server/middleware/authMiddleware.js",
  "server/models/Attendance.js",
  "server/models/Student.js",
  "server/models/User.js",
  "server/routes/attendanceRoutes.js",
  "server/routes/authRoutes.js",
  "server/routes/studentRoutes.js",
  ".gitignore"
];

paths.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

files.forEach(file => {
  fs.writeFileSync(file, '', { flag: 'w' });
});
