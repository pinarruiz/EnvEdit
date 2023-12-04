import React from "react";
import { Button } from "@/components/ui/button";
import { DialogHeader, DialogFooter } from "@/components/ui/dialog";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type DownloadEnvDialogProps = {
  children?: React.ReactNode;
  projectId: number;
};

export default function DownloadEnvDialog(props: DownloadEnvDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Download environment</DialogTitle>
          <DialogDescription className="opacity-40">
            Select an environment and download it.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4">
          <div className="grid gap-4 py-4"></div>
          <DialogFooter>
            <Button onClick={(e) => e.preventDefault()}>Download</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
