import { LogOut, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const ProfileSidebar = () => {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const getInitials = (email: string) => {
    return email.slice(0, 2).toUpperCase();
  };

  const getUserName = (email: string) => {
    return email.split("@")[0];
  };

  return (
    <Card className="bg-card border-border">
      <CardContent className="px-6 py-8">
        <div className="flex flex-col items-center space-y-4">
          {/* Avatar */}
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.user_metadata?.avatar_url} />
            <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold">
              {user?.email ? getInitials(user.email) : "U"}
            </AvatarFallback>
          </Avatar>

          {/* User Info */}
          <div className="text-center space-y-1">
            <h3 className="font-semibold text-lg">
              {user?.user_metadata?.name ||
                (user?.email ? getUserName(user.email) : "User")}
            </h3>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
          </div>

          {/* Action Buttons */}
          <div className="w-full space-y-2">
            <Button variant="outline" className="w-full" size="sm">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
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
