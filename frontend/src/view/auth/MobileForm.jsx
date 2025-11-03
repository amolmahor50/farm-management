import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { GalleryVerticalEnd } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { TypographyH3 } from "@/custom/Typography";
import { sendLoginOTP } from "@/services/authService";

export default function MobileForm() {
  const { isLoading, setIsLoading, setStep, mobile, setMobile } = useAuth();
  const [validationError, setValidationError] = useState("");

  //  Validate Indian mobile numbers
  const validateMobile = (number) => {
    const regex = /^[6-9]\d{9}$/;
    if (!number) return "Please enter your mobile number.";
    if (!regex.test(number))
      return "Enter a valid 10-digit mobile number starting with 6-9.";
    return "";
  };

  //  Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validateMobile(mobile);
    if (err) {
      setValidationError(err);
      return;
    }

    setValidationError("");
    setIsLoading(true);

    try {
      // Await API response
      const res = await sendLoginOTP(mobile);
      // console.log("OTP Response:", res);

      if (res?.success) {
        // OTP sent successfully → move to OTP step
        setStep("otp");
      } else {
        setValidationError(res?.message || "Failed to send OTP.");
      }
    } catch (error) {
      console.error("OTP Error:", error);
      setValidationError(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          {/* Header */}
          <div className="flex flex-col items-center gap-2 text-center">
            <a
              href="#"
              className="flex flex-col items-center gap-2 font-medium"
            >
              <div className="flex size-8 items-center justify-center rounded-md">
                <GalleryVerticalEnd className="size-6" />
              </div>
              <span className="sr-only">Praj Inc.</span>
            </a>
            <TypographyH3>Welcome to Praj Inc.</TypographyH3>
          </div>

          {/* Mobile Input */}
          <Field>
            <FieldLabel htmlFor="mobile">Mobile Number</FieldLabel>
            <Input
              id="mobile"
              type="tel"
              placeholder="967XXXXXXX"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              maxLength={10}
              className={
                validationError ? "border-red-500 focus:ring-red-500" : ""
              }
            />
          </Field>

          {/* Validation or API Error */}
          {validationError && (
            <p className="text-sm text-red-500 text-center">
              {validationError}
            </p>
          )}

          {/* Submit Button */}
          <Field>
            <Button
              type="submit"
              disabled={mobile.lenght < 6}
              className="w-full flex items-center justify-center gap-2"
            >
              {isLoading && <Spinner />}
              {isLoading ? "Sending OTP..." : "Continue"}
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <FieldDescription className="px-6 text-center text-sm">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline">
          Privacy Policy
        </a>
        .
      </FieldDescription>
    </div>
  );
}
