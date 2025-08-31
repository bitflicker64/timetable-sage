import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Play, 
  Calendar, 
  Users, 
  Brain,
  CheckCircle,
  ArrowRight,
  BookOpen,
  Clock
} from "lucide-react";

const Demo = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">
                Experience AI Timetabling in Action
              </h1>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                See how our revolutionary AI system generates perfect university timetables 
                in seconds, eliminating conflicts and optimizing resources automatically.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button className="btn-hero">
                  <Play className="h-5 w-5 mr-2" />
                  Start Interactive Demo
                </Button>
              </Link>
              <Button variant="outline" className="text-slate-700 border-slate-300">
                Watch Video Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              What You'll Experience
            </h2>
            <p className="text-xl text-slate-600">
              Our demo showcases real university scheduling scenarios
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI Algorithm Demo",
                description: "Watch our AI process 100+ constraints in real-time to generate optimal schedules.",
                features: ["Conflict resolution", "Resource optimization", "Preference matching"]
              },
              {
                icon: Calendar,
                title: "Interactive Timetable",
                description: "Explore a fully functional timetable with drag-and-drop modifications.",
                features: ["Visual schedule grid", "Real-time updates", "Export options"]
              },
              {
                icon: Users,
                title: "Multi-Role Experience",
                description: "Switch between admin, faculty, and student views to see all perspectives.",
                features: ["Admin dashboard", "Faculty portal", "Student interface"]
              }
            ].map((feature, index) => (
              <Card key={index} className="card-professional">
                <CardHeader>
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.features.map((item, idx) => (
                      <li key={idx} className="flex items-center text-sm text-slate-600">
                        <CheckCircle className="h-4 w-4 text-accent mr-2 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Scenarios */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
              Real University Scenarios
            </h2>
            <p className="text-xl text-slate-600">
              Our demo uses actual university data and constraints
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {[
              {
                title: "Computer Science Department",
                description: "Experience scheduling for a typical CS department with 15 subjects, 8 faculty members, and multiple lab requirements.",
                stats: [
                  { label: "Subjects", value: "15", icon: BookOpen },
                  { label: "Faculty", value: "8", icon: Users },
                  { label: "Labs", value: "5", icon: Calendar },
                  { label: "Conflicts Resolved", value: "0", icon: CheckCircle }
                ]
              },
              {
                title: "Engineering College",
                description: "See how our AI handles complex multi-departmental scheduling with shared resources and cross-department electives.",
                stats: [
                  { label: "Departments", value: "4", icon: BookOpen },
                  { label: "Classrooms", value: "20", icon: Calendar },
                  { label: "Time Slots", value: "48", icon: Clock },
                  { label: "Efficiency", value: "98%", icon: CheckCircle }
                ]
              }
            ].map((scenario, index) => (
              <Card key={index} className="card-professional">
                <CardHeader>
                  <CardTitle className="text-2xl">{scenario.title}</CardTitle>
                  <CardDescription className="text-base">{scenario.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {scenario.stats.map((stat, idx) => (
                      <div key={idx} className="text-center p-4 bg-slate-50 rounded-lg">
                        <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                        <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                        <div className="text-sm text-slate-600">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                  <Link to="/login">
                    <Button className="w-full btn-accent">
                      Try This Scenario
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to Try Our AI Timetable Generator?
            </h2>
            <p className="text-xl text-slate-300">
              Experience the future of university scheduling with our interactive demo. 
              No registration required to get started.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button className="btn-hero">
                  Start Demo Now
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Demo;