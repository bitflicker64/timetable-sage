import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { signUp, user } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const validatePassword = (password: string) => {
    return password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setIsLoading(false);
      return;
    }

    if (!validatePassword(formData.password)) {
      setIsLoading(false);
      return;
    }

    const { error } = await signUp(
      formData.email, 
      formData.password,
      {
        name: formData.name,
        username: formData.username
      }
    );

    if (!error) {
      navigate("/login");
    }

    setIsLoading(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="flex items-center justify-center py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-slate-900">Create Account</h1>
            <p className="mt-2 text-slate-600">
              Join the future of university scheduling
            </p>
          </div>

          <Card className="shadow-lg">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-semibold">Sign Up</CardTitle>
              <CardDescription>
                Create your account to get started with TIME GENIX
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Dr. John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john.doe@university.edu"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="johndoe"
                      value={formData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className="pl-10"
                      required
                      minLength={3}
                      maxLength={30}
                      pattern="[a-zA-Z0-9_-]+"
                    />
                  </div>
                  <p className="text-xs text-slate-500">
                    3-30 characters. Only letters, numbers, underscores, and hyphens.
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="text-xs text-slate-500">
                    Minimum 8 characters with uppercase, lowercase, and number.
                  </p>
                  {formData.password && !validatePassword(formData.password) && (
                    <p className="text-xs text-red-500">
                      Password must be at least 8 characters with uppercase, lowercase, and number.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                      className="pl-10 pr-10"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-xs text-red-500">
                      Passwords do not match.
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={
                    isLoading || 
                    !formData.name || 
                    !formData.email || 
                    !formData.username ||
                    !formData.password || 
                    !formData.confirmPassword ||
                    formData.password !== formData.confirmPassword ||
                    !validatePassword(formData.password)
                  }
                >
                  {isLoading ? "Creating Account..." : "Create Account"}
                </Button>
              </form>

              <div className="text-center">
                <p className="text-sm text-slate-600">
                  Already have an account?{" "}
                  <Link 
                    to="/login" 
                    className="font-medium text-primary hover:text-primary-hover"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Signup;