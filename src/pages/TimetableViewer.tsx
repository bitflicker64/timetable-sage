import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Navbar from '@/components/Navbar';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  BookOpen,
  Search,
  Filter,
  Download,
  Edit,
  AlertTriangle
} from 'lucide-react';

interface ScheduledClass {
  id: string;
  course_sections: {
    section_name: string;
    courses: {
      name: string;
      code: string;
    };
  };
  faculty: {
    name: string;
  };
  rooms: {
    name: string;
    code: string;
  };
  timeslots: {
    day_of_week: string;
    start_time: string;
    end_time: string;
    slot_number: number;
  };
  semester: number;
  semester_type: string;
  academic_year: number;
}

const TimetableViewer = () => {
  const [scheduledClasses, setScheduledClasses] = useState<ScheduledClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDay, setFilterDay] = useState('');
  const [selectedClass, setSelectedClass] = useState<ScheduledClass | null>(null);
  const { toast } = useToast();

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const timeSlots = Array.from({ length: 8 }, (_, i) => i + 1);

  useEffect(() => {
    loadScheduledClasses();
  }, []);

  const loadScheduledClasses = async () => {
    try {
      const { data, error } = await supabase
        .from('scheduled_classes')
        .select(`
          *,
          course_sections (
            section_name,
            courses (
              name, code
            )
          ),
          faculty (
            name
          ),
          rooms (
            name, code
          ),
          timeslots (
            day_of_week, start_time, end_time, slot_number
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setScheduledClasses(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load scheduled classes"
      });
    } finally {
      setLoading(false);
    }
  };

  const getClassForSlot = (day: string, slotNumber: number): ScheduledClass | null => {
    return scheduledClasses.find(
      cls => cls.timeslots.day_of_week === day && cls.timeslots.slot_number === slotNumber
    ) || null;
  };

  const hasConflict = (day: string, slotNumber: number): boolean => {
    const classesInSlot = scheduledClasses.filter(
      cls => cls.timeslots.day_of_week === day && cls.timeslots.slot_number === slotNumber
    );
    return classesInSlot.length > 1;
  };

  const filteredClasses = scheduledClasses.filter(cls => {
    const matchesSearch = searchTerm === '' || 
      cls.course_sections.courses.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.course_sections.courses.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cls.rooms.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDay = filterDay === '' || cls.timeslots.day_of_week === filterDay;
    
    return matchesSearch && matchesDay;
  });

  const TimeSlotCell = ({ day, slotNumber }: { day: string; slotNumber: number }) => {
    const scheduledClass = getClassForSlot(day, slotNumber);
    const conflict = hasConflict(day, slotNumber);

    if (!scheduledClass) {
      return (
        <div className="h-16 border border-border rounded bg-muted/20 flex items-center justify-center text-xs text-muted-foreground">
          Free
        </div>
      );
    }

    return (
      <div 
        className={`h-16 border rounded p-2 cursor-pointer transition-colors ${
          conflict 
            ? 'border-red-500 bg-red-50 hover:bg-red-100' 
            : 'border-primary bg-primary/5 hover:bg-primary/10'
        }`}
        onClick={() => setSelectedClass(scheduledClass)}
      >
        <div className="text-xs font-medium truncate">
          {scheduledClass.course_sections.courses.code}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {scheduledClass.rooms.code}
        </div>
        <div className="text-xs text-muted-foreground truncate">
          {scheduledClass.faculty.name.split(' ')[0]}
        </div>
        {conflict && (
          <AlertTriangle className="h-3 w-3 text-red-500 mt-1" />
        )}
      </div>
    );
  };

  const exportTimetable = () => {
    const timetableData = {
      metadata: {
        exported_at: new Date().toISOString(),
        total_classes: scheduledClasses.length,
        conflicts: scheduledClasses.filter((cls, index) => 
          scheduledClasses.findIndex(c => 
            c.timeslots.day_of_week === cls.timeslots.day_of_week &&
            c.timeslots.slot_number === cls.timeslots.slot_number
          ) !== index
        ).length
      },
      scheduled_classes: scheduledClasses
    };

    const blob = new Blob([JSON.stringify(timetableData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `timetable_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Timetable Viewer</h1>
            <p className="text-muted-foreground mt-2">
              View and manage generated timetables with conflict detection
            </p>
          </div>
          <Button onClick={exportTimetable} className="mt-4 md:mt-0">
            <Download className="h-4 w-4 mr-2" />
            Export Timetable
          </Button>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search courses, faculty, or rooms..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="w-full sm:w-48">
                <select
                  value={filterDay}
                  onChange={(e) => setFilterDay(e.target.value)}
                  className="w-full p-2 border border-input rounded-md bg-background"
                >
                  <option value="">All Days</option>
                  {days.map(day => (
                    <option key={day} value={day}>
                      {day.charAt(0).toUpperCase() + day.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Timetable Grid */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Timetable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                {/* Header */}
                <div className="grid grid-cols-7 gap-2 mb-2">
                  <div className="font-medium text-center py-2">Time</div>
                  {days.map(day => (
                    <div key={day} className="font-medium text-center py-2 capitalize">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Time slots */}
                {timeSlots.map(slot => (
                  <div key={slot} className="grid grid-cols-7 gap-2 mb-2">
                    <div className="flex items-center justify-center text-sm font-medium bg-muted rounded p-2">
                      Slot {slot}
                    </div>
                    {days.map(day => (
                      <TimeSlotCell key={`${day}-${slot}`} day={day} slotNumber={slot} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Class List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Scheduled Classes ({filteredClasses.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredClasses.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No scheduled classes found
              </div>
            ) : (
              <div className="space-y-3">
                {filteredClasses.map(cls => (
                  <div
                    key={cls.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => setSelectedClass(cls)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">
                          {cls.course_sections.courses.code} - {cls.course_sections.section_name}
                        </span>
                        <Badge variant="outline">{cls.course_sections.courses.name}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {cls.faculty.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {cls.rooms.name}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {cls.timeslots.day_of_week} - {cls.timeslots.start_time}
                        </span>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TimetableViewer;