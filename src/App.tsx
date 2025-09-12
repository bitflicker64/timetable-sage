import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Timetable from "./pages/Timetable";
import StudentView from "./pages/StudentView";
import Demo from "./pages/Demo";
import NotFound from "./pages/NotFound";
import TimetableDashboard from "./pages/TimetableDashboard";
import ImportData from "./pages/ImportData";
import GenerateConsole from "./pages/GenerateConsole";
import TimetableViewer from "./pages/TimetableViewer";
import AdminSetup from "./pages/AdminSetup";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin-setup" element={<AdminSetup />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/timetable" 
              element={
                <ProtectedRoute>
                  <Timetable />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/student-view" 
              element={
                <ProtectedRoute>
                  <StudentView />
                </ProtectedRoute>
              } 
            />
            <Route path="/demo" element={<Demo />} />
            <Route 
              path="/timetable-dashboard" 
              element={
                <ProtectedRoute requireAdmin>
                  <TimetableDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/import" 
              element={
                <ProtectedRoute requireAdmin>
                  <ImportData />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/generate" 
              element={
                <ProtectedRoute requireAdmin>
                  <GenerateConsole />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/timetable-view" 
              element={
                <ProtectedRoute>
                  <TimetableViewer />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
