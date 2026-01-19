import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Trash2, ChevronLeft, Layout, Lock, Info, ExternalLink, Paperclip, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function TemplateManagement({ isEmbedded = false }) {
    const { templates, addTemplate, deleteTemplate } = useAdmin();
    const navigate = useNavigate();
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [saving, setSaving] = useState(false);

    const handleAdd = async () => {
        if (!newTitle.trim()) return;

        setSaving(true);
        await addTemplate({
            title: newTitle.trim(),
            description: newDescription,
            attachment_url: '' // Admin no longer uploads attachments here
        });

        setNewTitle('');
        setNewDescription('');
        setSaving(false);
    };

    return (
        <div className={`p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500 ${isEmbedded ? 'p-10' : ''}`}>
            {!isEmbedded && (
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate('/admin')} className="rounded-full">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Portal
                    </Button>
                </div>
            )}

            {!isEmbedded && (
                <header>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Governance Templates</h1>
                    <p className="text-slate-500 mt-2 font-medium">Define the mandatory sections for all corporate knowledge transfer sessions.</p>
                </header>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Creation panel */}
                <div className="md:col-span-1">
                    <Card className="shadow-xl border-none ring-1 ring-slate-100 rounded-[2rem] sticky top-8">
                        <CardHeader>
                            <CardTitle className="text-lg">Add Section</CardTitle>
                            <CardDescription>Custom sections will appear in the creation wizard for all projects.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Section Title</label>
                                <Input
                                    placeholder="e.g. Compliance Checks"
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                    className="bg-slate-50 border-none rounded-xl h-12 font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Instructions / Info</label>
                                <Textarea
                                    placeholder="Describe what information is needed..."
                                    value={newDescription}
                                    onChange={e => setNewDescription(e.target.value)}
                                    className="bg-slate-50 border-none rounded-xl min-h-[100px] resize-none font-medium"
                                />
                            </div>


                            <Button
                                onClick={handleAdd}
                                disabled={saving || !newTitle.trim()}
                                className="w-full bg-primary hover:bg-primary/90 rounded-xl font-bold h-12 shadow-lg shadow-primary/20"
                            >
                                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                                {saving ? 'Injecting...' : 'Inject Section'}
                            </Button>
                        </CardContent>
                        <CardFooter className="bg-slate-50 border-t border-slate-100 p-6 flex items-start gap-3">
                            <Info className="w-4 h-4 text-slate-400 mt-0.5" />
                            <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                                Administrators define the structure. Contributors fill the content. Changes here do not retroactively affect existing active projects.
                            </p>
                        </CardFooter>
                    </Card>
                </div>

                {/* List panel */}
                <div className="md:col-span-2 space-y-4">
                    <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest px-2 mb-4">Active Blueprint Structure</h3>
                    {templates.length === 0 && (
                        <div className="text-center py-12 text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                            <p className="font-medium">no sections created</p>
                        </div>
                    )}
                    {templates.map((t, idx) => (
                        <Card key={t.id} className="group hover:shadow-md transition-all border-slate-100 rounded-2xl">
                            <CardContent className="p-5 flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                                        <Layout className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="font-bold text-slate-900">{t.title}</h4>

                                        {t.description && (
                                            <p className="text-xs text-slate-500 max-w-md">{t.description}</p>
                                        )}

                                        {t.attachment_url && (
                                            <a
                                                href={t.attachment_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-[10px] font-bold text-blue-600 hover:underline mt-1"
                                            >
                                                <Paperclip className="w-3 h-3 mr-1" /> View Attachment
                                            </a>
                                        )}

                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Sequence: {t.order || idx + 1}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-600" onClick={() => deleteTemplate(t.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}
