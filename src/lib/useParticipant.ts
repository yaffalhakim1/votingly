import { votes, participant } from "@prisma/client";
import useSWR from "swr";

export default function useParticipant(code: String) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, mutate } = useSWR<Res<participant>>(
    code ? "/api/participant/" + code : null,
    fetcher
  );
  return {
    data,
    isLoading: !error && !data,
    error,
    mutate,
  };
}
