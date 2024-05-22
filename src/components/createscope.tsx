import React from "react";
import { useInputState, useToggle } from "@mantine/hooks";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, CircleX } from "lucide-react";
import { CreateScopeProps } from "@/types/createscope";

const sharedClassName =
  "overflow-hidden duration-300 transition-[background-color,width,padding,border] w-full sm:w-40";

export default function CreateScope(props: CreateScopeProps) {
  const [isWriting, setIsWriting] = useToggle([false, true] as const);
  const [newScopeValue, setNewScopeValue] = useInputState("");
  const { toast } = useToast();

  function setExtraEnvs(value: string) {
    if (!props.env_scopes.includes(value)) {
      props.setExtraEnvs((oldExtraEnvs) => [...oldExtraEnvs, value]);
      setNewScopeValue("");
    } else {
      toast({ title: "Environment scope already exists", description: value });
    }
  }

  return (
    <div className="flex overflow-hidden">
      <Button
        className={cn(sharedClassName, isWriting && "w-0 sm:w-0 p-0 border-0")}
        onClick={(event) => {
          event.preventDefault();
          setIsWriting();
        }}
      >
        New Scope
      </Button>
      <div
        className={cn(
          sharedClassName,
          "flex gap-2",
          !isWriting && "sm:w-0 w-0",
        )}
      >
        <Input
          placeholder="New Scope"
          className="focus-visible:ring-transparent"
          value={newScopeValue}
          onChange={setNewScopeValue}
          onKeyUp={(event) => {
            if (event.key === "Enter" && newScopeValue !== "") {
              setExtraEnvs(newScopeValue);
            }
          }}
        />
        <Button
          size="icon"
          variant="outline"
          className="flex"
          onClick={(event) => {
            event.preventDefault();
            if (newScopeValue === "") {
              setIsWriting();
            } else {
              setExtraEnvs(newScopeValue);
            }
          }}
        >
          <CircleX
            className={cn(
              "duration-200",
              newScopeValue !== "" && "w-0 scale-0 -rotate-180",
            )}
          />
          <Check
            className={cn(
              "duration-200",
              newScopeValue === "" && "w-0 scale-0 rotate-180",
            )}
          />
        </Button>
      </div>
    </div>
  );
}
