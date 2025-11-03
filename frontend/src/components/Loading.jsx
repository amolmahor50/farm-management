import { TypographyH6 } from "../custom/Typography";
import { Spinner } from "@/components/ui/spinner";

export function Loading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col gap-3 items-center justify-center">
        {/* <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-primary"></div> */}
        <Spinner className="size-6 text-gray-400" />
        <TypographyH6 className="font-medium">Loading.....</TypographyH6>
      </div>
    </div>
  );
}
