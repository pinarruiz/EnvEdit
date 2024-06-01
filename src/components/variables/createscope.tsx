import React from "react";
import { useInputState } from "@mantine/hooks";
import { useToast } from "@/components/ui/use-toast";
import { CreateScopeProps } from "@/types/variables/createscope";
import RevealInputButton from "@/components/buttons/revealinput";

export default function CreateScope(props: CreateScopeProps) {
  const { toast } = useToast();
  const [newScopeValue, setNewScopeValue] = useInputState("");

  function setExtraEnvsProxy(value: string) {
    if (!props.envScopes.includes(value)) {
      props.setExtraEnvs((oldExtraEnvs) => [...oldExtraEnvs, value]);
      setNewScopeValue("");
      return true;
    } else {
      toast({ title: "Environment scope already exists", description: value });
    }
    return false;
  }

  return (
    <RevealInputButton
      textInput={newScopeValue}
      setTextInput={setNewScopeValue}
      onInputEnterKeyPress={() => {
        if (newScopeValue !== "") {
          return setExtraEnvsProxy(newScopeValue);
        }
        return false;
      }}
      actionName="New Scope"
    />
  );
}
