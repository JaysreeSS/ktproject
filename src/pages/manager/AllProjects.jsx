import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useProjects } from '../../contexts/ProjectContext.jsx';
import { Button } from '@/components/ui/button';
import { Plus, Folder, LogOut, ChevronLeft, ChevronRight, Activity, Search, Eye, ShieldAlert, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

export default function AllProjects() {
    const { user, logout } = useAuth();
    const { projects } = useProjects();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Reset pagination when search term changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const managerProjects = projects.filter(p => p.managerId === user.id);

    const filteredProjects = managerProjects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const paginatedProjects = filteredProjects.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans">
            <main className="p-5 max-w-7xl mx-auto space-y-5 animate-in fade-in duration-700">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                    <div className="space-y-1">
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">
                            All Projects
                        </h1>
                        <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-lg">
                            Manage and track every project handover.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative w-64 group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search projects..."
                                className="pl-10 h-11 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-primary focus:border-primary font-bold text-sm"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button onClick={() => navigate('/manager/create-project')} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 rounded-xl h-11 px-6 font-bold uppercase tracking-widest text-sm transition-all hover:scale-105 active:scale-95">
                            <Plus className="w-4 h-4 mr-2" /> New Project
                        </Button>
                    </div>
                </header>

                <div className="grid grid-cols-1 gap-6">
                    {filteredProjects.length === 0 ? (
                        <Card className="border-dashed py-20 bg-slate-50/50">
                            <CardContent className="flex flex-col items-center justify-center opacity-40">
                                <ShieldAlert className="w-12 h-12 mb-4 text-slate-400" />
                                <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">No project records found</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-white/80 backdrop-blur border-none shadow-md shadow-slate-200/50 rounded-[2rem] overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-slate-50/50 border-b border-slate-100">
                                        <tr>
                                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Project Name</th>
                                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Completion</th>
                                            <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right"></th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {paginatedProjects.map((p) => {
                                            // Calculate actual completion based on user rules
                                            const total = p.sections.length;
                                            const filled = p.sections.filter(s => s.status === 'Ready for Review' || s.status === 'Understood').length;
                                            const calcCompletion = total > 0 ? Math.round((filled / total) * 100) : 0;

                                            // Derived status logic for display
                                            let displayStatus = p.status || 'Not Started';
                                            if (displayStatus !== 'Completed' && calcCompletion > 0) {
                                                displayStatus = 'In Progress';
                                            }

                                            return (
                                                <tr key={p.id} className="hover:bg-slate-50/50 transition-all cursor-pointer group" onClick={() => navigate(`/manager/projects/${p.id}`)}>
                                                    <td className="p-4 py-6">
                                                        <div className="flex flex-col">
                                                            <span className="text-xs font-bold text-slate-800 uppercase tracking-tight group-hover:text-primary transition-colors">{p.name}</span>
                                                            <span className="text-[9px] text-slate-400 font-bold mt-1 max-w-md line-clamp-1 uppercase tracking-wider">{p.description}</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest w-fit border-2 ${displayStatus === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                            displayStatus === 'In Progress' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                                'bg-slate-100 text-slate-500 border-slate-200'
                                                            }`}>
                                                            {displayStatus}
                                                        </div>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex items-center gap-4">
                                                            <div className="flex-1 w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                                <div
                                                                    className={`h-full transition-all duration-1000 ${calcCompletion === 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                                                                    style={{ width: `${calcCompletion}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-black text-slate-700 min-w-[35px] text-right">{calcCompletion}%</span>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-right">
                                                        <div className="flex items-center justify-end">
                                                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-slate-50 text-slate-400 group-hover:bg-primary group-hover:text-white group-hover:translate-x-1 transition-all">
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
                                            className={`rounded-lg h-9 w-9 p-0 font-black text-xs ${currentPage === i + 1 ? 'shadow-lg shadow-primary/20' : 'border-slate-200 text-slate-500'
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
            </main>
        </div>
    );
}
