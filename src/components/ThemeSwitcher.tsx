import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Palette, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const themes = [
  { id: 'light', name: 'Light', description: 'Clean and bright interface' },
  { id: 'dark', name: 'Dark', description: 'Easy on the eyes' },
];

export function ThemeSwitcher() {
  const { profile, updateProfile } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleThemeChange = async (themeId: string) => {
    if (!profile || themeId === profile.theme) return;

    setIsUpdating(true);
    
    const { error } = await updateProfile({ theme: themeId });
    
    if (!error) {
      // Apply theme to document
      applyTheme(themeId);
      
      toast({
        title: "Theme Updated",
        description: `Switched to ${themes.find(t => t.id === themeId)?.name} theme.`,
      });
    }

    setIsUpdating(false);
  };

  const applyTheme = (themeId: string) => {
    // Remove existing theme classes
    document.documentElement.classList.remove('light', 'dark');
    
    // Add new theme class
    document.documentElement.classList.add(themeId);
    
    // Update CSS custom properties based on theme
    const root = document.documentElement;
    
    if (themeId === 'dark') {
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
  };

  // Apply current theme on component mount
  React.useEffect(() => {
    if (profile?.theme) {
      applyTheme(profile.theme);
    }
  }, [profile?.theme]);

  if (!profile) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Theme Settings
        </CardTitle>
        <CardDescription>
          Customize your interface appearance
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="theme">Select Theme</Label>
          <Select 
            value={profile.theme} 
            onValueChange={handleThemeChange}
            disabled={isUpdating}
          >
            <SelectTrigger id="theme">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {themes.map((theme) => (
                <SelectItem key={theme.id} value={theme.id}>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span>{theme.name}</span>
                      {profile.theme === theme.id && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {themes.map((theme) => (
            <Button
              key={theme.id}
              variant={profile.theme === theme.id ? "default" : "outline"}
              size="sm"
              onClick={() => handleThemeChange(theme.id)}
              disabled={isUpdating}
              className="justify-start h-auto p-3"
            >
              <div className="text-left">
                <div className="font-medium">{theme.name}</div>
                <div className="text-xs opacity-70">{theme.description}</div>
              </div>
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

