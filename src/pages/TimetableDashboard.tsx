import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Navbar from '@/components/Navbar';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  Users, 
  BookOpen, 
  MapPin, 
  Clock,
  Plus,
  FileText,
  Download,
  BarChart3
} from 'lucide-react';

interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  totalFaculty: number;
  totalRooms: number;
  scheduledClasses: number;
}

const TimetableDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalStudents: 0,
    totalFaculty: 0,
    totalRooms: 0,
    scheduledClasses: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    try {
      const [
        { count: coursesCount },
        { count: studentsCount },
        { count: facultyCount },
        { count: roomsCount },
        { count: scheduledCount }
      ] = await Promise.all([
        supabase.from('courses').select('*', { count: 'exact', head: true }),
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('faculty').select('*', { count: 'exact', head: true }),
        supabase.from('rooms').select('*', { count: 'exact', head: true }),
        supabase.from('scheduled_classes').select('*', { count: 'exact', head: true })
      ]);

      setStats({
        totalCourses: coursesCount || 0,
        totalStudents: studentsCount || 0,
        totalFaculty: facultyCount || 0,
        totalRooms: roomsCount || 0,
        scheduledClasses: scheduledCount || 0
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load dashboard statistics"
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color = "bg-primary" 
  }: { 
    title: string; 
    value: number; 
    icon: any; 
    color?: string;
  }) => (
    <Card className="relative overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{loading ? '...' : value}</p>
          </div>
          <div className={`p-3 rounded-full ${color} text-primary-foreground`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Timetable Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage your NEP-aligned academic scheduling system
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Quick Actions
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Courses"
            value={stats.totalCourses}
            icon={BookOpen}
            color="bg-blue-500"
          />
          <StatCard
            title="Total Students"
            value={stats.totalStudents}
            icon={Users}
            color="bg-green-500"
          />
          <StatCard
            title="Total Faculty"
            value={stats.totalFaculty}
            icon={Users}
            color="bg-purple-500"
          />
          <StatCard
            title="Total Rooms"
            value={stats.totalRooms}
            icon={MapPin}
            color="bg-orange-500"
          />
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" 
                onClick={() => window.location.href = '/import'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-blue-500" />
                Import Data
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Import students, faculty, and courses from CSV files
              </p>
              <Badge variant="secondary">CSV Upload</Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => window.location.href = '/generate'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-500" />
                Generate Timetable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                AI-powered timetable generation with constraint optimization
              </p>
              <Badge variant="secondary">AI Scheduling</Badge>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => window.location.href = '/timetable-view'}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-500" />
                View Timetable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                View and edit generated timetables with conflict detection
              </p>
              <Badge variant="secondary">Interactive</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Connection</span>
                <Badge variant="default" className="bg-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Scheduled Classes</span>
                <Badge variant="outline">{stats.scheduledClasses} classes</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Last Generation</span>
                <Badge variant="outline">Not generated yet</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default TimetableDashboard;