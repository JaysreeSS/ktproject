import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";


// Mock data structures
const initialUsers = [
    { id: "1", username: "admin", name: "System Admin", role: "admin", isAdmin: true },
    { id: "2", username: "manager", name: "Project Manager", role: "manager", isAdmin: false },
    { id: "3", username: "dev", name: "John Developer", role: "developer", isAdmin: false },
    { id: "4", username: "qa", name: "Sarah QA", role: "qa", isAdmin: false },
];

const initialTemplates = [
    { id: "t1", title: "Project Overview & Scope", sections: [], description: "Define the project's high-level goals and limits." },
    { id: "t2", title: "System Architecture & Flows", sections: [], description: "Detail technical architecture and data flows." },
    { id: "t3", title: "Daily Workflows & Responsibilities", sections: [] },
    { id: "t4", title: "Known Issues, Risks, and Dependencies", sections: [] },
    { id: "t5", title: "Required Tools/Access (Reference Only)", sections: [] },
    { id: "t6", title: "Supporting Documents", sections: [] },
];

const AdminContext = createContext(undefined);

export const AdminProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);

    // Initial load
    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch Users
            const { data: usersData, error: usersError } = await supabase.from('users').select('*');
            if (!usersError && usersData && usersData.length > 0) {
                setUsers(usersData);
            } else {
                console.log("Using fallback/local users due to:", usersError || "No users found in DB");
                setUsers(initialUsers);
            }

            // Fetch Templates
            const { data: templatesData, error: templatesError } = await supabase
                .from('templates')
                .select('*')
                .order('created_at', { ascending: true });

            if (!templatesError && templatesData && templatesData.length > 0) {
                setTemplates(templatesData);
            } else {
                console.error("Using fallback templates due to:", templatesError || "No templates found in DB");
                setTemplates(initialTemplates);
            }

        } catch (error) {
            console.error("Error in fetchData:", error);
            // Fallbacks in case of major error
            setUsers(initialUsers);
            setTemplates(initialTemplates);
        } finally {
            setLoading(false);
        }
    };

    // --- Users Operations ---
    const addUser = async (user) => {
        try {
            // Optimistic update
            const tempId = Date.now().toString();
            // setUsers(prev => [...prev, { ...user, id: tempId }]); 

            const { data, error } = await supabase.from('users').insert([user]).select();
            if (error) throw error;
            if (data) {
                setUsers(prev => [...prev, data[0]]);
            }
        } catch (error) {
            console.error("Error adding user:", error);
            // Revert optimistic update if needed
        }
    };

    const updateUser = async (id, updates) => {
        try {
            setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
            const { error } = await supabase.from('users').update(updates).eq('id', id);
            if (error) throw error;
        } catch (error) {
            console.error("Error updating user:", error);
        }
    };

    const deleteUser = async (id) => {
        try {
            setUsers(prev => prev.filter(u => u.id !== id));
            const { error } = await supabase.from('users').delete().eq('id', id);
            if (error) throw error;
        } catch (error) {
            console.error("Error deleting user:", error);
        }
    };

    const resetUsers = () => {
        // Not really applicable with DB, maybe re-fetch?
        fetchData();
    };


    // --- Templates Operations ---
    const addTemplate = async (templateData) => {
        // templateData can be a string (title) or object
        const newTemplate = typeof templateData === 'string'
            ? { title: templateData, sections: [] } // Legacy support if just title passed
            : templateData;

        try {
            const { data, error } = await supabase
                .from('templates')
                .insert([{
                    title: newTemplate.title,
                    description: newTemplate.description || '',
                    attachment_url: newTemplate.attachment_url || '',
                    // created_at is auto
                }])
                .select();

            if (error) throw error;
            if (data) {
                setTemplates(prev => [...prev, data[0]]);
            }
        } catch (error) {
            console.error("Error adding template:", error);
        }
    };

    const updateTemplate = async (id, updates) => {
        try {
            setTemplates(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
            const { error } = await supabase.from('templates').update(updates).eq('id', id);
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
                users, addUser, updateUser, deleteUser, resetUsers,
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
