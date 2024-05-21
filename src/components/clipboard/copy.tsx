import React from "react";
import { useClipboard } from "@mantine/hooks";
import { Button, ButtonProps } from "@/components/ui/button";
import { Check, Copy, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export default function CopyToClipboard(props: {
  value: string;
  variant?: ButtonProps["variant"];
}) {
  const clipboard = useClipboard();

  return (
    <Button
      variant={props.variant || "outline"}
      size="icon"
      onClick={(event) => {
        event.preventDefault();
        if (clipboard.error === null) {
          clipboard.copy(props.value);
        }
      }}
    >
      <Copy
        className={cn(
          "absolute transition-all",
          clipboard.error !== null || clipboard.copied
            ? "rotate-90 scale-0"
            : "rotate-0 scale-100",
        )}
      />
      <Check
        className={cn(
          "absolute transition-all text-green-500",
          clipboard.error === null && clipboard.copied
            ? "rotate-0 scale-100"
            : "-rotate-90 scale-0",
        )}
      />
      <TriangleAlert
        className={cn(
          "absolute transition-all text-yellow-500",
          clipboard.error !== null
            ? "rotate-0 scale-100"
            : "-rotate-90 scale-0",
        )}
      />
    </Button>
  );
}
