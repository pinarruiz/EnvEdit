import React from "react";
import { SessionContextValue, signIn, useSession } from "next-auth/react";
import BasicLayout from "@/components/layouts/basic";

export default function Home() {
  const { data: session, status } = useSession();
  const authState = React.useState<SessionContextValue["status"]>(status);
  const userEmailState = React.useState<string>("");

  React.useEffect(() => {
    if (status === "unauthenticated") {
      void signIn("gitlab");
    }
    authState[1](status);
    if (session?.user?.email) {
      userEmailState[1](session.user.email);
    }
  }, [status, authState[1], session]);

  return <BasicLayout></BasicLayout>;
}
