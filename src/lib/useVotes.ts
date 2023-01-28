import { votes } from "@prisma/client";
import useSWR from "swr";

export default function useVotes() {
  const fetcher = (url: string) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR<Res<votes[]>>("/api/votes", fetcher);
  return {
    data,
    isLoading: !error && !data,
    error,
  };
}
