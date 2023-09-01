import React from "react";
import Head from "next/head";
import { BasicLayoutProps } from "@/types/layouts";

export default function BasicLayout(props: BasicLayoutProps) {
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
