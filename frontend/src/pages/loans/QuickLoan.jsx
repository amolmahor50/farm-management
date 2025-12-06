import { useState, useEffect } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useCreateLoan, useUpdateLoan } from "@/hooks/useLoans";
import {
  loanTypes,
  lenderTypes,
  interestTypes,
  statusTypes,
} from "@/constants/loanConstants";

export const QuickLoan = ({ loan, trigger, view = false }) => {
  const today = new Date().toISOString().split("T")[0];
  const createLoanMutation = useCreateLoan();
  const updateLoanMutation = useUpdateLoan();

  const initialFormState = {
    lenderName: "",
    lenderType: "bank",
    lenderPhone: "",
    lenderAddress: "",
    loanType: "crop_loan",
    interestType: "simple",
    loanAmount: "",
    interestRate: "",
    emiAmount: "",
    duration: "",
    startDate: today,
    purpose: "",
    status: "pending",
    collateral: "",
    guarantorName: "",
    guarantorPhone: "",
    guarantorRelation: "",
    notes: "",
  };

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (loan) {
      setFormData({
        lenderName: loan?.lender?.name || "",
        lenderType: loan?.lender?.type || "bank",
        lenderPhone: loan?.lender?.phone || "",
        lenderAddress: loan?.lender?.address || "",
        loanType: loan?.loanType || "crop_loan",
        interestType: loan?.interestType || "simple",
        loanAmount: loan?.principal || "",
        interestRate: loan?.interestRate || "",
        emiAmount: loan?.emiAmount || "",
        duration: loan?.tenure?.months || "",
        startDate: loan?.startDate
          ? new Date(loan.startDate).toISOString().split("T")[0]
          : today,
        purpose: loan?.purpose || "",
        status: loan?.status || "pending",
        collateral: loan?.collateral?.description || "",
        guarantorName: loan?.guarantor?.name || "",
        guarantorPhone: loan?.guarantor?.phone || "",
        guarantorRelation: loan?.guarantor?.relation || "",
        notes: loan?.notes || "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [loan, open]);

  const handleChange = (field, value) => {
    if (!view) setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (view) return;

    setLoading(true);
    setErrorMsg("");

    try {
      const payload = {
        loanType: formData.loanType,
        interestType: formData.interestType,
        lender: {
          name: formData.lenderName,
          type: formData.lenderType,
          phone: formData.lenderPhone,
          address: formData.lenderAddress,
        },
        principal: Number(formData.loanAmount),
        interestRate: Number(formData.interestRate),
        tenure: { months: Number(formData.duration) },
        emiAmount: Number(formData.emiAmount),
        startDate: new Date(formData.startDate),
        purpose: formData.purpose,
        status: formData.status,
        collateral: formData.collateral || "",
        guarantor: {
          name: formData.guarantorName,
          phone: formData.guarantorPhone,
          relation: formData.guarantorRelation,
        },
        notes: formData.notes,
      };

      if (loan) await editLoan(loan._id, payload);
      else await addLoan(payload);

      await fetchLoans();
      setOpen(false);
      setFormData(initialFormState);
    } catch (err) {
      console.error("Loan operation failed:", err);
      const msg =
        err?.response?.data?.message ||
        "Something went wrong while saving loan.";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  const renderSelectOptions = (options) =>
    options.map((opt) => (
      <SelectItem key={opt.value} value={opt.value}>
        {opt.label}
      </SelectItem>
    ));

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>

      <SheetContent>
        <SheetHeader>
          <SheetTitle>
            {view ? "View Loan" : loan ? "Edit Loan" : "Add Loan"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-4">
          {errorMsg && (
            <p className="text-red-600 text-sm font-medium bg-red-50 border border-red-300 rounded-lg px-3 py-2">
              {errorMsg}
            </p>
          )}

          {/* LENDER INFO */}
          <div className="space-y-2">
            <Label>
              Lender Name <span className="text-red-500">*</span>
            </Label>
            <Input
              required
              value={formData.lenderName}
              onChange={(e) => handleChange("lenderName", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>
                Lender Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.lenderType}
                onValueChange={(v) => handleChange("lenderType", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {renderSelectOptions(lenderTypes)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>
                Loan Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.loanType}
                onValueChange={(v) => handleChange("loanType", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>{renderSelectOptions(loanTypes)}</SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Phone (Optional)</Label>
            <Input
              value={formData.lenderPhone}
              onChange={(e) => handleChange("lenderPhone", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Address (Optional)</Label>
            <Textarea
              rows={2}
              value={formData.lenderAddress}
              onChange={(e) => handleChange("lenderAddress", e.target.value)}
            />
          </div>

          {/* LOAN DETAILS */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>
                Loan Amount (₹) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                required
                value={formData.loanAmount}
                onChange={(e) => handleChange("loanAmount", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Interest Rate (%) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                step="0.1"
                required
                value={formData.interestRate}
                onChange={(e) => handleChange("interestRate", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>
                Interest Type <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.interestType}
                onValueChange={(v) => handleChange("interestType", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {renderSelectOptions(interestTypes)}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>EMI Amount (Optional)</Label>
              <Input
                type="number"
                value={formData.emiAmount}
                onChange={(e) => handleChange("emiAmount", e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-2">
              <Label>
                Duration (Months) <span className="text-red-500">*</span>
              </Label>
              <Input
                type="number"
                required
                value={formData.duration}
                onChange={(e) => handleChange("duration", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>
                Start Date <span className="text-red-500">*</span>
              </Label>
              <Input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => handleChange("startDate", e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Purpose (Optional)</Label>
            <Textarea
              rows={2}
              value={formData.purpose}
              onChange={(e) => handleChange("purpose", e.target.value)}
            />
          </div>

          {/* COLLATERAL & GUARANTOR */}
          <div className="space-y-2">
            <Label>Collateral (Optional)</Label>
            <Input
              value={formData.collateral}
              onChange={(e) => handleChange("collateral", e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Guarantor Name (Optional)</Label>
              <Input
                value={formData.guarantorName}
                onChange={(e) => handleChange("guarantorName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Guarantor Phone (Optional)</Label>
              <Input
                value={formData.guarantorPhone}
                onChange={(e) => handleChange("guarantorPhone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Relation (Optional)</Label>
              <Input
                value={formData.guarantorRelation}
                onChange={(e) =>
                  handleChange("guarantorRelation", e.target.value)
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>
              Status <span className="text-red-500">*</span>
            </Label>
            <Select
              value={formData.status}
              onValueChange={(v) => handleChange("status", v)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>{renderSelectOptions(statusTypes)}</SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Notes (Optional)</Label>
            <Textarea
              rows={2}
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>

          <SheetFooter className="py-4 flex justify-between">
            {!view && (
              <Button type="submit">
                {loading && <Spinner />}
                {loading ? "Saving..." : loan ? "Update Loan" : "Add Loan"}
              </Button>
            )}

            <SheetClose asChild>
              <Button
                type="button"
                variant="destructive"
                onClick={() => setOpen(false)}
              >
                {view ? "Close" : "Cancel"}
              </Button>
            </SheetClose>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
