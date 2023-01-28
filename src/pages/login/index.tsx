import Button from "@/components/button";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { useSession, signIn, signOut, getProviders } from "next-auth/react";
import { useRouter } from "next/router";

export default function Login({ providers }: any) {
  const { data: session } = useSession();
  const router = useRouter();
  if (session) {
    router.push("/");
  }
  return (
    <div className="flex flex-col items-center justify-center container h-screen mx-auto">
      <Head>
        <title>Login</title>
      </Head>

      <Link href="/" className="text-6xl mb-10 font-bold">
        Votingly
      </Link>
      <div className="w-1/3 ">
        {Object.values(providers).map((provider: any) => (
          <button
            key={provider.id}
            onClick={() => signIn(provider.id)}
            className="inline-flex justify-center items-center bg-white py-2 w-full border-2 border-black font-medium hover:bg-black hover:text-white"
          >
            {<img src="/favicon.ico" alt="google" className="w-6 h-6 mr-2" />}
            Login menggunakan {provider.name}
          </button>
        ))}
      </div>
    </div>
  );
}
export async function getServerSideProps() {
  const providers = await getProviders();
  return {
    props: { providers },
  };
}
