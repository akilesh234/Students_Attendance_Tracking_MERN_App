import React, { useState, useEffect, useCallback } from 'react';
import attendanceService from '../services/attendanceService';

function AttendanceViewPage() {
    const [filters, setFilters] = useState({
        date: new Date().toISOString().slice(0, 10), // Default to today
        standard: '',
        section: '',
        subject: '',
        studentId: '' // Optional: Filter by specific student ID
    });
    const [attendanceData, setAttendanceData] = useState([]);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        totalPages: 1,
        totalRecords: 0
    });
     const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

     // Function to fetch attendance data
     const fetchAttendance = useCallback(async (page = 1) => {
         // Only fetch if essential filters are present (e.g., date, standard, section)
         if (!filters.date || !filters.standard || !filters.section) {
             // Optionally show a message to select filters
             // setError("Please select Date, Standard, and Section to view attendance.");
             setAttendanceData([]); // Clear data if filters are incomplete
             setPagination({ currentPage: 1, totalPages: 1, totalRecords: 0 });
             return;
         }

         setIsLoading(true);
         setError('');
         try {
             const params = {
                date: filters.date,
                standard: filters.standard,
                section: filters.section,
                subject: filters.subject || null, // Pass subject or null
                studentId: filters.studentId || null, // Pass studentId if present
                page: page,
                limit: 20 // Set a reasonable limit per page
             };
             // Remove null/empty params before sending
             Object.keys(params).forEach(key => (params[key] == null || params[key] === '') && delete params[key]);


             const data = await attendanceService.getAttendance(params);
             setAttendanceData(data.attendance || []);
             setPagination({
                 currentPage: data.currentPage || 1,
                 totalPages: data.totalPages || 1,
                 totalRecords: data.totalRecords || 0
             });
         } catch (err) {
            setError(err.message || 'Failed to fetch attendance records');
             setAttendanceData([]); // Clear data on error
             setPagination({ currentPage: 1, totalPages: 1, totalRecords: 0 });
         } finally {
             setIsLoading(false);
         }
     }, [filters.date, filters.standard, filters.section, filters.subject, filters.studentId]); // Dependencies


    // Initial fetch and fetch on filter change
    useEffect(() => {
        fetchAttendance(1); // Fetch page 1 when filters change
    }, [fetchAttendance]); // Rerun when the fetch function definition changes

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
         // No immediate fetch here, useEffect handles it based on filter changes
    };

     // --- Pagination Handlers ---
     const handleNextPage = () => {
         if (pagination.currentPage < pagination.totalPages) {
             fetchAttendance(pagination.currentPage + 1);
         }
     };

     const handlePrevPage = () => {
         if (pagination.currentPage > 1) {
             fetchAttendance(pagination.currentPage - 1);
         }
     };

     // --- Optional: Student Report Generation Trigger ---
     const handleViewReport = async () => {
         if (!filters.studentId) {
             alert("Please enter a Student ID to view a report.");
             return;
         }
         // Navigate to a report page or show modal?
         // For simplicity, just log the call for now
         console.log("Requesting report for student:", filters.studentId);
         try {
             const reportData = await attendanceService.getStudentReport(filters.studentId, {
                 startDate: '2025-01-01', // Example: Get date range from user input
                 endDate: filters.date // Example: Use current filter date as end
             });
             console.log("Report Data:", reportData);
             alert(`Report for ${reportData.student.name}: ${reportData.report.percentage}% Present`);
         } catch (reportError) {
             console.error("Report Error:", reportError);
             alert(`Failed to get report: ${reportError.message}`);
         }
     };


    return (
        <div>
            <h2>View Attendance Records</h2>

             {/* Filter Inputs */}
            <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <label>Date: <input type="date" name="date" value={filters.date} onChange={handleFilterChange} /></label>
                <label>Standard: <input type="text" name="standard" value={filters.standard} onChange={handleFilterChange} placeholder="e.g., 10th" /></label>
                <label>Section: <input type="text" name="section" value={filters.section} onChange={handleFilterChange} placeholder="e.g., A" /></label>
                <label>Subject (Opt): <input type="text" name="subject" value={filters.subject} onChange={handleFilterChange} placeholder="e.g., Maths" /></label>
                <label>Student ID (Opt): <input type="text" name="studentId" value={filters.studentId} onChange={handleFilterChange} placeholder="Filter by Student ID" /></label>
                 {/* Removed explicit fetch button as it fetches automatically */}
            </div>

            {/* Optional: Button to trigger student report */}
             {filters.studentId && (
                 <button onClick={handleViewReport} style={{ marginBottom: '1rem' }}>View Report for Student</button>
             )}


            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {isLoading && <p>Loading attendance...</p>}

            {!isLoading && attendanceData.length > 0 && (
                <>
                    <p>Total Records Found: {pagination.totalRecords}</p>
                    <table border="1" style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Roll No</th>
                                <th>Student Name</th>
                                <th>Standard</th>
                                <th>Section</th>
                                <th>Subject</th>
                                <th>Status</th>
                                <th>Marked By</th>
                            </tr>
                        </thead>
                        <tbody>
                            {attendanceData.map(record => (
                                <tr key={record._id}>
                                     <td>{new Date(record.date).toLocaleDateString()}</td> {/* Format date */}
                                     <td>{record.studentId?.rollNumber || 'N/A'}</td> {/* Handle if student somehow deleted */}
                                    <td>{record.studentId?.name || 'Student Not Found'}</td>
                                     <td>{record.standard}</td>
                                     <td>{record.section}</td>
                                     <td>{record.subject || '-'}</td>
                                     <td>{record.status}</td>
                                     <td>{record.markedBy?.username || 'N/A'}</td> {/* Requires populating markedBy */}
                                </tr>
                            ))}
                        </tbody>
                    </table>

                     {/* Pagination Controls */}
                     <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'space-between' }}>
                         <button onClick={handlePrevPage} disabled={pagination.currentPage <= 1}>
                             Previous
                         </button>
                         <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
                         <button onClick={handleNextPage} disabled={pagination.currentPage >= pagination.totalPages}>
                             Next
                         </button>
                     </div>
                </>
            )}

            {!isLoading && attendanceData.length === 0 && filters.date && filters.standard && filters.section && (
                <p>No attendance records found for the selected criteria.</p>
            )}
             {!isLoading && (!filters.date || !filters.standard || !filters.section) && (
                <p>Please select Date, Standard, and Section to view attendance.</p>
             )}
        </div>
    );
}

export default AttendanceViewPage;