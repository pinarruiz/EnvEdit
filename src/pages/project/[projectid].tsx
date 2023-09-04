import React from "react";
import BasicLayout from "@/components/layouts/basic";
import VariableProcessor from "@/components/variableprocessor";
import { useRouter } from "next/router";

export default function Project() {
  const router = useRouter();
  const projectId = parseInt(router.query.projectid as string);

  return (
    <BasicLayout>
      <VariableProcessor
        projectId={projectId}
        loading={projectId === undefined}
      />
    </BasicLayout>
  );
}
