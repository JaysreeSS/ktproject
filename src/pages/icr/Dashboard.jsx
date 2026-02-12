import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useProjects } from '../../contexts/ProjectContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import {
    Briefcase,
    FileCheck,
    Layers,
    ArrowUpRight,
    Send,
    Inbox,
    Shield
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function ICRDashboard() {
    const { user } = useAuth();
    const { projects } = useProjects();
    const navigate = useNavigate();

    // 1. Get all projects where the user is a member
    const myProjects = projects.filter(p =>
        p.members.some(m => m.userId === user.id)
    );

    const getMyRole = (project) => {
        const member = project.members.find(m => m.userId === user.id);
        return member?.ktRole || 'Member';
    };

    const handleProjectClick = (project) => {
        const role = getMyRole(project);
        if (role === 'Initiator' || role === 'Contributor') {
            navigate(`/icr/handovers/${project.id}`);
        } else if (role === 'Receiver') {
            navigate(`/icr/onboardings/${project.id}`);
        }
    };

    // 4. Enhanced Attention Needed Logic:
    // - As a Contributor: See 'Needs Clarification' tasks
    // - As a Receiver: See 'Ready for Review' tasks
    const attentionNeeded = projects.flatMap(p => {
        const myRole = p.members.find(m => m.userId === user.id)?.ktRole;
        const myTasks = [];

        (p.sections || []).forEach(s => {
            // Case 1: I am the contributor and the receiver has questions
            if (s.contributorId === user.id && s.status === 'Needs Clarification') {
                myTasks.push({ ...s, projectId: p.id, projectName: p.name, type: 'clarify' });
            }
            // Case 2: I am the receiver and a task is waiting for my sign-off
            if (myRole === 'Receiver' && s.status === 'Ready for Review') {
                myTasks.push({ ...s, projectId: p.id, projectName: p.name, type: 'review' });
            }
        });

        return myTasks;
    });

    const stats = [
        {
            title: "Active Handovers",
            value: myProjects.filter(p => {
                const r = getMyRole(p);
                return (r === 'Initiator' || r === 'Contributor') && p.status !== 'Completed';
            }).length,
            icon: Send,
            color: "text-blue-600",
            bg: "bg-blue-50/80"
        },
        {
            title: "Active Onboardings",
            value: myProjects.filter(p => {
                const r = getMyRole(p);
                return r === 'Receiver' && p.status !== 'Completed';
            }).length,
            icon: Inbox,
            color: "text-orange-600",
            bg: "bg-orange-50/80"
        },
        {
            title: "Total Engagements",
            value: myProjects.length,
            icon: Briefcase,
            color: "text-emerald-600",
            bg: "bg-emerald-50/80"
        }
    ];

    return (
        <div className="px-8 md:px-12 py-6 space-y-5 max-w-7xl mx-auto animate-in fade-in duration-700">
            <header className="space-y-1">
                <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Dashboard</h1>
                <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-lg">Overview of your knowledge transfer responsibilities and learning paths.</p>
            </header>

            {/* Stats */}
            <div className="grid gap-5 md:grid-cols-3">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-none shadow-md shadow-slate-200/50 hover:shadow-xl transition-all duration-500 hover:-translate-y-1 bg-white/80 backdrop-blur overflow-hidden relative group">
                        <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full ${stat.bg} opacity-50 group-hover:scale-150 transition-transform duration-700 ease-out`} />
                        <CardContent className="p-5 relative z-10 flex items-center justify-between">
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">{stat.title}</p>
                                <p className="text-3xl font-black text-slate-800 tracking-tighter">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color} shadow-sm ring-1 ring-white/50`}>
                                <stat.icon className="h-5 w-5" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Attention Needed Sections Area */}
            <div className="space-y-4">
                <h2 className="text-base font-black text-slate-800 tracking-tight uppercase flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-500" />
                    Attention Needed
                </h2>
                {attentionNeeded.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {attentionNeeded.map((section, idx) => {
                            const isClarify = section.type === 'clarify';
                            const targetPath = isClarify ? `/icr/handovers/${section.projectId}` : `/icr/onboardings/${section.projectId}`;

                            return (
                                <Card
                                    key={`${section.projectId}-${section.id}-${idx}`}
                                    onClick={() => navigate(targetPath)}
                                    className={`group cursor-pointer border-2 transition-all rounded-xl overflow-hidden ${isClarify ? 'border-orange-100 bg-orange-50/30 hover:bg-orange-50' : 'border-blue-100 bg-blue-50/30 hover:bg-blue-50'
                                        }`}
                                >
                                    <CardContent className="p-4 flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${isClarify ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                                            }`}>
                                            {isClarify ? <Inbox className="w-5 h-5" /> : <FileCheck className="w-5 h-5" />}
                                        </div>
                                        <div className="min-w-0">
                                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{section.projectName}</h4>
                                            <p className="text-sm font-bold text-slate-800 truncate">{section.title}</p>
                                            <p className={`text-[10px] font-black uppercase mt-1 ${isClarify ? 'text-orange-600' : 'text-blue-600'
                                                }`}>
                                                {isClarify ? 'Clarification Needed' : 'Review Required'}
                                            </p>
                                        </div>
                                        <ArrowUpRight className={`w-4 h-4 ml-auto group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all ${isClarify ? 'text-orange-300 group-hover:text-orange-600' : 'text-blue-300 group-hover:text-blue-600'
                                            }`} />
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-white border border-dashed border-slate-100 rounded-xl">
                        No pending actions required at this time
                    </div>
                )}
            </div>

            {/* Projects Grid */}
            <div className="space-y-4">
                <h2 className="text-base font-black text-slate-800 tracking-tight uppercase flex items-center gap-2">
                    <Layers className="w-5 h-5 text-slate-400" />
                    Your Projects
                </h2>

                {myProjects.length === 0 ? (
                    <div className="text-center py-20 text-slate-400 text-xs font-bold uppercase tracking-widest bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                        No active projects found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                        {myProjects.map(project => {
                            const role = getMyRole(project);
                            const isHandover = role === 'Initiator' || role === 'Contributor';
                            const roleColor = isHandover ? 'text-blue-600 bg-blue-50 border-blue-100' : 'text-orange-600 bg-orange-50 border-orange-100';

                            return (
                                <Card
                                    key={project.id}
                                    onClick={() => handleProjectClick(project)}
                                    className="group cursor-pointer hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 border-none ring-1 ring-slate-100 rounded-xl overflow-hidden"
                                >
                                    <div className={`h-2 w-full ${isHandover ? 'bg-blue-500' : 'bg-orange-500'}`} />
                                    <CardContent className="p-5 space-y-4">
                                        <div className="flex justify-between items-start">
                                            <div className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border ${roleColor}`}>
                                                {role}
                                            </div>
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${project.status === 'Completed' ? 'border-emerald-200 text-emerald-600 bg-emerald-50' : 'border-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white'
                                                }`}>
                                                <ArrowUpRight className="w-4 h-4" />
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-base font-black text-slate-800 uppercase tracking-tight mb-2 group-hover:text-primary transition-colors line-clamp-1">{project.name}</h3>
                                            <p className="text-xs font-bold text-slate-500 line-clamp-2 leading-relaxed">{project.description}</p>
                                        </div>

                                        <div className="space-y-2 pt-3 border-t border-slate-50">
                                            <div className="flex justify-between text-xs font-black uppercase tracking-widest text-slate-400">
                                                <span>Completion</span>
                                                <span>{project.completion}%</span>
                                            </div>
                                            <Progress value={project.completion} className="h-1.5 bg-slate-100" />
                                        </div>

                                        <div className="flex items-center gap-2 pt-2">
                                            <div className="flex -space-x-2">
                                                {project.members.slice(0, 3).map((m, i) => (
                                                    <div key={i} className="w-6 h-6 rounded-full bg-white border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-600 shadow-sm ring-1 ring-slate-100">
                                                        {m.name.charAt(0)}
                                                    </div>
                                                ))}
                                                {project.members.length > 3 && (
                                                    <div className="w-6 h-6 rounded-full bg-slate-50 border-2 border-white flex items-center justify-center text-[10px] font-bold text-slate-400 shadow-sm ring-1 ring-slate-100">
                                                        +{project.members.length - 3}
                                                    </div>
                                                )}
                                            </div>
                                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-auto">
                                                {project.sections.length} Sections
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
