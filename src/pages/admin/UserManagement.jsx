import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, UserCog, Trash2, ShieldCheck, ChevronLeft, User, Mail, MoreHorizontal, Eye, EyeOff, RotateCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UserManagement({ isEmbedded = false }) {
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
            setIsAdding(false);
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
        <div className={`p-5 max-w-7xl mx-auto space-y-5 animate-in fade-in duration-700 ${isEmbedded ? 'p-10' : ''}`}>
            {!isEmbedded && (
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <header className="space-y-1">
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Users</h1>
                        <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-lg">Manage user accounts and roles.</p>
                    </header>
                    {!isAdding && (
                        <Button onClick={() => setIsAdding(true)} className="bg-slate-900 text-white shadow-lg shadow-slate-200 rounded-xl px-6 font-bold h-10 shrink-0 text-[10px] uppercase tracking-wider">
                            <UserPlus className="w-4 h-4 mr-2" /> New User
                        </Button>
                    )}
                </div>
            )}

            {isMockData && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-amber-900 font-black text-base uppercase tracking-tight">Running on Mock Data</h3>
                            <p className="text-amber-700 text-sm font-bold leading-relaxed">Your Supabase connection is active but the database appears to be empty.</p>
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
                    <CardHeader className="bg-primary/5 border-b border-slate-100 p-5">
                        <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-tight">
                            {editingId ? 'Edit User' : 'Add New User'}
                        </CardTitle>
                        <CardDescription className="text-xs font-bold text-slate-400">Enter user details and assign a role.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Username</label>
                                <Input
                                    value={formData.username}
                                    onChange={e => setFormData({ ...formData, username: e.target.value })}
                                    placeholder="e.g. jdoe"
                                    className="bg-slate-50 border-none h-12 rounded-xl focus-visible:ring-primary font-bold text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Password</label>
                                <Input
                                    value={formData.password}
                                    onChange={e => setFormData({ ...formData, password: e.target.value })}
                                    placeholder="Set temporary password"
                                    className="bg-slate-50 border-none h-12 rounded-xl focus-visible:ring-primary font-bold text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Full Name</label>
                                <Input
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="John Doe"
                                    className="bg-slate-50 border-none h-12 rounded-xl focus-visible:ring-primary font-bold text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Role</label>
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
                                    <option value="qa">QA Engineer</option>
                                    <option value="ba">Business Analyst</option>
                                    <option value="support">Support</option>
                                    <option value="manager">Manager</option>
                                    <option value="admin">System Admin</option>
                                </select>
                            </div>
                        </div>
                    </CardContent>
                    <CardFooter className="bg-primary/5 border-t border-slate-100 p-5 flex justify-end gap-3">
                        <Button variant="ghost" onClick={cancel} className="rounded-xl font-bold">Cancel</Button>
                        <Button onClick={handleSave} className="bg-slate-900 shadow-xl shadow-slate-200 rounded-xl px-8 font-bold h-12">
                            {editingId ? 'Update User' : 'Add User'}
                        </Button>
                    </CardFooter>
                </Card>
            )}

            {/* Categorized User List */}
            {/* Categorized User List */}
            <div className="space-y-12 pb-20">
                {[
                    {
                        title: "Admins",
                        items: users.filter(u => u.isAdmin || u.role === 'admin'),
                        icon: ShieldCheck,
                        color: "text-indigo-600"
                    },
                    {
                        title: "Managers & Team Leads",
                        items: users.filter(u => !u.isAdmin && u.role === 'manager'),
                        icon: UserCog,
                        color: "text-emerald-600"
                    },
                    {
                        title: "Functional Roles",
                        items: users.filter(u => !u.isAdmin && u.role !== 'manager' && u.role !== 'admin'),
                        icon: User,
                        color: "text-blue-600"
                    }
                ].map((category) => category.items.length > 0 && (
                    <div key={category.title} className="space-y-6">
                        <div className="flex items-center gap-3 px-2">
                            <div className={`p-2 rounded-lg bg-white shadow-sm ring-1 ring-slate-100 ${category.color}`}>
                                <category.icon className="w-5 h-5" />
                            </div>
                            <h2 className="text-lg font-black text-slate-800 tracking-tight uppercase">{category.title}</h2>
                            <div className="h-[1px] flex-1 bg-slate-100 ml-4" />
                            <Badge variant="outline" className="ml-auto bg-white text-slate-500 border-slate-200 font-bold px-3 text-sm uppercase tracking-wider">
                                {category.items.length} Users
                            </Badge>
                        </div>

                        <div className="space-y-3">
                            {category.items.map((u) => (
                                <Card key={u.id} className="group hover:shadow-md transition-all duration-300 border-none shadow-sm shadow-slate-200/50 rounded-2xl overflow-hidden bg-white/80 backdrop-blur">
                                    <div className="p-4 flex items-center gap-6">
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shrink-0 border border-slate-200">
                                            <User className="w-5 h-5" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-tight">{u.name}</h3>
                                                <Badge variant="secondary" className="bg-slate-100 text-slate-500 border-none font-bold uppercase tracking-wider text-[9px] px-2 py-0.5">
                                                    {u.role || 'Contributor'}
                                                </Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                                                <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                                                    ID: {u.id.substring(0, 8)}...
                                                </p>
                                                <p className="lg:hidden text-[9px] text-primary/60 font-black uppercase tracking-widest bg-primary/5 px-2 rounded">
                                                    @{u.username}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="hidden lg:flex items-center gap-6 px-6 border-x border-slate-100 h-8">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Username:</span>
                                                <code className="bg-slate-50 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-600 border border-slate-100">{u.username}</code>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Password:</span>
                                                <div className="flex items-center gap-1.5">
                                                    <code className="bg-slate-50 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-600 border border-slate-100 min-w-[70px]">
                                                        {visiblePasswords[u.id] ? (u.password || u.username) : '••••••••'}
                                                    </code>
                                                    <button onClick={() => togglePassword(u.id)} className="text-slate-300 hover:text-slate-600 transition-colors">
                                                        {visiblePasswords[u.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600" onClick={() => startEdit(u)}>
                                                <UserCog className="w-4 h-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500" onClick={() => deleteUser(u.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
