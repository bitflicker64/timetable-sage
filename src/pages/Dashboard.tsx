import { useState } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";
import { UsernameSetup } from "@/components/UsernameSetup";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { 
  BookOpen, 
  Users, 
  MapPin, 
  Clock, 
  Brain,
  Settings
} from "lucide-react";

const Dashboard = () => {
  const { profile, signOut, user } = useAuth();
  const [showUsernameSetup, setShowUsernameSetup] = useState(false);

  // Check if user needs to set username
  React.useEffect(() => {
    if (profile && (!profile.username || profile.username.startsWith('user_'))) {
      setShowUsernameSetup(true);
    }
  }, [profile]);

  if (showUsernameSetup) {
    return <UsernameSetup onComplete={() => setShowUsernameSetup(false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Username */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Welcome, {profile?.username || user?.email}!
            </h1>
            <p className="text-slate-600">Manage your university's timetabling system.</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" onClick={signOut}>
              Logout
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Courses</p>
                  <p className="text-3xl font-bold text-primary">12</p>
                </div>
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Faculty</p>
                  <p className="text-3xl font-bold text-accent">8</p>
                </div>
                <Users className="h-8 w-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Rooms</p>
                  <p className="text-3xl font-bold text-slate-700">25</p>
                </div>
                <MapPin className="h-8 w-8 text-slate-700" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600">Time Slots</p>
                  <p className="text-3xl font-bold text-slate-700">40</p>
                </div>
                <Clock className="h-8 w-8 text-slate-700" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* AI Timetable Generation */}
          <Card className="bg-gradient-to-r from-primary to-accent text-white">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Brain className="h-6 w-6" />
                    <h3 className="text-xl font-semibold">AI Timetable Generator</h3>
                  </div>
                  <p className="text-blue-100">
                    Generate optimized schedules using advanced algorithms.
                  </p>
                </div>
                <Link to="/generate">
                  <Button className="bg-white text-primary hover:bg-slate-100">
                    Generate
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

        {/* Theme Settings */}
        <div>
          <ThemeSwitcher />
        </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/timetable-dashboard">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Manage Data
                </CardTitle>
                <CardDescription>
                  Import and manage courses, faculty, and rooms
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/timetable-view">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  View Timetable
                </CardTitle>
                <CardDescription>
                  Browse and export current schedules
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>

          <Link to="/student-view">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Student View
                </CardTitle>
                <CardDescription>
                  See schedules from student perspective
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;