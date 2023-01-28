import { showAlert } from "@/components/alert";
import Button from "@/components/button";
import Form from "@/components/form";
import RestrictedPage from "@/components/page/restrictedPage";
import { useSession } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

export default function Participant() {
  const { data: session } = useSession();

  const [code, setCode] = useState<string>("");
  const router = useRouter();

  const handleSubmitCode = async () => {
    if (code === "") {
      showAlert({
        title: "Kode tidak boleh kosong",
        message: "Kode voting tidak boleh kosong",
      });
      return;
    }
    await fetch("/api/votes/" + code, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((data) => {
        if (data?.message && data?.message === "NOT_FOUND") {
          showAlert({
            title: "Kode tidak ditemukan",
            message: "Kode voting tidak ditemukan",
          });
          return;
        }
        router.push("/participants/" + code);
        return;
      });
    });
  };

  if (!session) {
    return <RestrictedPage />;
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-5 container mx-auto">
      <Head>
        <title>Masukkan kode</title>
      </Head>

      <Image src="/images/participate.png" width={200} height={200} alt={""} />
      <h1 className="text-4xl font-bold ">Ikutan Voting</h1>
      <h2 className="w-1/3 text-center leading-relaxed">
        Untuk ikutan voting, kamu harus memasukkan kode voting yang sudah di
        berikan panitia penyelenggara
      </h2>
      <Form
        value={code}
        onChange={setCode}
        placeHolder="masukkan kode disini"
        className="w-1/3 mt-3"
      />

      <Button onClick={handleSubmitCode} text="Lanjutkan" className="w-1/3" />
      <button className="text-sm" onClick={() => router.push("/")}>
        Kembali
      </button>
    </div>
  );
}
