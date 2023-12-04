import React from "react";
import { ProjectVariableSchema } from "@gitbeaker/rest";
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

type DownloadEnvDialogProps = {
  children?: React.ReactNode;
  projectId: number;
  variables?: ProjectVariableSchema[];
};

export default function DownloadEnvDialog(props: DownloadEnvDialogProps) {
  const [openedDialog, setOpenedDialog] = React.useState(false);
  const envSelected = React.useState<
    undefined | ProjectVariableSchema["environment_scope"]
  >(undefined);

  const envScopes = Array.from(
    new Set(
      props.variables?.map((variable) => variable.environment_scope),
    ).values(),
  ).filter((envScope) => envScope !== "*");

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
            <Select onValueChange={envSelected[1]}>
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
            <Button onClick={(e) => e.preventDefault()}>Download</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
