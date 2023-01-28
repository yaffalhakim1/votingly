import RestrictedPage from "@/components/page/restrictedPage";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Vote() {
  const { data: session } = useSession();
  if (!session) {
    return <RestrictedPage />;
  }
  return;
}
