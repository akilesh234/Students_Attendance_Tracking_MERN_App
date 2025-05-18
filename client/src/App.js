import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Pages
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import StudentManagementPage from './pages/StudentManagementPage';
import AttendanceEntryPage from './pages/AttendanceEntryPage';
import AttendanceViewPage from './pages/AttendanceViewPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Routes
import ProtectedRoute, { RoleProtectedRoute } from './components/ProtectedRoute';

function App() {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="App">
            <nav className="win-navbar">
                <div className="nav-group">
                    <Link to="/" className="nav-link">Home</Link>
                    {isAuthenticated && (
                        <>
                            <Link to="/dashboard" className="nav-link">Dashboard</Link>
                            <Link to="/students" className="nav-link">Students</Link>
                            <Link to="/attendance/entry" className="nav-link">Mark Attendance</Link>
                            <Link to="/attendance/view" className="nav-link">View Attendance</Link>
                        </>
                    )}
                </div>
                <div className="nav-group">
                    {isAuthenticated ? (
                        <>
                            <span className="user-info">Welcome, {user?.username} ({user?.role})</span>
                            <button onClick={handleLogout}>Logout</button>
                        </>
                    ) : (
                        <Link to="/login" className="nav-link">Login</Link>
                    )}
                </div>
            </nav>

            <main className="win-main">
                <Routes>
                    <Route path="/login" element={<LoginPage />} />
                    <Route element={<ProtectedRoute />}>
                        <Route path="/" element={<DashboardPage />} />
                        <Route path="/dashboard" element={<DashboardPage />} />
                        <Route path="/students" element={
                            <RoleProtectedRoute allowedRoles={['admin', 'teacher']}>
                                <StudentManagementPage />
                            </RoleProtectedRoute>
                        } />
                        <Route path="/attendance/entry" element={
                            <RoleProtectedRoute allowedRoles={['admin', 'teacher']}>
                                <AttendanceEntryPage />
                            </RoleProtectedRoute>
                        } />
                        <Route path="/attendance/view" element={
                            <RoleProtectedRoute allowedRoles={['admin', 'teacher']}>
                                <AttendanceViewPage />
                            </RoleProtectedRoute>
                        } />
                    </Route>
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </main>
        </div>
    );
}

export default App;
