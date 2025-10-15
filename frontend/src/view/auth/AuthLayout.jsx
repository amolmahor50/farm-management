import { Button } from "@/components/ui/button";
import { Tractor } from "lucide-react";
import MobileForm from "./MobileForm";
import OtpForm from "./OtpForm";
import UserDetails from "./UserDetails";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthLayout() {
  const { step, logout, user } = useAuth();

  const renderStep = () => {
    switch (step) {
      case "mobile":
        return <MobileForm />;
      case "otp":
        return <OtpForm />;
      case "userDetails":
        return <UserDetails />;
      default:
        return <MobileForm />;
    }
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Right Form Panel */}
      <div className="flex flex-col gap-4">
        {/* Header */}
        <div className="flex justify-between gap-2 items-center border-b p-3">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="bg-primary text-primary-foreground flex h-8 w-8 items-center justify-center rounded-md">
              <Tractor className="h-6 w-6" />
            </div>
            Praj Inc.
          </a>

          {user && (
            <Button
              onClick={logout}
              size="sm"
              variant="link"
              className="text-blue-800"
            >
              {" "}
              Logout
            </Button>
          )}
        </div>

        {/* Step Form */}
        <div className="flex flex-1 items-center justify-center p-6">
          <div className="w-full max-w-sm">{renderStep()}</div>
        </div>
      </div>

      {/* Left Image Panel */}
      <div className="bg-muted relative block">
        <img
          src="https://farmonaut.com/wp-content/uploads/2024/10/Revolutionizing-Iowa-Farms-How-Precision-Agriculture-Software-Optimizes-Field-Performance-and-Crop-Health_1.jpg"
          alt="Image"
          className="absolute inset-0 md:h-full h-96 w-full object-cover"
        />
        {/* Black overlay */}
        <div className="absolute inset-0 h-96 md:h-full bg-black opacity-50"></div>
      </div>
    </div>
  );
}
