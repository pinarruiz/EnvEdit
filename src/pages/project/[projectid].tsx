import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import BasicLayout from "@/components/layouts/basic";
import VariableProcessor from "@/components/variableprocessor";
import { UserContext } from "@/components/contexts/user";
import { UserContextProviderType } from "@/types/usercontext";
import { getProject } from "@/lib/gitlab/projects";
import { DEFAULT_TITLE } from "@/lib/appEnv";

export default function Project() {
  const router = useRouter();
  const { userData } = React.useContext(UserContext) as UserContextProviderType;
  const projectId = parseInt(router.query.projectid as string);

  const { data: projectData, status } = useQuery({
    queryKey: ["projectData", userData.accessToken, projectId],
    queryFn: () => getProject(userData.accessToken as string, projectId),
    enabled: userData !== undefined && projectId !== undefined,
  });

  return (
    <BasicLayout
      title={
        (status === "success" ? projectData.name + " - " : "") + DEFAULT_TITLE
      }
    >
      <VariableProcessor
        projectId={projectId}
        loading={projectId === undefined}
      />
    </BasicLayout>
  );
}
