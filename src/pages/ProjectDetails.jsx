import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '../contexts/ProjectContext.jsx';
import { useAuth } from '../contexts/AuthContext.jsx';
import { useAdmin } from '../contexts/AdminContext.jsx';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
    ChevronLeft,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    MessageSquare,
    Lock,
    Activity,
    ArrowUpRight,
    Layers,
    History,
    Zap,
    Trash2,
    Users,
    FileText,
    Paperclip,
    Plus,
    UserPlus,
    Pencil,
    X,
    FileDown
} from 'lucide-react';
import { exportProjectToPDF } from '../lib/pdfExport';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';

export default function ProjectDetails() {
    const { projectId } = useParams();
    const { user } = useAuth();
    const {
        projects,
        updateProjectStatus,
        updateMember,
        addMember,
        removeMember,
        addSection,
        removeSection,
        updateSectionStatus,
        updateSection
    } = useProjects();
    const { users: allUsers, templates } = useAdmin();
    const navigate = useNavigate();

    const [isManagingTeam, setIsManagingTeam] = useState(false);
    const [isAddingSection, setIsAddingSection] = useState(false);
    const [templateAssignees, setTemplateAssignees] = useState({});
    const [editingSectionId, setEditingSectionId] = useState(null);

    const [newMemberId, setNewMemberId] = useState("");
    const [newMemberKtRole, setNewMemberKtRole] = useState("Contributor");
    const [newMemberFunctionalRole, setNewMemberFunctionalRole] = useState("");

    const project = projects.find(p => p.id === projectId);

    if (!project) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
            <AlertCircle className="w-12 h-12 text-slate-300" />
            <h2 className="text-lg font-black text-slate-900 uppercase tracking-tight">Project Not Found</h2>
            <Button onClick={() => navigate('/dashboard')} className="rounded-xl text-sm">Go Home</Button>
        </div>
    );

    const isManager = project.managerId === user.id;
    const isAdmin = user.isAdmin;

    // Use persisted progress from database/context
    const overallProgress = project.completion || 0;
    const totalSections = project.sections?.length || 0;
    const understoodSections = project.sections?.filter(s => s.status === 'Understood').length || 0;

    const handleCloseProject = () => {
        if (window.confirm("Perform final institutional sign-off? This will archive the project as read-only.")) {
            updateProjectStatus(projectId, 'Completed');
        }
    };

    const getSectionProgress = (section) => {
        const hasText = !!section.content;
        const hasAttachments = (section.attachments || []).length > 0;
        const isReady = section.status === 'Ready for Review' || section.status === 'Understood';

        // If Needs Clarification, isReady becomes false, reducing progress
        return (hasText ? 33 : 0) + (hasAttachments ? 33 : 0) + (isReady ? 34 : 0);
    };

    const getReviewStatusBadge = (status) => {
        switch (status) {
            case 'Understood':
                return <Badge className="bg-emerald-50 text-emerald-600 border-emerald-100 hover:bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-none border-2">Understood</Badge>;
            case 'Needs Clarification':
                return <Badge className="bg-orange-50 text-orange-600 border-orange-100 hover:bg-orange-50 px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-none border-2">Needs Clarification</Badge>;
            default:
                return <Badge className="bg-slate-50 text-slate-400 border-slate-200 hover:bg-slate-50 px-3 py-1 text-xs font-bold uppercase tracking-widest shadow-none border-2">Not Reviewed Yet</Badge>;
        }
    };

    return (
        <div className="px-8 md:px-12 py-6 max-w-7xl mx-auto space-y-5 animate-in fade-in duration-700">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <Button
                        variant="ghost"
                        onClick={() => navigate(isAdmin ? '/admin/projects' : '/manager/projects')}
                        className="w-fit rounded-xl text-primary hover:text-primary hover:bg-primary/10 font-bold uppercase tracking-widest text-[10px] pl-0 hover:pl-2 transition-all"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Projects
                    </Button>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Project Details</h1>
                </div>

                <div className="flex items-center gap-3">
                    {isManager && project.status !== 'Completed' && (
                        <Button
                            onClick={handleCloseProject}
                            disabled={overallProgress < 100}
                            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest text-xs h-10 px-6 shadow-lg shadow-emerald-200/50"
                        >
                            Finish Project
                        </Button>
                    )}
                    {isAdmin && project.status === 'Completed' && (
                        <Button
                            onClick={() => exportProjectToPDF(project)}
                            className="rounded-xl bg-slate-900 hover:bg-black text-white font-bold uppercase tracking-widest text-xs h-10 px-6 shadow-lg shadow-slate-200"
                        >
                            <FileDown className="w-4 h-4 mr-2" /> Export Report
                        </Button>
                    )}
                    <Badge variant="outline" className={`rounded-xl px-4 py-1.5 font-bold text-xs uppercase tracking-wide border-2 ${project.status === 'Completed' ? 'bg-slate-50 text-slate-500 border-slate-200' :
                        project.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                            'bg-emerald-50 text-emerald-600 border-emerald-100'}`}>
                        {project.status === 'Completed' ? 'Signed Off' : (project.status || 'Active')}
                    </Badge>
                </div>
            </div>
            {/* Top Project Summary Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
                <Card className="xl:col-span-2 shadow-xl border-none ring-1 ring-slate-100 rounded-[2rem] overflow-hidden bg-white h-full flex flex-col">
                    <CardHeader className="p-5 pb-2">
                        <div className="flex items-start justify-between">
                            <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-sm border border-primary/10">
                                        <Layers className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <CardTitle className="text-lg sm:text-xl font-black text-slate-800 tracking-tight leading-tight uppercase">{project.name}</CardTitle>
                                    </div>
                                </div>
                                {project.description && (
                                    <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-2xl">{project.description}</p>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="p-5 flex-1">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-5 border-y border-slate-100">
                            <MetaDataItem label="Manager" value={project.managerName} />
                            <MetaDataItem label="Created" value={new Date(project.createdAt).toLocaleDateString()} />
                            <MetaDataItem label="People" value={`${project.members.length} Members`} />
                            <MetaDataItem label="Tasks" value={`${project.sections.length} Sections`} />
                        </div>

                        <div className="mt-6 space-y-3">
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">Team Members</h3>
                                {isManager && project.status !== 'Completed' && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-7 rounded-lg text-primary hover:bg-primary/5 text-xs font-black uppercase tracking-widest"
                                        onClick={() => setIsManagingTeam(!isManagingTeam)}
                                    >
                                        <UserPlus className="w-3.5 h-3.5 mr-1.5" /> {isManagingTeam ? 'Done' : 'Edit Team'}
                                    </Button>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-3">
                                {[...project.members]
                                    .sort((a, b) => {
                                        const roles = { 'Initiator': 1, 'Contributor': 2, 'Receiver': 3 };
                                        return (roles[a.ktRole] || 4) - (roles[b.ktRole] || 4);
                                    })
                                    .map((m, idx) => (
                                        <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100 group transition-all hover:bg-white hover:shadow-md">
                                            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600 border border-slate-200">
                                                {m.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-slate-800 leading-none">{m.name}</p>
                                                <p className={`text-[9px] font-bold uppercase tracking-wider mt-1 ${m.ktRole === 'Initiator' ? 'text-purple-600' :
                                                    m.ktRole === 'Receiver' ? 'text-orange-600' : 'text-blue-600'
                                                    }`}>{m.functionalRole || 'Member'} • {m.ktRole}</p>
                                            </div>
                                            {isManagingTeam && isManager && (
                                                <button
                                                    onClick={() => {
                                                        if (window.confirm(`Remove ${m.name} from this project?`)) {
                                                            removeMember(project.id, m.id);
                                                        }
                                                    }}
                                                    className="ml-2 p-1 text-slate-300 hover:text-red-500 transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                            </div>

                            {isManagingTeam && isManager && (
                                <div className="mt-6 p-6 bg-slate-50/50 border border-dashed border-slate-200 rounded-[2rem] space-y-4">
                                    <p className="text-xs font-bold uppercase tracking-wider text-slate-500 text-center">Assign New Member</p>
                                    <div className="flex flex-col gap-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <select
                                                className="h-10 bg-white border border-slate-200 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                                value={newMemberId}
                                                onChange={(e) => {
                                                    const uid = e.target.value;
                                                    setNewMemberId(uid);
                                                    const user = allUsers.find(u => u.id === uid);
                                                    if (user) {
                                                        setNewMemberFunctionalRole(user.role || "");
                                                    } else {
                                                        setNewMemberFunctionalRole("");
                                                    }
                                                }}
                                            >
                                                <option value="">Select User...</option>
                                                {allUsers
                                                    .filter(u => !u.isAdmin && u.role !== 'admin')
                                                    .filter(u => !project.members.find(m => m.userId === u.id))
                                                    .map(u => (
                                                        <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                                    ))}
                                            </select>

                                            <select
                                                className="h-10 bg-white border border-slate-200 rounded-xl px-4 text-sm font-bold outline-none focus:ring-2 focus:ring-primary/20"
                                                value={newMemberKtRole}
                                                onChange={(e) => setNewMemberKtRole(e.target.value)}
                                            >
                                                {['Contributor', 'Initiator', 'Receiver']
                                                    .filter(role => !(newMemberFunctionalRole?.toLowerCase() === 'manager' && role === 'Receiver'))
                                                    .map(role => (
                                                        <option key={role} value={role}>{role}</option>
                                                    ))
                                                }
                                            </select>


                                        </div>
                                        <Button
                                            disabled={!newMemberId}
                                            onClick={() => {
                                                const selectedUser = allUsers.find(u => u.id === newMemberId);
                                                if (selectedUser) {
                                                    // Enforce max 2 initiators
                                                    if (newMemberKtRole === 'Initiator') {
                                                        const currentInitiators = project.members.filter(m => m.ktRole === 'Initiator').length;
                                                        if (currentInitiators >= 2) {
                                                            alert("You can select only up to 2 Initiators.");
                                                            return;
                                                        }
                                                    }

                                                    addMember(project.id, {
                                                        userId: selectedUser.id,
                                                        name: selectedUser.name,
                                                        ktRole: newMemberKtRole,
                                                        functionalRole: selectedUser.role // Use default role from user profile
                                                    });
                                                    setNewMemberId("");
                                                    setNewMemberFunctionalRole("");
                                                    setNewMemberKtRole("Contributor");
                                                }
                                            }}
                                            className="w-full md:w-auto self-end rounded-xl bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px] h-10 px-8 disabled:opacity-50 shadow-lg shadow-slate-200"
                                        >
                                            Add Member
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Prominent Progress Section */}
                <Card className="shadow-xl border-none ring-1 ring-slate-100 rounded-[2rem] bg-primary/10 overflow-hidden relative h-full flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-5 opacity-10">
                        <Zap className="w-32 h-32 text-primary" />
                    </div>
                    <CardHeader className="p-5 pb-0">
                        <div className="flex items-center justify-between relative z-10">
                            <CardTitle className="text-xs font-bold uppercase tracking-wider text-slate-500">Overall Progress</CardTitle>
                            <ShieldCheck className="w-6 h-6 text-primary" />
                        </div>
                    </CardHeader>
                    <CardContent className="p-5 flex flex-col items-center justify-center space-y-6 relative z-10 flex-1">
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="80" cy="80" r="70" stroke="currentColor" className="text-white" strokeWidth="12" fill="transparent" />
                                <circle
                                    cx="80" cy="80" r="70"
                                    stroke="currentColor" strokeWidth="12"
                                    fill="transparent"
                                    strokeDasharray={439}
                                    strokeDashoffset={439 - (439 * overallProgress) / 100}
                                    className="text-primary transition-all duration-1000 ease-out"
                                    strokeLinecap="round"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <div className="flex items-start">
                                    <span className="text-3xl font-black tracking-tighter text-slate-900">{overallProgress}</span>
                                    <span className="text-sm font-bold text-slate-500 mt-1 ml-0.5">%</span>
                                </div>
                                <span className="text-xs font-black uppercase tracking-widest text-slate-500 mt-1">Ready</span>
                            </div>
                        </div>

                        <div className="w-full space-y-3">
                            <div className="flex justify-between items-end">
                                <div className="space-y-0.5">
                                    <p className="text-xs font-black uppercase tracking-widest text-slate-500">Checked Sections</p>
                                    <p className="text-base font-bold text-slate-900">{understoodSections} of {totalSections} done</p>
                                </div>
                                <Activity className="w-4 h-4 text-primary animate-pulse" />
                            </div>
                            <div className="h-2 bg-white rounded-full overflow-hidden">
                                <div className="h-full bg-primary transition-all duration-1000" style={{ width: `${overallProgress}%` }} />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Main Project Sections Table */}
            <Card className="shadow-xl border-none ring-1 ring-slate-100 rounded-[2rem] overflow-hidden bg-white">
                <CardHeader className="p-5 pb-4 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div>
                        <CardTitle className="text-xl font-black text-slate-800 tracking-tight flex items-center gap-3">
                            <Activity className="w-6 h-6 text-primary" />
                            Project Sections
                        </CardTitle>
                    </div>
                    {isManager && project.status !== 'Completed' && (
                        <Button
                            onClick={() => setIsAddingSection(!isAddingSection)}
                            className="w-full sm:w-auto rounded-xl bg-slate-900 border-none h-10 px-6 font-bold uppercase tracking-wide text-sm shadow-lg shadow-slate-200"
                        >
                            {isAddingSection ? <X className="w-4 h-4 mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            {isAddingSection ? 'Cancel' : 'Add New Section'}
                        </Button>
                    )}
                </CardHeader>
                <CardContent className="p-0">
                    {isAddingSection && isManager && (
                        <div className="p-10 bg-slate-50 border-y border-slate-100 animate-in slide-in-from-top-4 duration-500">
                            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Select a Template to Insert</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {templates.filter(t => !project.sections.find(s => s.title === t.title)).map(t => (
                                    <div
                                        key={t.id}
                                        className="p-6 bg-white rounded-[2rem] border-2 border-slate-100 hover:border-primary hover:shadow-xl transition-all group flex flex-col justify-between"
                                    >
                                        <div>
                                            <div className="flex items-center gap-4 mb-4">
                                                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-colors">
                                                    <FileText className="w-5 h-5" />
                                                </div>
                                                <h4 className="font-black text-slate-800 uppercase text-sm tracking-tight">{t.title}</h4>
                                            </div>
                                        </div>

                                        <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                                            <div className="space-y-1">
                                                <label className="text-xs font-bold uppercase text-slate-400">Assign To:</label>
                                                <select
                                                    className="w-full h-9 text-sm font-bold border-2 border-slate-100 rounded-xl px-2 outline-none focus:border-primary/50 bg-slate-50"
                                                    value={templateAssignees[t.id] || ""}
                                                    onChange={(e) => setTemplateAssignees(prev => ({ ...prev, [t.id]: e.target.value }))}
                                                >
                                                    <option value="">Select Member...</option>
                                                    {project.members.filter(m => m.ktRole !== 'Receiver').map(m => (
                                                        <option key={m.userId} value={m.userId}>{m.name} ({m.functionalRole})</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <Button
                                                onClick={() => {
                                                    if (!templateAssignees[t.id]) {
                                                        alert("Please select a member to assign this section to.");
                                                        return;
                                                    }
                                                    addSection(project.id, {
                                                        id: t.id,
                                                        title: t.title,
                                                        description: t.description,
                                                        contributorId: templateAssignees[t.id]
                                                    });
                                                    setIsAddingSection(false);
                                                    setTemplateAssignees({});
                                                }}
                                                className="w-full rounded-xl bg-slate-900 hover:bg-primary text-white font-bold uppercase tracking-widest text-sm h-9"
                                                disabled={!templateAssignees[t.id]}
                                            >
                                                Add Section
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {templates.filter(t => !project.sections.find(s => s.title === t.title)).length === 0 && (
                                    <div className="col-span-full py-10 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">
                                        All templates are already in this protocol
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px] md:min-w-0">
                            <thead>
                                <tr className="bg-slate-50/50 border-b border-slate-100">
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Section Details</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Person Assigned</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Progress</th>
                                    <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Receiver Status</th>
                                    {isManager && <th className="p-4 w-16"></th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {project.sections.map((section, idx) => {
                                    const progress = getSectionProgress(section);
                                    const contributor = project.members.find(m => m.userId === section.contributorId);
                                    const hasText = !!section.content;
                                    const hasAttachments = (section.attachments || []).length > 0;
                                    const isReady = section.status === 'Ready for Review' || section.status === 'Understood';

                                    return (
                                        <tr key={section.id} className="group hover:bg-slate-50/50 transition-all">
                                            <td className="p-4">
                                                <div className="flex flex-col gap-1">
                                                    <span className="text-xs font-bold text-slate-800 uppercase tracking-tight group-hover:text-primary transition-colors cursor-pointer" onClick={() => {
                                                        const isSectionContributor = section.contributorId === user.id;
                                                        let targetPath = `/icr/onboardings/${projectId}`;
                                                        if (isSectionContributor) targetPath = `/icr/handovers/${projectId}`;
                                                        navigate(targetPath);
                                                    }}>{section.title}</span>
                                                    <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">Step {idx + 1}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {editingSectionId === section.id && isManager ? (
                                                    <div className="mt-2 flex items-center gap-2">
                                                        <select
                                                            className="h-7 text-sm font-bold border border-slate-200 rounded-lg px-2 outline-none focus:border-primary bg-white w-full max-w-[140px]"
                                                            value={section.contributorId}
                                                            onChange={(e) => {
                                                                updateSection(project.id, section.id, { contributorId: e.target.value });
                                                                setEditingSectionId(null);
                                                            }}
                                                            onBlur={() => setEditingSectionId(null)}
                                                            autoFocus
                                                        >
                                                            <option value="">Unassigned</option>
                                                            {project.members.filter(m => m.ktRole !== 'Receiver').map(m => (
                                                                <option key={m.userId} value={m.userId}>{m.name} ({m.functionalRole})</option>
                                                            ))}
                                                        </select>
                                                        <button onClick={() => setEditingSectionId(null)} className="text-slate-400 hover:text-red-500">
                                                            <X className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-slate-600 text-xs">
                                                            {contributor?.name.charAt(0) || '?'}
                                                        </div>
                                                        <div>
                                                            <p className="text-xs font-bold text-slate-800 leading-none">{contributor?.name || 'Unassigned'}</p>
                                                            <Badge variant="outline" className={`text-[8px] px-1.5 py-0.5 border uppercase tracking-wider font-black mt-1.5 ${contributor?.ktRole === 'Initiator' ? 'bg-purple-50 text-purple-600 border-purple-100' :
                                                                contributor?.ktRole === 'Receiver' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                                                    contributor?.ktRole === 'Contributor' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                                        'bg-slate-50 text-slate-400 border-slate-200'
                                                                }`}>
                                                                {contributor?.ktRole || contributor?.functionalRole || 'Member'}
                                                            </Badge>
                                                        </div>
                                                        {isManager && project.status !== 'Completed' && progress === 0 && (
                                                            <button
                                                                className="ml-2 p-2 rounded-lg hover:bg-white text-slate-300 hover:text-primary transition-all shadow-sm opacity-0 group-hover:opacity-100"
                                                                onClick={() => setEditingSectionId(section.id)}
                                                                title="Change Assignee"
                                                            >
                                                                <Pencil className="w-3.5 h-3.5" />
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                            </td>
                                            <td className="p-4">
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex items-center gap-6">
                                                        <Indicator icon={<FileText className="w-3.5 h-3.5" />} active={hasText} label="Text" />
                                                        <Indicator icon={<Paperclip className="w-3.5 h-3.5" />} active={hasAttachments} label="Files" />
                                                        <Indicator icon={<CheckCircle2 className="w-3.5 h-3.5" />} active={isReady} label="Submitted" />
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex-1 w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full transition-all duration-700 ${progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                                                                style={{ width: `${progress}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-black text-slate-500 min-w-[30px]">{progress}%</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                {getReviewStatusBadge(section.status)}
                                            </td>
                                            {isManager && (
                                                <td className="p-4 text-right">
                                                    {progress === 0 && (
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="w-10 h-10 rounded-xl hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all"
                                                            onClick={() => {
                                                                if (window.confirm("Remove this section from the protocol? This action cannot be undone.")) {
                                                                    removeSection(project.id, section.id);
                                                                }
                                                            }}
                                                            title="Delete Section"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </Button>
                                                    )}
                                                </td>
                                            )}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {project.sections.length === 0 && (
                            <div className="py-20 text-center flex flex-col items-center gap-4">
                                <FileText className="w-12 h-12 text-slate-200" />
                                <p className="text-xs font-black uppercase tracking-widest text-slate-400">No sections defined for this protocol</p>
                                {isManager && (
                                    <Button onClick={() => setIsAddingSection(true)} variant="outline" className="rounded-xl h-9 text-xs font-black uppercase tracking-widest border-2">Add First Section</Button>
                                )}
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div >
    );
}

function MetaDataItem({ label, value }) {
    return (
        <div className="space-y-1">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</span>
            <p className="font-black text-slate-800 text-sm tracking-tight">{value}</p>
        </div>
    );
}

function Indicator({ icon, active, label }) {
    return (
        <div className={`flex items-center gap-2 group/tip relative ${active ? 'text-primary' : 'text-slate-200'}`}>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border-2 transition-all ${active ? 'border-primary/20 bg-primary/5' : 'border-slate-100 bg-slate-50'}`}>
                {icon}
            </div>
            {/* Simple tooltip simulation */}
            <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs font-black uppercase py-1 px-2 rounded opacity-0 group-hover/tip:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                {label}: {active ? 'PRESENT' : 'MISSING'}
            </span>
        </div>
    );
}
