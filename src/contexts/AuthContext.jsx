import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const AuthContext = createContext(undefined);

// Mock Users Data
const MOCK_USERS = [
    { id: "1", username: "admin", name: "System Admin", role: "admin", isAdmin: true },
    { id: "2", username: "manager", name: "Project Manager", role: "manager", isAdmin: false },
    { id: "3", username: "dev", name: "John Developer", role: "developer", isAdmin: false },
    { id: "4", username: "qa", name: "Sarah QA", role: "qa", isAdmin: false },
];

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Restore session
        const storedUser = localStorage.getItem("kt_user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = async (username, type) => {
        // Try to find user in Supabase
        const { data: dbUsers, error } = await supabase
            .from('users')
            .select('*')
            .eq('username', username);

        let found = null;
        if (!error && dbUsers && dbUsers.length > 0) {
            found = dbUsers[0];
        } else {
            // Fallback to Mock Data
            found = MOCK_USERS.find(u => u.username === username);
        }

        if (found) {
            // Check if user has permission for the requested view
            if (type === "admin" && !found.isAdmin) return false;
            if (type === "user" && found.isAdmin) return false;

            setUser(found);
            localStorage.setItem("kt_user", JSON.stringify(found));
            return true;
        }
        return false;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("kt_user");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
