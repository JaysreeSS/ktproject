import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../contexts/ProjectContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    ChevronLeft,
    ShieldCheck,
    Clock,
    CheckCircle2,
    AlertCircle,
    MessageSquare,
    Lock,
    Activity,
    ArrowUpRight,
    Layers,
    History
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';

export default function ProjectDetails() {
    const { projectId } = useParams();
    const { user } = useAuth();
    const { projects, updateProjectStatus } = useProjects();
    const navigate = useNavigate();

    const project = projects.find(p => p.id === projectId);

    if (!project) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <AlertCircle className="w-12 h-12 text-slate-300" />
            <h2 className="text-xl font-black text-slate-900 uppercase">Project Record Missing</h2>
            <Button onClick={() => navigate('/dashboard')} className="rounded-xl">Return to Command Center</Button>
        </div>
    );

    const isManager = project.managerId === user.id;
    const isAdmin = user.isAdmin;
    const canClose = project.completion === 100 && project.status !== 'Completed';

    const handleCloseProject = () => {
        if (window.confirm("Perform final institutional sign-off? This will archive the project as read-only.")) {
            updateProjectStatus(projectId, 'Completed');
        }
    };

    return (
        <div className="p-10 max-w-7xl mx-auto space-y-12 animate-in fade-in duration-700">
            {/* Header / Breadcrumb */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="rounded-2xl hover:bg-card text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                    <ChevronLeft className="w-4 h-4 mr-2" /> Project Library
                </Button>
                <div className="flex items-center gap-3">
                    <div className="flex bg-muted p-1 rounded-xl">
                        <div className="px-3 py-1.5 bg-card shadow-sm rounded-lg text-[10px] font-black text-foreground uppercase tracking-widest">General</div>
                        <div className="px-3 py-1.5 text-muted-foreground text-[10px] font-black uppercase tracking-widest">Metadata</div>
                        <div className="px-3 py-1.5 text-muted-foreground text-[10px] font-black uppercase tracking-widest">Audit</div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col xl:flex-row gap-12">
                {/* Main Content Area */}
                <div className="flex-1 space-y-10">
                    {/* Hero Card */}
                    <div className="bg-card p-10 rounded-xl shadow-lg border border-border relative overflow-hidden group">
                        {project.status === 'Completed' && (
                            <div className="absolute top-0 right-0 bg-emerald-600 text-white px-8 py-2 rotate-45 translate-x-6 -translate-y-1 text-[10px] font-black tracking-[0.3em] uppercase shadow-lg">
                                ARCHIVED
                            </div>
                        )}
                        <div className="space-y-6 relative z-10">
                            <div className="flex justify-between items-start">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg">
                                            <Layers className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-wider text-primary">Active Project</p>
                                            <h1 className="text-4xl font-bold tracking-tight text-foreground leading-tight">{project.name}</h1>
                                        </div>
                                    </div>
                                    <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-2xl">{project.description}</p>
                                </div>
                                <div className={`px-4 py-2 rounded-lg font-bold text-[10px] uppercase tracking-wider border ${project.status === 'Completed'
                                    ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                    : 'bg-secondary text-primary border-primary/20'
                                    }`}>
                                    {project.status} MODE
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-10 pt-10 border-t border-border">
                                <MetaDataItem label="Manager" value={project.managerName} />
                                <MetaDataItem label="Created On" value={new Date(project.createdAt).toLocaleDateString()} />
                                <MetaDataItem label="Team Size" value={`${project.members.length} Members`} />
                                <MetaDataItem label="Modules" value={`${project.sections.length} Sections`} />
                            </div>
                        </div>
                    </div>

                    {/* Section Groups */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-4">
                                <div className="w-8 h-8 rounded-lg bg-foreground flex items-center justify-center text-background">
                                    <Lock className="w-4 h-4" />
                                </div>
                                Project Modules
                            </h2>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Manage Content</span>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {project.sections.map((section, idx) => (
                                <SectionCard
                                    key={idx}
                                    section={section}
                                    project={project}
                                    onClick={() => navigate(`/project/${projectId}/section/${section.id}`)}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Performance & Meta Sidebar */}
                <div className="w-full xl:w-96 space-y-8">
                    {/* Progress Card */}
                    <Card className="shadow-lg border border-border rounded-xl bg-card">
                        <CardHeader className="p-8 pb-0">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold text-foreground uppercase tracking-tight">Project Status</CardTitle>
                                <Zap className="w-5 h-5 text-primary" />
                            </div>
                            <CardDescription className="font-medium text-xs text-muted-foreground">Completion Progress</CardDescription>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="flex flex-col items-center justify-center py-4 relative">
                                <div className="relative w-40 h-40 flex items-center justify-center">
                                    <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-muted" />
                                        <circle
                                            cx="80" cy="80" r="70"
                                            stroke="currentColor" strokeWidth="12"
                                            fill="transparent"
                                            strokeDasharray={440}
                                            strokeDashoffset={440 - (440 * project.completion) / 100}
                                            className="text-primary transition-all duration-1000 ease-out"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                    <div className="absolute flex flex-col items-center">
                                        <span className="text-4xl font-bold text-foreground tracking-tight">{project.completion}%</span>
                                    </div>
                                </div>
                            </div>

                            {isManager && project.status !== 'Completed' && (
                                <div className="space-y-6 pt-6 border-t border-border">
                                    <div className="flex items-start gap-3 p-4 bg-secondary rounded-lg border border-border">
                                        <div className="p-1.5 bg-primary rounded text-primary-foreground">
                                            <ShieldCheck className="w-3 h-3" />
                                        </div>
                                        <p className="text-xs font-medium text-foreground leading-relaxed">
                                            {project.completion === 100
                                                ? "Project is ready for final sign-off and archival."
                                                : "All modules must be 'Understood' before archival."}
                                        </p>
                                    </div>
                                    <Button
                                        onClick={handleCloseProject}
                                        disabled={!canClose}
                                        className="w-full h-12 rounded-lg bg-foreground hover:bg-foreground/90 text-background font-bold uppercase tracking-wider text-xs shadow-lg transition-all"
                                    >
                                        Archive Project
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Team Matrix */}
                    <Card className="shadow-lg border border-border rounded-xl bg-card">
                        <CardHeader className="p-6 pb-2">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                <History className="w-4 h-4" /> Team Members
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 pt-0 space-y-4">
                            {project.members.map((m, idx) => (
                                <div key={idx} className="flex items-center justify-between group">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center font-bold text-foreground border border-border">
                                            {m.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-foreground leading-none">{m.name}</p>
                                            <p className="text-[10px] font-medium text-muted-foreground mt-0.5 uppercase tracking-wide">{m.functionalRole || 'Associate'}</p>
                                        </div>
                                    </div>
                                    <div className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${m.ktRole === 'Initiator' ? 'text-purple-600 bg-purple-50' :
                                        m.ktRole === 'Receiver' ? 'text-orange-600 bg-orange-50' : 'text-primary bg-secondary'
                                        }`}>
                                        {m.ktRole}
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

function MetaDataItem({ label, value }) {
    return (
        <div className="space-y-2">
            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">{label}</span>
            <p className="font-black text-foreground text-sm tracking-tight">{value}</p>
        </div>
    )
}

function SectionCard({ section, project, onClick }) {
    const statusConfig = {
        'Understood': { color: 'emerald', icon: <CheckCircle2 className="w-5 h-5" /> },
        'Needs Clarification': { color: 'orange', icon: <AlertCircle className="w-5 h-5" /> },
        'Ready for Review': { color: 'primary', icon: <Activity className="w-5 h-5" /> },
        'Draft': { color: 'muted', icon: <Clock className="w-5 h-5" /> },
    };

    const config = statusConfig[section.status] || statusConfig['Draft'];

    return (
        <Card
            onClick={onClick}
            className="group hover:shadow-2xl hover:shadow-primary/20 transition-all duration-500 border-none ring-1 ring-border cursor-pointer rounded-[2rem] bg-card overflow-hidden p-2"
        >
            <CardContent className="p-6 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 ${section.status === 'Understood' ? 'bg-emerald-600 text-white shadow-emerald-200' :
                        section.status === 'Draft' ? 'bg-muted text-muted-foreground' : 'bg-primary text-primary-foreground shadow-primary/30'
                        }`}>
                        {config.icon}
                    </div>
                    <div className="space-y-1">
                        <h3 className="text-xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors uppercase">{section.title}</h3>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5 p-1 bg-muted/50 rounded-lg border border-border">
                                <div className="w-4 h-4 rounded-full bg-muted-foreground/20 flex items-center justify-center text-[8px] font-black">
                                    {project.members.find(m => m.userId === section.contributorId)?.name.charAt(0)}
                                </div>
                                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">
                                    Assignee: {project.members.find(m => m.userId === section.contributorId)?.name || 'N/A'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-6">
                    <div className={`hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border-2 ${section.status === 'Understood' ? 'text-emerald-600 border-emerald-50 bg-emerald-50/30' :
                        section.status === 'Needs Clarification' ? 'text-orange-600 border-orange-50 bg-orange-50/30' :
                            section.status === 'Draft' ? 'text-muted-foreground border-border bg-muted/30' : 'text-primary border-primary/20 bg-primary/10'
                        }`}>
                        <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                        {section.status}
                    </div>
                    <div className="w-12 h-12 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all">
                        <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
