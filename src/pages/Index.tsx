import StudentRegistrationForm from "@/components/StudentRegistrationForm";
import { GraduationCap } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto flex items-center gap-3 py-4 px-4">
          <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-tight">Smart Attendance</h1>
            <p className="text-xs text-muted-foreground">AI-Powered Attendance System</p>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="container mx-auto flex justify-center py-10 px-4">
        <StudentRegistrationForm />
      </main>
    </div>
  );
};

export default Index;
