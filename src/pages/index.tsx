import React from "react";
import BasicLayout from "@/components/layouts/basic";
import ProjectProcessor from "@/components/projects/processor";
import { UserContext } from "@/components/contexts/user";
import { UserContextProviderType } from "@/types/contexts/user";

export default function Home() {
  const { userData } = React.useContext(UserContext) as UserContextProviderType;

  return (
    <BasicLayout>
      <ProjectProcessor loading={userData.accessToken === null} />
    </BasicLayout>
  );
}
