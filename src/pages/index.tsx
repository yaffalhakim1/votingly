import Image from "next/image";
import Menu from "@/components/menu";
import Button from "@/components/button";
import { LinkIcon, TrashIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import useVotes from "@/lib/useVotes";
import React, { useEffect, useState } from "react";
import { votes } from "@prisma/client";
import moment from "moment";
import { showAlert } from "@/components/alert";
import { code } from "@/lib/code";

export default function Home() {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: votesApi, error, isLoading } = useVotes();
  const [votes, setVotes] = useState<votes[]>();

  const handleDelete = (code: String) => {
    showAlert({
      title: "Apakah anda yakin?",
      message: "Anda tidak akan bisa mengembalikan data yang sudah dihapus",
      onPositiveClick() {
        fetch(`/api/votes/${code}`, {
          method: "DELETE",
        })
          .then((res) => {
            if (res.status === 200) {
              showAlert({
                title: "Berhasil",
                message: "Data berhasil dihapus",
              });
              setVotes(votes?.filter((v) => v.code !== code));
            }
          })
          .catch((err) => {
            showAlert({
              title: "Gagal",
              message: "Data gagal dihapus",
            });
          });
      },
    });
  };

  useEffect(() => {
    if (votesApi) {
      setVotes(votesApi.data);
    }
  }, [votesApi]);

  return (
    <>
      <div className="container mx-auto mt-6">
        <Menu />

        {/* header */}

        {/* hero */}
        <div className="flex flex-col place-items-center py-44 space-y-3">
          <h1 className="text-5xl font-bold ">Ayo Mulai Voting</h1>
          <h2 className="text-lg bg-zinc-100 px-3 py-1">
            Web Voting No 1 di Undip
          </h2>
          <Image
            src={"/images/header-image.png"}
            width={274}
            height={243}
            alt={"header"}
          />
          <div className="flex space-x-10">
            <Button
              text="Buat vote baru"
              onClick={() => router.push("/vote/create")}
            />
            <Button
              type="primary"
              text="Ikutan vote"
              onClick={() => router.push("/participants")}
            />
          </div>
        </div>
        {/* hero */}

        {/* body */}
        {session && (
          <div className="">
            <p className="py-5 text-lg font-bold ">Vote yang saya buat</p>
            <table className="table-auto w-full border border-zinc-100 ">
              <thead>
                <tr className="border-b border-zinc-100">
                  <th className="p-5 text-left">No</th>
                  <th className="p-5 text-left">Judul</th>
                  <th className="p-5 text-left">Kandidat</th>
                  <th className="p-5 text-left">Kode</th>
                  <th className="p-5 text-left">Mulai</th>
                  <th className="p-5 text-left">Selesai</th>
                  <th className="p-5 text-left"></th>
                </tr>
              </thead>

              <tbody>
                {votes && votes.length > 0 ? (
                  votes.map((vote: votes, index: number) => (
                    <tr>
                      <td className="p-5 text-left">{index + 1}</td>
                      <td className="p-5 text-left text-blue-600">
                        <a href={`/vote/${vote.code}`}>{vote.title}</a>
                      </td>
                      <td className="p-5 text-left">
                        {vote.candidates.map((c: Candidate, index: number) => (
                          <span key={index}>
                            {c.name +
                              (index < vote.candidates.length - 1 ? "vs" : "")}
                          </span>
                        ))}
                      </td>
                      <td className="p-5 text-left font-bold">{vote.code}</td>
                      <td className="p-5 text-left">
                        {moment(vote.startDate).format(
                          "MMMM Do YYYY, h:mm:ss a"
                        )}
                      </td>
                      <td className="p-5 text-left">
                        {moment(vote.endDate).format("MMMM Do YYYY, h:mm:ss a")}
                      </td>
                      <td className="p-5 text-left">
                        <div>
                          <a href={`/participants/${vote.code}`}>
                            <LinkIcon className="h-8 w-8 text-zinc-500 p-2 hover:bg-zinc-100" />
                          </a>
                          <button
                            onClick={() => {
                              handleDelete(vote.code);
                            }}
                          >
                            <TrashIcon className="h-8 w-8 text-zinc-500 p-2 hover:bg-zinc-100" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <div className="flex mx-auto container justify-center">
                    {" "}
                    Belum ada votes yang dibuat
                  </div>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* body */}
      </div>
    </>
  );
}
