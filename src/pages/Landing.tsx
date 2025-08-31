import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Brain, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle, 
  Zap,
  BookOpen,
  Settings,
  BarChart3,
  Shield
} from "lucide-react";
import heroImage from "@/assets/hero-illustration.jpg";

const Landing = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-gradient py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-fade-up">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-slate-900 leading-tight">
                  AI-Powered Timetable Generator for{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
                    Smart Campuses
                  </span>
                </h1>
                <p className="text-xl text-slate-600 leading-relaxed">
                  Revolutionary scheduling solution that transforms university timetabling 
                  with artificial intelligence, perfectly aligned with NEP 2020 guidelines 
                  for modern educational excellence.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login">
                  <Button className="btn-hero w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
                <Link to="/demo">
                  <Button className="btn-outline-hero w-full sm:w-auto">
                    Try Demo
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">99%</div>
                  <div className="text-sm text-slate-600">Efficiency</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">50+</div>
                  <div className="text-sm text-slate-600">Universities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">24/7</div>
                  <div className="text-sm text-slate-600">Support</div>
                </div>
              </div>
            </div>

            <div className="animate-fade-in-delay">
              <img 
                src={heroImage} 
                alt="AI Timetable Generator Interface" 
                className="w-full h-auto rounded-2xl shadow-hero"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold text-slate-900">
              Why Choose Our AI Solution?
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Cutting-edge technology meets educational excellence to deliver 
              the most advanced timetabling system for modern universities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Optimization",
                description: "Advanced algorithms optimize scheduling for maximum efficiency and minimal conflicts."
              },
              {
                icon: BookOpen,
                title: "NEP 2020 Compliant",
                description: "Fully aligned with National Education Policy 2020 guidelines and requirements."
              },
              {
                icon: Users,
                title: "Multi-Stakeholder Support",
                description: "Seamless coordination between students, faculty, and administrative staff."
              },
              {
                icon: Clock,
                title: "Real-Time Updates",
                description: "Instant notifications and dynamic rescheduling for changing requirements."
              },
              {
                icon: BarChart3,
                title: "Analytics Dashboard",
                description: "Comprehensive insights and reporting for informed decision making."
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                description: "Enterprise-grade security with 99.9% uptime guarantee."
              }
            ].map((feature, index) => (
              <Card key={index} className="card-professional group cursor-pointer">
                <CardContent className="p-8 space-y-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-accent rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-3xl lg:text-4xl font-bold text-slate-900">
                  Transform Your University's Scheduling Process
                </h2>
                <p className="text-lg text-slate-600">
                  Say goodbye to manual scheduling conflicts and hello to intelligent, 
                  automated timetable generation that adapts to your institution's unique needs.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  "Eliminate scheduling conflicts automatically",
                  "Support for multidisciplinary courses",
                  "Faculty availability optimization",
                  "Room utilization maximization",
                  "Student preference consideration",
                  "Instant schedule modifications"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-accent flex-shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <Link to="/signup">
                <Button className="btn-accent">
                  Start Free Trial
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { icon: Calendar, label: "Smart Scheduling", value: "100%" },
                { icon: Users, label: "Faculty Satisfied", value: "95%" },
                { icon: Zap, label: "Time Saved", value: "80%" },
                { icon: Settings, label: "Automation", value: "24/7" }
              ].map((stat, index) => (
                <Card key={index} className="card-dashboard p-6 text-center">
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-4" />
                  <div className="text-2xl font-bold text-slate-900 mb-2">{stat.value}</div>
                  <div className="text-sm text-slate-600">{stat.label}</div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold text-white">
              Ready to Revolutionize Your Campus Scheduling?
            </h2>
            <p className="text-xl text-slate-300">
              Join hundreds of universities already using our AI-powered solution 
              to create perfect timetables every time.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/signup">
                <Button className="btn-hero">
                  Get Started Today
                </Button>
              </Link>
              <Link to="/demo">
                <Button variant="outline" className="text-white border-white hover:bg-white hover:text-slate-900">
                  Watch Demo
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

export default Landing;