import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client (replace with your actual URL and anon key)
const supabaseUrl = "https://YOUR_SUPABASE_PROJECT.supabase.co";
const supabaseAnonKey = "YOUR_PUBLIC_ANON_KEY";
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const ProjectContext = createContext(undefined);

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    // Load projects from Supabase on mount
    useEffect(() => {
        const fetchProjects = async () => {
            const { data, error } = await supabase.from("projects").select("*");
            if (error) {
                console.error("Supabase fetch error:", error);
                // Fallback to localStorage if Supabase fails
                const stored = localStorage.getItem("kt_projects");
                if (stored) setProjects(JSON.parse(stored));
            } else {
                setProjects(data);
                localStorage.setItem("kt_projects", JSON.stringify(data));
            }
            setLoading(false);
        };
        fetchProjects();
    }, []);

    // Persist changes to localStorage whenever projects change (after initial load)
    useEffect(() => {
        if (!loading) {
            localStorage.setItem("kt_projects", JSON.stringify(projects));
        }
    }, [projects, loading]);

    // Create a new project and sync to Supabase
    const createProject = async (projectData) => {
        const { data, error } = await supabase.from("projects").insert([projectData]).single();
        if (error) {
            console.error("Supabase insert error:", error);
            // Fallback: generate a local ID and add locally
            const newProject = { ...projectData, id: "p_" + Date.now().toString() };
            setProjects((prev) => [...prev, newProject]);
            return newProject;
        }
        setProjects((prev) => [...prev, data]);
        return data;
    };

    // Update project status (e.g., Completed)
    const updateProjectStatus = async (projectId, status) => {
        const { data, error } = await supabase.from("projects").update({ status }).eq("id", projectId).single();
        if (error) {
            console.error("Supabase update status error:", error);
            // Fallback local update
            setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, status } : p)));
            return;
        }
        setProjects((prev) => prev.map((p) => (p.id === projectId ? data : p)));
    };

    // Update a section's status/content and sync the whole project
    const updateSectionStatus = async (projectId, sectionId, status, content = null) => {
        setProjects((prev) =>
            prev.map((p) => {
                if (p.id === projectId) {
                    const updatedSections = p.sections.map((s) => {
                        if (s.id === sectionId) {
                            return { ...s, status, ...(content !== null && { content }) };
                        }
                        return s;
                    });
                    const understoodCount = updatedSections.filter((s) => s.status === "Understood").length;
                    const completion = Math.round((understoodCount / updatedSections.length) * 100);
                    // Sync to Supabase (replace whole project row)
                    supabase.from("projects").update({ sections: updatedSections, completion }).eq("id", projectId);
                    return { ...p, sections: updatedSections, completion };
                }
                return p;
            })
        );
    };

    // Add a comment to a section and sync
    const addComment = async (projectId, sectionId, comment) => {
        setProjects((prev) =>
            prev.map((p) => {
                if (p.id === projectId) {
                    const updatedSections = p.sections.map((s) => {
                        if (s.id === sectionId) {
                            const newComment = { ...comment, id: Date.now().toString(), timestamp: new Date().toISOString() };
                            return { ...s, comments: [...s.comments, newComment] };
                        }
                        return s;
                    });
                    // Sync to Supabase
                    supabase.from("projects").update({ sections: updatedSections }).eq("id", projectId);
                    return { ...p, sections: updatedSections };
                }
                return p;
            })
        );
    };

    // Delete a project both locally and in Supabase
    const deleteProject = async (projectId) => {
        const { error } = await supabase.from("projects").delete().eq("id", projectId);
        if (error) {
            console.error("Supabase delete error:", error);
            // Fallback local delete
            setProjects((prev) => prev.filter((p) => p.id !== projectId));
            return;
        }
        setProjects((prev) => prev.filter((p) => p.id !== projectId));
    };

    return (
        <ProjectContext.Provider
            value={{ projects, createProject, updateProjectStatus, updateSectionStatus, addComment, deleteProject, loading }}
        >
            {children}
        </ProjectContext.Provider>
    );
};

export const useProjects = () => {
    const ctx = useContext(ProjectContext);
    if (!ctx) throw new Error("useProjects must be used within ProjectProvider");
    return ctx;
};
