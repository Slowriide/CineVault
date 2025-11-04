import { supabase } from "@/integrations/supabase/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

/**
 * useUploadAvatar
 *
 * Custom hook to handle uploading a user's avatar image to Supabase storage.
 *
 * @param userId - The currently logged-in user's ID
 * @returns { updateAvatar } - Mutation object to trigger avatar upload
 *
 * Behavior:
 * - Uploads the file to the `avatars` storage bucket under a unique path
 * - Generates a unique filename using the original filename and a UUID
 * - Returns the public URL of the uploaded avatar
 * - Displays success/error notifications via toast
 * - Invalidates the React Query cache for the user's profile to update avatar in UI
 */
export const useUploadAvatar = (userId: string) => {
  const queryClient = useQueryClient();

  const updateAvatar = useMutation({
    /**
     * mutationFn
     *
     * Performs the actual upload of the avatar file to Supabase storage.
     */
    mutationFn: async (file: File) => {
      const bucket = "avatars";
      const fileName = file.name.replace(/\s+/g, "_"); // Replace spaces with underscores
      const uuid = uuidv4(); // Generate unique identifier to avoid collisions
      const filepath = `${userId}/${fileName}/${uuid}`;

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filepath, file, {
          cacheControl: "3600", // Cache for 1 hour
          upsert: true, // Overwrite if file already exists
        });

      if (uploadError) throw uploadError;

      // Get public URL of uploaded avatar
      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filepath);

      return urlData.publicUrl;
    },

    /**
     * onSuccess
     *
     * Triggered when upload succeeds:
     * - Shows success toast
     * - Invalidates user profile query to refresh avatar in UI
     */
    onSuccess: (url) => {
      toast.success("Avatar Updated");
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      return url;
    },

    /**
     * onError
     *
     * Triggered if upload fails:
     * - Shows error toast
     */
    onError: (err: any) => {
      toast.error(err.message);
    },
  });

  return { updateAvatar };
};
