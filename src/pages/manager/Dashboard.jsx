import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useProjects } from '../../contexts/ProjectContext.jsx';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, Folder, Clock, CheckCircle2, ChevronRight, LogOut, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';

export default function ManagerDashboard() {
    const { user, logout } = useAuth();
    const { projects } = useProjects();
    const navigate = useNavigate();

    const managerProjects = projects.filter(p => p.managerId === user.id);

    return (
        <div className="min-h-screen bg-background">
            {/* Top Navigation Bar */}
            <div className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border px-8 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3">
                        <img src="/src/assets/logo.png" alt="Logo" className="h-8" />
                        <span className="font-bold text-foreground tracking-tight uppercase text-lg hidden sm:block">KT Portal</span>
                    </div>

                    {/* Main Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        <TopNavItem icon={<Activity className="w-4 h-4" />} label="Dashboard" active onClick={() => navigate('/dashboard')} />
                        <TopNavItem icon={<Folder className="w-4 h-4" />} label="All Projects" onClick={() => navigate('/manager/projects')} />
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

            {/* Main Content */}
            <main className="p-8 lg:p-12 space-y-10 max-w-7xl mx-auto">
                {/* Hero Section */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="space-y-4">
                        <h1 className="text-4xl font-bold tracking-tight text-foreground leading-tight">
                            Manager Dashboard
                        </h1>
                        <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-lg">
                            Oversee project handovers and knowledge transfer progress.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button onClick={() => navigate('/manager/create-project')} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl h-12 px-8 font-bold uppercase tracking-wide transition-all hover:scale-105 active:scale-95">
                            <Plus className="w-5 h-5 mr-2" /> New Project
                        </Button>
                    </div>
                </header>

                {/* Stats Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-white dark:from-slate-900 border-blue-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-blue-600 font-bold uppercase tracking-widest text-[10px] flex items-center">
                                <Folder className="w-4 h-4 mr-2" /> TOTAL PROJECTS
                            </CardDescription>
                            <CardTitle className="text-4xl font-bold text-foreground">{managerProjects.length}</CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="bg-gradient-to-br from-orange-50 to-white dark:from-slate-900 border-orange-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-orange-600 font-bold uppercase tracking-widest text-[10px] flex items-center">
                                <Clock className="w-4 h-4 mr-2" /> ACTIVE HANDOVERS
                            </CardDescription>
                            <CardTitle className="text-4xl font-bold text-foreground">
                                {managerProjects.filter(p => p.status !== 'Completed').length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                    <Card className="bg-gradient-to-br from-emerald-50 to-white dark:from-slate-900 border-emerald-100 dark:border-slate-800 shadow-sm hover:shadow-md transition-all">
                        <CardHeader className="pb-2">
                            <CardDescription className="text-emerald-600 font-bold uppercase tracking-widest text-[10px] flex items-center">
                                <CheckCircle2 className="w-4 h-4 mr-2" /> COMPLETED KT
                            </CardDescription>
                            <CardTitle className="text-4xl font-bold text-foreground">
                                {managerProjects.filter(p => p.status === 'Completed').length}
                            </CardTitle>
                        </CardHeader>
                    </Card>
                </div>

                {/* Projects List */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
                            <Activity className="w-6 h-6 text-muted-foreground" /> Recent Projects
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {managerProjects.length === 0 ? (
                            <Card className="col-span-full py-20 border-dashed border-2 border-border bg-muted/5">
                                <CardContent className="flex flex-col items-center justify-center space-y-6">
                                    <div className="bg-background p-6 rounded-full shadow-sm border border-border">
                                        <Folder className="w-12 h-12 text-muted-foreground" />
                                    </div>
                                    <div className="text-center space-y-2">
                                        <h3 className="text-xl font-bold text-foreground">No projects found</h3>
                                        <p className="text-muted-foreground font-medium max-w-xs mx-auto">You haven't created any projects yet. Start by creating your first KT project.</p>
                                    </div>
                                    <Button onClick={() => navigate('/manager/create-project')} variant="outline" className="font-bold border-border hover:bg-background">
                                        Create First Project
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : (
                            managerProjects.slice(0, 4).map(project => (
                                <ProjectCard key={project.id} project={project} onOpen={() => navigate(`/manager/manage-project/${project.id}`)} />
                            ))
                        )}
                    </div>
                </section>
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

function ProjectCard({ project, onOpen }) {
    return (
        <Card className="hover:shadow-lg transition-all duration-300 group border-slate-200 dark:border-slate-800 overflow-hidden">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {project.name}
                        </CardTitle>
                        <CardDescription className="line-clamp-1 mt-1">{project.description}</CardDescription>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                        project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                        }`}>
                        {project.status}
                    </span>
                </div>
            </CardHeader>
            <CardContent className="space-y-4 pt-0">
                <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-500 uppercase tracking-tighter">KT PROGRESS</span>
                        <span className="text-slate-900 dark:text-slate-200">{project.completion}%</span>
                    </div>
                    <Progress value={project.completion} className="h-2 bg-slate-100 dark:bg-slate-800" />
                </div>

                <div className="flex items-center gap-6 border-t border-slate-50 dark:border-slate-800 pt-4">
                    <div className="flex -space-x-2">
                        {project.members.slice(0, 3).map((m, idx) => (
                            <div key={idx} className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold">
                                {m.userId.charAt(0).toUpperCase()}
                            </div>
                        ))}
                        {project.members.length > 3 && (
                            <div className="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-100 flex items-center justify-center text-[10px] font-bold">
                                +{project.members.length - 3}
                            </div>
                        )}
                    </div>
                    <div className="flex gap-4 text-xs font-medium text-slate-500">
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                            {project.sections.filter(s => s.status === 'Ready for Review').length} Review
                        </div>
                        <div className="flex items-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                            {project.sections.filter(s => s.status === 'Needs Clarification').length} Pending
                        </div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="bg-slate-50 dark:bg-slate-800 p-0">
                <Button onClick={onOpen} variant="ghost" className="w-full h-12 rounded-none hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 font-semibold group-hover:gap-3 transition-all">
                    Manage Project <ChevronRight className="w-4 h-4 ml-1 opacity-50 group-hover:opacity-100" />
                </Button>
            </CardFooter>
        </Card>
    );
}


