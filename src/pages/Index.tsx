import { useState } from "react";
import { GraduationCap, LayoutDashboard, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AttendanceDashboard from "@/components/AttendanceDashboard";
import StudentRegistrationForm from "@/components/StudentRegistrationForm";

const Index = () => {
  const [view, setView] = useState<"dashboard" | "register">("dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20">
      {/* Decorative gradient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="border-b border-border/30 bg-card/30 backdrop-blur-xl sticky top-0 z-20">
        <div className="container mx-auto flex items-center justify-between py-4 px-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">Smart Attendance AI System</h1>
              <p className="text-xs text-muted-foreground">AI-Powered Face Recognition</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={view === "dashboard" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("dashboard")}
              className="gap-1.5"
            >
              <LayoutDashboard className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
            <Button
              variant={view === "register" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("register")}
              className="gap-1.5"
            >
              <UserPlus className="w-4 h-4" />
              <span className="hidden sm:inline">Register</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto py-8 px-4 relative z-10">
        {view === "dashboard" ? (
          <AttendanceDashboard />
        ) : (
          <div className="flex justify-center animate-fade-in">
            <StudentRegistrationForm />
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;
