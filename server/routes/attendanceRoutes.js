const express = require('express');
const {
    markAttendance,
    getAttendance,
    getStudentAttendanceReport
} = require('../controllers/attendanceController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply protect middleware to all attendance routes
router.use(protect);

// Define routes
router.route('/')
    .get(authorize('admin', 'teacher'), getAttendance); // Teachers/Admin can view attendance

router.route('/mark')
    .post(authorize('admin', 'teacher'), markAttendance); // Teachers/Admin can mark attendance

// Specific report route (example)
router.route('/report/student/:studentId')
     .get(authorize('admin', 'teacher'), getStudentAttendanceReport); // Teachers/Admin can view reports

module.exports = router;