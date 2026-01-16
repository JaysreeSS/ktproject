import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ShieldCheck, User, ArrowRight, Sparkles, Eye, EyeOff, ChevronLeft } from "lucide-react";

export default function Login() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Determine context from URL
    const isAdminPath = location.pathname === '/admin-login';
    const isUserPath = location.pathname === '/user-login';

    // Default role based on path, fallback to 'user' for dev/testing
    const [roleType, setRoleType] = useState(isAdminPath ? "admin" : "user");

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Ensure role matches path if it changes (though usually component remounts)
    useEffect(() => {
        if (isAdminPath) setRoleType("admin");
        else if (isUserPath) setRoleType("user");
    }, [isAdminPath, isUserPath]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        // Add a slight delay for "premium" feel
        await new Promise(r => setTimeout(r, 800));

        const success = await login(username, roleType);
        setIsLoading(false);
        if (success) {
            navigate(roleType === "admin" ? "/admin" : "/dashboard");
        } else {
            setError("Invalid credentials or role mismatch. Try 'admin' for Admin or 'dev' for User.");
        }
    };

    const roleLabel = roleType === "admin" ? "Administrator" : "Associate";

    return (
        <div className="flex items-center justify-center min-h-screen relative overflow-hidden bg-background">
            {/* Background Decorations */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />

            <div className="w-full max-w-[450px] p-4 relative z-10 transition-all duration-700 animate-in fade-in slide-in-from-bottom-8">
                {/* Back Navigation */}
                <div className="mb-6">
                    <Button
                        variant="ghost"
                        onClick={() => navigate('/')}
                        className="text-muted-foreground hover:text-foreground -ml-4"
                    >
                        <ChevronLeft className="w-4 h-4 mr-1" /> Back to Role Selection
                    </Button>
                </div>

                <div className="text-center mb-8 space-y-4">
                    <img src="/src/assets/logo.png" alt="Company Logo" className="h-16 mx-auto mb-6" />
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Knowledge Transfer Portal</h1>
                </div>

                <Card className="border border-border shadow-xl rounded-xl overflow-hidden bg-card">
                    <CardHeader className="pt-8 pb-6 text-center">
                        <CardTitle className="text-2xl font-bold text-foreground">
                            {roleType === 'admin' ? 'Admin Access' : 'Associate Login'}
                        </CardTitle>
                        <CardDescription className="text-muted-foreground font-medium font-sans">
                            Sign in to your {roleLabel.toLowerCase()} account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="px-8 pb-8">
                        <form onSubmit={handleLogin} className="space-y-6">


                            {/* Role Selection (Only shown if path is not specific) */}
                            {(!isAdminPath && !isUserPath) && (
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Identity Type</Label>
                                    <RadioGroup
                                        defaultValue="user"
                                        value={roleType}
                                        onValueChange={setRoleType}
                                        className="grid grid-cols-2 gap-4"
                                    >
                                        <Label
                                            htmlFor="r-admin"
                                            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer hover:bg-secondary/50 ${roleType === "admin" ? "border-primary bg-secondary text-primary shadow-sm" : "border-border opacity-70"
                                                }`}
                                        >
                                            <RadioGroupItem value="admin" id="r-admin" className="sr-only" />
                                            <ShieldCheck className="w-6 h-6 mb-2" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Admin</span>
                                        </Label>
                                        <Label
                                            htmlFor="r-user"
                                            className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all cursor-pointer hover:bg-secondary/50 ${roleType === "user" ? "border-primary bg-secondary text-primary shadow-sm" : "border-border opacity-70"
                                                }`}
                                        >
                                            <RadioGroupItem value="user" id="r-user" className="sr-only" />
                                            <User className="w-6 h-6 mb-2" />
                                            <span className="text-xs font-bold uppercase tracking-wider">Associate</span>
                                        </Label>
                                    </RadioGroup>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Username</Label>
                                    <Input
                                        id="username"
                                        placeholder="Enter your system ID"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="h-11 rounded-lg bg-background border-input focus:ring-1 focus:ring-primary transition-all font-medium"
                                        required
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground ml-1">Password</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="••••••••"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="h-11 rounded-lg bg-background border-input focus:ring-1 focus:ring-primary transition-all pr-10"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                        >
                                            {showPassword ? (
                                                <EyeOff className="w-4 h-4" />
                                            ) : (
                                                <Eye className="w-4 h-4" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {error && (
                                <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-[10px] font-bold text-center uppercase tracking-wider animate-in fade-in zoom-in-95 duration-300">
                                    {error}
                                </div>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-bold uppercase tracking-wider shadow-lg transition-all"
                            >
                                {isLoading ? (
                                    <span className="flex items-center gap-2">
                                        Authenticating...
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        Login <ArrowRight className="w-4 h-4" />
                                    </span>
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center mt-8 text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Secure Corporate Gateway
                </p>
            </div>
        </div>
    );
}

function Badge({ children, variant, className }) {
    return (
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${className}`}>
            {children}
        </span>
    );
}
