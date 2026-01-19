import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../../contexts/ProjectContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import {
    ChevronLeft,
    ShieldCheck,
    Settings,
    Users,
    Activity,
    Lock,
    ArrowUpRight,
    Layers,
    Clock,
    CheckCircle2,
    AlertCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';

export default function ManageProject() {
    const { projectId } = useParams();
    const { user, logout } = useAuth();
    const { projects, updateProjectStatus } = useProjects();
    const navigate = useNavigate();

    const project = projects.find(p => p.id === projectId);

    if (!project) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <AlertCircle className="w-12 h-12 text-slate-300" />
            <h2 className="text-xl font-black text-slate-900 uppercase">Project Record Missing</h2>
            <Button onClick={() => navigate('/dashboard')} className="rounded-xl">Return to Dashboard</Button>
        </div>
    );

    const canClose = project.completion === 100 && project.status !== 'Completed';

    const handleCloseProject = () => {
        if (window.confirm("Perform final institutional sign-off? This will archive the project as read-only.")) {
            updateProjectStatus(projectId, 'Completed');
        }
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            {/* Top Navigation Bar */}
            <div className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border px-8 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <img src="/src/assets/logo.png" alt="Logo" className="h-8" />
                        <span className="font-bold text-foreground tracking-tight uppercase text-lg hidden sm:block">KT Portal</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-1">
                        <TopNavItem icon={<Activity className="w-4 h-4" />} label="Dashboard" onClick={() => navigate('/dashboard')} />
                        <TopNavItem icon={<Folder icon={<Folder className="w-4 h-4" />} />} label="All Projects" onClick={() => navigate('/manager/projects')} />
                    </nav>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Project Manager</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={logout} className="rounded-xl hover:bg-destructive/10 hover:text-destructive">
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            <main className="p-8 lg:p-12 space-y-10 max-w-7xl mx-auto w-full">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-full -ml-3">
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <h1 className="text-4xl font-bold tracking-tight text-foreground">{project.name}</h1>
                        </div>
                        <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-2xl">{project.description}</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] border-2 ${project.status === 'Completed' ? 'text-emerald-600 border-emerald-100 bg-emerald-50' : 'text-primary border-primary/10 bg-primary/5'
                            }`}>
                            <span className="w-2 h-2 rounded-full bg-current animate-pulse mr-2 inline-block" />
                            {project.status} MODE
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                    <div className="xl:col-span-2 space-y-10">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                            <StatCard label="KT Progress" value={`${project.completion}%`} icon={<Zap className="w-4 h-4 text-blue-500" />} />
                            <StatCard label="Active Sections" value={project.sections.filter(s => s.status !== 'Understood').length} icon={<Clock className="w-4 h-4 text-orange-500" />} />
                            <StatCard label="Team Members" value={project.members.length} icon={<Users className="w-4 h-4 text-primary" />} />
                        </div>

                        {/* Sections List */}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-2xl font-bold text-foreground tracking-tight flex items-center gap-3">
                                    <Layers className="w-6 h-6 text-primary" />
                                    Project Modules
                                </h2>
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

                    <div className="space-y-8">
                        {/* Manager Control Panel */}
                        <Card className="shadow-lg border-border ring-1 ring-border rounded-[2rem] bg-card overflow-hidden">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-lg font-bold flex items-center gap-2 uppercase tracking-wide">
                                    <Settings className="w-5 h-5 text-primary" />
                                    Management Console
                                </CardTitle>
                                <CardDescription>Perform administrative actions for this project.</CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-4 space-y-6">
                                <div className="p-6 bg-muted/50 rounded-2xl border border-border space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Global Status</span>
                                        <span className="text-xs font-black">{project.completion}%</span>
                                    </div>
                                    <Progress value={project.completion} className="h-2" />
                                    <p className="text-[11px] text-muted-foreground leading-relaxed">
                                        {project.completion === 100
                                            ? "All sections are verified and understood. Ready for archival."
                                            : "Institutional sign-off is disabled until 100% completion is reached."}
                                    </p>
                                </div>

                                <Button
                                    onClick={handleCloseProject}
                                    disabled={!canClose}
                                    className="w-full h-14 rounded-2xl bg-foreground hover:bg-foreground/90 text-background font-bold uppercase tracking-widest shadow-xl transition-all"
                                >
                                    Archive & Finalize
                                </Button>

                                <div className="space-y-4 pt-4">
                                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2">Quick Reports</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <Button variant="outline" className="h-12 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                                            Export Audit
                                        </Button>
                                        <Button variant="outline" className="h-12 rounded-xl text-[10px] font-bold uppercase tracking-wider">
                                            View Logs
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Team View */}
                        <Card className="shadow-lg border-border ring-1 ring-border rounded-[2rem] bg-card">
                            <CardHeader className="p-8 pb-4">
                                <CardTitle className="text-lg font-bold flex items-center gap-2 uppercase tracking-wide">
                                    <Users className="w-5 h-5 text-primary" />
                                    Project Team
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 space-y-4">
                                {project.members.map((m, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/30 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary border border-primary/20">
                                                {m.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground leading-none">{m.name}</p>
                                                <p className="text-[10px] font-medium text-muted-foreground mt-1 uppercase tracking-wider">{m.ktRole}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}

function TopNavItem({ icon, label, active = false, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${active ? 'bg-secondary text-primary' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'}`}
        >
            {icon}
            <span>{label}</span>
        </button>
    )
}

function StatCard({ label, value, icon }) {
    return (
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-3">
            <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{label}</span>
                {icon}
            </div>
            <p className="text-3xl font-black text-foreground tracking-tight">{value}</p>
        </div>
    )
}

function SectionCard({ section, project, onClick }) {
    const statusIcon = section.status === 'Understood' ? <CheckCircle2 className="w-5 h-5" /> :
        section.status === 'Needs Clarification' ? <AlertCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />;

    return (
        <Card
            onClick={onClick}
            className="group hover:shadow-xl transition-all duration-500 border-border cursor-pointer rounded-2xl bg-card overflow-hidden"
        >
            <CardContent className="p-6 flex items-center justify-between">
                <div className="flex gap-4 items-center">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${section.status === 'Understood' ? 'bg-emerald-100 text-emerald-600' :
                            section.status === 'Needs Clarification' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                        }`}>
                        {statusIcon}
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">{section.title}</h3>
                        <p className="text-xs text-muted-foreground">Assigned to: {project.members.find(m => m.userId === section.contributorId)?.name || 'N/A'}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${section.status === 'Understood' ? 'bg-emerald-50 text-emerald-600' :
                            section.status === 'Needs Clarification' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                        {section.status}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
                </div>
            </CardContent>
        </Card>
    )
}

function Zap({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
    )
}

function Folder({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path></svg>
    )
}

function LogOut({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
    )
}
