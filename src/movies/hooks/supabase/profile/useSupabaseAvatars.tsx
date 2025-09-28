import { supabase } from "@/integrations/supabase/supabaseClient";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

export const useUploadAvatar = (userId: string) => {
  const queryClient = useQueryClient();

  const updateAvatar = useMutation({
    mutationFn: async (file: File) => {
      const bucket = "avatars";
      const fileName = file.name.replace(/\s+/g, "_");
      const uuid = uuidv4();
      const filepath = `${userId}/${fileName}/${uuid}`;
      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filepath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from(bucket)
        .getPublicUrl(filepath);

      return urlData.publicUrl;
    },
    onSuccess: (url) => {
      toast.success("Avatar Updated ");
      queryClient.invalidateQueries({ queryKey: ["profile", userId] });
      return url;
    },
    onError: (err: any) => {
      toast.error(err.message);
    },
  });
  return { updateAvatar };
};
