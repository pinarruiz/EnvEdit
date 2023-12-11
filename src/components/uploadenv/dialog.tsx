import React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { X } from "lucide-react";
import { ProjectVariableSchema, SimpleProjectSchema } from "@gitbeaker/rest";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import variablesToScopes from "@/lib/variablesToScopes";
import { createVariable, updateVariable } from "@/lib/gitlab/variables";
import { UserContext } from "@/components/contexts/user";
import { UserContextProviderType } from "@/types/usercontext";
import { readInputFile } from "@/lib/files";

type UploadEnvDialogProps = {
  children?: React.ReactNode;
  variables: ProjectVariableSchema[];
  projectId: SimpleProjectSchema["id"];
};

export default function UploadEnvDialog(props: UploadEnvDialogProps) {
  const queryClient = useQueryClient();

  const { userData } = React.useContext(UserContext) as UserContextProviderType;
  const [openedDialog, setOpenedDialog] = React.useState(false);
  const [fileUploaded, setFileUploaded] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const envScopes = variablesToScopes(props.variables);
  const [searchScope, setSearchScope] = React.useState("");

  const filteredScopes = envScopes.filter(
    (envScope) =>
      envScope.toLowerCase().includes(searchScope.toLowerCase()) ||
      searchScope === "",
  );

  async function handleDialogOpenClose(event: boolean) {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setFileUploaded(false);
    setSearchScope("");
    setOpenedDialog(event);
  }

  const uploadButtonDisabled =
    !fileUploaded || searchScope.length === 0 || searchScope === "";

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
            <div
              className={cn(
                "duration-300 flex flex-col gap-2",
                fileUploaded ? "h-52" : "h-0 overflow-hidden",
              )}
            >
              <div className="flex">
                <Input
                  onChange={(e) => setSearchScope(e.currentTarget.value)}
                  value={searchScope}
                  placeholder="Search for environment scope..."
                />
              </div>
              <ScrollArea
                className={cn(
                  "duration-300 overflow-auto px-3 py-2 border rounded-md",
                  (searchScope !== "" && filteredScopes.length < 1) ||
                    (filteredScopes.length === 1 &&
                      filteredScopes[0] === searchScope)
                    ? "h-0 p-0 border-0"
                    : "",
                )}
              >
                {envScopes.map((envScope) => (
                  <p
                    className={cn(
                      "duration-300 overflow-hidden hover:bg-secondary/80 hover:cursor-pointer rounded-md",
                      filteredScopes.length <= 1 ? "mb-0" : "mb-1 last:mb-0",
                      filteredScopes.includes(envScope) || searchScope === ""
                        ? "h-8 px-2 py-1"
                        : "h-0 mb-0",
                    )}
                    onClick={() => setSearchScope(envScope)}
                    key={envScope}
                  >
                    {envScope}
                  </p>
                ))}
              </ScrollArea>
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
              disabled={uploadButtonDisabled}
              onClick={async (e) => {
                e.preventDefault();
                if (
                  fileInputRef.current &&
                  fileInputRef.current.files &&
                  userData.accessToken
                ) {
                  const fileContent = (
                    await readInputFile(fileInputRef.current.files[0])
                  ).trim();
                  for (const variable of fileContent.split("\n")) {
                    const [key, ...valueSplit] = variable.split("=");
                    const value = valueSplit.join("=");
                    try {
                      await updateVariable(
                        userData.accessToken,
                        props.projectId,
                        key,
                        value,
                        searchScope,
                      );
                    } catch (error) {
                      await createVariable(
                        userData.accessToken,
                        props.projectId,
                        key,
                        value,
                        searchScope,
                      );
                    }
                  }
                  await queryClient.invalidateQueries({
                    queryKey: [
                      "variables",
                      props.projectId,
                      userData.accessToken,
                    ],
                  });
                }
                handleDialogOpenClose(false);
              }}
            >
              <p
                className={cn(
                  "overflow-hidden duration-300 whitespace-nowrap text-left",
                  envScopes.includes(searchScope) || uploadButtonDisabled
                    ? "w-0"
                    : "w-28",
                )}
              >
                Create env and
              </p>
              <p>Upload</p>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
