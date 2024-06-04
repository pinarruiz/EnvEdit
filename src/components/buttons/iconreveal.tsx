import React from "react";
import { Loader2, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";

type IconRevealButtonProps = Pick<ButtonProps, "variant" | "onClick"> & {
  loading?: boolean;
  icon?: LucideIcon;
  className?: string;
  children?: React.ReactNode;
};

export default function IconRevealButton(props: IconRevealButtonProps) {
  return (
    <Button
      disabled={props.loading}
      onClick={props.onClick}
      variant={props.variant}
      className={cn(
        "duration-300 whitespace-nowrap flex group/iconrbutton",
        props.className,
      )}
    >
      <Loader2
        className={cn(
          "opacity-70 animate-spin",
          props.loading ? "mr-3 w-6" : "duration-300 w-0",
        )}
      />
      {props.icon !== undefined && (
        <props.icon className="duration-300 opacity-70 rotate-180 scale-0 w-0 group-hover/iconrbutton:mr-3 group-hover/iconrbutton:rotate-0 group-hover/iconrbutton:scale-100 group-hover/iconrbutton:w-6" />
      )}
      {props.children}
    </Button>
  );
}
