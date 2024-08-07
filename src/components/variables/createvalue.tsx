import React from "react";
import { useInputState } from "@mantine/hooks";
import { useToast } from "@/components/ui/use-toast";
import RevealInputButton from "@/components/buttons/revealinput";
import { CreateValueProps } from "@/types/variables/createvalue";

export default function CreateValue(props: CreateValueProps) {
  const { toast } = useToast();
  const [newValue, setNewValue] = useInputState("");

  function setExtraEnvsProxy(value: string) {
    if (!Object.keys(props.variablePool).includes(value)) {
      props.setExtraEnvsValues((oldExtraEnvsValues) => {
        return { ...oldExtraEnvsValues, [value]: [] };
      });
      setNewValue("");
      return true;
    } else {
      toast({ title: "Value already exists", description: value });
    }
    return false;
  }

  return (
    <RevealInputButton
      textInput={newValue}
      setTextInput={setNewValue}
      onInputEnterKeyPress={() => {
        if (newValue !== "") {
          return setExtraEnvsProxy(newValue);
        }
        return false;
      }}
      actionName="New Value"
    />
  );
}
