import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Fake user database or simulate API response
        const fakeUsers = [
            { username: 'admin', password: 'admin123', name: 'Admin User', role: 'admin' },
            { username: 'teacher', password: 'teach123', name: 'Mr. Smith', role: 'teacher' },
        ];

        const foundUser = fakeUsers.find(
            (user) => user.username === username && user.password === password
        );

        if (foundUser) {
            // Call context login with user object + fake token
            login({ name: foundUser.name, role: foundUser.role }, 'fake-jwt-token');
            navigate('/dashboard');
        } else {
            setError('Invalid credentials');
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto', padding: '2rem' }}>
            <h2>Login</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Username:</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" style={{ marginTop: '1rem' }}>Login</button>
            </form>
        </div>
    );
}

export default LoginPage;
