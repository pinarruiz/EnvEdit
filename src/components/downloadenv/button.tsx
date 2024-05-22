import React from "react";
import { ProjectVariableSchema, SimpleProjectSchema } from "@gitbeaker/rest";
import { Loader2, DownloadCloud } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import DownloadEnvDialog from "@/components/downloadenv/dialog";

type DownloadEnvButtonProps = {
  projectId: SimpleProjectSchema["id"];
  flatVariables: ProjectVariableSchema[];
  env_scopes_no_extra: ProjectVariableSchema["environment_scope"][];
  loading: boolean;
};

export default function DownloadEnvButton(props: DownloadEnvButtonProps) {
  return (
    <DownloadEnvDialog
      projectId={props.projectId}
      variables={props.flatVariables}
      env_scopes_no_extra={props.env_scopes_no_extra}
    >
      <Button
        disabled={props.loading || props.flatVariables?.length === 0}
        variant="outline"
        className="duration-300 whitespace-nowrap flex group/downloadbutton w-full md:w-fit"
      >
        <Loader2
          className={cn(
            "opacity-70 animate-spin",
            props.loading ? "mr-3 w-6" : "duration-300 w-0",
          )}
        />
        <DownloadCloud className="duration-300 opacity-70 rotate-180 scale-0 w-0 group-hover/downloadbutton:mr-3 group-hover/downloadbutton:rotate-0 group-hover/downloadbutton:scale-100 group-hover/downloadbutton:w-6" />
        Download Env
      </Button>
    </DownloadEnvDialog>
  );
}
