import "@/styles/globals.css";
import React from "react";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "@/components/theme/provider";
import { UserContextProvider } from "@/components/contexts/user";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps) {
  const queryClient = new QueryClient();

  return (
    <SessionProvider session={session}>
      <UserContextProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Component {...pageProps} />
          </ThemeProvider>
          <ReactQueryDevtools initialIsOpen={false} position={"bottom-right"} />
        </QueryClientProvider>
      </UserContextProvider>
    </SessionProvider>
  );
}
