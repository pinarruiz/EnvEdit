import React from "react";
import { useTimeout, useToggle } from "@mantine/hooks";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import { Check, CircleX, LucideIcon } from "lucide-react";
import IconRevealButton from "@/components/buttons/iconreveal";

type RevealInputButtonProps = {
  textInput: string;
  setTextInput: Function;
  onInputEnterKeyPress: Function;
  actionName: string;
  className?: string;
  variant?: ButtonProps["variant"];
  openClassname?: string;
  autoHideTimeoutMs?: number;
  hoverIcon?: LucideIcon;
  loading?: boolean;
};

export default function RevealInputButton(props: RevealInputButtonProps) {
  const { start: startHideTime, clear: clearHideTime } = useTimeout(() => {
    setIsWriting(false);
    props.setTextInput("");
  }, props.autoHideTimeoutMs || 10000);

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
      <IconRevealButton
        icon={props.hoverIcon}
        variant={props.variant}
        loading={props.loading}
        className={cn(
          sharedClassName,
          isWriting && "w-0 sm:w-0 md:w-0 p-0 border-0",
        )}
        onClick={(event) => {
          event.preventDefault();
          startHideTime();
          setIsWriting();
        }}
      >
        {props.actionName}
      </IconRevealButton>
      <div
        className={cn(
          sharedClassName,
          "flex gap-2",
          !isWriting && "sm:w-0 md:w-0 w-0",
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
