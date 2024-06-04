import React from "react";
import { ProjectVariableSchema, SimpleProjectSchema } from "@gitbeaker/rest";
import { DownloadCloudIcon } from "lucide-react";
import DownloadEnvDialog from "@/components/downloadenv/dialog";
import IconRevealButton from "@/components/buttons/iconreveal";

type DownloadEnvButtonProps = {
  projectId: SimpleProjectSchema["id"];
  flatVariables: ProjectVariableSchema[];
  env_scopes_no_extra: ProjectVariableSchema["environment_scope"][];
  loading: boolean;
};

export default function DownloadEnvButton(props: DownloadEnvButtonProps) {
  const [openedDialog, setOpenedDialog] = React.useState(false);

  return (
    <>
      <DownloadEnvDialog
        openedDialog={openedDialog}
        setOpenedDialog={setOpenedDialog}
        projectId={props.projectId}
        variables={props.flatVariables}
        env_scopes_no_extra={props.env_scopes_no_extra}
      />
      <IconRevealButton
        loading={props.loading}
        icon={DownloadCloudIcon}
        variant="outline"
        onClick={() => setOpenedDialog(!openedDialog)}
        className="w-full md:w-fit"
      >
        Download Env
      </IconRevealButton>
    </>
  );
}
