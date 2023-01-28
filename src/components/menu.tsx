import Image from "next/image";
import { useRouter } from "next/router";
import Button from "./button";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Menu() {
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <div className="flex justify-between py-5">
      <Image
        src={"/next.svg"}
        alt="Votingly Logo"
        width={100}
        height={100}
        onClick={() => router.push("/")}
        className={"cursor-pointer"}
      />
      {session ? (
        <div className="space-x-3">
          <span> {session.user?.name}</span>
          <Button onClick={signOut} text="Logout" type="primary" />
        </div>
      ) : (
        <Button onClick={signIn} text="Login" type="primary" />
      )}
    </div>
  );
}
