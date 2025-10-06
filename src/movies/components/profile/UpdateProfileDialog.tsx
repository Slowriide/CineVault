import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/context/AuthContext";
import { useUploadAvatar } from "@/movies/hooks/supabase/profile/useSupabaseAvatars";
import { useSupabaseProfile } from "@/movies/hooks/supabase/profile/useSupabaseProfile";
import { Edit3 } from "lucide-react";
import { useEffect, useState, type ChangeEvent } from "react";

export const UpdateProfileDialog = () => {
  const [open, setOpen] = useState(false);
  const { session } = useAuth();
  const userId = session?.user.id;

  const { updateProfile, getProfile } = useSupabaseProfile(userId);

  const profileData = getProfile.data;

  const { updateAvatar } = useUploadAvatar(userId!);

  const [username, setUsername] = useState(profileData?.username ?? "");
  const [avatarUrl, setAvatarUrl] = useState(profileData?.avatar_url ?? "");

  useEffect(() => {
    if (profileData) {
      setUsername(profileData.username ?? "");
      setAvatarUrl(profileData.avatar_url ?? "");
    }
  }, [profileData]);

  const handleUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handleSave = () => {
    if (!userId) return;
    updateProfile.mutate({ username, avatar_url: avatarUrl });
    setOpen(false);
  };

  const handleAvatarUpload = (file: File) => {
    updateAvatar.mutate(file, {
      onSuccess: (url) => setAvatarUrl(url),
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full" size="sm">
          <Edit3 className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogPortal>
        <DialogContent
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[400px] max-h-[320px]  bg-background p-6 rounded-lg shadow-lg w-full h-full"
          aria-describedby="Dialog for profile editing"
          aria-description="Dialog for profile editing"
        >
          <DialogHeader>
            <DialogTitle>Edit your profile</DialogTitle>
            <DialogDescription className="sr-only">
              Edit your username or avatar
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col  items-center  gap-6">
            {/* Avatar */}
            <label
              htmlFor="avatar-upload"
              className="cursor-pointer relative w-20 h-20"
            >
              <Avatar className="h-20 w-20">
                <AvatarImage
                  src={avatarUrl || "/profile_placeholder.png"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg font-semibold ">
                  <img src="/profile_placeholder.png" alt="placeholder" />
                </AvatarFallback>
              </Avatar>

              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition rounded-full">
                <Edit3 className="text-white w-6 h-6" />
              </div>
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              className="hidden"
              aria-label="Profile image"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  handleAvatarUpload(e.target.files[0]);
                }
              }}
            ></input>

            {/* Username */}
            <div className="flex-1 flex flex-col gap-2 w-full">
              <Input
                value={username}
                onChange={handleUsernameChange}
                placeholder="Username"
                aria-label="Username"
              />
            </div>
          </div>

          {/* Buttons */}
          <DialogFooter className="mt-10 flex justify-end gap-2">
            <DialogClose asChild>
              <Button
                variant={"outline"}
                className="hidden sm:flex"
                aria-label="Close"
              >
                Close
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleSave} aria-label="Submit">
              Save profile
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
};

export default UpdateProfileDialog;
