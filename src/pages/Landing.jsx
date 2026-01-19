import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck, User, ArrowRight, Sparkles } from "lucide-react";

export default function Landing() {
    const navigate = useNavigate();
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="min-h-screen w-full bg-[#fcfaff] flex flex-col items-center justify-center relative overflow-hidden font-sans py-20">
            {/* Dynamic Background Elements */}
            <div
                className="absolute w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none transition-transform duration-1000 ease-out"
                style={{
                    transform: `translate(${mousePos.x / 15}px, ${mousePos.y / 15}px)`,
                    top: '10%',
                    left: '10%'
                }}
            />
            <div
                className="absolute w-[500px] h-[500px] bg-purple-400/5 rounded-full blur-[100px] pointer-events-none transition-transform duration-700 ease-out"
                style={{
                    transform: `translate(${-(mousePos.x / 20)}px, ${-(mousePos.y / 20)}px)`,
                    bottom: '5%',
                    right: '10%'
                }}
            />

            {/* Mouse Sparkle Effect Container */}
            <div
                className="absolute pointer-events-none z-50 transition-opacity duration-300"
                style={{
                    left: mousePos.x,
                    top: mousePos.y,
                    transform: 'translate(-50%, -50%)'
                }}
            >
                <div className="relative">
                    <Sparkles className="w-6 h-6 text-primary/30 animate-pulse absolute -top-4 -left-4" />
                    <Sparkles className="w-4 h-4 text-primary/20 animate-bounce absolute -bottom-2 -right-6" style={{ animationDelay: '0.5s' }} />
                </div>
            </div>

            <div className="z-10 w-full max-w-5xl px-6 flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-1000">
                <header className="text-center mb-16 space-y-2">
                    <div className="relative inline-block mb-8">
                        <img
                            src="/src/assets/logo.png"
                            alt="Company Logo"
                            className="h-20 w-auto relative z-10 drop-shadow-sm"
                        />
                        <div className="absolute -inset-4 bg-primary/5 rounded-full blur-xl -z-0 animate-pulse" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
                        Knowledge Transfer <span className="text-primary">Portal</span>
                    </h1>
                    <p className="text-slate-500 font-medium max-w-lg mx-auto leading-relaxed">
                        A centralized gateway for corporate knowledge governance,
                        project handovers, and identity-based access.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
                    {/* Admin Access Card */}
                    <Card
                        className="group relative h-64 overflow-hidden border-none bg-white/40 backdrop-blur-md ring-1 ring-slate-200 hover:ring-primary/30 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-primary/5 rounded-[2.5rem]"
                        onClick={() => navigate('/admin-login')}
                    >
                        <CardContent className="h-full p-10 flex flex-col items-center justify-center text-center space-y-6 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 transform group-hover:-translate-y-2">
                                <ShieldCheck className="w-8 h-8 text-primary group-hover:text-white" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl font-black text-slate-800 tracking-tight transition-colors group-hover:text-primary">Administrator</h2>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                    Governance & Operations
                                </p>
                            </div>

                            <div className="absolute bottom-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Enter Dashboard</span>
                                <ArrowRight className="w-3 h-3 text-primary animate-in slide-in-from-left-2" />
                            </div>
                        </CardContent>
                    </Card>

                    {/* User Access Card */}
                    <Card
                        className="group relative h-64 overflow-hidden border-none bg-white/40 backdrop-blur-md ring-1 ring-slate-200 hover:ring-primary/30 transition-all duration-500 cursor-pointer shadow-sm hover:shadow-2xl hover:shadow-primary/5 rounded-[2.5rem]"
                        onClick={() => navigate('/user-login')}
                    >
                        <CardContent className="h-full p-10 flex flex-col items-center justify-center text-center space-y-6 relative z-10">
                            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 transform group-hover:-translate-y-2">
                                <User className="w-8 h-8 text-primary group-hover:text-white" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="text-xl font-black text-slate-800 tracking-tight transition-colors group-hover:text-primary">Associate</h2>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                    Project & Collaboration
                                </p>
                            </div>

                            <div className="absolute bottom-6 flex items-center gap-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Access Gateway</span>
                                <ArrowRight className="w-3 h-3 text-primary animate-in slide-in-from-left-2" />
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
