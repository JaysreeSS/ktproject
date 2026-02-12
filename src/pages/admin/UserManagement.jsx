import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserPlus, UserCog, ShieldCheck, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UserManagement({ isEmbedded = false }) {
    const { users, addUser, updateUser, deleteUser, isMockData, seedDatabase } = useAdmin();
    const navigate = useNavigate();

    const [isAdding, setIsAdding] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const PREDEFINED_ROLES = ['developer', 'qa', 'ba', 'support', 'manager', 'admin'];
    const [isOtherRole, setIsOtherRole] = useState(false);
    const [customRole, setCustomRole] = useState('');
    const [formData, setFormData] = useState({ email: '', name: '', role: '', isAdmin: false });

    const handleSave = async () => {
        let finalRole = formData.role;

        if (isOtherRole) {
            if (!customRole.trim()) {
                alert("Please enter a custom role.");
                return;
            }
            const normalizedCustom = customRole.trim().toLowerCase();
            if (PREDEFINED_ROLES.includes(normalizedCustom)) {
                alert(`"${normalizedCustom}" is already a standard role. Please select it from the dropdown instead.`);
                return;
            }
            finalRole = normalizedCustom;
        }

        // Validation
        if (!formData.email || !formData.name || !finalRole) {
            alert("Please fill in all fields (Email, Name, and Role).");
            return;
        }

        // Construct payload: Map email input to username column.
        // We DO NOT include 'email' key because the table doesn't have it.
        const submissionData = {
            username: formData.email,
            name: formData.name,
            role: finalRole,
            isAdmin: finalRole === 'admin' || formData.isAdmin || false
        };

        let result;
        if (editingId) {
            result = await updateUser(editingId, submissionData);
        } else {
            result = await addUser(submissionData);
        }

        if (result.success) {
            alert(editingId ? "User updated successfully!" : "User added successfully! Don't forget to create the Auth account in Supabase.");
            setEditingId(null);
            setIsAdding(false);
            setFormData({ email: '', name: '', role: '', isAdmin: false });
            setIsOtherRole(false);
            setCustomRole('');
        } else {
            alert(`Operation failed: ${result.error}`);
        }
    };

    const startEdit = (user) => {
        setEditingId(user.id);
        const isStandard = PREDEFINED_ROLES.includes(user.role);

        setFormData({
            email: user.email || user.username,
            name: user.name,
            role: isStandard ? user.role : 'other',
            isAdmin: user.isAdmin
        });

        if (!isStandard) {
            setIsOtherRole(true);
            setCustomRole(user.role);
        } else {
            setIsOtherRole(false);
            setCustomRole('');
        }

        setIsAdding(true);
    };

    const cancel = () => {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ email: '', name: '', role: '', isAdmin: false });
        setIsOtherRole(false);
        setCustomRole('');
    };

    return (
        <div className={`px-8 md:px-12 py-6 max-w-7xl mx-auto space-y-5 animate-in fade-in duration-700 ${isEmbedded ? 'px-0 py-0' : ''}`}>
            {!isEmbedded && (
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <header className="space-y-1">
                        <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Users</h1>
                        <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-lg">
                            Manage user profiles and functional roles.
                            New users must be added via the Supabase Dashboard.
                        </p>
                    </header>
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
                </div>
            )}

            {isAdding && (
                <Card className="shadow-2xl border-none ring-1 ring-slate-200 rounded-[2rem] overflow-hidden">
                    <CardHeader className="bg-primary/5 border-b border-slate-100 p-5">
                        <CardTitle className="text-lg font-black text-slate-800 uppercase tracking-tight">
                            Edit User Profile
                        </CardTitle>
                        <CardDescription className="text-xs font-bold text-slate-400">Update the user's display name and functional role.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-5 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black uppercase tracking-widest text-slate-400">Email (System ID)</label>
                                <Input
                                    value={formData.email}
                                    readOnly
                                    disabled
                                    className="bg-slate-100 border-none h-12 rounded-xl font-bold text-sm text-slate-500 cursor-not-allowed"
                                />
                                <p className="text-[10px] text-slate-400 mt-1 italic">Email can only be changed in Supabase Dashboard.</p>
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
                                <div className="space-y-3">
                                    <select
                                        value={formData.role}
                                        onChange={e => {
                                            const newRole = e.target.value;
                                            setIsOtherRole(newRole === 'other');
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
                                        <option value="other">Other...</option>
                                    </select>

                                    {isOtherRole && (
                                        <div className="animate-in slide-in-from-top-2 duration-300">
                                            <Input
                                                value={customRole}
                                                onChange={e => setCustomRole(e.target.value)}
                                                placeholder="Enter custom role"
                                                className="bg-white border-2 border-primary/20 h-10 rounded-xl focus-visible:ring-primary font-bold text-xs"
                                            />
                                        </div>
                                    )}
                                </div>
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
                                            </div>
                                        </div>

                                        <div className="hidden lg:flex items-center gap-6 px-6 border-x border-slate-100 h-8">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Email:</span>
                                                <code className="bg-slate-50 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-600 border border-slate-100">{u.email || u.username}</code>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1 shrink-0">
                                            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600" onClick={() => startEdit(u)}>
                                                <UserCog className="w-4 h-4" />
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
