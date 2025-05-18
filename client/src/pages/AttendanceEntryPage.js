import React, { useState, useEffect, useCallback } from 'react';
import studentService from '../services/studentService';
import attendanceService from '../services/attendanceService';

function AttendanceEntryPage() {
    // State for filters, students, attendance data, loading, errors etc.
    const [filters, setFilters] = useState({ standard: '', section: '', subject: '' });
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({}); // { studentId: 'Present', ... }
    const [isLoadingStudents, setIsLoadingStudents] = useState(false);
     const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Fetch students when filters change
    const fetchStudentsForAttendance = useCallback(async () => {
        if (!filters.standard || !filters.section || !selectedDate) {
            setStudents([]); // Clear students if filters not set
            return;
        }
        setIsLoadingStudents(true);
        setError('');
        setSuccessMessage('');
        setStudents([]); // Clear previous students
        setAttendance({}); // Clear previous attendance data

        try {
            const studentData = await studentService.getStudents({
                standard: filters.standard,
                section: filters.section
            });
             setStudents(studentData);

             // --- Pre-fill existing attendance for the selected date/class ---
             if (studentData.length > 0) {
                 const existingAttendanceData = await attendanceService.getAttendance({
                    date: selectedDate,
                    standard: filters.standard,
                    section: filters.section,
                    subject: filters.subject || null, // Use subject if provided
                    limit: studentData.length * 2 // Fetch more than needed just in case
                });

                const initialAttendance = {};
                 studentData.forEach(student => {
                     const record = existingAttendanceData?.attendance?.find(att => att.studentId._id === student._id);
                     initialAttendance[student._id] = record ? record.status : 'Present'; // Default to Present if no record found
                 });
                 setAttendance(initialAttendance);
            } else {
                 setAttendance({}); // No students, no attendance data needed
             }


        } catch (err) {
            setError(err.message || 'Failed to load students or existing attendance.');
        } finally {
            setIsLoadingStudents(false);
        }
    }, [filters.standard, filters.section, filters.subject, selectedDate]); // Dependencies for fetching

    useEffect(() => {
        fetchStudentsForAttendance();
    }, [fetchStudentsForAttendance]); // Run when the fetch function changes (due to dependencies)


    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleDateChange = (e) => {
        setSelectedDate(e.target.value);
    };

    const handleStatusChange = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (students.length === 0) {
            setError('No students loaded for the selected class.');
            return;
        }
        setIsSubmitting(true);
        setError('');
        setSuccessMessage('');

        const records = Object.entries(attendance).map(([studentId, status]) => ({
            studentId, status
        }));

        try {
            const response = await attendanceService.markAttendance({
                date: selectedDate,
                standard: filters.standard,
                section: filters.section,
                subject: filters.subject || null, // Send subject if it exists
                records: records
            });
            setSuccessMessage(response.message || 'Attendance submitted successfully!');
            // Optionally refetch attendance to confirm, or rely on the state update
             // fetchStudentsForAttendance(); // Re-fetch to show updated status immediately
        } catch (err) {
            setError(err.message || 'Failed to submit attendance.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h2>Mark Attendance</h2>

            {/* Filter Selection */}
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
                <label>Date:
                    <input type="date" value={selectedDate} onChange={handleDateChange} required />
                </label>
                <label>Standard:
                    <input type="text" name="standard" value={filters.standard} onChange={handleFilterChange} placeholder="e.g., 10th" required />
                </label>
                <label>Section:
                    <input type="text" name="section" value={filters.section} onChange={handleFilterChange} placeholder="e.g., A" required />
                </label>
                <label>Subject (Optional):
                    <input type="text" name="subject" value={filters.subject} onChange={handleFilterChange} placeholder="e.g., Maths" />
                </label>
                 {/* <button onClick={fetchStudentsForAttendance} disabled={isLoadingStudents || !filters.standard || !filters.section}>Load Students</button> */}
                 {/* Automatic loading now */}
            </div>

            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}

            {isLoadingStudents && <p>Loading students...</p>}

            {!isLoadingStudents && students.length === 0 && filters.standard && filters.section && (
                <p>No students found for the selected class, or filters not fully set.</p>
            )}

            {!isLoadingStudents && students.length > 0 && (
                <form onSubmit={handleSubmit}>
                    <table border="1" style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
                        <thead>
                            <tr>
                                <th>Roll No</th>
                                <th>Name</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {students.map(student => (
                                <tr key={student._id}>
                                    <td>{student.rollNumber}</td>
                                    <td>{student.name}</td>
                                    <td>
                                        <select
                                            value={attendance[student._id] || 'Present'} // Default to Present
                                            onChange={(e) => handleStatusChange(student._id, e.target.value)}
                                            style={{ padding: '5px' }}
                                        >
                                            <option value="Present">Present</option>
                                            <option value="Absent">Absent</option>
                                            <option value="Late">Late</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button type="submit" disabled={isSubmitting || isLoadingStudents} style={{ marginTop: '1rem' }}>
                        {isSubmitting ? 'Submitting...' : 'Submit Attendance'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default AttendanceEntryPage;