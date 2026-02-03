import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, FolderKanban, ChevronLeft, ChevronRight, LogOut, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from "@/components/ui/button";

export default function AdminLayout() {
    const [collapsed, setCollapsed] = useState(false);
    const [showUserMenu, setShowUserMenu] = useState(false);
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const navItems = [
        { path: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
        { path: '/admin/users', label: 'Users', icon: Users },
        { path: '/admin/templates', label: 'Sections', icon: FileText },
        { path: '/admin/projects', label: 'Projects', icon: FolderKanban },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
            {/* Sidebar */}
            <aside
                className={`bg-white border-r border-slate-200 z-30 shadow-sm transition-all duration-300 flex flex-col relative ${collapsed ? 'w-20' : 'w-64'
                    }`}
            >
                {/* Collapse Toggle */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-9 bg-white border border-slate-200 rounded-full p-1.5 text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm z-50 focus:outline-none"
                >
                    {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                </button>

                {/* Logo Area */}
                <div className={`flex items-center px-6 border-b border-slate-50 transition-all duration-300 ${collapsed ? 'h-20 justify-center' : 'h-24 flex-col justify-center items-start'}`}>
                    <img
                        src={collapsed ? "/src/assets/logo-small.png" : "/src/assets/logo.png"}
                        alt="Logo"
                        className={`transition-all duration-300 object-contain ${collapsed ? 'h-8 w-8' : 'h-8'}`}
                    />
                    {/* Only show text if not collapsed */}
                    <div className={`overflow-hidden transition-all duration-300 ${collapsed ? 'w-0 opacity-0 h-0' : 'w-auto opacity-100 mt-1'}`}>
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap block">
                            KT Portal
                        </span>
                    </div>
                </div>

                {/* Navigation */}
                <nav className={`flex-1 px-3 py-6 space-y-2 ${collapsed ? '' : 'overflow-y-auto overflow-x-hidden'}`}>
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.path === '/admin'
                            ? location.pathname === '/admin'
                            : location.pathname.startsWith(item.path);

                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={`
                                    flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative
                                    ${isActive
                                        ? 'bg-primary/5 text-primary'
                                        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'}
                                    ${collapsed ? 'justify-center' : ''}
                                `}
                            >
                                <Icon className={`w-5 h-5 transition-colors ${isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-600'} ${collapsed ? '' : 'mr-3'}`} />

                                {!collapsed && (
                                    <span className={`font-medium text-sm truncate ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
                                )}

                                {/* Active Indicator Bar */}
                                {isActive && !collapsed && (
                                    <div className="absolute right-0 h-6 w-1 bg-primary rounded-l-full" />
                                )}

                                {/* Hover Tooltip for Collapsed State */}
                                {collapsed && (
                                    <div className="absolute left-[calc(100%+10px)] top-1/2 -translate-y-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 whitespace-nowrap shadow-xl">
                                        {item.label}
                                        {/* Little Arrow */}
                                        <div className="absolute -left-1 top-1/2 -translate-y-1/2 border-y-4 border-y-transparent border-r-4 border-r-slate-900"></div>
                                    </div>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>

                {/* User / Logout */}
                <div className="p-4 border-t border-slate-100 mt-auto relative">
                    {/* User Menu Trigger */}
                    <div
                        className={`flex items-center p-2 rounded-xl transition-colors cursor-pointer hover:bg-slate-50 ${collapsed ? 'justify-center' : ''} group`}
                        onClick={() => setShowUserMenu(!showUserMenu)}
                    >
                        <div className="w-8 h-8 min-w-[32px] rounded-full bg-white flex items-center justify-center text-primary font-black border border-slate-200 shadow-sm relative">
                            {user?.name?.charAt(0) || 'A'}
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></div>
                        </div>

                        {!collapsed && (
                            <div className="ml-3 overflow-hidden flex-1">
                                <p className="text-sm font-bold text-slate-900 truncate">{user?.name}</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-wider truncate">Admin</p>
                            </div>
                        )}

                        {!collapsed && (
                            <Settings className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors ml-2" />
                        )}
                    </div>

                    {/* Popover Menu */}
                    {showUserMenu && (
                        <>
                            {/* Backdrop to close */}
                            <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />

                            <div className={`absolute bottom-full mb-2 bg-white border border-slate-200 shadow-2xl rounded-2xl p-4 w-60 z-50 animate-in slide-in-from-bottom-2 fade-in ${collapsed ? 'left-4' : 'left-4 w-[220px]'}`}>
                                <div className="border-b border-slate-100 pb-3 mb-3">
                                    <p className="font-bold text-slate-900 text-sm">{user?.name}</p>
                                    <p className="text-xs text-slate-500">{user?.role || 'Administrator'}</p>
                                </div>
                                <Button
                                    variant="ghost"
                                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 h-9 font-bold text-xs"
                                    onClick={handleLogout}
                                >
                                    <LogOut className="w-3.5 h-3.5 mr-2" />
                                    Sign Out
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 relative">
                <div className="h-full w-full">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
