import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import logoImage from "@/assets/logo.jpg";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileDropdown } from "@/components/ProfileDropdown";

const Navbar = () => {
  const location = useLocation();
  const { user } = useAuth();

  return (
    <nav className="nav-professional">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <img src={logoImage} alt="AI Timetable" className="h-10 w-10 rounded-lg" />
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-primary">AI Timetable</h1>
              <p className="text-xs text-muted-foreground">Smart Campus Solution</p>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/timetable" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === "/timetable" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Timetable
                </Link>
                <Link 
                  to="/student-view" 
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    location.pathname === "/student-view" ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  Student View
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/about" 
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  About
                </Link>
                <Link 
                  to="/demo" 
                  className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
                >
                  Demo
                </Link>
              </>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <ProfileDropdown />
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button size="sm" className="btn-accent">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;