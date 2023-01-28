import { XCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import Form from "./form";

interface Props {
  candidate: Candidate;
  submitCandidate: (candidate: Candidate) => void;
  removeCandidateForm: (key: number) => void;
}

export default function CandidateForm(props: Props) {
  const [candidate, setCandidate] = useState<Candidate>({
    key: 0,
    name: "",
    title: "",
  });

  useEffect(() => {
    setCandidate(props.candidate);
  }, [props.candidate]);

  useEffect(() => {
    props.submitCandidate(candidate);
  }, [candidate]);

  return (
    <div className="flex flex-col border border-zinc-100 p-5 ">
      <div className="self-end">
        <XCircleIcon
          className="h-6 w-6 cursor-pointer hover:bg-zinc-100 text-zinc-100 "
          onClick={() => props.removeCandidateForm(props.candidate.key)}
        />
      </div>
      <h1 className="flex w-1/2 bg-zinc-100 aspect-square  justify-center items-center text-center text-4xl rounded-full ">
        {props.candidate.key}
      </h1>
      <label htmlFor="" className="text-sm mt-3 mb-1 ">
        Nama Kandidat
      </label>
      <Form
        value={candidate.name}
        onChange={(e) => {
          setCandidate({ ...candidate, name: e });
        }}
        placeHolder="masukkan nama kandidat"
      />
      {/* ketika ada perubahan di kandidate, yg dirubah name aja */}
    </div>
  );
}
