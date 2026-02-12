import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../../contexts/ProjectContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    ChevronLeft,
    CheckCircle2,
    AlertCircle,
    FileSearch,
    Layers,
    Users,
    Save,
    Send,
    MessageSquare,
    Paperclip,
    FileText,
    Download,
    Trash2,
    Clock,
    UserCircle,
    ArrowRight
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';

export default function ManagerHandoverDetails() {
    const { projectId } = useParams();
    const { user } = useAuth();
    const { projects, updateSectionStatus, addComment, addAttachment, removeAttachment } = useProjects();
    const navigate = useNavigate();

    const project = projects.find(p => p.id === projectId);

    // Automatically select the first assigned section if available
    const initialSectionId = project?.sections.find(s => s.contributorId === user.id)?.id || project?.sections[0]?.id;
    const [selectedSectionId, setSelectedSectionId] = useState(initialSectionId);

    // Editor state
    const section = project?.sections.find(s => s.id === selectedSectionId);
    const [content, setContent] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [commentText, setCommentText] = useState('');

    useEffect(() => {
        if (section) {
            setContent(section.content || '');
            setIsEditing(false);
        }
    }, [selectedSectionId, section]);

    if (!project) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <AlertCircle className="w-12 h-12 text-slate-300" />
            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Project Record Missing</h2>
            <Button onClick={() => navigate('/manager/my-handovers')} className="rounded-xl">Return to Handovers</Button>
        </div>
    );

    const isContributor = section?.contributorId === user.id;
    const isReadOnly = project.status === 'Completed';

    const handleSave = () => {
        if (section) {
            const hasChanged = content !== (section.content || '');
            const newStatus = (hasChanged && (section.status === 'Ready for Review' || section.status === 'Needs Clarification')) ? 'Draft' : section.status;
            updateSectionStatus(projectId, section.id, newStatus, content);
            setIsEditing(false);
        }
    };

    const handleStatusUpdate = (newStatus) => {
        if (section) {
            updateSectionStatus(projectId, section.id, newStatus, content);
        }
    };

    const handleAddComment = () => {
        if (!commentText.trim() || !section) return;
        addComment(projectId, section.id, {
            userId: user.id,
            userName: user.name,
            text: commentText
        });
        setCommentText('');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && section) {
            addAttachment(projectId, section.id, {
                fileName: file.name,
                fileSize: (file.size / 1024).toFixed(1) + ' KB',
                uploadedBy: user.name,
                url: "#" // Mock URL
            });
        }
    };

    return (
        <div className="px-8 md:px-12 py-6 max-w-[1600px] mx-auto space-y-5 animate-in fade-in duration-700 bg-slate-50 min-h-screen font-sans">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/manager/my-handovers')}
                    className="w-fit rounded-xl text-primary hover:text-primary hover:bg-primary/10 font-bold uppercase tracking-widest text-[10px] pl-0 hover:pl-2 transition-all"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Handovers
                </Button>
                <div className="flex items-center gap-4">
                    <p className="text-sm font-bold text-slate-800 tracking-tight uppercase">{project.name}</p>
                    <Badge variant="outline" className={`rounded-xl px-4 py-1.5 font-bold text-xs uppercase tracking-wide border-2 ${project.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        {project.status || 'Active'}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-5 h-[calc(100vh-120px)]">
                {/* Left Sidebar: Sections List & Team */}
                <div className="col-span-12 xl:col-span-3 flex flex-col gap-4 h-full overflow-y-auto pr-2 custom-scrollbar">
                    {/* Sections List */}
                    <Card className="shadow-lg border-none ring-1 ring-slate-100 rounded-xl bg-white overflow-hidden flex flex-col">
                        <CardHeader className="p-4 pb-3 bg-slate-50/50 border-b border-slate-100 sticky top-0 z-10 backdrop-blur-sm">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                <Layers className="w-4 h-4" /> Project Sections
                            </CardTitle>
                        </CardHeader>
                        <div className="p-3 space-y-2 flex-1 overflow-y-auto">
                            {project.sections.map((s) => {
                                const isAssigned = s.contributorId === user.id;
                                const isSelected = selectedSectionId === s.id;

                                return (
                                    <div
                                        key={s.id}
                                        onClick={() => setSelectedSectionId(s.id)}
                                        className={`p-3 rounded-xl cursor-pointer transition-all border-l-4 group relative ${isSelected
                                            ? 'bg-primary/5 border-primary shadow-sm'
                                            : 'bg-white border-transparent hover:bg-slate-50 hover:border-slate-200'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <h4 className={`text-xs font-bold uppercase tracking-tight leading-snug ${isSelected ? 'text-primary' : 'text-slate-700'}`}>
                                                {s.title}
                                            </h4>
                                            {isAssigned && (
                                                <Badge className="bg-orange-50 text-orange-600 border border-orange-100 text-[8px] px-1.5 py-0 font-black uppercase tracking-widest pointer-events-none">
                                                    You
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <StatusIcon status={s.status || 'Draft'} />
                                            <span className={`text-[9px] font-bold uppercase tracking-wider ${isSelected ? 'text-primary/70' : 'text-slate-400'}`}>
                                                {s.status || 'Draft'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Team Members */}
                    <Card className="shadow-lg border-none ring-1 ring-slate-100 rounded-xl bg-white overflow-hidden flex-shrink-0">
                        <CardHeader className="p-4 pb-3 bg-slate-50/50 border-b border-slate-100">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
                                <Users className="w-4 h-4" /> Team
                            </CardTitle>
                        </CardHeader>
                        <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
                            {[...project.members]
                                .sort((a, b) => {
                                    const roles = { 'Initiator': 1, 'Contributor': 2, 'Receiver': 3 };
                                    return (roles[a.ktRole] || 4) - (roles[b.ktRole] || 4);
                                })
                                .map((m, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 border border-slate-200">
                                                {m.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800">{m.name}</p>
                                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{m.functionalRole}</p>
                                            </div>
                                        </div>
                                        <Badge variant="outline" className={`text-[8px] px-1.5 py-0.5 font-black uppercase tracking-wider border ${m.ktRole === 'Initiator' ? 'text-purple-600 bg-purple-50 border-purple-100' :
                                            m.ktRole === 'Receiver' ? 'text-orange-600 bg-orange-50 border-orange-100' :
                                                'text-blue-600 bg-blue-50 border-blue-100'
                                            }`}>
                                            {m.ktRole}
                                        </Badge>
                                    </div>
                                ))}
                        </div>
                    </Card>
                </div>

                {/* Right Content Area: Editor, Attachments, Discussion */}
                <div className="col-span-12 xl:col-span-9 flex flex-col gap-4 h-full overflow-y-auto custom-scrollbar pb-20">
                    {section ? (
                        <>
                            {/* Editor Section */}
                            <Card className="shadow-xl border-none ring-1 ring-slate-100 rounded-xl bg-white overflow-hidden flex-shrink-0">
                                <CardHeader className="p-5 border-b border-slate-50 flex flex-row items-center justify-between bg-white sticky top-0 z-10">
                                    <div className="space-y-1">
                                        <CardTitle className="text-2xl font-black text-slate-800 tracking-tight uppercase">{section.title}</CardTitle>
                                        <div className="flex items-center gap-2">
                                            {(() => {
                                                const assignee = project.members.find(m => m.userId === section.contributorId);
                                                if (!assignee) return (
                                                    <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider text-slate-500 border border-slate-100">
                                                        <UserCircle className="w-3 h-3" />
                                                        Unassigned
                                                    </div>
                                                );

                                                const isInitiator = assignee.ktRole === 'Initiator';
                                                const colorClass = isInitiator
                                                    ? 'bg-purple-50 text-purple-600 border-purple-100'
                                                    : 'bg-blue-50 text-blue-600 border-blue-100';

                                                return (
                                                    <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${colorClass}`}>
                                                        <UserCircle className="w-3 h-3" />
                                                        {assignee.ktRole}: {assignee.name}
                                                    </div>
                                                );
                                            })()}
                                            {isContributor && !isReadOnly && (
                                                <Badge className="bg-green-50 text-green-700 border-green-200 text-[9px]">Your Responsibility</Badge>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {!isReadOnly && isContributor && !isEditing && (
                                            <Button
                                                onClick={() => setIsEditing(true)}
                                                className="bg-slate-900 text-white hover:bg-slate-800 rounded-xl h-10 px-6 font-bold uppercase tracking-wider text-[10px] shadow-lg shadow-slate-200"
                                            >
                                                Edit Content
                                            </Button>
                                        )}
                                        {!isReadOnly && isContributor && isEditing && (
                                            <div className="flex items-center gap-2">
                                                <Button
                                                    variant="ghost"
                                                    onClick={() => { setIsEditing(false); setContent(section.content || ''); }}
                                                    className="rounded-xl h-10 px-4 text-slate-400 font-bold uppercase tracking-wider text-[10px]"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handleSave}
                                                    className="bg-primary text-white hover:bg-primary/90 rounded-xl h-10 px-6 font-bold uppercase tracking-wider text-[10px] shadow-lg shadow-primary/20"
                                                >
                                                    <Save className="w-3 h-3 mr-2" /> Save
                                                </Button>
                                            </div>
                                        )}
                                        {!isReadOnly && isContributor && section.status !== 'Understood' && !isEditing && (
                                            <Button
                                                onClick={() => handleStatusUpdate('Ready for Review')}
                                                disabled={!section.content || section.status === 'Ready for Review' || section.status === 'Needs Clarification'}
                                                className="bg-emerald-600 text-white hover:bg-emerald-700 rounded-xl h-10 px-6 font-bold uppercase tracking-wider text-[10px] shadow-lg shadow-emerald-200"
                                            >
                                                <Send className="w-3 h-3 mr-2" /> Submit
                                            </Button>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="p-5 min-h-[400px]">
                                    {isEditing ? (
                                        <Textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="Write your detailed documentation here..."
                                            className="min-h-[350px] w-full resize-none p-6 text-base leading-relaxed text-slate-700 bg-slate-50 border-slate-200 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-normal"
                                        />
                                    ) : (
                                        <div className="prose prose-slate max-w-none">
                                            {section.content ? (
                                                <p className="whitespace-pre-wrap text-base font-normal leading-relaxed text-slate-600">
                                                    {section.content}
                                                </p>
                                            ) : (
                                                <div className="flex flex-col items-center justify-center h-64 text-slate-300 border-2 border-dashed border-slate-100 rounded-xl bg-slate-50/50">
                                                    <FileText className="w-10 h-10 mb-3 opacity-50" />
                                                    <p className="text-xs font-bold uppercase tracking-widest">No content drafted yet</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-12">
                                {/* Attachments */}
                                <Card className="shadow-lg border-none ring-1 ring-slate-100 rounded-xl bg-white overflow-hidden h-fit">
                                    <CardHeader className="p-4 pb-3 border-b border-slate-50 bg-slate-50/30 flex flex-row justify-between items-center">
                                        <CardTitle className="text-sm font-black text-slate-800 tracking-tight uppercase flex items-center gap-2">
                                            <Paperclip className="w-4 h-4 text-primary" /> Attachments
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-2">
                                        {(section.attachments || []).length === 0 ? (
                                            <p className="text-[10px] font-bold text-slate-400 uppercase text-center py-8 border border-dashed border-slate-100 rounded-xl bg-slate-50/50">No files attached</p>
                                        ) : (
                                            (section.attachments || []).map((att) => (
                                                <div key={att.id} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl group hover:border-slate-300 transition-all">
                                                    <div className="flex items-center gap-3 overflow-hidden">
                                                        <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center border border-slate-200 text-slate-500 shadow-sm">
                                                            <FileText className="w-4 h-4" />
                                                        </div>
                                                        <div className="overflow-hidden">
                                                            <p className="text-[11px] font-black text-slate-700 truncate uppercase tracking-tight">{att.fileName}</p>
                                                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{att.fileSize}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg hover:bg-slate-200">
                                                            <Download className="w-3 h-3 text-slate-500" />
                                                        </Button>
                                                        {!isReadOnly && isContributor && (
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="w-8 h-8 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500"
                                                                onClick={() => {
                                                                    if (window.confirm("Remove this attachment?")) {
                                                                        removeAttachment(projectId, section.id, att.id);
                                                                    }
                                                                }}
                                                            >
                                                                <Trash2 className="w-3 h-3" />
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        )}

                                        {!isReadOnly && isContributor && (
                                            <div className="pt-2">
                                                <Label htmlFor="file-upload" className="cursor-pointer">
                                                    <div className="w-full h-10 border-2 border-dashed border-slate-200 rounded-xl flex items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-colors group">
                                                        <Paperclip className="w-3 h-3 text-slate-400 group-hover:text-primary transition-colors" />
                                                        <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 group-hover:text-primary transition-colors">Add File</span>
                                                    </div>
                                                    <input id="file-upload" type="file" className="hidden" onChange={handleFileUpload} />
                                                </Label>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>

                                {/* Discussion */}
                                <Card className="shadow-lg border-none ring-1 ring-slate-100 rounded-xl bg-white overflow-hidden h-fit">
                                    <CardHeader className="p-4 pb-3 border-b border-slate-50 bg-slate-50/30 flex flex-row justify-between items-center">
                                        <CardTitle className="text-sm font-black text-slate-800 tracking-tight uppercase flex items-center gap-2">
                                            <MessageSquare className="w-4 h-4 text-primary" /> Discussion
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="p-0 flex flex-col">
                                        <div className="p-4 space-y-3 max-h-[300px] overflow-y-auto min-h-[150px]">
                                            {(section.comments || []).length === 0 ? (
                                                <div className="text-center py-10 flex flex-col items-center gap-2 opacity-50">
                                                    <MessageSquare className="w-6 h-6 text-slate-300" />
                                                    <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">No comments</p>
                                                </div>
                                            ) : (
                                                section.comments.map((c, idx) => (
                                                    <div key={idx} className="flex flex-col gap-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[9px] font-black uppercase text-primary tracking-wider">{c.userName}</span>
                                                            <span className="text-[8px] text-slate-400 font-bold uppercase">{new Date(c.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                        </div>
                                                        <p className="text-xs text-slate-600 font-medium leading-relaxed">{c.text}</p>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        {!isReadOnly && (
                                            <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex gap-2">
                                                <Input
                                                    value={commentText}
                                                    onChange={(e) => setCommentText(e.target.value)}
                                                    placeholder="Type a comment..."
                                                    className="h-10 text-xs bg-white border-slate-200 rounded-xl focus-visible:ring-primary"
                                                />
                                                <Button
                                                    onClick={handleAddComment}
                                                    disabled={!commentText.trim()}
                                                    size="icon"
                                                    className="h-10 w-10 rounded-xl bg-slate-900 hover:bg-black text-white shrink-0 shadow-md"
                                                >
                                                    <ArrowRight className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-slate-300 space-y-4">
                            <Layers className="w-16 h-16 opacity-20" />
                            <p className="font-bold uppercase tracking-widest text-sm">Select a section to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

function StatusIcon({ status }) {
    switch (status) {
        case 'Understood': return <CheckCircle2 className="w-3 h-3 text-emerald-500" />;
        case 'Needs Clarification': return <AlertCircle className="w-3 h-3 text-orange-500" />;
        case 'Ready for Review': return <FileSearch className="w-3 h-3 text-primary" />;
        case 'Draft': return <Clock className="w-3 h-3 text-slate-400" />;
        default: return <Clock className="w-3 h-3 text-slate-300" />;
    }
}
