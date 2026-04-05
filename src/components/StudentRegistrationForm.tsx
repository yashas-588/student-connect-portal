import { useState } from "react";
import { User, Mail, Phone, Users, GraduationCap } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import WebcamCapture from "./WebcamCapture";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

interface FormData {
  studentName: string;
  studentEmail: string;
  studentPhone: string;
  rollNumber: string;
  department: string;
  parentName: string;
  parentEmail: string;
  parentPhone: string;
  photo: string;
}

const initialForm: FormData = {
  studentName: "",
  studentEmail: "",
  studentPhone: "",
  rollNumber: "",
  department: "",
  parentName: "",
  parentEmail: "",
  parentPhone: "",
  photo: "",
};

const StudentRegistrationForm = () => {
  const [form, setForm] = useState<FormData>(initialForm);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.studentName || !form.studentEmail || !form.studentPhone) {
      toast.error("Please fill in all required student fields.");
      return;
    }
    if (!form.photo) {
      toast.error("Please capture a photo of the student.");
      return;
    }
    setSubmitting(true);
    try {
      await addDoc(collection(db, "students"), {
        ...form,
        createdAt: serverTimestamp(),
      });
      toast.success("Student registered successfully!");
      setForm(initialForm);
    } catch {
      toast.error("Failed to register. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl border-border/50 shadow-lg">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
          <GraduationCap className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">Student Registration</CardTitle>
        <CardDescription>Capture student details and photo for smart attendance</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Photo */}
          <div className="flex justify-center">
            <WebcamCapture onCapture={(img) => setForm((p) => ({ ...p, photo: img }))} capturedImage={form.photo || null} />
          </div>

          <Separator />

          {/* Student Details */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <User className="w-4 h-4" /> Student Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="studentName">Full Name *</Label>
                <Input id="studentName" placeholder="John Doe" value={form.studentName} onChange={handleChange("studentName")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input id="rollNumber" placeholder="CS2024001" value={form.rollNumber} onChange={handleChange("rollNumber")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="studentEmail">Email *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="studentEmail" type="email" className="pl-9" placeholder="student@email.com" value={form.studentEmail} onChange={handleChange("studentEmail")} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="studentPhone">Phone *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="studentPhone" type="tel" className="pl-9" placeholder="+91 98765 43210" value={form.studentPhone} onChange={handleChange("studentPhone")} />
                </div>
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="department">Department</Label>
                <Input id="department" placeholder="Computer Science" value={form.department} onChange={handleChange("department")} />
              </div>
            </div>
          </div>

          <Separator />

          {/* Parent Details */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
              <Users className="w-4 h-4" /> Parent / Guardian Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <Label htmlFor="parentName">Parent Name</Label>
                <Input id="parentName" placeholder="Parent full name" value={form.parentName} onChange={handleChange("parentName")} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="parentEmail">Parent Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="parentEmail" type="email" className="pl-9" placeholder="parent@email.com" value={form.parentEmail} onChange={handleChange("parentEmail")} />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="parentPhone">Parent Phone</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input id="parentPhone" type="tel" className="pl-9" placeholder="+91 98765 43210" value={form.parentPhone} onChange={handleChange("parentPhone")} />
                </div>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full h-12 text-base font-semibold" disabled={submitting}>
            {submitting ? "Registering..." : "Register Student"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default StudentRegistrationForm;
