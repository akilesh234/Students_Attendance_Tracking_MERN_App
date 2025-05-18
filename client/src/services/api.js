import axios from 'axios';

const api = axios.create({
    baseURL: '/api', // Proxied to http://localhost:5001/api (or your backend)
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token in headers
api.interceptors.request.use(
    (config) => {
        const authData = localStorage.getItem('auth');
        if (authData) {
            const token = JSON.parse(authData).token;
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Optional: Add a response interceptor to handle global errors like 401 Unauthorized
api.interceptors.response.use(
    (response) => response, // Simply return response on success
    (error) => {
        if (error.response && error.response.status === 401) {
            console.log("Unauthorized or token expired. Logging out.");
            // Trigger logout from AuthContext or directly manipulate localStorage/redirect
             localStorage.removeItem('auth');
             // Redirect to login page - use window.location or React Router's navigate
             window.location.href = '/login'; // Simple redirect
        }
        // Return the error so components can handle specific errors too
        return Promise.reject(error);
    }
);


export default api;