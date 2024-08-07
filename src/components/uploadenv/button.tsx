import React from "react";
import { SimpleProjectSchema, ProjectVariableSchema } from "@gitbeaker/rest";
import { UploadCloudIcon } from "lucide-react";
import UploadEnvDialog from "@/components/uploadenv/dialog";
import IconRevealButton from "@/components/buttons/iconreveal";

type UploadEnvButtonProps = {
  projectId: SimpleProjectSchema["id"];
  env_scopes: ProjectVariableSchema["environment_scope"][];
  loading: boolean;
};

export default function UploadEnvButton(props: UploadEnvButtonProps) {
  const [openedDialog, setOpenedDialog] = React.useState(false);

  return (
    <>
      <UploadEnvDialog
        openedDialog={openedDialog}
        setOpenedDialog={setOpenedDialog}
        env_scopes={props.env_scopes}
        projectId={props.projectId}
      />
      <IconRevealButton
        loading={props.loading}
        icon={UploadCloudIcon}
        variant="outline"
        onClick={() => setOpenedDialog(!openedDialog)}
        className="w-full md:w-fit"
      >
        Upload Env
      </IconRevealButton>
    </>
  );
}
