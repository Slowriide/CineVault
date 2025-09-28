import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UpdateProfileDialog } from "./profile/UpdateProfileDialog";
import { useSupabaseProfile } from "../hooks/supabase/profile/useSupabaseProfile";

export const ProfileSidebar = () => {
  const { session, user, signOut } = useAuth();

  const userId = session?.user.id;

  const { getProfile } = useSupabaseProfile(userId);
  const profileData = getProfile.data;

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <Card className="bg-card border-border">
      <CardContent className="px-6 py-8 ">
        <div className="flex flex-col items-center space-y-4">
          {/* Avatar */}
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={profileData?.avatar_url || "/profile_placeholder.png"}
              className="object-cover"
            />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              {"/profile_placeholder.png"}
            </AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="text-center space-y-1">
            <h3 className="font-semibold text-lg">
              {profileData?.username || "User"}
            </h3>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-2">
            <UpdateProfileDialog />
            <Button
              variant="ghost"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
              size="sm"
              onClick={handleSignOut}
            >
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
