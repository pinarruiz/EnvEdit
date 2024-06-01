import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function checkOverflow(ref: HTMLParagraphElement | null): boolean {
  if (ref) {
    return (
      ref.scrollHeight > ref.clientHeight || ref.scrollWidth > ref.clientWidth
    );
  }
  return false;
}
