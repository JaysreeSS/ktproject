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
        members: [], // { userId, ktRole, functionalRole }
        sections: [] // { id, title, contributorId }
    });

    const availableUsers = users.filter(u => !u.isAdmin);

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

    const handleSubmit = () => {
        const projectData = {
            ...formData,
            managerId: user.id,
            managerName: user.name
        };
        createProject(projectData);
        navigate('/dashboard');
    };

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-8">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="rounded-full">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Dashboard
                </Button>
                <div className="flex gap-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className={`h-2 w-8 rounded-full ${step >= i ? 'bg-blue-600' : 'bg-slate-200'}`} />
                    ))}
                </div>
            </div>

            {step === 1 && (
                <Card className="shadow-xl border-none ring-1 ring-slate-200">
                    <CardHeader className="space-y-1 pb-8">
                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-4">
                            <FileText className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Project Details</CardTitle>
                        <CardDescription>Tell us about the project and why knowledge transfer is needed.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="name">Project Name</Label>
                            <Input
                                id="name"
                                placeholder="Ex: NextGen Portal Migration"
                                className="h-12 text-lg font-medium"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="desc">Description</Label>
                            <Textarea
                                id="desc"
                                placeholder="Provide context about the handover objective..."
                                className="min-h-[120px] resize-none"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end pt-4 border-t">
                        <Button onClick={handleNext} disabled={!formData.name} className="h-12 px-8 rounded-xl font-bold">
                            Assign Team <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {step === 2 && (
                <Card className="shadow-xl border-none ring-1 ring-slate-200">
                    <CardHeader className="space-y-1 pb-8">
                        <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center mb-4">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Assign Team & Roles</CardTitle>
                        <CardDescription>Select team members and define their responsibility in this KT.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
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
                            <div className="space-y-4 pt-4">
                                <h3 className="text-sm font-bold text-slate-600 border-l-4 border-orange-500 pl-3">Define KT Responsibilities</h3>
                                <div className="space-y-3">
                                    {formData.members.map(m => (
                                        <div key={m.userId} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                            <div className="flex items-center gap-2">
                                                <UserCircle className="w-4 h-4 text-slate-400" />
                                                <span className="font-bold text-sm">{m.name}</span>
                                            </div>
                                            <div className="flex bg-white p-1 rounded-lg border border-slate-200">
                                                {['Initiator', 'Contributor', 'Receiver'].map(role => (
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
                    <CardFooter className="flex justify-between pt-4 border-t">
                        <Button variant="ghost" onClick={handleBack} className="h-12 px-8 rounded-xl font-bold">
                            Back
                        </Button>
                        <Button onClick={handleNext} disabled={formData.members.length === 0} className="h-12 px-8 rounded-xl font-bold bg-slate-900 group">
                            Map Sections <ChevronRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-all" />
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {step === 3 && (
                <Card className="shadow-xl border-none ring-1 ring-slate-200">
                    <CardHeader className="space-y-1 pb-8">
                        <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center mb-4">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Section Mapping</CardTitle>
                        <CardDescription>Assign specific KT sections to team members.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-8">
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
                    <CardFooter className="flex justify-between pt-4 border-t">
                        <Button variant="ghost" onClick={handleBack} className="h-12 px-8 rounded-xl font-bold">
                            Back
                        </Button>
                        <Button
                            onClick={handleSubmit}
                            disabled={formData.sections.length === 0 || formData.sections.some(s => !s.contributorId)}
                            className="h-12 px-8 rounded-xl font-bold bg-blue-600 shadow-lg shadow-blue-200 animate-pulse-subtle hover:scale-105 transition-all"
                        >
                            Finalize & Launch Project
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    );
}
