import React from "react";
import { Users, FileText, FolderKanban, TrendingUp, Zap, Briefcase, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

import { useAdmin } from "../../contexts/AdminContext.jsx";
import { useProjects } from "../../contexts/ProjectContext.jsx";

export default function AdminDashboard() {
    const navigate = useNavigate();
    const { users, templates } = useAdmin();
    const { projects: allProjects } = useProjects();

    const activeProjects = allProjects.filter(p => p.status !== 'Completed').length;
    const totalAssociates = users.length;
    const totalTemplates = templates.length;

    // Real-time Stats
    const stats = [
        {
            title: "Total Users",
            value: totalAssociates,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50/80"
        },
        {
            title: "Active Projects",
            value: activeProjects,
            icon: FolderKanban,
            color: "text-purple-600",
            bg: "bg-purple-50/80"
        },
        {
            title: "Templates",
            value: totalTemplates,
            icon: FileText,
            color: "text-pink-600",
            bg: "bg-pink-50/80"
        }
    ];

    // Get real managers/leads from users context (Excluding Admins)
    const managers = users
        .filter(u => u.role === 'manager')
        .map(u => ({
            name: u.name,
            role: 'Project Manager',
            project: allProjects.find(p => p.managerName === u.name)?.name || "No active project"
        }));

    // Get real active projects from context
    const projectList = allProjects
        .filter(p => p.status !== 'Completed')
        .slice(0, 4);

    // Calculate real role counts
    const roleStats = [
        { label: "Developers", count: users.filter(u => u.role === 'developer').length, color: "bg-blue-500", lightBg: "bg-blue-50" },
        { label: "QA Engineers", count: users.filter(u => u.role === 'qa').length, color: "bg-purple-500", lightBg: "bg-purple-50" },
        { label: "Business Analysts", count: users.filter(u => u.role === 'ba').length, color: "bg-amber-500", lightBg: "bg-amber-50" },
        { label: "Support", count: users.filter(u => u.role === 'support').length, color: "bg-slate-500", lightBg: "bg-slate-50" }
    ];

    return (
        <div className="p-5 max-w-7xl mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Dashboard</h1>
                    <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-lg">Key metrics and project updates.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-none shadow-md shadow-slate-200/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-white/80 backdrop-blur overflow-hidden relative group">

                        {/* Decorative background blob */}
                        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out`} />

                        <CardHeader className="p-5 flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} shadow-sm ring-1 ring-white/50`}>
                                <stat.icon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="p-5 pt-0 relative z-10">
                            <div className="flex items-baseline gap-2">
                                <div className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* New Widgets: Organization & Projects */}
            <div className="grid gap-5 md:grid-cols-2">

                {/* Team Overview & Roles */}
                <Card className="border-none shadow-lg shadow-slate-200/40 flex flex-col">
                    <CardHeader className="border-b border-slate-100/80 pb-4">
                        <CardTitle className="text-base font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-primary" />
                            Team Overview
                        </CardTitle>
                        <CardDescription className="text-xs font-bold text-slate-400">Managers and team breakdown</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4 space-y-6 flex-1">
                        {/* Managers List - Sub Card Style */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Team Leadership</h4>
                            <div className="bg-slate-50/50 rounded-2xl border border-slate-100 p-3">
                                <div className="space-y-3 max-h-[160px] overflow-y-auto pr-2 custom-scrollbar">
                                    {managers.length > 0 ? (
                                        managers.map((mgr, i) => (
                                            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white transition-colors border border-slate-100 shadow-sm">
                                                <div className="w-9 h-9 min-w-[36px] rounded-full bg-primary/5 border border-primary/10 flex items-center justify-center font-bold text-primary text-xs">
                                                    {mgr.name.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-bold text-slate-900 truncate">{mgr.name}</p>
                                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-tight truncate">{mgr.role}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="text-center py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">
                                            No managers found
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Role Distribution */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Team Roles</h4>
                            <div className="grid grid-cols-2 gap-3">
                                {roleStats.map((role, i) => (
                                    <div key={i} className={`p-3 rounded-xl border border-slate-100 ${role.lightBg}/30 flex flex-col gap-1`}>
                                        <div className="flex items-center gap-1.5">
                                            <div className={`w-1.5 h-1.5 rounded-full ${role.color}`} />
                                            <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">{role.label}</span>
                                        </div>
                                        <span className="text-base font-black text-slate-800">{role.count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Active Projects Status */}
                <Card className="border-none shadow-lg shadow-slate-200/40 flex flex-col">
                    <CardHeader className="border-b border-slate-100/80 pb-4 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-base font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                                <FolderKanban className="w-4 h-4 text-primary" />
                                Active Projects
                            </CardTitle>
                            <CardDescription className="text-xs font-bold text-slate-400">Track project status and progress</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="hidden sm:flex text-primary hover:text-primary hover:bg-primary/10 font-bold text-xs uppercase tracking-widest" onClick={() => navigate('/admin/projects')}>
                            View All <ChevronRight className="w-3" />
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-4">
                        <div className="space-y-4">
                            {projectList.length > 0 ? projectList.map((proj, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{proj.name}</h4>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Lead: {proj.managerName || 'Unassigned'}</p>
                                        </div>
                                        <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md ${proj.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' :
                                            proj.status === 'In Progress' ? 'bg-blue-100 text-blue-600' :
                                                proj.status === 'Planning' ? 'bg-slate-100 text-slate-600' : 'bg-purple-100 text-purple-600'
                                            }`}>
                                            {proj.status}
                                        </span>
                                    </div>
                                    <Progress value={proj.completion} className="h-1.5 bg-slate-100"
                                        indicatorClassName={
                                            proj.status === 'Completed' ? 'bg-emerald-500' :
                                                proj.completion > 50 ? 'bg-blue-500' : 'bg-slate-400'
                                        }
                                    />
                                </div>
                            )) : (
                                <div className="text-center py-10 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                    No active projects found
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
