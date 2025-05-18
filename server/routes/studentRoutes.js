const express = require('express');
const {
    getStudents,
    getStudentById,
    addStudent,
    updateStudent,
    deleteStudent
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Apply protect middleware to all student routes
router.use(protect);

// Define routes
router.route('/')
    .get(getStudents) // All authenticated users can view students
    .post(authorize('admin', 'teacher'), addStudent); // Only admin/teacher can add

router.route('/:id')
    .get(getStudentById) // All authenticated users can view single student
    .put(authorize('admin', 'teacher'), updateStudent) // Only admin/teacher can update
    .delete(authorize('admin'), deleteStudent); // Only admin can delete/deactivate

module.exports = router;