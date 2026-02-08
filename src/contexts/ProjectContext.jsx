import React, { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

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

                    // Bug Fix: Transition status forward if work has started
                    let nextStatus = p.status || 'Not Started';
                    // Check against 'Not Started' OR 'Active' (default fallback in some views)
                    if ((nextStatus === 'Not Started' || nextStatus === 'Active') && (status === 'Ready for Review' || status === 'Understood')) {
                        nextStatus = 'In Progress';
                    }

                    // Sync to Supabase
                    supabase.from("projects").update({
                        sections: updatedSections,
                        completion,
                        status: nextStatus
                    }).eq("id", projectId);

                    return { ...p, sections: updatedSections, completion, status: nextStatus };
                }
                return p;
            })
        );
    };

    // Remove an attachment from a section
    const removeAttachment = async (projectId, sectionId, attachmentId) => {
        setProjects((prev) =>
            prev.map((p) => {
                if (p.id === projectId) {
                    const updatedSections = p.sections.map((s) => {
                        if (s.id === sectionId) {
                            return {
                                ...s,
                                attachments: (s.attachments || []).filter(a => a.id !== attachmentId)
                            };
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

    // Update member details (e.g., functional role)
    const updateMember = async (projectId, memberId, updates) => {
        setProjects((prev) =>
            prev.map((p) => {
                if (p.id === projectId) {
                    const updatedMembers = p.members.map((m) => {
                        if (m.userId === memberId || m.id === memberId) {
                            return { ...m, ...updates };
                        }
                        return m;
                    });
                    // Sync to Supabase
                    supabase.from("projects").update({ members: updatedMembers }).eq("id", projectId);
                    return { ...p, members: updatedMembers };
                }
                return p;
            })
        );
    };

    // Add a new member to the project
    const addMember = async (projectId, memberData) => {
        setProjects((prev) =>
            prev.map((p) => {
                if (p.id === projectId) {
                    const updatedMembers = [...p.members, memberData];
                    // Sync to Supabase
                    supabase.from("projects").update({ members: updatedMembers }).eq("id", projectId);
                    return { ...p, members: updatedMembers };
                }
                return p;
            })
        );
    };

    // Add an attachment to a section and sync
    const addAttachment = async (projectId, sectionId, attachment) => {
        setProjects((prev) =>
            prev.map((p) => {
                if (p.id === projectId) {
                    const updatedSections = p.sections.map((s) => {
                        if (s.id === sectionId) {
                            const newAttachment = { ...attachment, id: Date.now().toString(), uploadedAt: new Date().toISOString() };
                            return { ...s, attachments: [...(s.attachments || []), newAttachment] };
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

    // Add a new section to a project
    const addSection = async (projectId, sectionData) => {
        setProjects((prev) =>
            prev.map((p) => {
                if (p.id === projectId) {
                    const newSection = {
                        ...sectionData,
                        id: 'sec_' + Date.now().toString(),
                        status: 'Draft',
                        content: '',
                        attachments: [],
                        comments: []
                    };
                    const updatedSections = [...p.sections, newSection];
                    // Sync to Supabase
                    supabase.from("projects").update({ sections: updatedSections }).eq("id", projectId);
                    return { ...p, sections: updatedSections };
                }
                return p;
            })
        );
    };

    // Remove a section from a project
    const removeSection = async (projectId, sectionId) => {
        setProjects((prev) =>
            prev.map((p) => {
                if (p.id === projectId) {
                    const updatedSections = p.sections.filter(s => s.id !== sectionId);
                    // Recalculate completion
                    const understoodCount = updatedSections.filter((s) => s.status === "Understood").length;
                    const completion = updatedSections.length > 0 ? Math.round((understoodCount / updatedSections.length) * 100) : 0;

                    // Sync to Supabase
                    supabase.from("projects").update({ sections: updatedSections, completion }).eq("id", projectId);
                    return { ...p, sections: updatedSections, completion };
                }
                return p;
            })
        );
    };

    // Update generic section details (e.g., contributor assignment)
    const updateSection = async (projectId, sectionId, updates) => {
        setProjects((prev) =>
            prev.map((p) => {
                if (p.id === projectId) {
                    const updatedSections = p.sections.map((s) => {
                        if (s.id === sectionId) {
                            return { ...s, ...updates };
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

    // Remove a member from the project
    const removeMember = async (projectId, memberId) => {
        setProjects((prev) =>
            prev.map((p) => {
                if (p.id === projectId) {
                    const updatedMembers = p.members.filter((m) => m.userId !== memberId && m.id !== memberId);
                    // Sync to Supabase
                    supabase.from("projects").update({ members: updatedMembers }).eq("id", projectId);
                    return { ...p, members: updatedMembers };
                }
                return p;
            })
        );
    };

    return (
        <ProjectContext.Provider
            value={{
                projects,
                createProject,
                updateProjectStatus,
                updateSectionStatus,
                addComment,
                deleteProject,
                updateMember,
                addMember,
                removeMember,
                addAttachment,
                removeAttachment,
                addSection,
                removeSection,
                updateSection,
                loading
            }}
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
