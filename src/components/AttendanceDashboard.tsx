import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Users, Clock, BookOpen, Activity, AlertCircle } from "lucide-react";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, query, orderBy, limit } from "firebase/firestore";

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

function getActiveClass(): TimetableSlot | null {
  const hour = new Date().getHours();
  return timetable.find((s) => hour >= s.startHour && hour < s.endHour) || null;
}

function getInitials(name: string) {
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

const StatCard = ({ icon: Icon, label, value, accent }: {
  icon: React.ElementType; label: string; value: string | number; accent?: string;
}) => (
  <Card className="border-border/30 bg-card/40 backdrop-blur-xl shadow-lg">
    <CardContent className="flex items-center gap-4 p-5">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: accent || "hsl(var(--primary) / 0.15)" }}>
        <Icon className="w-5 h-5 text-primary" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{label}</p>
        <p className="text-2xl font-bold leading-tight">{value}</p>
      </div>
    </CardContent>
  </Card>
);

const TableSkeleton = () => (
  <div className="space-y-3 p-4">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4">
        <Skeleton className="w-9 h-9 rounded-full" />
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-20 hidden sm:block" />
        <Skeleton className="h-4 w-24 hidden md:block" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-5 w-16 ml-auto rounded-full" />
      </div>
    ))}
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mb-4">
      <AlertCircle className="w-8 h-8 text-muted-foreground" />
    </div>
    <h3 className="text-lg font-semibold mb-1">No Attendance Records</h3>
    <p className="text-sm text-muted-foreground max-w-xs">
      Attendance records will appear here in real-time once students are detected by the system.
    </p>
  </div>
);

const AttendanceDashboard = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeClass, setActiveClass] = useState<TimetableSlot | null>(getActiveClass());
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time Firestore listener
  useEffect(() => {
    const q = query(collection(db, "attendance"), orderBy("timestamp", "desc"), limit(50));
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const data: AttendanceRecord[] = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            name: d.name || "Unknown",
            rollNumber: d.rollNumber || d.roll_number || "",
            subject: d.subject || activeClass?.subject || "",
            time: d.time || (d.timestamp?.toDate?.()
              ? d.timestamp.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
              : ""),
            status: d.status === "Late" ? "Late" : "Present",
            photo: d.photo || d.photoUrl || "",
          };
        });
        setRecords(data);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error:", error);
        setLoading(false);
      }
    );
    return () => unsub();
  }, [activeClass]);

  // Clock update
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
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Current Class</p>
              <p className="text-lg font-bold">{activeClass ? activeClass.subject : "No Active Class"}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
            {activeClass && (
              <Badge variant="default" className="ml-2 bg-accent text-accent-foreground">
                <span className="relative flex h-2 w-2 mr-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-foreground opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-foreground" />
                </span>
                Live
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total" value={loading ? "—" : records.length} />
        <StatCard icon={Activity} label="Present" value={loading ? "—" : presentCount} accent="hsl(var(--accent) / 0.15)" />
        <StatCard icon={Clock} label="Late" value={loading ? "—" : lateCount} accent="hsl(var(--destructive) / 0.15)" />
        <StatCard icon={BookOpen} label="Rate" value={loading ? "—" : `${records.length ? Math.round((presentCount / records.length) * 100) : 0}%`} />
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
                <div key={slot.subject}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-primary text-primary-foreground shadow-md scale-105"
                      : "bg-secondary/60 text-secondary-foreground"
                  }`}>
                  <span className="font-semibold">{slot.subject}</span>
                  <span className="ml-2 opacity-70">{slot.startHour}:00–{slot.endHour}:00</span>
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
            {!loading && records.length > 0 && (
              <Badge variant="secondary" className="ml-auto text-xs">{records.length} records</Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <TableSkeleton />
          ) : records.length === 0 ? (
            <EmptyState />
          ) : (
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
                  <TableRow key={record.id}
                    className="border-border/20 hover:bg-primary/5 transition-colors duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 40}ms` }}>
                    <TableCell>
                      <Avatar className="w-9 h-9 border border-border/50">
                        {record.photo && <AvatarImage src={record.photo} alt={record.name} />}
                        <AvatarFallback className="bg-secondary text-xs font-semibold">
                          {getInitials(record.name)}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell><span className="font-medium">{record.name}</span></TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-xs">{record.rollNumber}</TableCell>
                    <TableCell className="hidden md:table-cell text-muted-foreground text-xs">{record.subject}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{record.time}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={record.status === "Present" ? "default" : "destructive"}
                        className={record.status === "Present" ? "bg-accent/20 text-accent border-accent/30 hover:bg-accent/30" : ""}>
                        {record.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AttendanceDashboard;
