import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useProjects } from '../contexts/ProjectContext.jsx';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
    ChevronLeft,
    Save,
    Send,
    CheckCircle2,
    HelpCircle,
    AlertTriangle,
    MessageSquare,
    History,
    FileText,
    User,
    BadgeAlert,
    Cpu,
    ArrowRight,
    Sparkles
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function SectionEditor() {
    const { projectId, sectionId } = useParams();
    const { user } = useAuth();
    const { projects, updateSectionStatus, addComment } = useProjects();
    const navigate = useNavigate();

    const project = projects.find(p => p.id === projectId);
    const section = project?.sections.find(s => s.id === sectionId);

    const [content, setContent] = useState(section?.content || '');
    const [isEditing, setIsEditing] = useState(false);
    const [commentText, setCommentText] = useState('');

    if (!project || !section) return <div className="p-20 text-center font-black uppercase tracking-widest text-slate-300">Section Protocol Missing</div>;

    const isContributor = section.contributorId === user.id;
    const isReceiver = project.members.find(m => m.userId === user.id)?.ktRole === 'Receiver';
    const isReadOnly = project.status === 'Completed';

    const handleSave = () => {
        updateSectionStatus(projectId, sectionId, section.status, content);
        setIsEditing(false);
    };

    const handleStatusUpdate = (newStatus) => {
        updateSectionStatus(projectId, sectionId, newStatus, content);
    };

    const handleAddComment = () => {
        if (!commentText.trim()) return;
        addComment(projectId, sectionId, {
            userId: user.id,
            userName: user.name,
            text: commentText
        });
        setCommentText('');
    };

    return (
        <div className="p-10 max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Context Navigation */}
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate(`/project/${projectId}`)} className="rounded-xl hover:bg-card text-muted-foreground font-bold uppercase tracking-widest text-[10px]">
                    <ChevronLeft className="w-4 h-4 mr-2" /> Back to Project
                </Button>
                <div className="flex gap-4 items-center">
                    <div className="hidden md:flex flex-col items-end">
                        <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider leading-none">Project Context</p>
                        <p className="text-sm font-bold text-foreground tracking-tight uppercase">{project.name}</p>
                    </div>
                    <div className={`px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm border ${section.status === 'Understood' ? 'text-emerald-600 border-emerald-100 bg-emerald-50' :
                        section.status === 'Needs Clarification' ? 'text-orange-600 border-orange-100 bg-orange-50' :
                            'text-primary border-primary/20 bg-primary/10'
                        }`}>
                        {section.status}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-12">
                {/* Editor Content Core */}
                <div className="xl:col-span-3 space-y-8">
                    <Card className="shadow-lg border border-border rounded-xl bg-card overflow-hidden">
                        <CardHeader className="bg-muted/30 border-b border-border p-8 flex flex-row items-center justify-between">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-foreground rounded-lg flex items-center justify-center text-background">
                                        <Cpu className="w-6 h-6" />
                                    </div>
                                    <CardTitle className="text-3xl font-bold text-foreground tracking-tight uppercase">{section.title}</CardTitle>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[8px] font-bold text-primary-foreground">
                                            {project.members.find(m => m.userId === section.contributorId)?.name.charAt(0)}
                                        </div>
                                        <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Contributor: {project.members.find(m => m.userId === section.contributorId)?.name}</span>
                                    </div>
                                    <div className="w-1.5 h-1.5 rounded-full bg-border" />
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                        <History className="w-3 h-3" /> Auto-saved
                                    </span>
                                </div>
                            </div>
                            {!isReadOnly && isContributor && !isEditing && (
                                <Button
                                    onClick={() => setIsEditing(true)}
                                    className="rounded-lg bg-foreground hover:bg-foreground/90 text-background px-6 h-12 font-bold uppercase tracking-wider text-xs shadow-md transition-all"
                                >
                                    Edit Content
                                </Button>
                            )}
                        </CardHeader>
                        <CardContent className="p-10 min-h-[500px]">
                            {isEditing ? (
                                <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
                                    <Textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Enter detailed documentation here..."
                                        className="min-h-[450px] text-lg leading-relaxed font-normal text-foreground bg-muted/30 border border-input rounded-xl p-8 focus-visible:ring-1 focus-visible:ring-primary focus-visible:bg-card transition-all resize-none"
                                    />
                                    <div className="flex justify-end items-center gap-4 pt-4 border-t border-border">
                                        <Button variant="ghost" onClick={() => { setIsEditing(false); setContent(section.content); }} className="text-muted-foreground font-bold uppercase tracking-wider text-[10px]">Cancel</Button>
                                        <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 h-12 rounded-lg font-bold uppercase tracking-wider text-xs shadow-lg transition-all">
                                            <Save className="w-4 h-4 mr-2" /> Save Changes
                                        </Button>
                                    </div>
                                </div>
                            ) : (
                                <div className="animate-in fade-in duration-500">
                                    {section.content ? (
                                        <div className="prose prose-slate max-w-none">
                                            <p className="whitespace-pre-wrap text-lg font-normal leading-relaxed text-foreground">
                                                {section.content}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center py-32 text-muted space-y-6">
                                            <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center border-2 border-dashed border-border">
                                                <FileText className="w-8 h-8 opacity-50 text-muted-foreground" />
                                            </div>
                                            <p className="font-bold uppercase tracking-widest text-xs text-muted-foreground">No Content Added</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>

                        {!isReadOnly && (
                            <CardFooter className="bg-muted/30 border-t border-border p-8 flex flex-wrap gap-6 justify-between items-center">
                                <div className="flex gap-4">
                                    {isContributor && section.status !== 'Understood' && (
                                        <Button
                                            onClick={() => handleStatusUpdate('Ready for Review')}
                                            disabled={isEditing || !content}
                                            className="bg-foreground hover:bg-foreground/90 text-background px-8 h-14 rounded-lg font-bold uppercase tracking-wider text-xs shadow-md transition-all"
                                        >
                                            <Send className="w-4 h-4 mr-2" /> Submit for Review
                                        </Button>
                                    )}
                                    {isReceiver && section.status === 'Ready for Review' && (
                                        <>
                                            <Button
                                                onClick={() => handleStatusUpdate('Understood')}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 h-14 rounded-lg font-bold uppercase tracking-wider text-xs shadow-md transition-all"
                                            >
                                                <CheckCircle2 className="w-4 h-4 mr-2" /> Mark as Understood
                                            </Button>
                                            <Button
                                                variant="outline"
                                                onClick={() => handleStatusUpdate('Needs Clarification')}
                                                className="border-orange-500/50 text-orange-600 hover:bg-orange-50 px-8 h-14 rounded-lg font-bold uppercase tracking-wider text-xs transition-all"
                                            >
                                                <HelpCircle className="w-4 h-4 mr-2" /> Request Clarification
                                            </Button>
                                        </>
                                    )}
                                </div>
                                {isReceiver && (
                                    <Button
                                        variant="ghost"
                                        onClick={() => handleStatusUpdate('Not Covered')}
                                        className="text-red-400 hover:bg-red-50 hover:text-red-600 font-bold uppercase tracking-wider text-[10px]"
                                    >
                                        Mark Not Applicable
                                    </Button>
                                )}
                            </CardFooter>
                        )}
                    </Card>
                </div>

                {/* Discussion Sidebar */}
                <div className="space-y-8">
                    <Card className="shadow-lg border border-border rounded-xl bg-card overflow-hidden">
                        <CardHeader className="p-6 pb-4 border-b border-border bg-muted/10">
                            <div className="flex items-center justify-between">
                                <CardTitle className="text-lg font-bold text-foreground tracking-tight uppercase">Discussion</CardTitle>
                                <MessageSquare className="w-4 h-4 text-primary" />
                            </div>
                            <CardDescription className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Comments & Feedback</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 max-h-[600px] overflow-y-auto px-6 py-4 scrollbar-thin">
                            {section.comments.length === 0 ? (
                                <div className="text-center py-20 flex flex-col items-center gap-4">
                                    <MessageSquare className="w-8 h-8 text-muted-foreground/30" />
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">No comments yet</p>
                                </div>
                            ) : (
                                section.comments.map((c, idx) => (
                                    <div key={idx} className="space-y-2 group animate-in slide-in-from-right-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                        <div className="flex justify-between items-center px-1">
                                            <span className="text-[10px] font-bold uppercase text-primary tracking-wide">{c.userName}</span>
                                            <span className="text-[9px] text-muted-foreground font-bold uppercase">{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        <div className="p-4 bg-muted/40 rounded-lg border border-border group-hover:bg-muted/60 transition-all duration-300">
                                            <p className="text-sm text-foreground font-medium leading-relaxed">{c.text}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </CardContent>
                        {!isReadOnly && (
                            <CardFooter className="p-6 border-t border-border flex flex-col gap-4 bg-muted/10">
                                <div className="space-y-2 w-full">
                                    <Label className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider ml-1">Add Comment</Label>
                                    <Textarea
                                        placeholder="Type your comment..."
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        className="text-sm min-h-[100px] rounded-lg bg-background border-input focus-visible:ring-1 focus-visible:ring-primary shadow-sm resize-none"
                                    />
                                </div>
                                <Button
                                    onClick={handleAddComment}
                                    disabled={!commentText.trim()}
                                    className="w-full bg-foreground hover:bg-black text-background rounded-lg h-12 font-bold uppercase tracking-wider text-[10px] shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
                                >
                                    Post Comment <ArrowRight className="w-3 h-3 ml-2" />
                                </Button>
                            </CardFooter>
                        )}
                    </Card>

                    <Card className="border-none shadow-lg rounded-xl bg-foreground text-primary-foreground">
                        <CardHeader className="p-6 pb-2">
                            <CardTitle className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground/70 flex items-center gap-3">
                                <History className="w-4 h-4" /> Activity History
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-6 space-y-4">
                            <div className="flex gap-4 items-start relative">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary mt-1.5 relative z-10" />
                                <div className="absolute left-[4.5px] top-4 w-[1px] h-full bg-primary-foreground/10" />
                                <div className="space-y-0.5">
                                    <p className="text-xs font-bold text-primary-foreground uppercase tracking-wide">Created</p>
                                    <p className="text-[10px] text-primary-foreground/50 font-medium uppercase">{new Date(project.createdAt).toLocaleString()}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
