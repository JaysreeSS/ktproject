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

export default function TemplateManagement() {
    const { templates, addTemplate, deleteTemplate } = useAdmin();
    const navigate = useNavigate();
    const [newTitle, setNewTitle] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleAdd = async () => {
        if (!newTitle.trim()) return;

        setUploading(true);
        let attachment_url = '';

        if (file) {
            try {
                const fileExt = file.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${fileExt}`;

                const { error: uploadError } = await supabase.storage
                    .from('template-attachments')
                    .upload(fileName, file);

                if (uploadError) {
                    throw uploadError;
                }

                const { data } = supabase.storage
                    .from('template-attachments')
                    .getPublicUrl(fileName);

                attachment_url = data.publicUrl;
            } catch (error) {
                console.error('Error uploading file:', error);
                alert('Failed to upload file. Please try again.');
                setUploading(false);
                return;
            }
        }

        await addTemplate({
            title: newTitle.trim(),
            description: newDescription,
            attachment_url: attachment_url
        });

        setNewTitle('');
        setNewDescription('');
        setFile(null);
        setUploading(false);
    };

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate('/admin')} className="rounded-full">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Portal
                </Button>
            </div>

            <header>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Governance Templates</h1>
                <p className="text-slate-500 mt-2 font-medium">Define the mandatory sections for all corporate knowledge transfer sessions.</p>
            </header>

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

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Attachment (Optional)</label>
                                <div className="border border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-slate-50 transition-colors relative">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={e => setFile(e.target.files[0])}
                                    />
                                    <Paperclip className={`w-5 h-5 mb-2 ${file ? 'text-blue-500' : 'text-slate-300'}`} />
                                    <span className="text-xs font-medium text-slate-600 truncate max-w-full px-2">
                                        {file ? file.name : "Click to upload file"}
                                    </span>
                                </div>
                            </div>

                            <Button
                                onClick={handleAdd}
                                disabled={uploading || !newTitle.trim()}
                                className="w-full bg-slate-900 rounded-xl font-bold h-12 shadow-lg shadow-slate-200"
                            >
                                {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Plus className="w-4 h-4 mr-2" />}
                                {uploading ? 'Injecting...' : 'Inject Section'}
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
                        <div className="text-center py-12 text-slate-400">
                            <p>No sections defined yet.</p>
                        </div>
                    )}
                    {templates.map((t, idx) => (
                        <Card key={t.id} className="group hover:shadow-md transition-all border-slate-100 rounded-2xl">
                            <CardContent className="p-5 flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors shrink-0">
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
                                            <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Sequence: {idx + 1}</span>
                                            {/* Logic for core/locked sections might need review if completely dynamic now, but keeping for visual consistency if manually creating core sections */}
                                            {(t.title.includes("Overview") || idx < 3) && <Badge variant="secondary" className="bg-blue-50 text-[8px] text-blue-600 border-none px-2 py-0">CORE SECTION</Badge>}
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
