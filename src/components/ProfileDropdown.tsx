import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Settings, LogOut, Moon, Sun } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { UserSettings } from "@/components/UserSettings";
import { Dialog, DialogContent } from "@/components/ui/dialog";

export function ProfileDropdown() {
  const { profile, signOut, updateProfile } = useAuth();
  const [showSettings, setShowSettings] = useState(false);
  const [isDark, setIsDark] = useState(profile?.theme === 'dark');

  const handleThemeToggle = async () => {
    const newTheme = isDark ? 'light' : 'dark';
    setIsDark(!isDark);
    
    // Apply theme immediately
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
    
    // Update CSS custom properties
    const root = document.documentElement;
    if (newTheme === 'dark') {
      root.style.setProperty('--background', '222 84% 4.9%');
      root.style.setProperty('--foreground', '210 40% 98%');
      root.style.setProperty('--card', '222 84% 4.9%');
      root.style.setProperty('--card-foreground', '210 40% 98%');
      root.style.setProperty('--popover', '222 84% 4.9%');
      root.style.setProperty('--popover-foreground', '210 40% 98%');
      root.style.setProperty('--muted', '217.2 32.6% 17.5%');
      root.style.setProperty('--muted-foreground', '215 20.2% 65.1%');
      root.style.setProperty('--border', '217.2 32.6% 17.5%');
      root.style.setProperty('--input', '217.2 32.6% 17.5%');
    } else {
      root.style.setProperty('--background', '0 0% 100%');
      root.style.setProperty('--foreground', '222.2 84% 4.9%');
      root.style.setProperty('--card', '0 0% 100%');
      root.style.setProperty('--card-foreground', '222.2 84% 4.9%');
      root.style.setProperty('--popover', '0 0% 100%');
      root.style.setProperty('--popover-foreground', '222.2 84% 4.9%');
      root.style.setProperty('--muted', '210 40% 98%');
      root.style.setProperty('--muted-foreground', '215.4 16.3% 46.9%');
      root.style.setProperty('--border', '214.3 31.8% 91.4%');
      root.style.setProperty('--input', '214.3 31.8% 91.4%');
    }
    
    // Save to Supabase
    await updateProfile({ theme: newTheme });
  };

  if (!profile) return null;

  const initials = profile.username
    ? profile.username.slice(0, 2).toUpperCase()
    : profile.email.slice(0, 2).toUpperCase();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile.profile_picture} alt={profile.username} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{profile.username}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {profile.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setShowSettings(true)}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleThemeToggle}>
            {isDark ? (
              <Sun className="mr-2 h-4 w-4" />
            ) : (
              <Moon className="mr-2 h-4 w-4" />
            )}
            <span>{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <UserSettings onClose={() => setShowSettings(false)} />
        </DialogContent>
      </Dialog>
    </>
  );
}