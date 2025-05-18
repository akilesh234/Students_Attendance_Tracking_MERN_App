import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function DashboardPage() {
     const { user } = useAuth(); // Get user info if needed

    return (
        <div>
            <h2>Dashboard</h2>
            <p>Welcome, {user?.username || 'User'}!</p>
            <p>This is the main dashboard area. Add widgets, summaries, or quick links here.</p>
            {/* Example: Quick Stats or Links */}
            <div>
                 <h3>Quick Actions</h3>
                 <ul>
                     <li><a href="/students">Manage Students</a></li>
                     <li><a href="/attendance/entry">Mark Attendance</a></li>
                     <li><a href="/attendance/view">View Attendance Records</a></li>
                 </ul>
            </div>
        </div>
    );
}

export default DashboardPage;