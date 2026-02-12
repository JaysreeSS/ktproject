import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext.jsx';
import { useProjects } from '../../contexts/ProjectContext.jsx';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import {
    Search,
    ChevronRight,
    ChevronLeft,
    Inbox
} from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function MyOnboardings() {
    const { user } = useAuth();
    const { projects } = useProjects();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    // Filter projects where user is Receiver
    const myProjects = projects.filter(p =>
        p.members.some(m => m.userId === user.id && m.ktRole === 'Receiver')
    );

    const filteredProjects = myProjects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Reset pagination when search term changes
    React.useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm]);

    const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);
    const paginatedProjects = filteredProjects.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    return (
        <div className="px-8 md:px-12 py-6 max-w-7xl mx-auto space-y-5 animate-in fade-in duration-700 font-sans">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-10">
                <div className="space-y-1">
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">My Onboardings</h1>
                    <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-lg">Track your learning progress and review assigned modules.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative w-64 group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
                        <Input
                            placeholder="Search onboardings..."
                            className="pl-10 h-11 bg-white border-slate-200 rounded-xl shadow-sm focus:ring-primary focus:border-primary font-bold text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-6">
                {filteredProjects.length === 0 ? (
                    <Card className="border-dashed py-20 bg-slate-50/50">
                        <CardContent className="flex flex-col items-center justify-center opacity-40">
                            <Inbox className="w-12 h-12 mb-4 text-slate-400" />
                            <p className="font-bold text-slate-500 uppercase tracking-widest text-xs">No assigned onboardings found</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-6">
                        <div className="bg-white/80 backdrop-blur border-none shadow-md shadow-slate-200/50 rounded-[2rem] overflow-hidden">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50/50 border-b border-slate-100">
                                    <tr>
                                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Project Name</th>
                                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Your Role</th>
                                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Status</th>
                                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Deadline</th>
                                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500">Learning Progress</th>
                                        <th className="p-4 text-xs font-bold uppercase tracking-wider text-slate-500 text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {paginatedProjects.map((p) => {
                                        const myRole = p.members.find(m => m.userId === user.id)?.ktRole;
                                        const displayProgress = p.completion || 0;
                                        const displayStatus = p.status || 'Not Started';

                                        return (
                                            <tr key={p.id} className="hover:bg-slate-50/50 transition-all cursor-pointer group" onClick={() => navigate(`/icr/onboardings/${p.id}`)}>
                                                <td className="p-4 py-6">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-bold text-slate-800 uppercase tracking-tight group-hover:text-primary transition-colors">{p.name}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-xs font-bold text-slate-600 uppercase bg-slate-100 px-3 py-1 rounded-lg">
                                                        {myRole}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest w-fit border-2 ${(displayStatus === 'Completed' || displayStatus === 'Signed Off')
                                                        ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                                                        : displayStatus === 'In Progress'
                                                            ? 'bg-blue-50 text-blue-600 border-blue-100'
                                                            : 'bg-slate-50 text-slate-400 border-slate-200'
                                                        }`}>
                                                        {displayStatus === 'Completed' || displayStatus === 'Signed Off' ? 'Signed Off' : (displayStatus || 'Active')}
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className="text-xs font-bold text-slate-500 uppercase tracking-tight">
                                                        {p.deadline ? new Date(p.deadline).toLocaleDateString() : 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <div className="flex items-center gap-4">
                                                        <div className="flex-1 w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                                            <div
                                                                className={`h-full transition-all duration-1000 ${displayProgress === 100 ? 'bg-emerald-500' : 'bg-primary'}`}
                                                                style={{ width: `${displayProgress}%` }}
                                                            />
                                                        </div>
                                                        <span className="text-xs font-black text-slate-700 min-w-[35px] text-right">{displayProgress}%</span>
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
        </div>
    );
}
