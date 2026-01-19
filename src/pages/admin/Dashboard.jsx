import React from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, LogOut, LayoutDashboard, Database, ArrowRight } from "lucide-react";

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col">
            {/* Top Navigation Bar */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-6">
                    <img src="/src/assets/logo.png" alt="Logo" className="h-10 w-auto" />
                    <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />
                    <div>
                        <span className="font-black text-slate-900 tracking-tight uppercase text-lg hidden sm:block">Admin Console</span>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">System Oversight</p>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 pr-6 border-r border-slate-200">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-black text-slate-900">{user?.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">Global Admin</p>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-900 font-bold border-2 border-white shadow-sm ring-1 ring-slate-100">
                            {user?.name?.charAt(0) || 'A'}
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={logout} className="rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors">
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>
            </header>

            <main className="flex-grow p-4 md:p-8 max-w-7xl mx-auto w-full flex flex-col items-center justify-center space-y-12">
                <div className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="text-5xl font-black text-slate-900 tracking-tight">System Control Center</h1>
                    <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto">
                        Select a governance module to manage corporate identities, protocol blueprints, or monitor real-time knowledge transfer progress.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl animate-in fade-in zoom-in-95 duration-1000 delay-150">
                    <div
                        onClick={() => navigate('/admin/users')}
                        className="group bg-white border border-slate-200 p-10 rounded-[2.5rem] flex flex-col items-center gap-6 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 cursor-pointer border-b-4 border-b-transparent hover:border-b-primary"
                    >
                        <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                            <Users className="w-10 h-10" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-black text-slate-900">Users Identity</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                Manage corporate personas, access levels, and system permissions for all associates.
                            </p>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            Open Module <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>

                    <div
                        onClick={() => navigate('/admin/templates')}
                        className="group bg-white border border-slate-200 p-10 rounded-[2.5rem] flex flex-col items-center gap-6 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 cursor-pointer border-b-4 border-b-transparent hover:border-b-primary"
                    >
                        <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                            <LayoutDashboard className="w-10 h-10" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-black text-slate-900">Sections Creation</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                Design and govern mandatory document structures for all knowledge transfer sessions.
                            </p>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            Open Module <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>

                    <div
                        onClick={() => navigate('/admin/projects')}
                        className="group bg-white border border-slate-200 p-10 rounded-[2.5rem] flex flex-col items-center gap-6 shadow-sm hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 cursor-pointer border-b-4 border-b-transparent hover:border-b-primary"
                    >
                        <div className="w-20 h-20 rounded-[2rem] bg-slate-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-inner">
                            <Database className="w-10 h-10" />
                        </div>
                        <div className="text-center space-y-2">
                            <h3 className="text-2xl font-black text-slate-900">Project Monitoring</h3>
                            <p className="text-sm text-slate-500 font-medium leading-relaxed">
                                Monitor progress and access audit trails for all active and completed projects.
                            </p>
                        </div>
                        <div className="mt-4 flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                            Open Module <ArrowRight className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
