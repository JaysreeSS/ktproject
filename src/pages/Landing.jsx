import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, User, Sparkles, ArrowRight } from "lucide-react";

export default function Landing() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center relative overflow-hidden p-6">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

            <div className="z-10 w-full max-w-4xl space-y-12">
                <div className="text-center space-y-6">
                    <img src="/src/assets/logo.png" alt="Company Logo" className="h-20 mx-auto mb-8 animate-in fade-in zoom-in-50 duration-700" />
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                        Knowledge Transfer Portal
                    </h1>
                    <p className="text-xl text-muted-foreground font-medium max-w-2xl mx-auto">
                        Select your operational role to access the secure workspace.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
                    {/* Admin Card */}
                    <Card
                        className="group relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-primary/10 bg-card"
                        onClick={() => navigate('/admin-login')}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <CardContent className="p-10 flex flex-col items-center text-center space-y-6 relative z-10">
                            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <ShieldCheck className="w-10 h-10 text-primary" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-foreground">Administrator</h2>
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                    System configuration, user management, and global oversight.
                                </p>
                            </div>
                            <div className="pt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                <span className="inline-flex items-center text-primary font-bold text-sm uppercase tracking-wider">
                                    Access Portal <ArrowRight className="ml-2 w-4 h-4" />
                                </span>
                            </div>
                        </CardContent>
                    </Card>

                    {/* User Card */}
                    <Card
                        className="group relative overflow-hidden border-2 border-border hover:border-blue-400/50 transition-all duration-300 cursor-pointer shadow-xl hover:shadow-2xl hover:shadow-blue-400/10 bg-card"
                        onClick={() => navigate('/user-login')}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                        <CardContent className="p-10 flex flex-col items-center text-center space-y-6 relative z-10">
                            <div className="w-20 h-20 rounded-2xl bg-blue-400/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                <User className="w-10 h-10 text-blue-500" />
                            </div>
                            <div className="space-y-2">
                                <h2 className="text-2xl font-bold text-foreground">Associate</h2>
                                <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                                    Project initiation, contribution, and knowledge reception.
                                </p>
                            </div>
                            <div className="pt-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                                <span className="inline-flex items-center text-blue-500 font-bold text-sm uppercase tracking-wider">
                                    Access Portal <ArrowRight className="ml-2 w-4 h-4" />
                                </span>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="text-center pt-8">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Secure Corporate Gateway
                    </p>
                </div>
            </div>
        </div>
    );
}
