import React, { ChangeEventHandler } from "react";
import { useToggle } from "@mantine/hooks";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Check, CircleX } from "lucide-react";

type RevealButtonProps = {
  textInput: string;
  setTextInput: Function;
  onInputEnterKeyPress: Function;
  actionName: string;
  className?: string;
};

export default function RevealButton(props: RevealButtonProps) {
  const [isWriting, setIsWriting] = useToggle([false, true] as const);

  const sharedClassName = cn(
    "overflow-hidden duration-300 transition-[background-color,width,padding,border] w-full sm:w-40",
    props.className,
  );

  return (
    <div className="flex overflow-hidden">
      <Button
        className={cn(sharedClassName, isWriting && "w-0 sm:w-0 p-0 border-0")}
        onClick={(event) => {
          event.preventDefault();
          setIsWriting();
        }}
      >
        {props.actionName}{" "}
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
          onChange={props.setTextInput as ChangeEventHandler}
          onKeyUp={(event) => {
            if (event.key === "Enter") {
              props.onInputEnterKeyPress();
            }
          }}
        />
        <Button
          size="icon"
          variant="outline"
          className="flex"
          onClick={(event) => {
            event.preventDefault();
            if (props.textInput === "") {
              setIsWriting();
            } else {
              props.onInputEnterKeyPress();
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
