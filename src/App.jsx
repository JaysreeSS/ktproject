import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import { AdminProvider } from "./contexts/AdminContext.jsx";
import { ProjectProvider } from "./contexts/ProjectContext.jsx";
import Login from "./pages/Login.jsx";
import Landing from "./pages/Landing.jsx";
import AdminDashboard from "./pages/admin/Dashboard.jsx";
import UserManagement from "./pages/admin/UserManagement.jsx";
import TemplateManagement from "./pages/admin/TemplateManagement.jsx";
import AdminProjects from "./pages/admin/Projects.jsx";
import DashboardRedirect from "./pages/DashboardRedirect.jsx";
import ManagerDashboard from "./pages/manager/Dashboard.jsx";
import CreateProject from "./pages/manager/CreateProject.jsx";
import ProjectDetails from "./pages/ProjectDetails.jsx";
import SectionEditor from "./pages/SectionEditor.jsx";

function ProtectedRoute({ allowedRoles }) {
    const { isAuthenticated, user } = useAuth();
    if (!isAuthenticated) return <Navigate to="/" replace />; // Redirect to Landing

    if (allowedRoles && user) {
        const hasRole = allowedRoles.includes(user.role) || (user.isAdmin && allowedRoles.includes('admin'));
        if (!hasRole) {
            return <Navigate to="/dashboard" replace />; // Redirect to their dashboard instead of landing
        }
    }
    return <Outlet />;
}

export default function App() {
    return (
        <AuthProvider>
            <AdminProvider>
                <ProjectProvider>
                    <Router>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Landing />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/admin-login" element={<Login />} />
                            <Route path="/user-login" element={<Login />} />

                            {/* Admin Routes */}
                            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                                <Route path="/admin" element={<AdminDashboard />} />
                                <Route path="/admin/users" element={<UserManagement />} />
                                <Route path="/admin/templates" element={<TemplateManagement />} />
                                <Route path="/admin/projects" element={<AdminProjects />} />
                            </Route>

                            {/* General User Routes */}
                            <Route element={<ProtectedRoute />}>
                                <Route path="/dashboard" element={<DashboardRedirect />} />

                                {/* Manager Only */}
                                <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
                                    <Route path="/manager/create-project" element={<CreateProject />} />
                                </Route>

                                {/* Project Details (Shared Access) */}
                                <Route path="/project/:projectId" element={<ProjectDetails />} />
                                <Route path="/project/:projectId/section/:sectionId" element={<SectionEditor />} />
                            </Route>

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Router>
                </ProjectProvider>
            </AdminProvider>
        </AuthProvider>
    );
}
