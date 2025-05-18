import api from './api';

const login = async (username, password) => {
    try {
        const response = await api.post('/auth/login', { username, password });
        return response.data; // Should contain { _id, username, role, token }
    } catch (error) {
        console.error("Login service error:", error.response?.data || error.message);
        throw error.response?.data || new Error('Login failed');
    }
};

const register = async (username, password, role) => {
     try {
         const response = await api.post('/auth/register', { username, password, role });
         return response.data;
     } catch (error) {
         console.error("Register service error:", error.response?.data || error.message);
        throw error.response?.data || new Error('Registration failed');
     }
};

const getProfile = async () => {
    try {
        const response = await api.get('/auth/me');
        return response.data; // User profile data
    } catch (error) {
        console.error("Get profile service error:", error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to fetch profile');
    }
};


export default {
    login,
    register,
    getProfile,
};