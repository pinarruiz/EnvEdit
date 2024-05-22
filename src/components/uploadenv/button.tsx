import React from "react";
import { SimpleProjectSchema, ProjectVariableSchema } from "@gitbeaker/rest";
import { Loader2, UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import UploadEnvDialog from "@/components/uploadenv/dialog";

type UploadEnvButtonProps = {
  projectId: SimpleProjectSchema["id"];
  env_scopes: ProjectVariableSchema["environment_scope"][];
  loading: boolean;
};

export default function UploadEnvButton(props: UploadEnvButtonProps) {
  return (
    <UploadEnvDialog env_scopes={props.env_scopes} projectId={props.projectId}>
      <Button
        disabled={props.loading}
        variant="outline"
        className="duration-300 whitespace-nowrap flex group/uploadbutton w-full md:w-fit"
      >
        <Loader2
          className={cn(
            "opacity-70 animate-spin",
            props.loading ? "mr-3 w-6" : "duration-300 w-0",
          )}
        />
        <UploadCloud className="duration-300 opacity-70 rotate-180 scale-0 w-0 group-hover/uploadbutton:mr-3 group-hover/uploadbutton:rotate-0 group-hover/uploadbutton:scale-100 group-hover/uploadbutton:w-6" />
        Upload Env
      </Button>
    </UploadEnvDialog>
  );
}
