import api from './api';

// Mark attendance for a class on a date
const markAttendance = async (attendancePayload) => {
    // payload: { date, standard, section, subject(optional), records: [{ studentId, status }] }
    try {
        const response = await api.post('/attendance/mark', attendancePayload);
        return response.data; // { message, inserted, updated }
    } catch (error) {
        console.error("Mark attendance service error:", error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to mark attendance');
    }
};

// Get attendance records with filters
const getAttendance = async (params = {}) => {
    // params: { date, standard, section, subject(optional), studentId(optional), page, limit }
    try {
        const response = await api.get('/attendance', { params });
        // response.data should be { totalRecords, currentPage, totalPages, attendance: [...] }
        return response.data;
    } catch (error) {
        console.error("Get attendance service error:", error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch attendance records');
    }
};

// Get student-specific report
const getStudentReport = async (studentId, params = {}) => {
    // params: { startDate, endDate, subject(optional) }
     if (!studentId) throw new Error('Student ID is required for report');
    try {
        const response = await api.get(`/attendance/report/student/${studentId}`, { params });
        return response.data; // { student: {...}, report: {...}, details: [...] }
    } catch (error) {
        console.error("Get student report service error:", error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch student report');
    }
};


export default {
    markAttendance,
    getAttendance,
    getStudentReport,
};