import React from "react";
import { useInputState } from "@mantine/hooks";
import { CirclePlus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { CreateVarProps } from "@/types/variables/createvar";
import RevealButton from "@/components/revealbutton";

export default function CreateVar(props: CreateVarProps) {
  const { toast } = useToast();
  const [newVar, setNewVar] = useInputState("");

  function setExtraVarsProxy(value: string) {
    const filteredValue = value.replaceAll(" ", "_");
    if (!Object.keys(props.consolidatedVariables).includes(filteredValue)) {
      props.setExtraVars((oldExtraVars) => {
        return [...oldExtraVars, filteredValue];
      });
      setNewVar("");
      return true;
    } else {
      setNewVar(filteredValue);
      toast({ title: "Variable already exists", description: filteredValue });
    }
    return false;
  }

  return (
    <RevealButton
      textInput={newVar}
      setTextInput={setNewVar}
      onInputEnterKeyPress={() => {
        if (newVar !== "") {
          return setExtraVarsProxy(newVar);
        }
        return false;
      }}
      actionName="New Variable"
      openClassname="sm:w-72"
      className="sm:w-40"
      variant="outline"
      hoverIcon={CirclePlus}
    />
  );
}
