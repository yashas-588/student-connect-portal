import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Users, Clock, BookOpen, Activity } from "lucide-react";

interface AttendanceRecord {
  id: string;
  name: string;
  rollNumber: string;
  subject: string;
  time: string;
  status: "Present" | "Late";
  photo: string;
}

interface TimetableSlot {
  subject: string;
  startHour: number;
  endHour: number;
}

const timetable: TimetableSlot[] = [
  { subject: "Data Structures", startHour: 9, endHour: 10 },
  { subject: "Operating Systems", startHour: 10, endHour: 11 },
  { subject: "Computer Networks", startHour: 11, endHour: 12 },
  { subject: "Database Systems", startHour: 13, endHour: 14 },
  { subject: "Machine Learning", startHour: 14, endHour: 15 },
  { subject: "Software Engineering", startHour: 15, endHour: 16 },
];

const sampleRecords: AttendanceRecord[] = [
  { id: "1", name: "Aarav Sharma", rollNumber: "CS2024001", subject: "Data Structures", time: "09:02 AM", status: "Present", photo: "" },
  { id: "2", name: "Priya Patel", rollNumber: "CS2024002", subject: "Data Structures", time: "09:15 AM", status: "Late", photo: "" },
  { id: "3", name: "Rohan Gupta", rollNumber: "CS2024003", subject: "Data Structures", time: "09:01 AM", status: "Present", photo: "" },
  { id: "4", name: "Sneha Reddy", rollNumber: "CS2024004", subject: "Data Structures", time: "09:00 AM", status: "Present", photo: "" },
  { id: "5", name: "Vikram Singh", rollNumber: "CS2024005", subject: "Data Structures", time: "09:18 AM", status: "Late", photo: "" },
  { id: "6", name: "Ananya Iyer", rollNumber: "CS2024006", subject: "Data Structures", time: "09:03 AM", status: "Present", photo: "" },
];

function getActiveClass(): TimetableSlot | null {
  const now = new Date();
  const hour = now.getHours();
  return timetable.find((slot) => hour >= slot.startHour && hour < slot.endHour) || null;
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const StatCard = ({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  accent?: string;
}) => (
  <Card className="border-border/30 bg-card/40 backdrop-blur-xl shadow-lg">
    <CardContent className="flex items-center gap-4 p-5">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: accent || "hsl(var(--primary) / 0.15)" }}
      >
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold leading-tight">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const AttendanceDashboard = () => {
  const [records] = useState<AttendanceRecord[]>(sampleRecords);
  const [activeClass, setActiveClass] = useState<TimetableSlot | null>(getActiveClass());
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setActiveClass(getActiveClass());
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  const presentCount = records.filter((r) => r.status === "Present").length;
  const lateCount = records.filter((r) => r.status === "Late").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Active Class Banner */}
      <Card className="border-primary/30 bg-primary/5 backdrop-blur-xl shadow-lg overflow-hidden relative">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-accent/10 pointer-events-none" />
        <CardContent className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-5 relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Current Class
              </p>
              <p className="text-lg font-bold">
                {activeClass ? activeClass.subject : "No Active Class"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>
              {currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
            </span>
            {activeClass && (
              <Badge variant="default" className="ml-2 bg-accent text-accent-foreground">
                Live
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total" value={records.length} />
        <StatCard icon={Activity} label="Present" value={presentCount} accent="hsl(var(--accent) / 0.15)" />
        <StatCard icon={Clock} label="Late" value={lateCount} accent="hsl(var(--destructive) / 0.15)" />
        <StatCard
          icon={BookOpen}
          label="Rate"
          value={`${records.length ? Math.round((presentCount / records.length) * 100) : 0}%`}
        />
      </div>

      {/* Timetable */}
      <Card className="border-border/30 bg-card/40 backdrop-blur-xl shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Clock className="w-4 h-4 text-primary" /> Today's Timetable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {timetable.map((slot) => {
              const isActive = activeClass?.subject === slot.subject;
              return (
                <div
                  key={slot.subject}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md scale-105"
                      : "bg-secondary/60 text-secondary-foreground"
                  }`}
                >
                  <span className="font-semibold">{slot.subject}</span>
                  <span className="ml-2 opacity-70">
                    {slot.startHour}:00–{slot.endHour}:00
                  </span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Attendance Table */}
      <Card className="border-border/30 bg-card/40 backdrop-blur-xl shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" /> Attendance Records
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-border/30 hover:bg-transparent">
                <TableHead className="w-16">Face</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Roll No</TableHead>
                <TableHead className="hidden md:table-cell">Subject</TableHead>
                <TableHead>Time</TableHead>
                <TableHead className="text-right">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.map((record, index) => (
                <TableRow
                  key={record.id}
                  className="border-border/20 hover:bg-primary/5 transition-colors duration-200"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <TableCell>
                    <Avatar className="w-9 h-9 border border-border/50">
                      {record.photo ? (
                        <AvatarImage src={record.photo} alt={record.name} />
                      ) : null}
                      <AvatarFallback className="bg-secondary text-xs font-semibold">
                        {getInitials(record.name)}
                      </AvatarFallback>
                    </Avatar>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{record.name}</span>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">
                    {record.rollNumber}
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground text-xs">
                    {record.subject}
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">{record.time}</TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={record.status === "Present" ? "default" : "destructive"}
                      className={
                        record.status === "Present"
                          ? "bg-accent/20 text-accent border-accent/30 hover:bg-accent/30"
                          : ""
                      }
                    >
                      {record.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceDashboard;
