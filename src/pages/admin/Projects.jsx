import React from 'react';
import { useProjects } from '../../contexts/ProjectContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trash2, Eye, ShieldAlert, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminProjects({ isEmbedded = false }) {
    const { projects, deleteProject } = useProjects();
    const { user } = useAuth();
    const navigate = useNavigate();

    const handleDelete = (id, status) => {
        if (status !== 'Completed') {
            alert("Only completed KT projects can be removed by the Admin.");
            return;
        }
        if (window.confirm("Are you sure you want to permanently delete this project? This action cannot be undone.")) {
            deleteProject(id);
        }
    };

    return (
        <div className={`p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 ${isEmbedded ? 'p-10' : ''}`}>
            {!isEmbedded && (
                <div className="flex items-center justify-between">
                    <Button variant="ghost" onClick={() => navigate('/admin')} className="rounded-full">
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Portal
                    </Button>
                </div>
            )}

            {!isEmbedded && (
                <header>
                    <h1 className="text-4xl font-black tracking-tight text-slate-900">Project Governance</h1>
                    <p className="text-slate-500 mt-2 font-medium">Global oversight of all knowledge transfer sessions and system records.</p>
                </header>
            )}

            <div className="grid grid-cols-1 gap-6">
                {projects.length === 0 ? (
                    <Card className="border-dashed py-20 bg-slate-50/50">
                        <CardContent className="flex flex-col items-center justify-center opacity-40">
                            <ShieldAlert className="w-12 h-12 mb-4" />
                            <p className="font-bold uppercase tracking-widest text-xs">No project records found</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-slate-50/50 border-b border-slate-100">
                                <tr>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Project Name</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Manager</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-center">Completion</th>
                                    <th className="p-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {projects.map((p) => (
                                    <tr key={p.id} className="hover:bg-slate-50/30 transition-colors group">
                                        <td className="p-6 py-8">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-900">{p.name}</span>
                                                <span className="text-[10px] text-slate-400 font-medium mt-1">ID: {p.id}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-[10px] font-black text-primary border border-primary/20">
                                                    {p.managerName?.charAt(0) || 'M'}
                                                </div>
                                                <span className="text-sm font-semibold">{p.managerName}</span>
                                            </div>
                                        </td>
                                        <td className="p-6">
                                            <Badge className={
                                                p.status === 'Completed' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                                                    'bg-primary/10 text-primary hover:bg-primary/10'
                                            }>
                                                {p.status}
                                            </Badge>
                                        </td>
                                        <td className="p-6">
                                            <div className="flex flex-col items-center gap-1.5">
                                                <span className="text-[10px] font-black">{p.completion}%</span>
                                                <div className="w-24 h-1 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-primary" style={{ width: `${p.completion}%` }} />
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-6 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button variant="ghost" size="icon" className="rounded-xl" onClick={() => navigate(`/project/${p.id}`)}>
                                                    <Eye className="w-4 h-4 text-slate-400" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="rounded-xl hover:bg-red-50 hover:text-red-600"
                                                    onClick={() => handleDelete(p.id, p.status)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
