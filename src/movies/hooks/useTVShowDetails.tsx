import { useQuery } from "@tanstack/react-query";
import { getTvShowDetails } from "../api/get-tvShow-details.action";

export const useTVShowDetails = (id: string, language: string = "us-US") => {
  return useQuery({
    queryKey: ["tvShowDetails", id, language],
    queryFn: () => getTvShowDetails({ id, language }),
    staleTime: 1000 * 60 * 5,
  });
};
