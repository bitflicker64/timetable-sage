import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Camera, Save, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface UserSettingsProps {
  onClose: () => void;
}

export function UserSettings({ onClose }: UserSettingsProps) {
  const { profile, updateProfile } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState(profile?.username || "");
  const [profilePicture, setProfilePicture] = useState(profile?.profile_picture || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!username.trim()) {
      toast({
        title: "Error",
        description: "Username cannot be empty",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    const { error } = await updateProfile({
      username: username.trim(),
      profile_picture: profilePicture.trim() || null,
    });

    if (!error) {
      toast({
        title: "Settings Updated",
        description: "Your profile has been updated successfully.",
      });
      onClose();
    } else {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  if (!profile) return null;

  const initials = username
    ? username.slice(0, 2).toUpperCase()
    : profile.email.slice(0, 2).toUpperCase();

  return (
    <div className="space-y-6">
      <DialogHeader>
        <DialogTitle>Profile Settings</DialogTitle>
      </DialogHeader>

      <div className="space-y-4">
        {/* Profile Picture */}
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="h-20 w-20">
              <AvatarImage src={profilePicture} alt={username} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
            <Button
              size="sm"
              variant="outline"
              className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0"
              onClick={() => {
                const url = prompt("Enter profile picture URL:");
                if (url !== null) setProfilePicture(url);
              }}
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-2 w-full">
            <Label htmlFor="profile-picture">Profile Picture URL</Label>
            <Input
              id="profile-picture"
              type="url"
              placeholder="https://example.com/avatar.jpg"
              value={profilePicture}
              onChange={(e) => setProfilePicture(e.target.value)}
            />
          </div>
        </div>

        {/* Username */}
        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>
          <Input
            id="username"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Email (read-only) */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={profile.email}
            disabled
            className="bg-muted"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-2 pt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
}