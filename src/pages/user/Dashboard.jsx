import React from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useProjects } from '../../contexts/ProjectContext.jsx';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import {
    Search,
    Bell,
    LogOut,
    ChevronRight,
    Inbox,
    Send,
    CheckCircle2,
    LayoutGrid,
    Clock,
    Zap,
    MoreVertical,
    Layers,
    Sparkles
} from 'lucide-react';

export default function UserDashboard() {
    const { user, logout } = useAuth();
    const { projects } = useProjects();
    const navigate = useNavigate();

    // Filter projects where user has a role
    const myProjects = projects.filter(p => p.members.some(m => m.userId === user.id));

    const outgoing = myProjects.filter(p =>
        p.members.some(m => m.userId === user.id && (m.ktRole === 'Initiator' || m.ktRole === 'Contributor'))
    );

    const incoming = myProjects.filter(p =>
        p.members.some(m => m.userId === user.id && m.ktRole === 'Receiver')
    );

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
                        <TopNavItem icon={<LayoutGrid className="w-4 h-4" />} label="Dashboard" active />
                        <TopNavItem icon={<Send className="w-4 h-4" />} label="My Hand-offs" badge={outgoing.length} color="primary" />
                        <TopNavItem icon={<Inbox className="w-4 h-4" />} label="Onboarding" badge={incoming.length} color="orange" />
                        <TopNavItem icon={<Clock className="w-4 h-4" />} label="Activity" />
                    </nav>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-foreground">{user.name}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">{user.role}</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={logout} className="rounded-xl hover:bg-destructive/10 hover:text-destructive">
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <main className="p-8 lg:p-12 space-y-10 max-w-7xl mx-auto">
                {/* Hero / Welcome */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="space-y-4 animate-in fade-in slide-in-from-left-4 duration-700">
                        <div className="flex items-center gap-2 text-primary bg-secondary w-fit px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest">
                            <Sparkles className="w-3 h-3" /> System Online
                        </div>
                        <h1 className="text-4xl font-bold tracking-tight text-foreground leading-tight">
                            Welcome back, {user.name.split(' ')[0]}
                        </h1>
                        <p className="text-muted-foreground font-medium text-lg leading-relaxed max-w-lg">
                            Review your active knowledge transfer tasks and status below.
                        </p>
                    </div>
                    <div className="flex flex-col items-end gap-6">
                        <div className="flex items-center gap-4">
                            <div className="bg-card p-2 rounded-xl shadow-sm border border-border flex items-center px-4 h-12 w-80 group focus-within:ring-1 focus-within:ring-primary transition-all">
                                <Search className="w-5 h-5 text-muted-foreground mr-3 group-hover:text-primary transition-colors" />
                                <input type="text" placeholder="Search projects..." className="bg-transparent border-none outline-none text-sm w-full font-medium placeholder:text-muted-foreground" />
                            </div>
                            <Button variant="secondary" size="icon" className="rounded-xl bg-card w-12 h-12 shadow-sm border border-border group relative">
                                <Bell className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                                <span className="absolute top-3 right-3 w-2 h-2 bg-destructive rounded-full border border-card" />
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Stats Performance Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <QuickStat title="Active Hand-offs" count={outgoing.length} color="primary" description="Projects you are leading" />
                    <QuickStat title="Pending Onboarding" count={incoming.filter(p => p.status !== 'Completed').length} color="orange" description="Requires your review" />
                    <QuickStat title="Archived Projects" count={myProjects.filter(p => p.status === 'Completed').length} color="emerald" description="Completed transfers" />
                </div>

                {/* Vertical Split Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Outgoing List */}
                    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-bold text-foreground leading-tight flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary">
                                    <Send className="w-4 h-4" />
                                </div>
                                Outgoing Hand-offs
                            </h2>
                            <Button variant="ghost" className="text-xs font-bold uppercase text-primary hover:bg-secondary">View All</Button>
                        </div>
                        <div className="space-y-4">
                            {outgoing.length === 0 ? (
                                <EmptyPlaceholder icon={<Send />} text="No active handovers." />
                            ) : (
                                outgoing.map(p => <SmallProjectCard key={p.id} project={p} onClick={() => navigate(`/project/${p.id}`)} />)
                            )}
                        </div>
                    </section>

                    {/* Incoming List */}
                    <section className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-1000" style={{ animationDelay: '200ms' }}>
                        <div className="flex items-center justify-between px-2">
                            <h2 className="text-xl font-bold text-foreground leading-tight flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-orange-100 flex items-center justify-center text-orange-600">
                                    <Inbox className="w-4 h-4" />
                                </div>
                                Incoming Onboarding
                            </h2>
                            <Button variant="ghost" className="text-xs font-bold uppercase text-orange-600 hover:bg-orange-50">View All</Button>
                        </div>
                        <div className="space-y-4">
                            {incoming.length === 0 ? (
                                <EmptyPlaceholder icon={<Inbox />} text="No incoming sessions." />
                            ) : (
                                incoming.map(p => <SmallProjectCard key={p.id} project={p} onClick={() => navigate(`/project/${p.id}`)} />)
                            )}
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

function TopNavItem({ icon, label, active = false, badge = 0 }) {
    return (
        <a href="#" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${active ? 'bg-secondary text-primary' : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'}`}>
            {icon}
            <span>{label}</span>
            {badge > 0 && (
                <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[9px] ${active ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'}`}>
                    {badge}
                </span>
            )}
        </a>
    )
}

function QuickStat({ title, count, color, description }) {
    const colors = {
        primary: "text-primary bg-secondary",
        orange: "text-orange-600 bg-orange-50",
        emerald: "text-emerald-600 bg-emerald-50"
    };
    return (
        <div className="bg-card p-8 rounded-xl shadow-sm border border-border hover:shadow-lg transition-all duration-300 group relative overflow-hidden">
            <div className="flex justify-between items-start relative z-10">
                <div className="space-y-3">
                    <p className="text-muted-foreground font-bold uppercase text-[10px] tracking-wider">{title}</p>
                    <p className="text-5xl font-bold text-foreground tracking-tight">{count}</p>
                    <p className="text-[10px] font-medium text-muted-foreground max-w-[120px] leading-tight">{description}</p>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colors[color]} shadow-sm group-hover:scale-110 transition-transform`}>
                    <Zap className="w-6 h-6" />
                </div>
            </div>
        </div>
    )
}

function SmallProjectCard({ project, onClick }) {
    return (
        <div
            onClick={onClick}
            className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer group flex items-center justify-between"
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                    <Layers className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                    <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors uppercase tracking-tight leading-none">{project.name}</h4>
                    <div className="flex items-center gap-3 pt-1">
                        <div className="flex items-center gap-1.5">
                            <div className="w-4 h-4 rounded-full bg-muted flex items-center justify-center text-[8px] font-bold">{project.managerName?.charAt(0)}</div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{project.managerName}</span>
                        </div>
                        <div className="w-1 h-1 rounded-full bg-border" />
                        <span className="text-[9px] font-bold uppercase tracking-wider text-primary bg-secondary px-2 py-0.5 rounded">{project.status}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="text-right flex flex-col items-end space-y-1">
                    <span className="text-[10px] font-bold text-foreground tracking-tight">{project.completion}% Completed</span>
                    <div className="w-20 h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${project.completion}%` }} />
                    </div>
                </div>
                <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:bg-foreground group-hover:text-background transition-all">
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </div>
            </div>
        </div>
    )
}

function EmptyPlaceholder({ icon, text }) {
    return (
        <div className="py-16 flex flex-col items-center justify-center bg-muted/20 rounded-xl border-2 border-dashed border-border space-y-4">
            <div className="w-12 h-12 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground">
                {icon}
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{text}</p>
        </div>
    )
}
