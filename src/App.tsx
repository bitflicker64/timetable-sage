import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/timetable" element={<Timetable />} />
          <Route path="/student-view" element={<StudentView />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/timetable-dashboard" element={<TimetableDashboard />} />
          <Route path="/import" element={<ImportData />} />
          <Route path="/generate" element={<GenerateConsole />} />
          <Route path="/timetable-view" element={<TimetableViewer />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
