import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, UserCog, Trash2, ShieldCheck, ChevronLeft, User, Mail, MoreHorizontal, Eye, EyeOff, RotateCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UserManagement() {
    const { users, addUser, updateUser, deleteUser, isMockData, seedDatabase } = useAdmin();
    const navigate = useNavigate();

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ username: '', name: '', password: '', role: '', isAdmin: false });
    const [visiblePasswords, setVisiblePasswords] = useState({});

    const togglePassword = (id) => {
        setVisiblePasswords(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const handleSave = () => {
        // Validation
        if (!formData.username || !formData.name || !formData.role || !formData.password) {
            alert("Please fill in all fields (Username, Password, Name, and Role).");
            return;
        }

        if (editingId) {
            updateUser(editingId, formData);
            setEditingId(null);
        } else {
            addUser(formData);
            setIsAdding(false);
        }
        setFormData({ username: '', name: '', password: '', role: '', isAdmin: false });
    };

    const startEdit = (user) => {
        setEditingId(user.id);
        setFormData({
            username: user.username,
            name: user.name,
            role: user.role,
            isAdmin: user.isAdmin,
            password: user.password || user.username // Fallback for legacy users
        });
        setIsAdding(true);
    };

    const cancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ username: '', name: '', password: '', role: '', isAdmin: false });
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <Button variant="ghost" onClick={() => navigate('/admin')} className="rounded-full">
                    <ChevronLeft className="w-4 h-4 mr-1" /> Back to Portal
                </Button>
                <div className="flex gap-4">
                    {!isAdding && (
                        <Button onClick={() => setIsAdding(true)} className="bg-primary shadow-lg shadow-primary/20 rounded-xl px-6 font-bold h-11">
                            <UserPlus className="w-4 h-4 mr-2" /> New User
                        </Button>
                    )}
                </div>
            </div>

            <header>
                <h1 className="text-4xl font-black text-slate-900 tracking-tight">Identity & Access</h1>
                <p className="text-slate-500 mt-2 font-medium">Manage corporate identities, functional roles, and system permissions.</p>
            </header>

            {isMockData && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-amber-900 font-black">Running on Mock Data</h3>
                            <p className="text-amber-700 text-sm font-medium">Your Supabase connection is active but the database appears to be empty.</p>
                        </div>
                    </div>
                    <Button
                        onClick={async () => {
                            const res = await seedDatabase();
                            if (res.success) {
                                alert("Database seeded successfully!");
                            } else {
                                alert("Seeding failed. Please check the console and your Supabase setup.");
                            }
                        }}
                        className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-6 rounded-xl"
                    >
                        Sync Mock Data to Supabase
                    </Button>
                </div>
            )}

            {isAdding && (
                <Card className="shadow-2xl border-none ring-1 ring-slate-200 rounded-[2rem] overflow-hidden">
                    <CardHeader className="bg-primary/5 border-b border-slate-100 p-8">
                        <CardTitle className="text-xl font-black text-slate-800 tracking-tight">
                            {editingId ? 'Modify User Profile' : 'Provision New Identity'}
                        </CardTitle>
                        <CardDescription>Enter the user credentials and assign a system-wide functional role.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Username</label>
                                <Input
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="e.g. jdoe"
                                    className="bg-slate-50 border-none h-12 rounded-xl focus-visible:ring-primary font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                                <Input
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Set temporary password"
                                    className="bg-slate-50 border-none h-12 rounded-xl focus-visible:ring-primary font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                                <Input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    className="bg-slate-50 border-none h-12 rounded-xl focus-visible:ring-primary font-bold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Functional Role</label>
                                <select
                                    value={formData.role}
                                    onChange={e => {
                                        const newRole = e.target.value;
                                        setFormData({
                                            ...formData,
                                            role: newRole,
                                            isAdmin: newRole === 'admin'
                                        });
                                    }}
                                    className="w-full bg-slate-50 border-none h-12 rounded-xl px-4 text-sm font-bold focus:ring-2 focus:ring-primary outline-none appearance-none cursor-pointer"
                                >
                                    <option value="" disabled>Select Role</option>
                                    <option value="developer">Developer</option>
                                    <option value="manager">Manager</option>
                                    <option value="qa">QA Engineer</option>
                                    <option value="ba">Business Analyst</option>
                                    <option value="support">Support</option>
                                    <option value="admin">System Admin</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-primary/5 border-t border-slate-100 p-8 flex justify-end gap-3">
                        <Button variant="ghost" onClick={cancel} className="rounded-xl font-bold">Cancel</Button>
                        <Button onClick={handleSave} className="bg-slate-900 shadow-xl shadow-slate-200 rounded-xl px-8 font-bold h-12">
                            {editingId ? 'Update User' : 'Add User'}
                        </Button>
                    </CardFooter>
                </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((u) => (
                    <Card key={u.id} className="group hover:shadow-xl transition-all duration-300 border-slate-200 dark:border-slate-800 rounded-[2rem] overflow-hidden">
                        <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-500">
                                    <User className="w-7 h-7" />
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => startEdit(u)}>
                                        <UserCog className="w-4 h-4 text-slate-400" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-red-50 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteUser(u.id)}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="pt-4">
                                <CardTitle className="text-xl font-black text-slate-900">{u.name}</CardTitle>
                                <CardDescription className="flex items-center gap-2 mt-1">
                                    <Mail className="w-3 h-3 opacity-40" /> {u.username}@ideassion.com
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-bold uppercase tracking-widest text-[9px] px-3 py-1">
                                    {u.role || 'Contributor'}
                                </Badge>
                                {u.isAdmin && (
                                    <Badge className="bg-primary text-primary-foreground border-none font-bold uppercase tracking-widest text-[9px] px-3 py-1">
                                        System Admin
                                    </Badge>
                                )}
                            </div>

                            {/* Credentials Display */}
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mt-2">
                                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Access Credentials</p>
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] uppercase font-bold text-slate-500 w-16">Username:</span>
                                            <code className="text-xs font-bold text-slate-700 bg-slate-200/50 px-1 rounded">{u.username}</code>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] uppercase font-bold text-slate-500 w-16">Password:</span>
                                            <code className="text-xs font-bold text-slate-700 bg-slate-200/50 px-1 rounded transition-all min-w-[60px]">
                                                {visiblePasswords[u.id] ? (u.password || u.username) : '••••••••'}
                                            </code>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-8 w-8 rounded-lg hover:bg-white hover:shadow-sm"
                                        onClick={() => togglePassword(u.id)}
                                    >
                                        {visiblePasswords[u.id] ? (
                                            <EyeOff className="w-3 h-3 text-slate-400" />
                                        ) : (
                                            <Eye className="w-3 h-3 text-slate-400" />
                                        )}
                                    </Button>
                                </div>
                            </div>
                        </CardContent>

                    </Card>
                ))}
            </div>
        </div>
    );
}
