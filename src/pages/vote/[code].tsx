import Form from "@/components/form";
import Menu from "@/components/menu";
import Head from "next/head";
import Image from "next/image";
import React, { useEffect } from "react";
import "react-datepicker/dist/react-datepicker.css";
import ReactDatePicker, { registerLocale } from "react-datepicker";
import id from "date-fns/locale/id";
import CandidateForm from "@/components/candidateform";
import { PlusIcon } from "@heroicons/react/24/solid";
import Button from "@/components/button";
import { useSession } from "next-auth/react";
import restrictedPage from "@/components/page/restrictedPage";
import RestrictedPage from "@/components/page/restrictedPage";
import { showAlert } from "@/components/alert";
import { useRouter } from "next/router";
import useVote from "@/lib/useVote";

registerLocale("id", id);

export default function DetailrOrEditVote() {
  const { data: session } = useSession();
  const router = useRouter();
  const [startDate, setStartDate] = React.useState<Date | null>(null);
  const [endDate, setEndDate] = React.useState<Date | null>(null);
  const [candidates, setCandidates] = React.useState<Candidate[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const { code } = router.query;
  const { data: datavoteApi, error } = useVote(code as string);

  useEffect(() => {
    if (datavoteApi && datavoteApi.data) {
      const d = datavoteApi.data;
      setTitle(datavoteApi.data.title);
      setStartDate(new Date(datavoteApi.data.startDate));
      setEndDate(new Date(datavoteApi.data.endDate));
      setCandidates(datavoteApi.data.candidates);
    }
  }, [datavoteApi]);

  const submitCandidate = (candidate: Candidate) => {
    candidates.map((c) => (c.key === candidate.key ? candidate : c));
  };

  const addCandidate = () => {
    const newCandidate: Candidate = {
      key: candidates.length + 1,
      name: "",
      title: "",
    };
    setCandidates([...candidates, newCandidate]);
  };

  const removeCandidateForm = (key: number) => {
    ///list kandidate baru kecuali dengan key diatas
    const newCandidates = candidates.filter((c) => c.key !== key);

    ///set key ulang biar nomornya urut. misal 1 2 3, trs yg dihapus 1, jadinya 1 2 bukan 2 3
    newCandidates.forEach((candidate, index) => {
      candidate.key = index + 1;
    });
    setCandidates(newCandidates);
  };

  if (!session) {
    return <RestrictedPage />;
  }

  const updateVote = (e: any) => {
    e.preventDefault();
    if (title === "") {
      showAlert({ title: "hmm", message: "judul harus diisi" });
      return;
    }
    if (candidates.length < 2) {
      showAlert({ title: "hmm", message: "minimal ada 2 kandidat" });
      return;
    }
    if (startDate === null || endDate === null) {
      showAlert({ title: "hmm", message: "tanggal harus diisi" });
      return;
    }
    if (startDate > endDate) {
      showAlert({ title: "hmm", message: "tanggal mulai harus lebih awal" });
      return;
    }
    // if (candidates.some((c) => c.name === "")) {
    //   showAlert({ title: "hmm", message: "kandidat harus diisi" });
    //   return;
    // }

    setLoading(true);

    fetch("/api/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        startDate,
        endDate,
        candidates,
        publisher: session.user?.email,
        deleteAt: new Date(),
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          showAlert({
            title: "berhasil",
            message: "vote berhasil diubah",
          });
        } else {
          console.log(res);
          showAlert({
            title: "gagal",
            message: "vote gagal dibuat",
          });
        }
        router.push("/");
      })
      .catch((err) => {
        console.log(err);
        showAlert({
          title: "gagal",
          message: "vote gagal dibuat",
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container mx-auto mt-6">
      <Head>
        <title>Buat Voting Baru</title>
      </Head>
      <Menu />

      <div className="py-10">
        <Image
          alt={"create vote"}
          src={"/images/vote.png"}
          width={284}
          height={200}
        />

        <h1 className="text-4xl font-bold ">Buat Voting Baru</h1>
        <h2 className="text-zinc-700 mt-3">
          Silakan masukkan data yang dibutuhkan sebelum membuat vote online
        </h2>

        <form onSubmit={updateVote}>
          {/* detail vote */}

          <div className="space-y-5 ">
            <h3 className="font-medium text-xl mt-10">Detail voting</h3>
            <div className="flex flex-col ">
              <label className="text-sm mt-5" htmlFor="">
                Judul
              </label>
              <Form
                onChange={(e) => {
                  setTitle(e);
                }}
                value={title}
                placeHolder={"contoh : voting orang aneh"}
                className={"mt-1 w-1/2"}
              />
            </div>
            <div className="flex flex-col w-2/3">
              <label htmlFor="" className="text-sm">
                Kapan dimulai
              </label>
              <div className="inline-flex">
                <ReactDatePicker
                  locale={"id"}
                  selected={startDate}
                  onChange={(date) => date && setStartDate(date)}
                  showTimeSelect
                  dateFormat={"Pp"}
                  minDate={new Date()}
                  className={"w-full bg-zinc-100 py-2 px-3"}
                />
                <span className="text-sm text-center p-3 ">sampai</span>
                <ReactDatePicker
                  locale={"id"}
                  selected={endDate}
                  onChange={(date) => date && setEndDate(date)}
                  showTimeSelect
                  dateFormat={"Pp"}
                  minDate={startDate}
                  className={"w-full bg-zinc-100 py-2 px-3"}
                />
              </div>
            </div>
          </div>

          {/* detail vote */}
          {/* kandidat */}

          <h3 className="font-medium text-xl mt-10">Kandidat</h3>
          <div className="grid gap-4 grid-cols-4 mt-5">
            {candidates.map((candidate: Candidate, index: number) => (
              <CandidateForm
                key={index}
                candidate={candidate}
                submitCandidate={submitCandidate}
                removeCandidateForm={removeCandidateForm}
              />
            ))}
            <div
              className="w-1/3 flex flex-col items-center justify-center cursor-pointer bg-zinc-100 aspect-square text-zinc-400  hover:bg-black hover:text-white"
              onClick={() => addCandidate()}
            >
              <PlusIcon className="w-1/3" />
            </div>
          </div>

          {/* kandidat */}
          <div className="text-right mt-10">
            <Button text="Buat Voting" isLoading={loading} />
          </div>
        </form>
      </div>
    </div>
  );
}
