import React from "react";
import { useAuth } from "../../contexts/AuthContext.jsx";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Users, FileText, Activity, LogOut, ShieldCheck, Zap, Globe, Command } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";

export default function AdminDashboard() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const adminActions = [
        {
            title: "Identity Management",
            description: "Control access levels and manage corporate personas.",
            icon: <Users className="w-8 h-8 text-primary" />,
            path: "/admin/users",
            color: "primary",
            tag: "Access Control"
        },
        {
            title: "Blueprint Governance",
            description: "Design the mandatory structure for project handovers.",
            icon: <FileText className="w-8 h-8 text-primary" />,
            path: "/admin/templates",
            color: "primary",
            tag: "Standards"
        },
        {
            title: "Global Overview",
            description: "Institutional audit trail of all knowledge transfer events.",
            icon: <Activity className="w-8 h-8 text-primary" />,
            path: "/admin/projects",
            color: "primary",
            tag: "Governance"
        },
    ];

    return (
        <div className="min-h-screen bg-background">
            {/* Top Navigation Bar */}
            <div className="bg-background/80 backdrop-blur-md sticky top-0 z-50 border-b border-border px-8 py-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <img src="/src/assets/logo.png" alt="Logo" className="h-8" />
                    <span className="font-bold text-foreground tracking-tight uppercase text-lg hidden sm:block">Admin Console</span>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-bold text-foreground">{user?.name}</p>
                            <p className="text-xs text-muted-foreground">Administrator</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={logout} className="rounded-xl hover:bg-destructive/10 hover:text-destructive">
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="p-10 max-w-7xl mx-auto space-y-12">
                {/* Hero Layout */}
                <header className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    <div className="space-y-6">

                        <h1 className="text-5xl font-bold tracking-tight text-foreground">
                            Overview
                        </h1>
                        <p className="text-lg text-muted-foreground font-medium max-w-lg leading-relaxed">
                            Manage users, project templates, and view system-wide audits.
                        </p>
                    </div>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pt-8">
                    {adminActions.map((action) => (
                        <Card
                            key={action.path}
                            className="group hover:-translate-y-1 hover:border-primary/50 transition-all duration-300 cursor-pointer border border-border rounded-xl bg-card"
                            onClick={() => navigate(action.path)}
                        >
                            <CardHeader className="p-8 pb-4">
                                <div className={`mb-6 p-4 bg-secondary rounded-xl w-fit group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300`}>
                                    {React.cloneElement(action.icon, { className: "w-8 h-8 group-hover:text-primary-foreground transition-colors" })}
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-bold uppercase tracking-wider text-primary">{action.tag}</p>
                                    <CardTitle className="text-2xl font-bold text-foreground leading-tight">
                                        {action.title}
                                    </CardTitle>
                                </div>
                                <CardDescription className="text-muted-foreground font-medium pt-2 text-sm leading-relaxed">
                                    {action.description}
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="p-8 pt-0 flex justify-end">
                                <div className="p-2 rounded-full opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300 text-primary">
                                    <ArrowRight className="w-5 h-5" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

function ArrowRight({ className }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14" /><path d="m12 5 7 7-7 7" />
        </svg>
    )
}
