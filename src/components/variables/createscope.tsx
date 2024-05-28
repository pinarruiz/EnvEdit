import React from "react";
import { useInputState } from "@mantine/hooks";
import { useToast } from "@/components/ui/use-toast";
import { CreateScopeProps } from "@/types/variables/createscope";
import RevealButton from "@/components/revealbutton";

export default function CreateScope(props: CreateScopeProps) {
  const { toast } = useToast();
  const [newScopeValue, setNewScopeValue] = useInputState("");

  function setExtraEnvsProxy(value: string) {
    if (!props.envScopes.includes(value)) {
      props.setExtraEnvs((oldExtraEnvs) => [...oldExtraEnvs, value]);
      setNewScopeValue("");
    } else {
      toast({ title: "Environment scope already exists", description: value });
    }
  }

  return (
    <RevealButton
      textInput={newScopeValue}
      setTextInput={setNewScopeValue}
      onInputEnterKeyPress={() => {
        if (newScopeValue !== "") {
          setExtraEnvsProxy(newScopeValue);
        }
      }}
      actionName="New Scope"
    />
  );
}
