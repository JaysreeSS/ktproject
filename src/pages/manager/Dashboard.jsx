import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useProjects } from '../../contexts/ProjectContext.jsx';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Folder, Clock, CheckCircle2, ChevronRight, LogOut, Activity, LayoutDashboard, FileText, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';

export default function ManagerDashboard() {
    const { user, logout } = useAuth();
    const { projects } = useProjects();
    const navigate = useNavigate();

    const managerProjects = projects.filter(p => p.managerId === user.id);
    const activeProjects = managerProjects.filter(p => p.status !== 'Completed').length;
    const completedProjects = managerProjects.filter(p => p.status === 'Completed').length;

    const stats = [
        {
            title: "Total Projects",
            value: managerProjects.length,
            icon: Folder,
            color: "text-blue-600",
            bg: "bg-blue-50/80"
        },
        {
            title: "Active Handovers",
            value: activeProjects,
            icon: Clock,
            color: "text-orange-600",
            bg: "bg-orange-50/80"
        },
        {
            title: "Completed KT",
            value: completedProjects,
            icon: CheckCircle2,
            color: "text-emerald-600",
            bg: "bg-emerald-50/80"
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            {/* Main Content */}
            <main className="px-8 md:px-12 py-6 max-w-7xl mx-auto space-y-5 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Dashboard</h1>
                        <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-lg">Overview of your project handovers and progress.</p>
                    </div>
                    {/* New Project Button Removed */}
                </div>

                {/* Stats Grid */}
                <div className="grid gap-5 md:grid-cols-3">
                    {stats.map((stat, index) => (
                        <Card key={index} className="border-none shadow-md shadow-slate-200/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-white/80 backdrop-blur overflow-hidden relative group">
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

                {/* Cards Grid: Recent Projects & Notifications */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Recent Projects List (Matching Admin Style) */}
                    <Card className="border-none shadow-lg shadow-slate-200/40 flex flex-col h-[400px]">
                        <CardHeader className="p-5 border-b border-slate-100/80 pb-4 flex flex-row items-center justify-between">
                            <div>
                                <CardTitle className="text-base font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                                    <Activity className="w-5 h-5 text-primary" />
                                    Recent Projects
                                </CardTitle>
                                <CardDescription className="font-bold text-slate-400 text-xs">LATEST UPDATES ON YOUR PROJECTS</CardDescription>
                            </div>
                            <Button variant="ghost" size="sm" className="hidden sm:flex text-primary hover:text-primary hover:bg-primary/10 font-bold text-xs uppercase tracking-wide" onClick={() => navigate('/manager/projects')}>
                                View All <ChevronRight className="w-3 h-3 ml-1" />
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-4 flex-1 overflow-auto">
                            <div className="space-y-4">
                                {managerProjects.length > 0 ? managerProjects.slice(0, 5).map((proj, i) => (
                                    <div key={i} className="group cursor-pointer" onClick={() => navigate(`/manager/projects/${proj.id}`)}>
                                        <div className="flex justify-between items-center mb-2">
                                            <div>
                                                <h4 className="text-sm font-black text-slate-900 group-hover:text-primary transition-colors uppercase tracking-tight">{proj.name}</h4>
                                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">{proj.description}</p>
                                            </div>
                                            <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-md border ${proj.status === 'Completed' ? 'bg-emerald-100 text-emerald-600 border-emerald-200' :
                                                proj.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                                    'bg-slate-100 text-slate-600 border-slate-200'
                                                }`}>
                                                {proj.status || 'Not Started'}
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
                                        No projects found. Create one to get started.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Notifications Panel */}
                    <Card className="border-none shadow-lg shadow-slate-200/40 flex flex-col h-[400px]">
                        <CardHeader className="p-5 border-b border-slate-100/80 pb-4">
                            <CardTitle className="text-base font-black text-slate-800 uppercase tracking-tight flex items-center gap-2">
                                <Activity className="w-5 h-5 text-orange-500" />
                                Attention Needed
                            </CardTitle>
                            <CardDescription className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">SECTIONS REQUIRING CLARIFICATION</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 flex-1 overflow-auto">
                            <div className="space-y-4">
                                {(() => {
                                    const attentionItems = managerProjects.flatMap(p =>
                                        p.sections
                                            .filter(s => s.status === 'Needs Clarification')
                                            .map(s => ({ ...s, projectName: p.name, projectId: p.id }))
                                    );

                                    if (attentionItems.length === 0) {
                                        return (
                                            <div className="text-center py-8 text-slate-400 text-xs font-bold uppercase tracking-widest">
                                                No pending actions needed
                                            </div>
                                        );
                                    }

                                    return attentionItems.map((item, idx) => {
                                        const isClarify = item.status === 'Needs Clarification';
                                        return (
                                            <div key={idx} className={`flex items-start gap-4 p-4 rounded-xl border transition-colors cursor-pointer ${isClarify ? 'bg-orange-50/50 border-orange-100 hover:bg-orange-50' : 'bg-blue-50/50 border-blue-100 hover:bg-blue-50'
                                                }`} onClick={() => navigate(`/manager/projects/${item.projectId}`)}>
                                                <div className="mt-1">
                                                    <div className={`w-2 h-2 rounded-full animate-pulse ${isClarify ? 'bg-orange-500' : 'bg-blue-500'}`} />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.title}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold mt-0.5">PROJECT: {item.projectName.toUpperCase()}</p>
                                                    <p className={`text-[9px] font-black uppercase tracking-widest mt-2 w-fit px-2 py-1 rounded ${isClarify ? 'bg-orange-100/50 text-orange-600' : 'bg-blue-100/50 text-blue-600'
                                                        }`}>{item.status}</p>
                                                </div>
                                            </div>
                                        );
                                    });
                                })()}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}


