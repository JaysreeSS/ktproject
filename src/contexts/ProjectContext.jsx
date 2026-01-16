import React, { createContext, useContext, useState, useEffect } from "react";

const ProjectContext = createContext(undefined);

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);

    // Load from localStorage on mount
    useEffect(() => {
        const storedProjects = localStorage.getItem("kt_projects");
        if (storedProjects) {
            setProjects(JSON.parse(storedProjects));
        }
    }, []);

    // Persist changes
    useEffect(() => {
        localStorage.setItem("kt_projects", JSON.stringify(projects));
    }, [projects]);

    const createProject = (projectData) => {
        const newProject = {
            ...projectData,
            id: "p_" + Date.now().toString(),
            status: "Not Started",
            completion: 0,
            createdAt: new Date().toISOString(),
            sections: projectData.sections.map(s => ({
                ...s,
                status: "Draft", // Draft, Ready for Review, Needs Clarification, Updated, Not Covered, Understood
                content: "",
                attachments: [],
                comments: []
            }))
        };
        setProjects(prev => [...prev, newProject]);
        return newProject;
    };

    const updateProjectStatus = (projectId, status) => {
        setProjects(prev => prev.map(p => p.id === projectId ? { ...p, status } : p));
    };

    const updateSectionStatus = (projectId, sectionId, status, content = null) => {
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                const updatedSections = p.sections.map(s => {
                    if (s.id === sectionId) {
                        return { ...s, status, ...(content !== null && { content }) };
                    }
                    return s;
                });

                // Calculate completion
                const understoodCount = updatedSections.filter(s => s.status === "Understood").length;
                const completion = Math.round((understoodCount / updatedSections.length) * 100);

                return { ...p, sections: updatedSections, completion };
            }
            return p;
        }));
    };

    const addComment = (projectId, sectionId, comment) => {
        setProjects(prev => prev.map(p => {
            if (p.id === projectId) {
                return {
                    ...p,
                    sections: p.sections.map(s => {
                        if (s.id === sectionId) {
                            return {
                                ...s,
                                comments: [...s.comments, { ...comment, id: Date.now().toString(), timestamp: new Date().toISOString() }]
                            };
                        }
                        return s;
                    })
                };
            }
            return p;
        }));
    };

    const deleteProject = (projectId) => {
        setProjects(prev => prev.filter(p => p.id !== projectId));
    };

    return (
        <ProjectContext.Provider value={{
            projects,
            createProject,
            updateProjectStatus,
            updateSectionStatus,
            addComment,
            deleteProject
        }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProjects = () => {
    const ctx = useContext(ProjectContext);
    if (!ctx) throw new Error("useProjects must be used within ProjectProvider");
    return ctx;
};
