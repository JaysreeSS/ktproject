import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useProjects } from '../../contexts/ProjectContext.jsx';
import { Button } from '@/components/ui/button';
import { Plus, Folder, LogOut, ChevronLeft, Activity, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

export default function AllProjects() {
    const { user, logout } = useAuth();
    const { projects } = useProjects();
    const navigate = useNavigate();

    const managerProjects = projects.filter(p => p.managerId === user.id);

    return (
        <div className="min-h-screen bg-background">
            {/* Top Navigation Bar */}
            <div className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border px-8 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-8">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                        <img src="/src/assets/logo.png" alt="Logo" className="h-8" />
                        <span className="font-bold text-foreground tracking-tight uppercase text-lg hidden sm:block">KT Portal</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-1">
                        <TopNavItem icon={<Activity className="w-4 h-4" />} label="Dashboard" onClick={() => navigate('/dashboard')} />
                        <TopNavItem icon={<Folder className="w-4 h-4" />} label="All Projects" active />
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

            <main className="p-8 lg:p-12 space-y-10 max-w-7xl mx-auto">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-full -ml-3">
                                <ChevronLeft className="w-5 h-5" />
                            </Button>
                            <h1 className="text-4xl font-bold tracking-tight text-foreground leading-tight">
                                All Projects
                            </h1>
                        </div>
                        <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-lg">
                            Manage and track every project handover under your supervision.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button onClick={() => navigate('/manager/create-project')} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl h-12 px-8 font-bold uppercase tracking-wide transition-all hover:scale-105 active:scale-95">
                            <Plus className="w-5 h-5 mr-2" /> New Project
                        </Button>
                    </div>
                </header>

                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search projects by name..." className="pl-10 h-11 bg-card border-border rounded-xl" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {managerProjects.length === 0 ? (
                        <div className="col-span-full py-20 text-center space-y-4">
                            <Folder className="w-12 h-12 text-muted-foreground mx-auto opacity-20" />
                            <p className="text-muted-foreground font-bold uppercase tracking-widest text-xs">No project records found</p>
                        </div>
                    ) : (
                        managerProjects.map(project => (
                            <Card key={project.id} className="hover:shadow-lg transition-all duration-300 group border-border overflow-hidden bg-card">
                                <CardHeader className="pb-3 px-6 pt-6">
                                    <div className="flex justify-between items-start">
                                        <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-1">
                                            {project.name}
                                        </CardTitle>
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${project.status === 'Completed' ? 'bg-emerald-50 text-emerald-600' : 'bg-secondary text-primary'
                                            }`}>
                                            {project.status}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent className="px-6 pb-6 space-y-4">
                                    <p className="text-sm text-muted-foreground line-clamp-2 min-h-[40px]">{project.description}</p>
                                    <div className="flex items-center gap-2 pt-2">
                                        <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                                            <div className="bg-primary h-full transition-all" style={{ width: `${project.completion}%` }} />
                                        </div>
                                        <span className="text-[10px] font-bold text-foreground">{project.completion}%</span>
                                    </div>
                                </CardContent>
                                <CardFooter className="bg-muted/30 p-0 border-t border-border">
                                    <Button
                                        onClick={() => navigate(`/manager/manage-project/${project.id}`)}
                                        variant="ghost"
                                        className="w-full h-12 rounded-none hover:bg-primary/5 hover:text-primary font-bold uppercase tracking-widest text-[10px]"
                                    >
                                        Manage Project →
                                    </Button>
                                </CardFooter>
                            </Card>
                        ))
                    )}
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
