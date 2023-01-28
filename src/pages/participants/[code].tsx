import { showAlert } from "@/components/alert";
import Button from "@/components/button";
import CandidateItem from "@/components/candidateitem";
import CountDown from "@/components/CountDown/countdown";
import Menu from "@/components/menu";
import RestrictedPage from "@/components/page/restrictedPage";
import useParticipant from "@/lib/useParticipant";
import useVote from "@/lib/useVote";
import moment from "moment";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const STATE_NOT_STARTED = "NOT_STARTED";
export const STATE_STARTED = "STARTED";
export const STATE_ENDED = "STATE_ENDED";
export const STATE_LOADING = "LOADING";

export default function DetailParticipant() {
  const router = useRouter();
  const { data: session } = useSession();
  const { code } = router.query;
  const { data: dataParticipantApi, mutate: mutateParticipant } =
    useParticipant(code as string);
  const { data: datavoteApi, mutate: mutateVoteApi } = useVote(code as string);
  const [selected, setSelected] = useState<Candidate | null>(null);

  const [current, setCurrent] = useState<string>(STATE_LOADING);

  useEffect(() => {
    if (datavoteApi && datavoteApi?.data) {
      const vote = datavoteApi?.data;
      if (current === STATE_ENDED) {
        return;
      }
      const start = moment(vote?.startDate);
      const end = moment(vote?.endDate);

      const interval = setInterval(async () => {
        const now = moment();
        if (now.isBefore(start)) {
          setCurrent(STATE_NOT_STARTED);
        } else if (now.isAfter(start) && now.isBefore(end)) {
          setCurrent(STATE_STARTED);
        } else {
          setCurrent(STATE_ENDED);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [datavoteApi]);

  useEffect(() => {
    if (dataParticipantApi && datavoteApi) {
      const candidate = datavoteApi?.data?.candidates.find(
        (candidate: Candidate) =>
          candidate.name === dataParticipantApi?.data?.candidate
      );
      if (candidate) {
        setSelected(candidate);
      }
    }
  }, [dataParticipantApi, datavoteApi]);

  const submitVote = async () => {
    if (selected) {
      showAlert({
        title: "Apakah anda yakin?",
        message:
          "Anda tidak dapat mengubah pilihan anda setelah mengirimkan vote",
        positiveBtnText: "Ya, saya yakin memilih " + selected.name,
        negativeBtnText: "Tidak",
        onPositiveClick: async () => {
          const res = await fetch(
            "/api/participant/" + datavoteApi?.data?.code,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                candidate: selected.name,
                email: session?.user?.email,
              }),
            }
          );
          if (res.status === 200) {
            mutateVoteApi();
            mutateParticipant();

            showAlert({
              title: "Terima kasih telah memilih",
              message: "Anda telah berhasil memilih " + selected.name,
              positiveBtnText: "Ya",
              negativeBtnText: "Tidak",
              onPositiveClick: () => {
                router.push("/");
              },
            });
          }
        },
      });
    } else {
      showAlert({
        title: "Vote tidak boleh kosong",
        message: "Mohon pilih salah satu kandidat sebelum mengirimkan vote",
        positiveBtnText: "Ya",
        negativeBtnText: "Tidak",
      });
    }
  };

  if (!session) {
    return <RestrictedPage />;
  }

  return (
    <div className="container mx-auto mt-6">
      <Head>
        <title>Mulai Vote</title>
      </Head>
      <Menu />

      <div>
        <h1 className="text-4xl font-bold text-center">
          {datavoteApi?.data?.title}
        </h1>

        {/* timer */}
        <span>timer</span>
        <CountDown
          className="mt-10"
          start={String(datavoteApi?.data?.startDate)}
          end={String(datavoteApi?.data?.endDate)}
          curentState={current}
        />
        {/* timer */}

        {/* kandidat */}
        <div className="mt-10 space-y-3 w-2/3 mx-auto">
          {datavoteApi?.data?.candidates.map(
            (candidate: Candidate, index: number) => (
              <CandidateItem
                onClick={() => {
                  dataParticipantApi?.data &&
                    current === STATE_STARTED &&
                    setSelected(candidate);
                }}
                key={index}
                isSelected={selected?.name === candidate.name}
                name={candidate.name}
                index={candidate.key}
                title={"Kandidat" + (index + 1)}
                percentage={
                  candidate.votes
                    ? (candidate.votes / datavoteApi?.data?.totalVotes) * 100
                    : 0
                }
              />
            )
          )}
        </div>
        {/* kandidat */}

        {/* button */}
        <div className="flex justify-center mt-10">
          {session?.user?.email != datavoteApi?.data?.publisher &&
            !dataParticipantApi &&
            current === STATE_STARTED && (
              <Button
                text="Kirim vote saya 🤨"
                onClick={() => {
                  submitVote();
                }}
              />
            )}
          {dataParticipantApi?.data && (
            <span className="bg-zinc-100 py-2 px-3">
              Anda telah memilih <b>{dataParticipantApi?.data?.candidate}</b>
            </span>
          )}
          {session?.user?.email === datavoteApi?.data?.publisher && (
            <span className="bg-zinc-100 py-2 px-3">
              Anda adalah pemilik vote, anda tidak dapat memilih.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

//alert custom
