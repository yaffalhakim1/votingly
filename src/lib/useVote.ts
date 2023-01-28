import { votes } from "@prisma/client";
import useSWR from "swr";

export default function useVote(code: String) {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error, mutate } = useSWR<Res<votes>>(
    code ? "/api/votes" + code : null,
    fetcher
  );
  return {
    data,
    isLoading: !error && !data,
    error,
    mutate,
  };
}
