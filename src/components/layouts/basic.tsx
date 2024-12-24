import React from "react";
import Head from "next/head";
import { useMutation, useQuery } from "@tanstack/react-query";
import { signIn, signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { UserContext } from "@/components/contexts/user";
import { BasicLayoutProps } from "@/types/layouts";
import { UserContextProviderType } from "@/types/contexts/user";
import { User } from "@/types/user";
import Menu from "@/components/menu";
import { getUserMe } from "@/lib/gitlab/getUser";
import { DEFAULT_TITLE } from "@/lib/appEnv";

export default function BasicLayout(props: BasicLayoutProps) {
  const { data: session, status } = useSession();
  const { userData, setUserData } = React.useContext(
    UserContext,
  ) as UserContextProviderType;

  const userTokenMutation = useMutation({
    mutationFn: async () => await (await fetch("/api/token")).json(),
    mutationKey: ["userToken"],
  });

  const { data: userMe, isLoading: userMeLoading } = useQuery({
    queryKey: ["userMe", userData.accessToken],
    queryFn: () => getUserMe(userData.accessToken as string),
    enabled: userData.accessToken !== undefined,
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
        const newData: User = {
          email: session.user?.email as string,
          name: session.user?.name as string,
          accessToken: res["token"]["gitlab"]["accessToken"],
          refreshToken: res["token"]["gitlab"]["refreshToken"],
        };
        if (JSON.stringify(newData) !== JSON.stringify(userData)) {
          setUserData(newData);
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session]);

  if (!userMeLoading && userMe && !Object.keys(userMe).includes("id")) {
    signOut({ redirect: false });
  }

  return (
    <>
      <Head>
        <title>{props.title || DEFAULT_TITLE}</title>
      </Head>
      <div className="container transition-[padding] duration-300 sm:px-8 px-4 pb-5 flex flex-col">
        <Menu className="sticky top-0 z-40 " />
        <div
          className={cn(
            "pt-5 flex-grow flex flex-col min-h-0",
            props.className,
          )}
        >
          {props.children}
          <Toaster />
        </div>
      </div>
    </>
  );
}
