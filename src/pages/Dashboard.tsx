import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import { 
  Plus, 
  BookOpen, 
  Users, 
  MapPin, 
  Clock, 
  Calendar,
  Trash2,
  Edit3,
  Brain,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface Subject {
  id: string;
  name: string;
  code: string;
  credits: number;
  type: string;
}

interface Faculty {
  id: string;
  name: string;
  email: string;
  subjects: string[];
  availability: string[];
}

interface Classroom {
  id: string;
  name: string;
  capacity: number;
  type: string;
}

interface TimeSlot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
}

const Dashboard = () => {
  const { toast } = useToast();
  
  // State for all entities
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: "1", name: "Data Structures", code: "CS101", credits: 4, type: "Core" },
    { id: "2", name: "Database Systems", code: "CS201", credits: 3, type: "Core" },
  ]);
  
  const [faculty, setFaculty] = useState<Faculty[]>([
    { 
      id: "1", 
      name: "Dr. Sarah Johnson", 
      email: "sarah.j@university.edu", 
      subjects: ["CS101", "CS201"],
      availability: ["Monday", "Tuesday", "Wednesday"]
    }
  ]);
  
  const [classrooms, setClassrooms] = useState<Classroom[]>([
    { id: "1", name: "Room A-101", capacity: 60, type: "Lecture Hall" },
    { id: "2", name: "Lab B-205", capacity: 30, type: "Computer Lab" },
  ]);
  
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { id: "1", day: "Monday", startTime: "09:00", endTime: "10:30" },
    { id: "2", day: "Monday", startTime: "11:00", endTime: "12:30" },
  ]);

  // Form states
  const [subjectForm, setSubjectForm] = useState({ name: "", code: "", credits: "", type: "" });
  const [facultyForm, setFacultyForm] = useState({ name: "", email: "", subjects: "", availability: "" });
  const [classroomForm, setClassroomForm] = useState({ name: "", capacity: "", type: "" });
  const [timeSlotForm, setTimeSlotForm] = useState({ day: "", startTime: "", endTime: "" });

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const addSubject = () => {
    if (!subjectForm.name || !subjectForm.code || !subjectForm.credits) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newSubject: Subject = {
      id: Date.now().toString(),
      name: subjectForm.name,
      code: subjectForm.code,
      credits: parseInt(subjectForm.credits),
      type: subjectForm.type || "Core"
    };

    setSubjects([...subjects, newSubject]);
    setSubjectForm({ name: "", code: "", credits: "", type: "" });
    toast({
      title: "Subject Added",
      description: `${newSubject.name} has been added successfully.`,
    });
  };

  const addFaculty = () => {
    if (!facultyForm.name || !facultyForm.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const newFaculty: Faculty = {
      id: Date.now().toString(),
      name: facultyForm.name,
      email: facultyForm.email,
      subjects: facultyForm.subjects.split(",").map(s => s.trim()),
      availability: facultyForm.availability.split(",").map(d => d.trim())
    };

    setFaculty([...faculty, newFaculty]);
    setFacultyForm({ name: "", email: "", subjects: "", availability: "" });
    toast({
      title: "Faculty Added",
      description: `${newFaculty.name} has been added successfully.`,
    });
  };

  const generateTimetable = () => {
    toast({
      title: "AI Timetable Generation Started",
      description: "Processing your data with advanced algorithms...",
    });
    
    // Simulate processing time
    setTimeout(() => {
      toast({
        title: "Timetable Generated Successfully!",
        description: "Your optimized timetable is ready for review.",
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar isAuthenticated={true} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard</h1>
          <p className="text-slate-600">Manage your university's timetabling data and generate AI-optimized schedules.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="card-dashboard">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Subjects</p>
                  <p className="text-3xl font-bold text-primary">{subjects.length}</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-dashboard">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Faculty</p>
                  <p className="text-3xl font-bold text-accent">{faculty.length}</p>
                </div>
                <Users className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-dashboard">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Classrooms</p>
                  <p className="text-3xl font-bold text-slate-700">{classrooms.length}</p>
                </div>
                <MapPin className="h-8 w-8 text-slate-700" />
              </div>
            </CardContent>
          </Card>
          
          <Card className="card-dashboard">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Time Slots</p>
                  <p className="text-3xl font-bold text-slate-700">{timeSlots.length}</p>
                </div>
                <Clock className="h-8 w-8 text-slate-700" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Generation Card */}
        <Card className="mb-8 bg-gradient-to-r from-primary to-accent text-white">
          <CardContent className="p-8">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Brain className="h-6 w-6" />
                  <h3 className="text-xl font-semibold">AI Timetable Generator</h3>
                </div>
                <p className="text-blue-100">
                  Ready to create your optimized timetable? Our AI will analyze all your data and generate the perfect schedule.
                </p>
              </div>
              <div className="flex space-x-4">
                <Link to="/timetable">
                  <Button 
                    onClick={generateTimetable}
                    className="bg-white text-primary hover:bg-slate-100"
                  >
                    Generate Timetable
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Management Tabs */}
        <Tabs defaultValue="subjects" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="subjects">Subjects</TabsTrigger>
            <TabsTrigger value="faculty">Faculty</TabsTrigger>
            <TabsTrigger value="classrooms">Classrooms</TabsTrigger>
            <TabsTrigger value="timeslots">Time Slots</TabsTrigger>
          </TabsList>

          {/* Subjects Tab */}
          <TabsContent value="subjects">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-dashboard">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Add New Subject</span>
                  </CardTitle>
                  <CardDescription>Create a new subject for your curriculum</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject-name">Subject Name</Label>
                      <Input
                        id="subject-name"
                        value={subjectForm.name}
                        onChange={(e) => setSubjectForm({...subjectForm, name: e.target.value})}
                        placeholder="e.g., Data Structures"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject-code">Subject Code</Label>
                      <Input
                        id="subject-code"
                        value={subjectForm.code}
                        onChange={(e) => setSubjectForm({...subjectForm, code: e.target.value})}
                        placeholder="e.g., CS101"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject-credits">Credits</Label>
                      <Input
                        id="subject-credits"
                        type="number"
                        value={subjectForm.credits}
                        onChange={(e) => setSubjectForm({...subjectForm, credits: e.target.value})}
                        placeholder="e.g., 4"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject-type">Type</Label>
                      <Select onValueChange={(value) => setSubjectForm({...subjectForm, type: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Core">Core</SelectItem>
                          <SelectItem value="Elective">Elective</SelectItem>
                          <SelectItem value="Lab">Lab</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <Button onClick={addSubject} className="w-full">
                    Add Subject
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-dashboard">
                <CardHeader>
                  <CardTitle>Existing Subjects</CardTitle>
                  <CardDescription>Manage your curriculum subjects</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {subjects.map((subject) => (
                      <div key={subject.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                        <div>
                          <h4 className="font-medium">{subject.name}</h4>
                          <p className="text-sm text-slate-600">{subject.code} • {subject.credits} credits • {subject.type}</p>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit3 className="h-4 w-4" />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Faculty Tab */}
          <TabsContent value="faculty">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-dashboard">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5" />
                    <span>Add New Faculty</span>
                  </CardTitle>
                  <CardDescription>Register a new faculty member</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="faculty-name">Full Name</Label>
                    <Input
                      id="faculty-name"
                      value={facultyForm.name}
                      onChange={(e) => setFacultyForm({...facultyForm, name: e.target.value})}
                      placeholder="e.g., Dr. John Smith"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty-email">Email</Label>
                    <Input
                      id="faculty-email"
                      type="email"
                      value={facultyForm.email}
                      onChange={(e) => setFacultyForm({...facultyForm, email: e.target.value})}
                      placeholder="john.smith@university.edu"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty-subjects">Subject Codes (comma-separated)</Label>
                    <Input
                      id="faculty-subjects"
                      value={facultyForm.subjects}
                      onChange={(e) => setFacultyForm({...facultyForm, subjects: e.target.value})}
                      placeholder="e.g., CS101, CS201"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="faculty-availability">Available Days (comma-separated)</Label>
                    <Input
                      id="faculty-availability"
                      value={facultyForm.availability}
                      onChange={(e) => setFacultyForm({...facultyForm, availability: e.target.value})}
                      placeholder="e.g., Monday, Tuesday, Wednesday"
                    />
                  </div>
                  <Button onClick={addFaculty} className="w-full">
                    Add Faculty
                  </Button>
                </CardContent>
              </Card>

              <Card className="card-dashboard">
                <CardHeader>
                  <CardTitle>Faculty Members</CardTitle>
                  <CardDescription>Manage your teaching staff</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {faculty.map((member) => (
                      <div key={member.id} className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium">{member.name}</h4>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit3 className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-slate-600 mb-1">{member.email}</p>
                        <p className="text-xs text-slate-500">
                          Subjects: {member.subjects.join(", ")} • Available: {member.availability.join(", ")}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Similar structure for classrooms and timeslots tabs... */}
          <TabsContent value="classrooms">
            <div className="text-center py-12">
              <MapPin className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Classroom Management</h3>
              <p className="text-slate-600">Add and manage your classroom resources here.</p>
            </div>
          </TabsContent>

          <TabsContent value="timeslots">
            <div className="text-center py-12">
              <Clock className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">Time Slot Management</h3>
              <p className="text-slate-600">Configure your class schedules and time periods.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;