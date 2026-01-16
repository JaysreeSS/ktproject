import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import ManagerDashboard from './manager/Dashboard.jsx';
import UserDashboard from './user/Dashboard.jsx';

export default function DashboardRedirect() {
    const { user } = useAuth();

    if (!user) return <Navigate to="/login" replace />;

    if (user.isAdmin) return <Navigate to="/admin" replace />;

    if (user.role === 'manager') {
        return <ManagerDashboard />;
    }

    return <UserDashboard />;
}
