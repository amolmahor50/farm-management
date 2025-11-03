import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { TypographyH3, TypographyMuted } from "@/custom/Typography";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/contexts/AuthContext";
import { verifyLoginOTP, sendLoginOTP } from "@/services/authService";
import { useNavigate } from "react-router-dom";

export default function OtpForm() {
  const { mobile, setStep, setIsLoading, setUser, logout, isLoading } =
    useAuth();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter a 6-digit OTP.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
      const res = await verifyLoginOTP(mobile, otp);

      if (res.success) {
        const userData = res.user;

        //  Check if user is active and subscription is active
        if (!userData.isActive || !userData.subscription?.isActive) {
          setError(
            "Your account or subscription is inactive... Please contact to support Team"
          );
          return;
        }

        // //  Save user data
        setUser(userData);

        console.log("verifying done..", userData);

        //  Decide next step
        if (userData.name == undefined || userData.email == undefined) {
          setStep("userDetails");
        } else {
          navigate("/dashboard");
        }
      } else {
        setError(res.message || "Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || "Failed to verify OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setResendLoading(true);
    try {
      const res = await sendLoginOTP(mobile);
      if (res?.success) {
        setError("A new OTP has been sent to your mobile number.");
      } else {
        setError(res?.message || "Failed to resend OTP.");
      }
    } catch (err) {
      console.error(err);
      setError("Error resending OTP. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <form onSubmit={handleSubmit}>
        <FieldGroup>
          <div className="flex flex-col items-center gap-1 text-center">
            <TypographyH3>Enter verification code</TypographyH3>
            <TypographyMuted>
              We sent a 6-digit code to your mobile number {mobile}.
            </TypographyMuted>
          </div>

          <Field>
            <FieldLabel htmlFor="otp" className="sr-only">
              Verification code
            </FieldLabel>
            <InputOTP
              id="otp"
              maxLength={6}
              value={otp}
              onChange={(value) => setOtp(value)}
              required
            >
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup className="gap-2">
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>

            <FieldDescription className="text-center">
              Enter the 6-digit code sent to your mobile.{" "}
              <span
                onClick={() => setStep("mobile")}
                className="text-blue-600 cursor-pointer hover:underline"
              >
                Change Mobile Number
              </span>
            </FieldDescription>
          </Field>

          <Button
            type="submit"
            disabled={isLoading || otp.length !== 6}
            className="w-full flex items-center justify-center gap-2"
          >
            {isLoading && <Spinner className="size-4" />}
            {isLoading ? "Verifying..." : "Verify"}
          </Button>

          <span className="text-sm text-red-500">{error}</span>

          <FieldDescription className="text-center">
            Didn&apos;t receive the code?{" "}
            <Button
              variant="link"
              size="sm"
              type="button"
              onClick={handleResend}
              disabled={resendLoading}
            >
              {resendLoading && <Spinner />}
              {resendLoading ? "Resending..." : "Resend"}
            </Button>
          </FieldDescription>
        </FieldGroup>
      </form>
    </div>
  );
}

// 8788673748
