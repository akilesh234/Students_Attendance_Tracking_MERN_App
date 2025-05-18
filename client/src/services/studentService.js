import api from './api';

// Fetch students, optionally filtered by standard/section
const getStudents = async (params = {}) => { // params = { standard: '10th', section: 'A' }
    try {
        const response = await api.get('/students', { params }); // Pass query params
        return response.data; // Array of students
    } catch (error) {
        console.error("Get students service error:", error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch students');
    }
};

// Add a new student
const addStudent = async (studentData) => { // { name, rollNumber, standard, section }
    try {
        const response = await api.post('/students', studentData);
        return response.data; // The newly created student object
    } catch (error) {
        console.error("Add student service error:", error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to add student');
    }
};

// Update an existing student
const updateStudent = async (id, studentData) => {
    try {
        const response = await api.put(`/students/${id}`, studentData);
        return response.data; // The updated student object
    } catch (error) {
        console.error("Update student service error:", error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to update student');
    }
};

// Deactivate (soft delete) a student
const deactivateStudent = async (id) => {
    try {
        const response = await api.delete(`/students/${id}`);
        return response.data; // { message: 'Student deactivated successfully' }
    } catch (error) {
        console.error("Deactivate student service error:", error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to deactivate student');
    }
};


export default {
    getStudents,
    addStudent,
    updateStudent,
    deactivateStudent,
};