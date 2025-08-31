import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Github, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold">AI Timetable Generator</h3>
            <p className="text-slate-300 text-sm">
              Revolutionary scheduling solution for modern universities, 
              aligned with NEP 2020 guidelines.
            </p>
            <div className="flex space-x-4">
              <Github className="h-5 w-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-slate-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold">Quick Links</h4>
            <div className="space-y-2 text-sm">
              <Link to="/about" className="block text-slate-300 hover:text-white transition-colors">
                About
              </Link>
              <Link to="/demo" className="block text-slate-300 hover:text-white transition-colors">
                Try Demo
              </Link>
              <Link to="/login" className="block text-slate-300 hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/signup" className="block text-slate-300 hover:text-white transition-colors">
                Sign Up
              </Link>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h4 className="font-semibold">Features</h4>
            <div className="space-y-2 text-sm text-slate-300">
              <p>AI-Powered Scheduling</p>
              <p>NEP 2020 Compliance</p>
              <p>Multi-disciplinary Support</p>
              <p>Real-time Optimization</p>
              <p>Mobile Responsive</p>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold">Contact Us</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-slate-300">
                <Mail className="h-4 w-4" />
                <span>team@aitimetable.edu</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <Phone className="h-4 w-4" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-300">
                <MapPin className="h-4 w-4" />
                <span>Smart India Hackathon 2024</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-slate-400 text-sm">
            © 2024 AI Timetable Generator. Built for Smart India Hackathon.
          </p>
          <div className="flex space-x-6 text-sm text-slate-400 mt-4 sm:mt-0">
            <Link to="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;