import React from "react";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

type UploadEnvDialogProps = {
  children?: React.ReactNode;
};

export default function UploadEnvDialog(props: UploadEnvDialogProps) {
  const [openedDialog, setOpenedDialog] = React.useState(false);

  return (
    <Dialog open={openedDialog} onOpenChange={setOpenedDialog}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Upload environment</DialogTitle>
          <DialogDescription className="opacity-40">
            Upload a file and select an environment.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4">
          <div className="grid gap-4 py-4"></div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                setOpenedDialog(false);
              }}
            >
              Cancel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
