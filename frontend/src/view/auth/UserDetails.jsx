import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { TypographyH3 } from "@/custom/Typography";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/contexts/AuthContext";
import { registerUser } from "@/services/authService";
import { useNavigate } from "react-router-dom";

export default function UserDetails() {
  const { user, setUser } = useAuth();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    language: "en",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  // 🔹 Validation
  const validateForm = () => {
    const newErrors = { name: "", email: "" };
    let valid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Full name is required.";
      valid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
      valid = false;
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // 🔹 Handle input change
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
    setErrors((prev) => ({ ...prev, [id]: "" }));
  };

  // 🔹 Language change
  const handleLanguageChange = (value) => {
    setFormData((prev) => ({ ...prev, language: value }));
  };

  // 🔹 Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setServerError("");

    try {
      // Register/update user details in backend
      const res = await registerUser(formData);

      if (res.success) {
        setUser(res.user); // update context user
        // setStep("dashboard"); // move to dashboard
        navigate("/dashboard"); // move to dashboard
      } else {
        setServerError(res.message || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      setServerError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center max-w-md mx-auto">
      <TypographyH3>Fill Your Details</TypographyH3>

      <form onSubmit={handleSubmit} className="mt-6">
        <FieldGroup className="gap-5">
          {/* Full Name */}
          <Field className="grid gap-2 text-left">
            <FieldLabel htmlFor="name">Full Name</FieldLabel>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name}</p>
            )}
          </Field>

          {/* Email */}
          <Field className="grid gap-2 text-left">
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email}</p>
            )}
          </Field>

          {/* phone */}
          <Field className="grid gap-2 text-left">
            <FieldLabel htmlFor="phone">phone Number</FieldLabel>
            <Input id="phone" type="text" value={formData.phone} disabled />
          </Field>

          {/* Language */}
          <Field className="grid gap-3 text-left">
            <FieldLabel>Select Language</FieldLabel>
            <RadioGroup
              value={formData.language}
              onValueChange={handleLanguageChange}
              className="grid grid-cols-3 gap-3"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="en" id="lang-en" />
                <FieldLabel htmlFor="lang-en">English</FieldLabel>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="mr" id="lang-mr" />
                <FieldLabel htmlFor="lang-mr">मराठी</FieldLabel>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="hi" id="lang-hi" />
                <FieldLabel htmlFor="lang-hi">हिन्दी</FieldLabel>
              </div>
            </RadioGroup>
          </Field>

          {/* Server Error */}
          {serverError && (
            <p className="text-red-500 text-sm text-center">{serverError}</p>
          )}

          {/* Submit */}
          <FieldGroup>
            <Field className="text-center">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Submitting..." : "Continue"}
              </Button>
              <FieldDescription className="px-6 text-center mt-3">
                Want to change your phone number?{" "}
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  onClick={() => alert("phone number change flow here")}
                >
                  Change
                </Button>
              </FieldDescription>
            </Field>
          </FieldGroup>
        </FieldGroup>
      </form>
    </div>
  );
}
