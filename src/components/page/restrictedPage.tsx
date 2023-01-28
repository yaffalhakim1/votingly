import Head from "next/head";
import Image from "next/image";
import React from "react";
import Button from "../button";
import { useSession, signIn, signOut } from "next-auth/react";

export default function RestrictedPage() {
  return (
    <div className="container mx-auto flex flex-col items-center justify-center h-screen space-y-5">
      <Head>
        <title>Login dulu</title>
      </Head>
      <Image
        src={"/images/thinking.png"}
        width={200}
        height={200}
        alt={"restricted lol"}
      />

      <h1 className="text-4xl font-bold">Login dulu</h1>
      <h2 className="text-lg"> sebelum bikin atau nge vote login dulu ok</h2>
      <Button onClick={signIn} text="Login" />
    </div>
  );
}
