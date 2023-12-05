import React from "react";
import { cn } from "@/lib/utils";
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
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

type UploadEnvDialogProps = {
  children?: React.ReactNode;
};

export default function UploadEnvDialog(props: UploadEnvDialogProps) {
  const [openedDialog, setOpenedDialog] = React.useState(false);
  const [fileUploaded, setFileUploaded] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  async function handleDialogOpenClose(event: boolean) {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFileUploaded(false);
    setOpenedDialog(event);
  }

  return (
    <Dialog open={openedDialog} onOpenChange={handleDialogOpenClose}>
      <DialogTrigger asChild>{props.children}</DialogTrigger>
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Upload environment</DialogTitle>
          <DialogDescription className="opacity-40">
            Upload a file and select an environment.
          </DialogDescription>
        </DialogHeader>
        <form className="flex flex-col gap-4">
          <div className="grid gap-4 py-4">
            <div
              className={cn(
                "duration-300 transition-[gap] flex",
                fileUploaded ? "gap-3" : "",
              )}
            >
              <Input
                type="file"
                ref={fileInputRef}
                accept="text/plain,.env"
                onChange={(e) =>
                  setFileUploaded(e.currentTarget.files?.length !== 0)
                }
              />
              <Button
                size="icon"
                variant="destructive"
                disabled={!fileUploaded}
                onClick={(e) => {
                  e.preventDefault();
                  if (fileInputRef.current) {
                    setFileUploaded(false);
                    fileInputRef.current.value = "";
                  }
                }}
                className={cn(
                  "transition-all duration-300 group/removebutton h-10",
                  fileUploaded ? "w-10" : "w-0",
                )}
              >
                <X className="duration-150 rotate-0 group-hover/removebutton:rotate-90" />
              </Button>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={(e) => {
                e.preventDefault();
                handleDialogOpenClose(false);
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
