import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const AdminContext = createContext(undefined);

export const AdminProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial load and Realtime Subscriptions
    useEffect(() => {
        fetchData();

        // Realtime subscription for users table
        const usersSubscription = supabase
            .channel('public:users')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, (payload) => {
                console.log("[AdminContext] User change detected:", payload);
                if (payload.eventType === 'INSERT') {
                    const newUser = { ...payload.new, isAdmin: payload.new.role === 'admin' };
                    setUsers(prev => {
                        // Avoid duplicates if we already added it optimistically
                        if (prev.find(u => u.id === newUser.id)) return prev;
                        return [...prev, newUser];
                    });
                } else if (payload.eventType === 'UPDATE') {
                    const updatedUser = { ...payload.new, isAdmin: payload.new.role === 'admin' };
                    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
                } else if (payload.eventType === 'DELETE') {
                    setUsers(prev => prev.filter(u => u.id !== payload.old.id));
                }
            })
            .subscribe();

        // Realtime subscription for templates table
        const templatesSubscription = supabase
            .channel('public:templates')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'templates' }, (payload) => {
                console.log("[AdminContext] Template change detected:", payload);
                if (payload.eventType === 'INSERT') {
                    const newTemplate = { ...payload.new, input_type: ['text', 'file'] };
                    setTemplates(prev => {
                        if (prev.find(t => t.id === newTemplate.id)) return prev;
                        return [...prev, newTemplate].sort((a, b) => (a.order || 0) - (b.order || 0));
                    });
                } else if (payload.eventType === 'UPDATE') {
                    const updatedTemplate = { ...payload.new, input_type: payload.new.input_type || ['text', 'file'] };
                    setTemplates(prev => prev.map(t => t.id === updatedTemplate.id ? updatedTemplate : t).sort((a, b) => (a.order || 0) - (b.order || 0)));
                } else if (payload.eventType === 'DELETE') {
                    setTemplates(prev => prev.filter(t => t.id !== payload.old.id));
                }
            })
            .subscribe();

        return () => {
            supabase.removeChannel(usersSubscription);
            supabase.removeChannel(templatesSubscription);
        };
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Users
            const { data: usersData, error: usersError } = await supabase.from('users').select('*');
            if (!usersError && usersData) {
                setUsers(usersData.map(u => ({
                    ...u,
                    isAdmin: u.role === 'admin'
                })));
            }

            // Fetch Templates
            const { data: templatesData, error: templatesError } = await supabase
                .from('templates')
                .select('*')
                .order('order', { ascending: true });

            if (!templatesError && templatesData) {
                const normalizedTemplates = templatesData.map(t => ({
                    ...t,
                    input_type: t.input_type || ['text', 'file']
                }));
                setTemplates(normalizedTemplates);
            }
        } catch (error) {
            console.error("Error in fetchData:", error);
        } finally {
            setLoading(false);
        }
    };

    // --- Users Operations ---
    // --- Users Operations ---
    const addUser = async (user) => {
        try {
            const { isAdmin, ...dbUser } = user;
            const { data, error } = await supabase.from('users').insert([dbUser]).select();
            if (error) {
                console.error("Supabase Error adding user:", error);
                return { success: false, error: error.message };
            }
            if (data) {
                setUsers(prev => [...prev, { ...data[0], isAdmin: data[0].role === 'admin' }]);
                return { success: true };
            }
        } catch (error) {
            console.error("Error adding user:", error);
            return { success: false, error: error.message };
        }
    };

    const updateUser = async (id, updates) => {
        try {
            const { isAdmin, ...dbUpdates } = updates;
            // Optimistic update
            const originalUsers = [...users];
            setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));

            const { error } = await supabase.from('users').update(dbUpdates).eq('id', id);

            if (error) {
                // Revert on error
                setUsers(originalUsers);
                console.error("Supabase Error updating user:", error);
                return { success: false, error: error.message };
            }
            return { success: true };
        } catch (error) {
            console.error("Error updating user:", error);
            return { success: false, error: error.message };
        }
    };

    const deleteUser = async (id) => {
        try {
            // Optimistic update
            const originalUsers = [...users];
            setUsers(prev => prev.filter(u => u.id !== id));

            const { error } = await supabase.from('users').delete().eq('id', id);

            if (error) {
                // Revert on error
                setUsers(originalUsers);
                console.error("Supabase Error deleting user:", error);
                return { success: false, error: error.message };
            }
            return { success: true };
        } catch (error) {
            console.error("Error deleting user:", error);
            return { success: false, error: error.message };
        }
    };

    // --- Templates Operations ---
    const addTemplate = async (templateData) => {
        const newTemplate = typeof templateData === 'string'
            ? { title: templateData }
            : templateData;

        try {
            const maxOrder = templates.reduce((max, t) => Math.max(max, t.order || 0), 0);
            const { data, error } = await supabase
                .from('templates')
                .insert([{
                    title: newTemplate.title,
                    description: newTemplate.description || '',
                    attachment_url: newTemplate.attachment_url || '',
                    order: maxOrder + 1
                }])
                .select();

            if (error) throw error;
            if (data) {
                setTemplates(prev => [...prev, { ...data[0], input_type: ['text', 'file'] }]);
            }
        } catch (error) {
            console.error("Error adding template:", error);
        }
    };

    const updateTemplate = async (id, updates) => {
        try {
            const { input_type, ...dbUpdates } = updates;
            setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
            const { error } = await supabase.from('templates').update(dbUpdates).eq('id', id);
            if (error) throw error;
        } catch (error) {
            console.error("Error updating template:", error);
        }
    };

    const deleteTemplate = async (id) => {
        try {
            setTemplates(prev => prev.filter(t => t.id !== id));
            const { error } = await supabase.from('templates').delete().eq('id', id);
            if (error) throw error;
        } catch (error) {
            console.error("Error deleting template:", error);
        }
    };

    return (
        <AdminContext.Provider
            value={{
                users, addUser, updateUser, deleteUser,
                templates, addTemplate, updateTemplate, deleteTemplate,
                loading
            }}
        >
            {children}
        </AdminContext.Provider>
    );
};

export const useAdmin = () => {
    const ctx = useContext(AdminContext);
    if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
    return ctx;
};


