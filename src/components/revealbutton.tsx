import React from "react";
import { useTimeout, useToggle } from "@mantine/hooks";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { Check, CircleX } from "lucide-react";

type RevealButtonProps = {
  textInput: string;
  setTextInput: Function;
  onInputEnterKeyPress: Function;
  actionName: string;
  className?: string;
  variant?: ButtonProps["variant"];
  openClassname?: string;
  autoHideTimeoutMs?: number;
};

export default function RevealButton(props: RevealButtonProps) {
  const { start: startHideTime, clear: clearHideTime } = useTimeout(() => {
    setIsWriting(false);
    props.setTextInput("");
  }, props.autoHideTimeoutMs || 8000);

  const [isWriting, setIsWriting] = useToggle([false, true] as const);

  function setTextInputProxy(event: React.ChangeEvent<HTMLInputElement>) {
    if (event.target.value !== "") {
      clearHideTime();
    }
    props.setTextInput(event);
  }

  const sharedClassName = cn(
    "overflow-hidden duration-300 transition-[background-color,width,padding,border] w-full sm:w-44",
    props.className,
    isWriting && props.openClassname,
  );

  return (
    <div className="flex overflow-hidden">
      <Button
        className={cn(sharedClassName, isWriting && "w-0 sm:w-0 p-0 border-0")}
        variant={props.variant}
        onClick={(event) => {
          event.preventDefault();
          setIsWriting();
        }}
      >
        {props.actionName}
      </Button>
      <div
        className={cn(
          sharedClassName,
          "flex gap-2",
          !isWriting && "sm:w-0 w-0",
        )}
      >
        <Input
          placeholder={props.actionName}
          className="focus-visible:ring-transparent"
          value={props.textInput}
          onChange={setTextInputProxy}
          onKeyUp={(event) => {
            if (event.key === "Enter") {
              if (props.onInputEnterKeyPress()) {
                startHideTime();
              }
            }
          }}
        />
        <Button
          size="icon"
          variant="outline"
          className="flex px-1"
          onClick={(event) => {
            event.preventDefault();
            if (props.textInput === "") {
              setIsWriting();
            } else {
              if (props.onInputEnterKeyPress()) {
                startHideTime();
              }
            }
          }}
        >
          <CircleX
            className={cn(
              "duration-200",
              props.textInput !== "" && "w-0 scale-0 -rotate-180",
            )}
          />
          <Check
            className={cn(
              "duration-200",
              props.textInput === "" && "w-0 scale-0 rotate-180",
            )}
          />
        </Button>
      </div>
    </div>
  );
}
