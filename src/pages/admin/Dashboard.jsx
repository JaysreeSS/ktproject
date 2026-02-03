import React from "react";
import { Users, FileText, FolderKanban, TrendingUp, Zap, Briefcase, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

import { useAdmin } from "../../contexts/AdminContext.jsx";
import { useProjects } from "../../contexts/ProjectContext.jsx";

export default function AdminDashboard() {
    const { users, templates } = useAdmin();
    const { projects: allProjects } = useProjects();

    const activeProjects = allProjects.filter(p => p.status !== 'Completed').length;
    const totalAssociates = users.length;
    const totalTemplates = templates.length;

    // Real-time Stats
    const stats = [
        {
            title: "Total Associates",
            value: totalAssociates,
            change: "+12% growth",
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-50/80",
            trend: "up"
        },
        {
            title: "Active Projects",
            value: activeProjects,
            change: "3 critical deadlines",
            icon: FolderKanban,
            color: "text-purple-600",
            bg: "bg-purple-50/80",
            trend: "neutral"
        },
        {
            title: "Section Templates",
            value: totalTemplates,
            change: "100% compliance",
            icon: FileText,
            color: "text-pink-600",
            bg: "bg-pink-50/80",
            trend: "up"
        }
    ];

    // Mock Data for Managers (Can be replaced later)
    const managers = [
        { name: "Sarah Connor", role: "Product Manager", project: "Project Genasys" },
        { name: "Kyle Reese", role: "Tech Lead", project: "Skynet API" },
        { name: "John Smith", role: "Engineering Manager", project: "Resistance App" },
    ];

    // Mock Data for Projects (Use mock for the list display for now to keep detailed design, or map real projects if properties align)
    const projectList = [
        { name: "FinTech Migration", status: "In Progress", progress: 65, lead: "Sarah C." },
        { name: "HealthCare Portal", status: "Code Review", progress: 85, lead: "Kyle R." },
        { name: "Internal Audit Tool", status: "Planning", progress: 15, lead: "John S." },
        { name: "Legacy Sunset", status: "Completed", progress: 100, lead: "Sarah C." },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tight">System Overview</h1>
                    <p className="text-slate-500 font-medium">Real-time metrics and governance insights.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-none shadow-md shadow-slate-200/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-white/80 backdrop-blur overflow-hidden relative group">

                        {/* Decorative background blob */}
                        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out`} />

                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
                            <CardTitle className="text-xs font-bold uppercase tracking-widest text-slate-500">
                                {stat.title}
                            </CardTitle>
                            <div className={`p-2 rounded-xl ${stat.bg} ${stat.color} shadow-sm ring-1 ring-white/50`}>
                                <stat.icon className="h-4 w-4" />
                            </div>
                        </CardHeader>
                        <CardContent className="relative z-10">
                            <div className="flex items-baseline gap-2">
                                <div className="text-4xl font-black text-slate-800 tracking-tighter">{stat.value}</div>
                            </div>
                            <p className="text-xs font-bold text-slate-400 mt-2 flex items-center gap-1.5">
                                {stat.trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-500" />}
                                {stat.trend === 'down' && <TrendingUp className="w-3 h-3 text-red-500 rotate-180" />}
                                {stat.trend === 'neutral' && <Zap className="w-3 h-3 text-amber-500" />}
                                <span className={stat.trend === 'up' ? 'text-emerald-600' : 'text-slate-500'}>
                                    {stat.change}
                                </span>
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* New Widgets: Organization & Projects */}
            <div className="grid gap-8 md:grid-cols-2">

                {/* Organization Structure & Personnel */}
                <Card className="border-none shadow-lg shadow-slate-200/40 flex flex-col">
                    <CardHeader className="border-b border-slate-100/80 pb-4">
                        <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                            <Briefcase className="w-4 h-4 text-primary" />
                            Organization Structure
                        </CardTitle>
                        <CardDescription className="font-medium text-slate-400">Key leadership and role distribution</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-8 flex-1">
                        {/* Managers List */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Team Leadership</h4>
                            <div className="grid gap-3">
                                {managers.map((mgr, i) => (
                                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors border border-slate-100">
                                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center font-bold text-slate-700 shadow-sm">
                                            {mgr.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-slate-900">{mgr.name}</p>
                                            <p className="text-[10px] font-bold text-slate-500 uppercase">{mgr.role}</p>
                                        </div>
                                        <div className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-1 rounded-md">
                                            {mgr.project}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Role Distribution */}
                        <div className="space-y-4">
                            <h4 className="text-xs font-black uppercase tracking-widest text-slate-400">Role Composition</h4>
                            <div className="space-y-3">
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-slate-600">
                                        <span>Developers</span>
                                        <span>65%</span>
                                    </div>
                                    <Progress value={65} className="h-2 bg-slate-100" indicatorClassName="bg-blue-500" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-slate-600">
                                        <span>QA Engineers</span>
                                        <span>20%</span>
                                    </div>
                                    <Progress value={20} className="h-2 bg-slate-100" indicatorClassName="bg-purple-500" />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex justify-between text-xs font-bold text-slate-600">
                                        <span>Management</span>
                                        <span>15%</span>
                                    </div>
                                    <Progress value={15} className="h-2 bg-slate-100" indicatorClassName="bg-emerald-500" />
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Active Projects Status */}
                <Card className="border-none shadow-lg shadow-slate-200/40 flex flex-col">
                    <CardHeader className="border-b border-slate-100/80 pb-4 flex flex-row items-center justify-between">
                        <div>
                            <CardTitle className="text-lg font-bold text-slate-800 flex items-center gap-2">
                                <FolderKanban className="w-4 h-4 text-primary" />
                                Active Initiatives
                            </CardTitle>
                            <CardDescription className="font-medium text-slate-400">Project progress and status overview</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" className="hidden sm:flex text-primary hover:text-primary hover:bg-primary/10 font-bold text-xs uppercase tracking-wide">
                            View All <ChevronRight className="w-3 h-3 ml-1" />
                        </Button>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <div className="space-y-6">
                            {projectList.map((proj, i) => (
                                <div key={i} className="group">
                                    <div className="flex justify-between items-center mb-2">
                                        <div>
                                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{proj.name}</h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Lead: {proj.lead}</p>
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md ${proj.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' :
                                            proj.status === 'In Progress' ? 'bg-blue-100 text-blue-600' :
                                                proj.status === 'Planning' ? 'bg-slate-100 text-slate-600' : 'bg-purple-100 text-purple-600'
                                            }`}>
                                            {proj.status}
                                        </span>
                                    </div>
                                    <Progress value={proj.progress} className="h-1.5 bg-slate-100"
                                        indicatorClassName={
                                            proj.status === 'Completed' ? 'bg-emerald-500' :
                                                proj.progress > 50 ? 'bg-blue-500' : 'bg-slate-400'
                                        }
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="mt-8 p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                            <div className="flex items-start gap-3">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
                                    <Zap className="w-4 h-4" />
                                </div>
                                <div>
                                    <h5 className="text-sm font-black text-indigo-900">Project Velocity</h5>
                                    <p className="text-xs text-indigo-700 mt-1 font-medium leading-relaxed">
                                        Overall delivery velocity has increased by <span className="font-bold">18%</span> this quarter. 3 projects are ahead of schedule.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
