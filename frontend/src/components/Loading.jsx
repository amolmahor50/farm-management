import { TypographyH5 } from "../custom/Typography";
import { Spinner } from "@/components/ui/spinner";

export function Loading() {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-20vh)] w-full">
      <div className="flex flex-col gap-3 items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-primary"></div>
        {/* <Spinner className="size-8 text-primary" /> */}
        <TypographyH5 className="font-medium">Loading.....</TypographyH5>
      </div>
    </div>
  );
}
