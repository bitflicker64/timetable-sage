import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { 
  Download, 
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  Search,
  Bell,
  Star
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface StudentTimetableEntry {
  id: string;
  day: string;
  time: string;
  subject: string;
  faculty: string;
  room: string;
  type: string;
  credits: number;
}

const StudentView = () => {
  const { toast } = useToast();
  const [selectedSemester, setSelectedSemester] = useState("sem1");
  const [selectedBranch, setSelectedBranch] = useState("cse");
  
  // Mock student timetable data
  const [studentTimetable] = useState<StudentTimetableEntry[]>([
    { id: "1", day: "Monday", time: "09:00-10:30", subject: "Data Structures", faculty: "Dr. Sarah Johnson", room: "A-101", type: "Lecture", credits: 4 },
    { id: "2", day: "Monday", time: "11:00-12:30", subject: "Database Systems", faculty: "Dr. Sarah Johnson", room: "A-102", type: "Lecture", credits: 3 },
    { id: "3", day: "Tuesday", time: "09:00-10:30", subject: "Data Structures Lab", faculty: "Dr. Sarah Johnson", room: "Lab B-205", type: "Lab", credits: 2 },
    { id: "4", day: "Tuesday", time: "11:00-12:30", subject: "Algorithms", faculty: "Dr. Michael Chen", room: "A-101", type: "Lecture", credits: 4 },
    { id: "5", day: "Wednesday", time: "09:00-10:30", subject: "Database Systems", faculty: "Dr. Sarah Johnson", room: "A-103", type: "Lecture", credits: 3 },
    { id: "6", day: "Wednesday", time: "11:00-12:30", subject: "Software Engineering", faculty: "Prof. Emily Davis", room: "A-101", type: "Lecture", credits: 3 },
    { id: "7", day: "Thursday", time: "09:00-10:30", subject: "Mathematics III", faculty: "Dr. Priya Sharma", room: "A-102", type: "Lecture", credits: 4 },
    { id: "8", day: "Thursday", time: "11:00-12:30", subject: "Database Lab", faculty: "Dr. Sarah Johnson", room: "Lab B-206", type: "Lab", credits: 2 },
    { id: "9", day: "Friday", time: "09:00-10:30", subject: "Software Engineering", faculty: "Prof. Emily Davis", room: "A-103", type: "Lecture", credits: 3 },
    { id: "10", day: "Friday", time: "11:00-12:30", subject: "Environmental Studies", faculty: "Dr. Raj Patel", room: "A-101", type: "Lecture", credits: 2 },
  ]);

  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const timeSlots = ["09:00-10:30", "11:00-12:30", "14:00-15:30", "16:00-17:30"];

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const downloadTimetable = () => {
    toast({
      title: "Download Started",
      description: "Your personal timetable is being prepared for download...",
    });
  };

  const getTimetableEntry = (day: string, time: string) => {
    return studentTimetable.find(entry => entry.day === day && entry.time === time);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Lecture": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Lab": return "bg-green-100 text-green-800 border-green-200";
      case "Tutorial": return "bg-orange-100 text-orange-800 border-orange-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const totalCredits = studentTimetable.reduce((sum, entry) => sum + entry.credits, 0);
  const uniqueSubjects = new Set(studentTimetable.map(entry => entry.subject)).size;

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">My Timetable</h1>
              <p className="text-slate-600">Your personalized class schedule - Fall 2024</p>
            </div>
            <div className="flex space-x-3 mt-4 sm:mt-0">
              <Button 
                variant="outline"
                className="flex items-center space-x-2"
              >
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </Button>
              <Button 
                onClick={downloadTimetable}
                className="flex items-center space-x-2 btn-accent"
              >
                <Download className="h-4 w-4" />
                <span>Download</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6 card-dashboard">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="branch">Branch</Label>
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cse">Computer Science & Engineering</SelectItem>
                    <SelectItem value="ece">Electronics & Communication</SelectItem>
                    <SelectItem value="me">Mechanical Engineering</SelectItem>
                    <SelectItem value="ce">Civil Engineering</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="semester">Semester</Label>
                <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select semester" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sem1">Semester 1</SelectItem>
                    <SelectItem value="sem2">Semester 2</SelectItem>
                    <SelectItem value="sem3">Semester 3</SelectItem>
                    <SelectItem value="sem4">Semester 4</SelectItem>
                    <SelectItem value="sem5">Semester 5</SelectItem>
                    <SelectItem value="sem6">Semester 6</SelectItem>
                    <SelectItem value="sem7">Semester 7</SelectItem>
                    <SelectItem value="sem8">Semester 8</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="search">Search Subject</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    id="search"
                    placeholder="Search subjects..."
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="card-dashboard">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Subjects</p>
                  <p className="text-2xl font-bold text-slate-900">{uniqueSubjects}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-dashboard">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Star className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Credits</p>
                  <p className="text-2xl font-bold text-slate-900">{totalCredits}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-dashboard">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Classes/Week</p>
                  <p className="text-2xl font-bold text-slate-900">{studentTimetable.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-dashboard">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Hours/Week</p>
                  <p className="text-2xl font-bold text-slate-900">15</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Student Info Card */}
        <Card className="mb-8 bg-gradient-to-r from-primary to-accent text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">Student: Alex Kumar</h3>
                </div>
                <p className="text-blue-100">
                  Roll No: CSE/2022/001 • Computer Science & Engineering • Semester 5
                </p>
                <div className="flex space-x-6 text-sm">
                  <span>CGPA: 8.7</span>
                  <span>Attendance: 94%</span>
                  <span>NEP 2020 Compliant</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timetable Grid */}
        <Card className="card-dashboard mb-6">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Weekly Schedule</span>
            </CardTitle>
            <CardDescription>
              Your personalized class timetable
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="timetable-grid" style={{ gridTemplateColumns: `150px repeat(${days.length}, 1fr)` }}>
                {/* Header Row */}
                <div className="timetable-header">Time</div>
                {days.map(day => (
                  <div key={day} className="timetable-header text-center">
                    {day}
                  </div>
                ))}

                {/* Time Slot Rows */}
                {timeSlots.map(timeSlot => (
                  <>
                    <div key={timeSlot} className="timetable-header flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {timeSlot}
                    </div>
                    {days.map(day => {
                      const entry = getTimetableEntry(day, timeSlot);
                      return (
                        <div key={`${day}-${timeSlot}`} className="timetable-cell min-h-[120px]">
                          {entry ? (
                            <div className={`p-3 rounded-lg border-2 h-full ${getTypeColor(entry.type)}`}>
                              <div className="font-semibold text-sm mb-1">{entry.subject}</div>
                              <div className="text-xs mb-1 flex items-center">
                                <User className="h-3 w-3 mr-1" />
                                {entry.faculty}
                              </div>
                              <div className="text-xs mb-1 flex items-center">
                                <MapPin className="h-3 w-3 mr-1" />
                                {entry.room}
                              </div>
                              <div className="text-xs font-medium flex items-center justify-between">
                                <span>{entry.type}</span>
                                <span className="bg-white/50 px-1 rounded text-xs">{entry.credits}cr</span>
                              </div>
                            </div>
                          ) : (
                            <div className="p-3 text-center text-slate-400 text-sm">
                              Free Period
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Subject List */}
        <Card className="card-dashboard">
          <CardHeader>
            <CardTitle>Enrolled Subjects</CardTitle>
            <CardDescription>Complete list of your subjects this semester</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from(new Set(studentTimetable.map(entry => entry.subject))).map((subject, index) => {
                const subjectEntries = studentTimetable.filter(entry => entry.subject === subject);
                const credits = subjectEntries[0]?.credits || 0;
                const faculty = subjectEntries[0]?.faculty || "";
                const classCount = subjectEntries.length;
                
                return (
                  <div key={index} className="p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{subject}</h4>
                      <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded">
                        {credits} Credits
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 mb-1">Faculty: {faculty}</p>
                    <p className="text-xs text-slate-500">{classCount} classes per week</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentView;