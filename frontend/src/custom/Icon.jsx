import * as LucideIcons from "lucide-react";
import { cn } from "@/lib/utils";

export const Icon = ({ name, size = 20, color, className, ...props }) => {
  const LucideIcon = LucideIcons[name];

  if (!LucideIcon) {
    console.warn(`⚠️ Icon "${name}" not found in lucide-react`);
    return null;
  }

  return (
    <LucideIcon
      size={size}
      color={color}
      className={cn("inline-block", className)}
      {...props}
    />
  );
};
