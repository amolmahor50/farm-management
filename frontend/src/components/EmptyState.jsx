import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

/**
 * Reusable Empty State Component
 * Props:
 * - icon: JSX element (optional)
 * - title: string
 * - description: string
 * - button: JSX element (optional, e.g., <Button> or custom trigger)
 * - className: string (optional extra styling)
 */
export function EmptyState({
  icon,
  title = "No Data",
  description = "There is nothing to display yet.",
  button,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center h-[calc(100vh-20vh)] w-full ${className}`}
    >
      <Empty className="text-center">
        <EmptyHeader>
          <EmptyMedia variant="icon">{icon}</EmptyMedia>
          <EmptyTitle>{title}</EmptyTitle>
          <EmptyDescription>{description}</EmptyDescription>
        </EmptyHeader>

        {button && <EmptyContent>{button}</EmptyContent>}
      </Empty>
    </div>
  );
}
