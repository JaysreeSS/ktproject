import React, { useState } from 'react';
import { useProjects } from '../../contexts/ProjectContext.jsx';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { Trash2, Eye, ShieldAlert, ChevronLeft, ChevronRight, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { useAdmin } from '../../contexts/AdminContext.jsx';

export default function AdminProjects({ isEmbedded = false }) {
    const { projects, deleteProject } = useProjects();
    const { users } = useAdmin();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Reset pagination when search term changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.managerName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const paginatedProjects = filteredProjects.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleDelete = (e, id, status) => {
        e.stopPropagation(); // Prevent row navigation
        if (status !== 'Completed') {
            alert("Only completed KT projects can be removed by the Admin.");
            return;
        }
        if (window.confirm("Are you sure you want to permanently delete this project? This action cannot be undone.")) {
            deleteProject(id);
        }
    };

    return (
        <div className={`p-5 max-w-7xl mx-auto space-y-5 animate-in fade-in duration-700 ${isEmbedded ? 'p-10' : ''}`}>

            {!isEmbedded && (
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Projects</h1>
                        <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-lg">Overview of all system-wide knowledge transfer projects.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative w-72 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <input
                                type="text"
                                placeholder="Search by name or manager..."
                                className="w-full pl-10 pr-4 h-11 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none font-bold text-sm transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                </header>
            )}

            <div className="grid grid-cols-1 gap-6">
                {filteredProjects.length === 0 ? (
                    <Card className="border-dashed py-20 bg-slate-50/50 rounded-[2rem]">
                        <CardContent className="flex flex-col items-center justify-center opacity-40">
                            <ShieldAlert className="w-12 h-12 mb-4" />
                            <p className="font-bold uppercase tracking-widest text-xs">No project records found</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-white/80 backdrop-blur border-none shadow-md shadow-slate-200/50 rounded-[1.5rem] md:rounded-[2rem] overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse min-w-[700px] md:min-w-0">
                                    <thead className="bg-slate-50/50 border-b border-slate-100">
                                        <tr>
                                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Project Name</th>
                                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Manager</th>
                                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Completion</th>
                                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {paginatedProjects.map((p) => {
                                            // Calculate actual completion
                                            const total = p.sections?.length || 0;
                                            const filled = p.sections?.filter(s => s.status === 'Ready for Review' || s.status === 'Understood').length || 0;
                                            const calcCompletion = total > 0 ? Math.round((filled / total) * 100) : 0;

                                            return (
                                                <tr key={p.id} className="hover:bg-slate-50/50 transition-all cursor-pointer group" onClick={() => navigate(`/admin/projects/${p.id}`)}>
                                                    <td className="p-4 py-8">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold text-slate-800 uppercase tracking-tight group-hover:text-primary transition-colors">{p.name}</span>
                                                            <span className="text-[9px] text-slate-400 font-bold mt-1 max-w-md line-clamp-1 uppercase tracking-wider">{p.description}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-3">
                                                            {(() => {
                                                                const manager = users.find(u => u.id === p.managerId) || users.find(u => u.name === p.managerName) || { name: p.managerName };
                                                                return (
                                                                    <>
                                                                        <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-xs font-black text-primary border border-primary/20">
                                                                            {manager.name?.charAt(0) || 'M'}
                                                                        </div>
                                                                        <span className="text-xs font-black text-slate-700 uppercase tracking-tight">{manager.name}</span>
                                                                    </>
                                                                );
                                                            })()}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest w-fit border-2 ${p.status === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                            p.status === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                                'bg-slate-100 text-slate-500 border-slate-200'
                                                            }`}>
                                                            {p.status || 'Not Started'}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex-1 w-24 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full transition-all duration-1000 ${calcCompletion === 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                                                                    style={{ width: `${calcCompletion}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-black text-slate-700 min-w-[35px] text-right">{calcCompletion}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex items-center justify-end gap-3">
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                className="w-9 h-9 rounded-xl hover:bg-red-50 hover:text-red-600 transition-colors"
                                                                onClick={(e) => handleDelete(e, p.id, p.status)}
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:translate-x-1 transition-all">
                                                                <ChevronRight className="w-5 h-5" />
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 pt-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => prev - 1)}
                                    className="rounded-lg h-9 w-9 p-0 border-slate-200"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </Button>
                                {[...Array(totalPages)].map((_, i) => (
                                    <Button
                                        key={i}
                                        variant={currentPage === i + 1 ? "default" : "outline"}
                                        size="sm"
                                        onClick={() => setCurrentPage(i + 1)}
                                        className={`rounded-lg h-9 w-9 p-0 font-black text-xs ${currentPage === i + 1 ? 'shadow-lg shadow-primary/20 bg-primary text-white' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
                                            }`}
                                    >
                                        {i + 1}
                                    </Button>
                                ))}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => prev + 1)}
                                    className="rounded-lg h-9 w-9 p-0 border-slate-200"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div >
    );
}
