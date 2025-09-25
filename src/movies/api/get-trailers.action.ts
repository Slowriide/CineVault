import { TMDBAPI } from "@/api/TheMovieDBApi";
import type { TrailerResponse } from "../../interfaces/Trailers";
import type { Type } from "@/interfaces/MovieCategory";

interface Options {
  language?: string;
  type: Type;
  id: string;
}

export const getTrailersAction = async ({
  language,
  type,
  id,
}: Options): Promise<TrailerResponse> => {
  const { data } = await TMDBAPI.get(`/${type}/${id}/videos`, {
    params: { language },
  });

  return { ...data };
};
