import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, X } from "lucide-react";
import { ProjectVariableSchema, SimpleProjectSchema } from "@gitbeaker/rest";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DialogHeader,
  DialogFooter,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { updateCreateVariable } from "@/lib/gitlab/variables";
import { UserContext } from "@/components/contexts/user";
import { UserContextProviderType } from "@/types/contexts/user";
import { readInputFile } from "@/lib/files";

type UploadEnvDialogProps = {
  env_scopes: ProjectVariableSchema["environment_scope"][];
  projectId: SimpleProjectSchema["id"];
  openedDialog: boolean;
  setOpenedDialog: React.Dispatch<
    React.SetStateAction<UploadEnvDialogProps["openedDialog"]>
  >;
};

export default function UploadEnvDialog(props: UploadEnvDialogProps) {
  const queryClient = useQueryClient();

  const { userData } = React.useContext(UserContext) as UserContextProviderType;
  const [isUploading, setIsUploading] = React.useState(false);
  const [fileUploaded, setFileUploaded] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const [searchScope, setSearchScope] = React.useState("");

  const filteredScopes = props.env_scopes.filter(
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
    props.setOpenedDialog(event);
  }

  const uploadVariablesMutation = useMutation({
    mutationKey: ["uploadVariables"],
    mutationFn: async (args: {
      variables: Record<
        ProjectVariableSchema["key"],
        ProjectVariableSchema["value"]
      >;
      environment_scope: ProjectVariableSchema["environment_scope"];
      oauthToken: string;
    }) => {
      for (const variable of Object.keys(args.variables)) {
        updateCreateVariable(
          args.oauthToken,
          props.projectId,
          variable,
          args.variables[variable],
          args.environment_scope,
        );
      }
    },
  });

  const uploadButtonDisabled =
    !fileUploaded ||
    searchScope.length === 0 ||
    searchScope === "" ||
    isUploading;

  return (
    <Dialog open={props.openedDialog} onOpenChange={handleDialogOpenClose}>
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
                {props.env_scopes.map((env_scope) => (
                  <p
                    className={cn(
                      "duration-300 overflow-hidden hover:bg-secondary/80 hover:cursor-pointer rounded-md",
                      filteredScopes.length <= 1 ? "mb-0" : "mb-1 last:mb-0",
                      filteredScopes.includes(env_scope) || searchScope === ""
                        ? "h-8 px-2 py-1"
                        : "h-0 mb-0",
                    )}
                    onClick={() => setSearchScope(env_scope)}
                    key={env_scope}
                  >
                    {env_scope}
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
                setIsUploading(true);
                if (
                  fileInputRef.current &&
                  fileInputRef.current.files &&
                  userData.accessToken
                ) {
                  const fileContent = (
                    await readInputFile(fileInputRef.current.files[0])
                  ).trim();
                  const variables: Record<
                    ProjectVariableSchema["key"],
                    ProjectVariableSchema["value"]
                  > = {};
                  for (const variable of fileContent.split("\n")) {
                    const [key, ...valueSplit] = variable.split("=");
                    const value = valueSplit.join("=");
                    variables[key] = value;
                  }
                  await uploadVariablesMutation.mutateAsync({
                    variables: variables,
                    environment_scope: searchScope,
                    oauthToken: userData.accessToken,
                  });
                  uploadVariablesMutation.reset();
                  await queryClient.invalidateQueries({
                    queryKey: [
                      "variables",
                      props.projectId,
                      userData.accessToken,
                    ],
                  });
                }
                setIsUploading(false);
                handleDialogOpenClose(false);
              }}
            >
              <p
                className={cn(
                  "overflow-hidden duration-300 whitespace-nowrap text-left",
                  props.env_scopes.includes(searchScope) || uploadButtonDisabled
                    ? "w-0"
                    : "w-28",
                )}
              >
                Create env and
              </p>
              <Loader2
                className={cn(
                  "animate-spin overflow-hidden",
                  isUploading ? "w-6 h-6 mr-2" : "w-0 h-0",
                )}
                style={{ transitionDuration: "300ms" }}
              />
              <p>{isUploading ? "Uploading..." : "Upload"}</p>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
