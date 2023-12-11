import React from "react";
import { ProjectVariableSchema } from "@gitbeaker/rest";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import variablesToScopes from "@/lib/variablesToScopes";

type UploadEnvSelectorProps = {
  variables: ProjectVariableSchema[];
  enabled: boolean;
};

export default function UploadEnvSelector(props: UploadEnvSelectorProps) {
  const [envScopes, setEnvScopes] = React.useState(
    variablesToScopes(props.variables),
  );
  const [searchScope, setSearchScope] = React.useState(
    envScopes.length === 1 ? envScopes[0] : "",
  );

  const filteredScopes = envScopes.filter(
    (envScope) =>
      envScope.toLowerCase().includes(searchScope.toLowerCase()) ||
      searchScope === "",
  );

  return (
    <div
      className={cn(
        "duration-300 flex flex-col gap-2",
        props.enabled ? "h-52" : "h-0 overflow-hidden",
      )}
    >
      <div className="flex">
        <Input
          onChange={(e) => setSearchScope(e.currentTarget.value)}
          value={searchScope}
          placeholder="Search for environment scope..."
        />
        <Button
          size="icon"
          variant="outline"
          className={cn(
            "group/createenv duration-300 transition-all",
            envScopes.includes(searchScope.toLowerCase()) || searchScope === ""
              ? "w-0 border-none"
              : "w-10 ml-3",
          )}
          onClick={(e) => {
            e.preventDefault();
            setEnvScopes((oldEnvScopes) => oldEnvScopes.concat([searchScope]));
          }}
        >
          <Plus className="duration-300 group-hover/createenv:rotate-90 h-6 w-6" />
        </Button>
      </div>
      <ScrollArea
        className={cn(
          "duration-300 overflow-auto px-3 py-2 border rounded-md",
          (searchScope !== "" && filteredScopes.length < 1) ||
            (filteredScopes.length === 1 && filteredScopes[0] === searchScope)
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
  );
}
