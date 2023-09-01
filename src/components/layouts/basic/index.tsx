import React from "react";
import Head from "next/head";
import { useMutation } from "@tanstack/react-query";
import { signIn, useSession } from "next-auth/react";
import { UserContext } from "@/components/contexts/user";
import { BasicLayoutProps } from "@/types/layouts";
import { UserContextProviderType } from "@/types/usercontext";
import { User } from "@/types/user";

export default function BasicLayout(props: BasicLayoutProps) {
  const { data: session, status } = useSession();
  const { setUserData } = React.useContext(
    UserContext,
  ) as UserContextProviderType;

  const userTokenMutation = useMutation({
    mutationFn: async () => await (await fetch("/api/token")).json(),
    mutationKey: ["userToken"],
  });

  React.useEffect(() => {
    if (status === "unauthenticated") {
      void signIn("gitlab");
    }
    if (
      status === "authenticated" &&
      session?.user &&
      session.user.email &&
      session.user.name
    ) {
      userTokenMutation.mutateAsync().then((res) => {
        setUserData((prevState: User) => {
          const newData = {
            email: session.user?.email,
            name: session.user?.name,
            accessToken: res["token"]["gitlab"]["accessToken"],
            refreshToken: res["token"]["gitlab"]["refreshToken"],
          } as User;
          return { ...prevState, ...newData };
        });
      });
    }
  }, [status, session]);

  return (
    <>
      <Head>
        <title>{props.title || "EnvEdit"}</title>
      </Head>
      <div className="container transition-[padding] duration-300 sm:px-8 px-4 pb-5 flex flex-col">
        <div className="pt-5 flex-grow flex flex-col min-h-0">
          {props.children}
        </div>
      </div>
    </>
  );
}
