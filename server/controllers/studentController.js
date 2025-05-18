const Student = require('../models/Student');
const mongoose = require('mongoose');

// @desc    Get all students or filter by standard/section
// @route   GET /api/students
// @access  Private
exports.getStudents = async (req, res) => {
    const { standard, section } = req.query;
    const filter = {};

    if (standard) filter.standard = standard;
    if (section) filter.section = section;
    filter.isActive = true; // Typically only fetch active students

    try {
        const students = await Student.find(filter).sort({ rollNumber: 1 }); // Sort by roll number
        res.json(students);
    } catch (error) {
        console.error("Error fetching students:", error);
        res.status(500).json({ message: 'Server error fetching students' });
    }
};

// @desc    Get a single student by ID
// @route   GET /api/students/:id
// @access  Private
exports.getStudentById = async (req, res) => {
     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid student ID format' });
    }
    try {
        const student = await Student.findById(req.params.id);
        if (student && student.isActive) { // Check if student exists and is active
            res.json(student);
        } else {
            res.status(404).json({ message: 'Student not found or inactive' });
        }
    } catch (error) {
        console.error("Error fetching student by ID:", error);
        res.status(500).json({ message: 'Server error fetching student' });
    }
};


// @desc    Add a new student
// @route   POST /api/students
// @access  Private (e.g., Admin or Teacher)
exports.addStudent = async (req, res) => {
    const { name, rollNumber, standard, section } = req.body;

    if (!name || !rollNumber || !standard || !section) {
        return res.status(400).json({ message: 'Please provide all required student details' });
    }

    try {
        const studentExists = await Student.findOne({ rollNumber, standard, section });
        if (studentExists) {
            return res.status(400).json({ message: 'Student with this roll number already exists in this class' });
        }

        const student = new Student({
            name,
            rollNumber,
            standard,
            section,
        });

        const createdStudent = await student.save();
        res.status(201).json(createdStudent);
    } catch (error) {
        console.error("Error adding student:", error);
        // Handle specific errors like validation or unique constraint
         if (error.code === 11000) { // Duplicate key error
             return res.status(409).json({ message: 'Student with this roll number already exists in this class (Conflict).' });
         } else if (error.name === 'ValidationError') {
             return res.status(400).json({ message: 'Validation Error', errors: error.errors });
         }
        res.status(500).json({ message: 'Server error adding student' });
    }
};

// @desc    Update a student
// @route   PUT /api/students/:id
// @access  Private (e.g., Admin or Teacher)
exports.updateStudent = async (req, res) => {
    const { name, rollNumber, standard, section, isActive } = req.body;

     if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid student ID format' });
    }

    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Check for potential duplicate if rollNumber/standard/section is changed
        if (rollNumber && standard && section &&
           (student.rollNumber !== rollNumber || student.standard !== standard || student.section !== section)) {
           const existingStudent = await Student.findOne({
                rollNumber,
                standard,
                section,
                _id: { $ne: req.params.id } // Exclude the current student
            });
            if (existingStudent) {
                 return res.status(400).json({ message: 'Another student with this roll number already exists in this class' });
             }
        }


        // Update fields selectively
        student.name = name ?? student.name;
        student.rollNumber = rollNumber ?? student.rollNumber;
        student.standard = standard ?? student.standard;
        student.section = section ?? student.section;
        if (typeof isActive === 'boolean') { // Only update isActive if explicitly provided
             student.isActive = isActive;
         }


        const updatedStudent = await student.save();
        res.json(updatedStudent);
    } catch (error) {
        console.error("Error updating student:", error);
        if (error.code === 11000) {
            return res.status(409).json({ message: 'Update failed: Another student has this roll number in this class.' });
        } else if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Validation Error', errors: error.errors });
        }
        res.status(500).json({ message: 'Server error updating student' });
    }
};

// @desc    Deactivate (soft delete) or Delete a student
// @route   DELETE /api/students/:id
// @access  Private (e.g., Admin) - Consider making it Deactivate only for teachers
exports.deleteStudent = async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
       return res.status(400).json({ message: 'Invalid student ID format' });
   }
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        // Option 1: Soft Delete (Deactivate) - Recommended
        student.isActive = false;
        await student.save();
        res.json({ message: 'Student deactivated successfully' });

        // Option 2: Hard Delete (Remove permanently) - Use with caution
        // await student.deleteOne(); // Mongoose v5+
        // res.json({ message: 'Student removed successfully' });

    } catch (error) {
        console.error("Error deleting/deactivating student:", error);
        res.status(500).json({ message: 'Server error deleting student' });
    }
};