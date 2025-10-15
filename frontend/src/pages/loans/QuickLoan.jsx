import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const QuickLoan = ({ open, onClose, onSubmit }) => {
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({ startDate: today });

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
    onClose();
    setFormData({ startDate: today });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] md:max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Loan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Lender Name</Label>
            <Input
              type="text"
              required
              value={formData.lenderName || ""}
              onChange={(e) => handleChange("lenderName", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Loan Amount (₹)</Label>
            <Input
              type="number"
              required
              value={formData.loanAmount || ""}
              onChange={(e) => handleChange("loanAmount", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Interest Rate (%)</Label>
            <Input
              type="number"
              step="0.1"
              required
              value={formData.interestRate || ""}
              onChange={(e) => handleChange("interestRate", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Start Date</Label>
            <Input
              type="date"
              required
              value={formData.startDate}
              onChange={(e) => handleChange("startDate", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Duration (months)</Label>
            <Input
              type="number"
              required
              value={formData.duration || ""}
              onChange={(e) => handleChange("duration", e.target.value)}
            />
          </div>
          <DialogFooter className="pt-4 flex justify-between">
            <Button type="button" variant="destructive" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Loan</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
