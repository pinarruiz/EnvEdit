import React from "react";
import { useRouter } from "next/router";
import { useQuery } from "@tanstack/react-query";
import BasicLayout from "@/components/layouts/basic";
import VariableProcessor from "@/components/variables/processor";
import { UserContext } from "@/components/contexts/user";
import { UserContextProviderType } from "@/types/contexts/user";
import { getProject } from "@/lib/gitlab/projects";
import { DEFAULT_TITLE } from "@/lib/appEnv";
import QuickLinks from "@/components/variables/quicklinks";
import { ProjectSchema } from "@gitbeaker/rest";

export default function Project() {
  const router = useRouter();
  const { userData } = React.useContext(UserContext) as UserContextProviderType;
  const projectId = parseInt(router.query.projectid as string);

  const { data: projectData, status } = useQuery({
    queryKey: ["projectData", userData.accessToken, projectId],
    queryFn: () => getProject(userData.accessToken as string, projectId),
    enabled:
      userData && userData.email !== undefined && projectId !== undefined,
  });

  return (
    <BasicLayout
      title={
        (status === "success" && projectData ? projectData.name + " - " : "") +
        DEFAULT_TITLE
      }
      className="flex flex-col gap-5"
    >
      <QuickLinks
        projectData={projectData as ProjectSchema}
        loading={status === "pending"}
      />
      <VariableProcessor
        projectId={projectId}
        loading={projectId === undefined}
      />
    </BasicLayout>
  );
}
