import { supabase } from "@/integrations/supabase/supabaseClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ProfileProps {
  id: string; // User ID from auth.users.id
  username: string;
  avatar_url?: string;
}

/**
 * useSupabaseProfile
 *
 * Custom hook to manage Supabase user profiles.
 * Provides queries and mutations for:
 * - fetching the current user's profile
 * - updating the profile
 * - creating a new profile
 * - deleting the profile
 *
 * @param userId - Current user's ID
 */
export const useSupabaseProfile = (userId?: string) => {
  const queryClient = useQueryClient();

  /**
   * getProfile
   *
   * Fetches the profile of the current user.
   * Uses React Query's `useQuery` to cache and manage data.
   */
  const getProfile = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) throw new Error("Not logged In");

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle(); // returns null if no profile exists

      if (error) throw error;
      return data;
    },
    enabled: !!userId, // Only run query if userId is provided
  });

  /**
   * updateProfile
   *
   * Updates the user's profile in Supabase.
   * Invalidates the cached profile query on success to refresh UI.
   */
  const updateProfile = useMutation({
    mutationFn: async (profile: Omit<ProfileProps, "id">) => {
      if (!userId) throw new Error("Not logged In");

      const { error } = await supabase
        .from("profiles")
        .update(profile)
        .eq("id", userId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Profile updated!");
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

  /**
   * createProfile
   *
   * Inserts a new profile for the user if none exists.
   * Invalidates cached profile query on success.
   */
  const createProfile = useMutation({
    mutationFn: async (profile: ProfileProps) => {
      if (!userId) throw new Error("Not logged In");

      const { error } = await supabase.from("profiles").insert({
        id: userId,
        username: profile.username,
        avatar_url: profile.avatar_url ?? null,
      });

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Profile created!");
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

  /**
   * deleteProfile
   *
   * Deletes the user's profile from Supabase.
   * Invalidates cached profile query on success.
   */
  const deleteProfile = useMutation({
    mutationFn: async () => {
      if (!userId) throw new Error("Not logged In");

      const { error } = await supabase
        .from("profiles")
        .delete()
        .eq("id", userId);

      if (error) throw new Error(error.message);
    },
    onSuccess: () => {
      toast.success("Profile Deleted!");
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

  return { updateProfile, createProfile, deleteProfile, getProfile };
};
