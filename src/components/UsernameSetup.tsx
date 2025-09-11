import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface UsernameSetupProps {
  onComplete: () => void;
}

export function UsernameSetup({ onComplete }: UsernameSetupProps) {
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { updateProfile } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter a username to continue.",
        variant: "destructive",
      });
      return;
    }

    if (username.length < 3) {
      toast({
        title: "Username Too Short",
        description: "Username must be at least 3 characters long.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await updateProfile({ username: username.trim() });

    if (!error) {
      onComplete();
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Set Your Username</CardTitle>
          <CardDescription>
            Choose a unique username to complete your profile setup
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full"
                disabled={isLoading}
                minLength={3}
                maxLength={30}
                pattern="[a-zA-Z0-9_-]+"
                title="Username can only contain letters, numbers, underscores, and hyphens"
              />
              <p className="text-xs text-slate-500">
                Must be 3-30 characters. Only letters, numbers, underscores, and hyphens allowed.
              </p>
            </div>
            
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading || !username.trim()}
            >
              {isLoading ? "Setting Up..." : "Continue"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}