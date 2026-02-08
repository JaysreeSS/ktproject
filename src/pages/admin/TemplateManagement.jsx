import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Plus, Trash2, ChevronLeft, Layout, Lock, Info, ExternalLink, Paperclip, Loader2, Pencil } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

export default function TemplateManagement({ isEmbedded = false }) {
    const { templates, addTemplate, updateTemplate, deleteTemplate } = useAdmin();
    const navigate = useNavigate();
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [saving, setSaving] = useState(false);

    const handleAdd = async () => {
        if (!newTitle.trim()) return;

        setSaving(true);
        if (editingId) {
            await updateTemplate(editingId, {
                title: newTitle.trim(),
                description: newDescription,
                input_type: ['text', 'file']
            });
            setEditingId(null);
        } else {
            await addTemplate({
                title: newTitle.trim(),
                description: newDescription,
                attachment_url: '',
                input_type: ['text', 'file']
            });
        }

        setNewTitle('');
        setNewDescription('');
        setSaving(false);
    };

    const startEdit = (template) => {
        setEditingId(template.id);
        setNewTitle(template.title);
        setNewDescription(template.description || '');
    };



    return (
        <div className={`p-5 max-w-7xl mx-auto space-y-5 animate-in fade-in duration-700 ${isEmbedded ? 'p-10' : ''}`}>


            {!isEmbedded && (
                <header className="space-y-1">
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Section Templates</h1>
                    <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-lg">Define the required sections for projects.</p>
                </header>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Creation panel */}
                <div className="md:col-span-1">
                    <Card className="shadow-xl border-none ring-1 ring-slate-100 rounded-[2rem] sticky top-8">
                        <CardHeader className="p-5 pb-5 border-b border-slate-50">
                            <CardTitle className="text-base font-black text-slate-800 uppercase tracking-tight">{editingId ? 'Edit Section' : 'Add New Section'}</CardTitle>
                            <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{editingId ? 'Update section details.' : 'Create a new section template.'}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-5 space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Section Title</label>
                                <Input
                                    placeholder="e.g. Compliance Checks"
                                    value={newTitle}
                                    onChange={e => setNewTitle(e.target.value)}
                                    className="bg-slate-50 border-none rounded-xl h-10 font-bold text-sm"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Instructions / Info</label>
                                <Textarea
                                    placeholder="Describe what information is needed..."
                                    value={newDescription}
                                    onChange={e => setNewDescription(e.target.value)}
                                    className="bg-slate-50 border-none rounded-xl min-h-[100px] resize-none font-bold text-sm"
                                />
                            </div>




                            <Button
                                onClick={handleAdd}
                                disabled={saving || !newTitle.trim()}
                                className="w-full bg-primary hover:bg-primary/90 rounded-xl font-bold h-10 shadow-lg shadow-primary/20 text-[10px] uppercase tracking-wider"
                            >
                                {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                                {saving ? (editingId ? 'Updating...' : 'Adding...') : (editingId ? 'Update Section' : 'Add Section')}
                            </Button>
                            {editingId && (
                                <Button
                                    onClick={() => {
                                        setEditingId(null);
                                        setNewTitle('');
                                        setNewDescription('');
                                    }}
                                    variant="ghost"
                                    className="w-full mt-2"
                                >
                                    Cancel
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* List panel */}
                <div className="md:col-span-2 space-y-4">
                    <h3 className="text-sm font-black uppercase text-slate-400 tracking-widest px-2 mb-4">Current Sections</h3>
                    {templates.length === 0 && (
                        <div className="text-center py-12 text-slate-400 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                            <p className="font-medium">no sections created</p>
                        </div>
                    )}
                    {templates.map((t, idx) => (
                        <Card key={t.id} className="group hover:shadow-md transition-all border-none shadow-sm shadow-slate-200/50 rounded-2xl bg-white/80 backdrop-blur">
                            <CardContent className="p-5 flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors shrink-0">
                                        <Layout className="w-5 h-5" />
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className="text-sm font-black text-slate-800 uppercase tracking-tight">{t.title}</h4>

                                        {t.description && (
                                            <p className="text-xs text-slate-500 font-bold max-w-md">{t.description}</p>
                                        )}

                                        {t.attachment_url && (
                                            <a
                                                href={t.attachment_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center text-xs font-black text-blue-600 hover:underline mt-1 uppercase tracking-widest"
                                            >
                                                <Paperclip className="w-3 h-3 mr-1" /> View Attachment
                                            </a>
                                        )}

                                        <div className="flex items-center gap-3 mt-2">
                                            <span className="text-xs font-black uppercase tracking-widest text-slate-400">Sequence: {t.order || idx + 1}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 text-slate-400" onClick={() => startEdit(t)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-600 text-slate-400" onClick={() => deleteTemplate(t.id)}>
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
