import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { 
  Download, 
  RefreshCw, 
  Calendar,
  Clock,
  MapPin,
  User,
  BookOpen,
  Filter,
  Eye,
  Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TimetableEntry {
  id: string;
  day: string;
  time: string;
  subject: string;
  faculty: string;
  room: string;
  type: string;
}

const Timetable = () => {
  const { toast } = useToast();
  
  // Mock timetable data
  const [timetableData] = useState<TimetableEntry[]>([
    { id: "1", day: "Monday", time: "09:00-10:30", subject: "Data Structures", faculty: "Dr. Sarah Johnson", room: "A-101", type: "Lecture" },
    { id: "2", day: "Monday", time: "11:00-12:30", subject: "Database Systems", faculty: "Dr. Sarah Johnson", room: "A-102", type: "Lecture" },
    { id: "3", day: "Tuesday", time: "09:00-10:30", subject: "Data Structures Lab", faculty: "Dr. Sarah Johnson", room: "Lab B-205", type: "Lab" },
    { id: "4", day: "Tuesday", time: "11:00-12:30", subject: "Algorithms", faculty: "Dr. Michael Chen", room: "A-101", type: "Lecture" },
    { id: "5", day: "Wednesday", time: "09:00-10:30", subject: "Database Systems", faculty: "Dr. Sarah Johnson", room: "A-103", type: "Lecture" },
    { id: "6", day: "Wednesday", time: "11:00-12:30", subject: "Software Engineering", faculty: "Prof. Emily Davis", room: "A-101", type: "Lecture" },
    { id: "7", day: "Thursday", time: "09:00-10:30", subject: "Algorithms", faculty: "Dr. Michael Chen", room: "A-102", type: "Lecture" },
    { id: "8", day: "Thursday", time: "11:00-12:30", subject: "Database Lab", faculty: "Dr. Sarah Johnson", room: "Lab B-206", type: "Lab" },
    { id: "9", day: "Friday", time: "09:00-10:30", subject: "Software Engineering", faculty: "Prof. Emily Davis", room: "A-103", type: "Lecture" },
    { id: "10", day: "Friday", time: "11:00-12:30", subject: "Project Work", faculty: "Dr. Sarah Johnson", room: "A-101", type: "Project" },
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

  const regenerateTimetable = () => {
    toast({
      title: "Regenerating Timetable",
      description: "AI is optimizing your schedule with updated preferences...",
    });
    
    setTimeout(() => {
      toast({
        title: "Timetable Updated!",
        description: "Your timetable has been regenerated with improved optimization.",
      });
    }, 2000);
  };

  const downloadTimetable = () => {
    toast({
      title: "Download Started",
      description: "Your timetable is being prepared for download...",
    });
  };

  const getTimetableEntry = (day: string, time: string) => {
    return timetableData.find(entry => entry.day === day && entry.time === time);
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Lecture": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Lab": return "bg-green-100 text-green-800 border-green-200";
      case "Project": return "bg-purple-100 text-purple-800 border-purple-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2">AI Generated Timetable</h1>
              <p className="text-slate-600">Optimized schedule for Computer Science Department - Fall 2024</p>
            </div>
            <div className="flex space-x-3 mt-4 sm:mt-0">
              <Button 
                variant="outline" 
                onClick={regenerateTimetable}
                className="flex items-center space-x-2"
              >
                <RefreshCw className="h-4 w-4" />
                <span>Regenerate</span>
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

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="card-dashboard">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Total Classes</p>
                  <p className="text-2xl font-bold text-slate-900">{timetableData.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-dashboard">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <User className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Faculty Assigned</p>
                  <p className="text-2xl font-bold text-slate-900">3</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-dashboard">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Rooms Used</p>
                  <p className="text-2xl font-bold text-slate-900">6</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-dashboard">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BookOpen className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-600">Subjects</p>
                  <p className="text-2xl font-bold text-slate-900">5</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Generation Info */}
        <Card className="mb-8 bg-gradient-to-r from-primary to-accent text-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Settings className="h-5 w-5" />
                  <h3 className="text-lg font-semibold">AI Optimization Results</h3>
                </div>
                <p className="text-blue-100">
                  Generated with 98% efficiency • Zero conflicts detected • Optimal resource utilization
                </p>
                <div className="flex space-x-6 text-sm">
                  <span>✓ Faculty preferences respected</span>
                  <span>✓ Room capacity optimized</span>
                  <span>✓ NEP 2020 compliant</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timetable Grid */}
        <Card className="card-dashboard">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Weekly Schedule</span>
            </CardTitle>
            <CardDescription>
              Complete timetable for Computer Science Department
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
                              <div className="text-xs font-medium">{entry.type}</div>
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

        {/* Legend */}
        <Card className="mt-6 card-dashboard">
          <CardContent className="p-6">
            <h3 className="font-semibold mb-4">Legend</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-blue-100 border-2 border-blue-200"></div>
                <span className="text-sm">Lecture</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-200"></div>
                <span className="text-sm">Lab Session</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 rounded bg-purple-100 border-2 border-purple-200"></div>
                <span className="text-sm">Project Work</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Timetable;