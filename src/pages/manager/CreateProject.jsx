import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useAdmin } from '../../contexts/AdminContext.jsx';
import { useProjects } from '../../contexts/ProjectContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Check, ChevronRight, ChevronLeft, UserPlus, FileText, Trash2, ShieldCheck, UserCircle } from 'lucide-react';

export default function CreateProject() {
    const { user } = useAuth();
    const { users, templates } = useAdmin();
    const { createProject } = useProjects();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        deadline: '',
        members: [], // { userId, ktRole, functionalRole }
        sections: [] // { id, title, contributorId }
    });

    const availableUsers = users.filter(u => !u.isAdmin && u.role !== 'admin');

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const toggleMember = (u) => {
        if (formData.members.find(m => m.userId === u.id)) {
            setFormData({ ...formData, members: formData.members.filter(m => m.userId !== u.id) });
        } else {
            setFormData({
                ...formData,
                members: [...formData.members, { userId: u.id, name: u.name, ktRole: 'Contributor', functionalRole: u.role }]
            });
        }
    };

    const updateMemberRole = (userId, ktRole) => {
        // Enforce max 2 initiators
        if (ktRole === 'Initiator') {
            const currentInitiators = formData.members.filter(m => m.ktRole === 'Initiator').length;
            const isAlreadyInitiator = formData.members.find(m => m.userId === userId)?.ktRole === 'Initiator';
            if (currentInitiators >= 2 && !isAlreadyInitiator) {
                alert("You can select only up to 2 Initiators.");
                return;
            }
        }
        setFormData({
            ...formData,
            members: formData.members.map(m => m.userId === userId ? { ...m, ktRole } : m)
        });
    };

    const toggleSection = (template) => {
        if (formData.sections.find(s => s.id === template.id)) {
            setFormData({ ...formData, sections: formData.sections.filter(s => s.id !== template.id) });
        } else {
            setFormData({
                ...formData,
                sections: [...formData.sections, { id: template.id, title: template.title, contributorId: '' }]
            });
        }
    };

    const assignContributor = (sectionId, contributorId) => {
        setFormData({
            ...formData,
            sections: formData.sections.map(s => s.id === sectionId ? { ...s, contributorId } : s)
        });
    };

    const handleSubmit = async () => {
        const projectData = {
            ...formData,
            managerId: user.id,
            managerName: user.name
        };
        await createProject(projectData);
        navigate('/dashboard');
    };

    return (
        <div className="p-5 max-w-4xl mx-auto space-y-5">
            <div className="flex items-center justify-between">
                <Button
                    variant="ghost"
                    onClick={() => navigate('/manager/projects')}
                    className="w-fit rounded-xl text-primary hover:text-primary hover:bg-primary/10 font-bold uppercase tracking-widest text-[10px] pl-0 hover:pl-2 transition-all"
                >
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Projects
                </Button>
                <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-2 w-8 rounded-full ${step >= i ? 'bg-blue-600' : 'bg-slate-200'}`} />
                    ))}
                </div>
            </div>

            {step === 1 && (
                <Card className="shadow-xl border-none ring-1 ring-slate-200">
                    <CardHeader className="p-5 pb-5 border-b border-slate-50">
                        <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mb-3">
                            <FileText className="w-5 h-5" />
                        </div>
                        <CardTitle className="text-base font-black text-slate-800 uppercase tracking-tight">Project Details</CardTitle>
                        <CardDescription className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">PROJECT CONTEXT AND OBJECTIVES</CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 space-y-5">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Project Name</Label>
                            <Input
                                id="name"
                                placeholder="Ex: NextGen Portal Migration"
                                className="h-10 text-sm font-bold border-slate-200"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="desc" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</Label>
                            <Textarea
                                id="desc"
                                placeholder="Provide context about the handover objective..."
                                className="min-h-[100px] resize-none text-sm font-bold border-slate-200"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="deadline" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Target Deadline (Optional)</Label>
                            <Input
                                id="deadline"
                                type="date"
                                className="h-10 text-sm font-bold border-slate-200"
                                value={formData.deadline}
                                onChange={e => setFormData({ ...formData, deadline: e.target.value })}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="p-5 flex justify-end border-t border-slate-50">
                        <Button onClick={handleNext} disabled={!formData.name} className="h-10 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-slate-900 text-white shadow-lg shadow-slate-200">
                            Assign Team <ChevronRight className="ml-2 w-3.5 h-3.5" />
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {step === 2 && (
                <Card className="shadow-xl border-none ring-1 ring-slate-200">
                    <CardHeader className="p-5 pb-5 border-b border-slate-50">
                        <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-xl flex items-center justify-center mb-3">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        <CardTitle className="text-base font-black text-slate-800 uppercase tracking-tight">Assign Team & Roles</CardTitle>
                        <CardDescription className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">SELECT TEAM MEMBERS AND RESPONSIBILITIES</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {availableUsers.map(u => {
                                const selected = formData.members.find(m => m.userId === u.id);
                                return (
                                    <div
                                        key={u.id}
                                        onClick={() => toggleMember(u)}
                                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${selected ? 'border-orange-500 bg-orange-50 shadow-md' : 'border-slate-100 bg-white hover:border-slate-200'
                                            }`}
                                    >
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${selected ? 'bg-orange-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                            {u.name.charAt(0)}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold leading-tight">{u.name}</p>
                                            <p className="text-[11px] uppercase tracking-wider font-semibold text-slate-400 group-hover:text-slate-500">{u.role}</p>
                                        </div>
                                        {selected && <Check className="w-4 h-4 text-orange-600" />}
                                    </div>
                                );
                            })}
                        </div>

                        {formData.members.length > 0 && (
                            <div className="space-y-4 pt-4 border-t border-slate-100">
                                <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400">Define KT Responsibilities</h3>
                                <div className="space-y-3">
                                    {formData.members.map(m => (
                                        <div key={m.userId} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <UserCircle className="w-4 h-4 text-slate-400" />
                                                <span className="font-bold text-sm">{m.name}</span>
                                            </div>
                                            <div className="flex bg-white p-1 rounded-lg border border-slate-200">
                                                {['Initiator', 'Contributor', 'Receiver']
                                                    .filter(role => !(m.functionalRole?.toLowerCase() === 'manager' && role === 'Receiver'))
                                                    .map(role => (
                                                        <button
                                                            key={role}
                                                            onClick={() => updateMemberRole(m.userId, role)}
                                                            className={`px-3 py-1.5 text-[10px] font-bold uppercase rounded-md transition-all ${m.ktRole === role ? 'bg-orange-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'
                                                                }`}
                                                        >
                                                            {role}
                                                        </button>
                                                    ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="p-5 flex justify-between border-t border-slate-50">
                        <Button variant="ghost" onClick={handleBack} className="h-10 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px]">
                            Back
                        </Button>
                        <Button onClick={handleNext} disabled={formData.members.length === 0} className="h-10 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-slate-900 text-white shadow-lg shadow-slate-200">
                            Map Sections <ChevronRight className="ml-2 w-3.5 h-3.5 group-hover:translate-x-1 transition-all" />
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {step === 3 && (
                <Card className="shadow-xl border-none ring-1 ring-slate-200">
                    <CardHeader className="p-5 pb-5 border-b border-slate-50">
                        <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center mb-3">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <CardTitle className="text-base font-black text-slate-800 uppercase tracking-tight">Section Mapping</CardTitle>
                        <CardDescription className="font-bold text-slate-400 text-[10px] uppercase tracking-wider">ASSIGN PROTOCOL SECTIONS TO CONTRIBUTORS</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 gap-4">
                            {templates.map(t => {
                                const selected = formData.sections.find(s => s.id === t.id);
                                const currentContributorId = selected?.contributorId || '';

                                return (
                                    <div key={t.id} className={`p-5 rounded-2xl border-2 transition-all ${selected ? 'border-green-500 bg-green-50/30' : 'border-slate-100'}`}>
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3" onClick={() => toggleSection(t)}>
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer ${selected ? 'bg-green-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                                                    <Check className="w-4 h-4" />
                                                </div>
                                                <span className="font-bold text-slate-900">{t.title}</span>
                                            </div>
                                            {selected && <Trash2 onClick={() => toggleSection(t)} className="w-4 h-4 text-red-400 cursor-pointer hover:text-red-600" />}
                                        </div>

                                        {selected && (
                                            <div className="space-y-3 pl-11">
                                                <Label className="text-[10px] uppercase tracking-widest font-black text-slate-400">ASSIGNED TO</Label>
                                                <div className="flex flex-wrap gap-2">
                                                    {formData.members.filter(m => m.ktRole !== 'Receiver').length === 0 ? (
                                                        <p className="text-xs text-orange-600 font-medium">No contributors/initiators available. Go back and assign roles.</p>
                                                    ) : (
                                                        formData.members.filter(m => m.ktRole !== 'Receiver').map(m => (
                                                            <button
                                                                key={m.userId}
                                                                onClick={() => assignContributor(t.id, m.userId)}
                                                                className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${currentContributorId === m.userId
                                                                    ? 'bg-green-600 border-green-600 text-white shadow-lg -translate-y-0.5'
                                                                    : 'bg-white border-slate-200 text-slate-600 hover:border-green-300'
                                                                    }`}
                                                            >
                                                                {m.name} ({m.ktRole})
                                                            </button>
                                                        ))
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                    <CardFooter className="p-5 flex justify-between border-t border-slate-50">
                        <Button variant="ghost" onClick={handleBack} className="h-10 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px]">
                            Back
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={formData.sections.length === 0 || formData.sections.some(s => !s.contributorId)}
                            className="h-10 px-6 rounded-xl font-bold uppercase tracking-wider text-[10px] bg-blue-600 text-white shadow-lg shadow-blue-200 animate-pulse-subtle hover:scale-105 transition-all"
                        >
                            Finalize & Launch Project
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
