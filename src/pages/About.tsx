import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Brain, Users, Clock, Shield, Zap, BookOpen } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <div className="text-center space-y-4 mb-16">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900">
            About AI Timetable Generator
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Revolutionizing university scheduling with artificial intelligence and smart automation.
          </p>
        </div>

        {/* Mission Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-slate-900">Our Mission</h2>
            <p className="text-lg text-slate-600">
              We're dedicated to transforming how educational institutions manage their scheduling 
              processes. By leveraging advanced AI algorithms, we eliminate conflicts, optimize 
              resource utilization, and create perfect timetables every time.
            </p>
            <p className="text-lg text-slate-600">
              Built in compliance with NEP 2020 guidelines, our solution supports multidisciplinary 
              courses and flexible academic structures that modern universities need.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Brain className="h-8 w-8 text-primary mx-auto mb-4" />
                <div className="text-2xl font-bold text-slate-900 mb-2">AI-Powered</div>
                <div className="text-sm text-slate-600">Smart Algorithms</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Users className="h-8 w-8 text-accent mx-auto mb-4" />
                <div className="text-2xl font-bold text-slate-900 mb-2">50+</div>
                <div className="text-sm text-slate-600">Universities</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-slate-700 mx-auto mb-4" />
                <div className="text-2xl font-bold text-slate-900 mb-2">24/7</div>
                <div className="text-sm text-slate-600">Support</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6 text-center">
                <Shield className="h-8 w-8 text-slate-700 mx-auto mb-4" />
                <div className="text-2xl font-bold text-slate-900 mb-2">99.9%</div>
                <div className="text-sm text-slate-600">Uptime</div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-slate-900 text-center mb-12">
            Why Choose Our Platform?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Intelligent Optimization",
                description: "Advanced AI algorithms automatically resolve scheduling conflicts and optimize resource allocation."
              },
              {
                icon: BookOpen,
                title: "NEP 2020 Compliant",
                description: "Fully aligned with National Education Policy 2020 for multidisciplinary and flexible learning."
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description: "Generate complete timetables in minutes, not weeks. Instant updates and real-time synchronization."
              },
              {
                icon: Users,
                title: "Multi-User Support",
                description: "Role-based access for administrators, faculty, and students with personalized dashboards."
              },
              {
                icon: Clock,
                title: "Real-Time Updates",
                description: "Dynamic rescheduling with instant notifications to all stakeholders."
              },
              {
                icon: Shield,
                title: "Secure & Reliable",
                description: "Enterprise-grade security with data encryption and 99.9% uptime guarantee."
              }
            ].map((feature, index) => (
              <Card key={index} className="group hover:shadow-lg transition-shadow">
                <CardHeader>
                  <feature.icon className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-slate-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">
            Built by Education Technology Experts
          </h2>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Our team combines decades of experience in educational administration, 
            software development, and artificial intelligence to create the most 
            advanced timetabling solution available today.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default About;