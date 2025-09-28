import { supabase } from "@/integrations/supabase/supabaseClient";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface ProfileProps {
  id: string; // igual al auth.users.id
  username: string;
  avatar_url?: string;
}

export const useSupabaseProfile = (userId?: string) => {
  const queryClient = useQueryClient();

  const getProfile = useQuery({
    queryKey: ["profile", userId],
    queryFn: async () => {
      if (!userId) throw new Error("Not logged In");
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

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
      toast.success("Review Saved!");
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });

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
