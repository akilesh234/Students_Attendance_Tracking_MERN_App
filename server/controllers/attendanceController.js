const Attendance = require('../models/Attendance');
const Student = require('../models/Student'); // To fetch student names if needed
const mongoose = require('mongoose');

// Helper to normalize date to UTC midnight
const normalizeDate = (dateString) => {
    const date = new Date(dateString);
    date.setUTCHours(0, 0, 0, 0);
    return date;
};

// @desc    Mark attendance for multiple students
// @route   POST /api/attendance/mark
// @access  Private
exports.markAttendance = async (req, res) => {
    // records: [{ studentId, status ('Present'/'Absent'/'Late') }]
    const { date, standard, section, subject, records } = req.body;
    const userId = req.userId; // From protect middleware

    if (!date || !standard || !section || !Array.isArray(records) || records.length === 0) {
        return res.status(400).json({ message: 'Missing required fields (date, standard, section, records array)' });
    }

    try {
        const attendanceDate = normalizeDate(date); // Use normalized date

        const bulkOps = records.map(record => {
            if (!mongoose.Types.ObjectId.isValid(record.studentId) || !['Present', 'Absent', 'Late'].includes(record.status)) {
                console.warn(`Invalid record skipped: studentId=${record.studentId}, status=${record.status}`);
                return null; // Will be filtered out
            }
            return {
                updateOne: {
                    filter: {
                        studentId: record.studentId,
                        date: attendanceDate,
                        standard: standard, // Ensure filter includes all unique keys
                        section: section,
                        subject: subject || null // Match subject or null if not provided
                    },
                    update: {
                        $set: {
                            status: record.status,
                            markedBy: userId,
                            // These are needed on $set for upsert to work correctly if the doc is new
                            studentId: record.studentId,
                            date: attendanceDate,
                            standard: standard,
                            section: section,
                            subject: subject || null,
                        }
                    },
                    upsert: true // Create if doesn't exist, update if it does
                }
            };
        }).filter(op => op !== null); // Filter out invalid records

        if (bulkOps.length === 0) {
            return res.status(400).json({ message: 'No valid attendance records to process.' });
        }

        const result = await Attendance.bulkWrite(bulkOps);

        res.status(200).json({
            message: 'Attendance marked successfully.',
            processed: bulkOps.length, // How many valid records were attempted
            inserted: result.upsertedCount,
            updated: result.modifiedCount
        });

    } catch (error) {
        console.error("Error marking attendance:", error);
        if (error.code === 11000) { // Handle potential race conditions or duplicates not caught by filter
            return res.status(409).json({ message: 'Duplicate attendance record conflict during bulk write.', error: error.message });
        }
        res.status(500).json({ message: 'Server error marking attendance.', error: error.message });
    }
};

// @desc    Get attendance records with filtering and student details
// @route   GET /api/attendance
// @access  Private
exports.getAttendance = async (req, res) => {
    const { date, standard, section, subject, studentId } = req.query;
    const filter = {};

    if (date) filter.date = normalizeDate(date); // Filter by specific normalized date
    if (standard) filter.standard = standard;
    if (section) filter.section = section;
    if (subject) filter.subject = subject; // Add subject to filter if provided
    else filter.subject = null; // Default to match records without a subject unless specified
    if (studentId) {
         if (!mongoose.Types.ObjectId.isValid(studentId)) {
            return res.status(400).json({ message: 'Invalid student ID format provided for filtering.' });
        }
        filter.studentId = studentId;
    }


    // --- Pagination (Optional but recommended for large datasets) ---
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50; // Records per page
    const skip = (page - 1) * limit;

    try {
        const attendanceRecords = await Attendance.find(filter)
            .populate('studentId', 'name rollNumber') // Populate student name and roll number
            .sort({ date: -1 }) // Sort by date descending
            .skip(skip)
            .limit(limit);

        // Get total count for pagination info
        const totalRecords = await Attendance.countDocuments(filter);

        res.json({
            totalRecords,
            currentPage: page,
            totalPages: Math.ceil(totalRecords / limit),
            attendance: attendanceRecords,
        });
    } catch (error) {
        console.error("Error fetching attendance:", error);
        res.status(500).json({ message: 'Server error fetching attendance records' });
    }
};


// @desc    Get attendance report for a student over a date range (Example)
// @route   GET /api/attendance/report/student/:studentId
// @access  Private
exports.getStudentAttendanceReport = async (req, res) => {
    const { studentId } = req.params;
    const { startDate, endDate, subject } = req.query; // Expect YYYY-MM-DD format

    if (!mongoose.Types.ObjectId.isValid(studentId)) {
        return res.status(400).json({ message: 'Invalid student ID format.' });
    }
    if (!startDate || !endDate) {
        return res.status(400).json({ message: 'Please provide both startDate and endDate (YYYY-MM-DD).' });
    }

    try {
        const start = normalizeDate(startDate);
        const end = normalizeDate(endDate);
        // Ensure end date includes the whole day for comparison
        end.setUTCDate(end.getUTCDate() + 1); // To include records on the endDate

        const filter = {
            studentId: studentId,
            date: { $gte: start, $lt: end } // Use $lt for the end date after adding 1 day
        };

        if (subject) filter.subject = subject;
         else filter.subject = null; // Or handle 'all subjects' logic if needed

        const attendance = await Attendance.find(filter).sort({ date: 1 });

        if (!attendance || attendance.length === 0) {
            return res.status(404).json({ message: 'No attendance records found for this student in the specified range.' });
        }

        // Calculate statistics
        const totalDays = attendance.length;
        const presentDays = attendance.filter(a => a.status === 'Present' || a.status === 'Late').length;
        const absentDays = totalDays - presentDays;
        const percentage = totalDays > 0 ? ((presentDays / totalDays) * 100).toFixed(2) : 0;

        // Fetch student details once
        const student = await Student.findById(studentId).select('name rollNumber standard section');
        if (!student) {
             // Should ideally not happen if attendance exists, but good practice
             return res.status(404).json({ message: 'Student associated with attendance not found.' });
        }


        res.json({
             student: {
                 _id: student._id,
                 name: student.name,
                 rollNumber: student.rollNumber,
                 standard: student.standard,
                 section: student.section
             },
            report: {
                startDate: startDate, // Return original query params
                endDate: endDate,
                subject: subject || 'All (Default)',
                totalRecords: totalDays,
                present: presentDays,
                absent: absentDays,
                percentage: parseFloat(percentage), // Return as number
            },
            details: attendance // Optionally return the detailed records
        });

    } catch (error) {
        console.error("Error generating student attendance report:", error);
        res.status(500).json({ message: 'Server error generating report' });
    }
};