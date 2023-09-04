import React from "react";
import BasicLayout from "@/components/layouts/basic";
import ProjectProcessor from "@/components/projectprocessor";
import { UserContext } from "@/components/contexts/user";
import { UserContextProviderType } from "@/types/usercontext";

export default function Home() {
  const { userData } = React.useContext(UserContext) as UserContextProviderType;

  return (
    <BasicLayout>
      <ProjectProcessor loading={userData.accessToken === null} />
    </BasicLayout>
  );
}
