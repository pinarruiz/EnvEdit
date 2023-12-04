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

type DownloadEnvDialogProps = {
  children?: React.ReactNode;
  projectId: number;
  variables?: ProjectVariableSchema[];
};

export default function DownloadEnvDialog(props: DownloadEnvDialogProps) {
  const [openedDialog, setOpenedDialog] = React.useState(false);

  const envScopes = Array.from(
    new Set(
      props.variables?.map((variable) => variable.environment_scope),
    ).values(),
  );

  const [envSelected, setEnvSelected] = React.useState<
    undefined | ProjectVariableSchema["environment_scope"]
  >(envScopes.length === 1 ? envScopes[0] : undefined);

  React.useEffect(() => {
    if (envSelected === undefined && envScopes.length === 1) {
      setEnvSelected(envScopes[0]);
    }
  }, [envScopes, envSelected]);

  return (
    <Dialog open={openedDialog} onOpenChange={setOpenedDialog}>
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
                defaultChecked={false}
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
          <DialogFooter>
            <Button
              variant="secondary"
              className="mr-auto"
              onClick={(e) => {
                e.preventDefault();
                setOpenedDialog(false);
              }}
            >
              Cancel
            </Button>
            <Button
              disabled={envSelected === undefined}
              onClick={(e) => e.preventDefault()}
            >
              Download
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
