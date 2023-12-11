import React from "react";
import { ProjectVariableSchema } from "@gitbeaker/rest";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import scopedVarsToEnv from "@/lib/scopedVarsToEnv";
import variablesToScopes from "@/lib/variablesToScopes";

type DownloadEnvDialogProps = {
  children?: React.ReactNode;
  projectId: number;
  variables: ProjectVariableSchema[];
};

export default function DownloadEnvDialog(props: DownloadEnvDialogProps) {
  const [openedDialog, setOpenedDialog] = React.useState(false);
  const [checkedIncludeDefault, setCheckedIncludeDefault] =
    React.useState(true);

  const envScopes = variablesToScopes(props.variables);

  const [envSelected, setEnvSelected] = React.useState<
    undefined | ProjectVariableSchema["environment_scope"]
  >(envScopes.length === 1 ? envScopes[0] : undefined);

  React.useEffect(() => {
    if (envSelected === undefined && envScopes.length === 1) {
      setEnvSelected(envScopes[0]);
    }
  }, [envScopes, envSelected]);

  function handleDialogOpenClose(event: boolean) {
    setEnvSelected(undefined);
    setOpenedDialog(event);
  }

  return (
    <Dialog open={openedDialog} onOpenChange={handleDialogOpenClose}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Download environment</DialogTitle>
          <DialogDescription className="opacity-40">
            Select an environment and download it.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4">
          <div className="grid gap-4 py-4">
            <Select onValueChange={setEnvSelected} value={envSelected}>
              <SelectTrigger disabled={envScopes.length === 0}>
                <SelectValue placeholder="Environment" />
              </SelectTrigger>
              <SelectContent>
                {envScopes.map((envScope) => (
                  <SelectItem key={envScope} value={envScope}>
                    {envScope}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div
              className={cn(
                "duration-300 flex gap-3 h-5 opacity-100 overflow-hidden",
                envSelected === undefined || envSelected === "*"
                  ? "h-0 opacity-0"
                  : "",
              )}
            >
              <Checkbox
                id="includedefault"
                checked={checkedIncludeDefault}
                onCheckedChange={(e) =>
                  setCheckedIncludeDefault(e === "indeterminate" ? false : e)
                }
                disabled={envSelected === "*"}
              />
              <label
                htmlFor="includedefault"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                Include default scope
              </label>
            </div>
          </div>
          <DialogFooter className="flex gap-3">
            <Button
              variant="secondary"
              className="sm:mr-auto"
              onClick={(e) => {
                e.preventDefault();
                handleDialogOpenClose(false);
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={envSelected === undefined}
              onClick={(e) => {
                e.preventDefault();
                if (props.variables && envSelected) {
                  const envFile = new File(
                    [
                      scopedVarsToEnv({
                        variables: props.variables,
                        environment_scope: envSelected,
                        includeDefault: checkedIncludeDefault,
                      }),
                    ],
                    `${props.projectId}-${
                      envSelected === "*" ? "all" : envSelected
                    }.env`,
                    { type: "text/plain" },
                  );
                  const link = document.createElement("a");
                  const url = URL.createObjectURL(envFile);

                  link.href = url;
                  link.download = envFile.name;
                  document.body.appendChild(link);
                  link.click();

                  document.body.removeChild(link);
                  window.URL.revokeObjectURL(url);
                }
              }}
            >
              Download
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
