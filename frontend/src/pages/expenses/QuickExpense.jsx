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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createExpense } from "../../services/expenseService";
import { toastError, toastSuccess } from "@/utils/toast";

export const QuickExpense = ({ open, onClose }) => {
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({ date: today });

  // Backend enum values
  const categories = [
    "seeds",
    "fertilizer",
    "pesticide",
    "labor",
    "irrigation",
    "equipment",
    "transport",
    "electricity",
    "rent",
    "other",
  ];

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await createExpense(formData);
      toastSuccess("Expense added successfully!");
      onClose();
      setFormData({ date: today });
    } catch (error) {
      toastError(error.response?.data?.message || "Failed to add expense");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] md:max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label>Date</Label>
            <Input
              type="date"
              required
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={formData.category || ""}
              onValueChange={(val) => handleChange("category", val)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Amount (₹)</Label>
            <Input
              type="number"
              required
              value={formData.amount || ""}
              onChange={(e) => handleChange("amount", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Crop</Label>
            <Input
              type="text"
              required
              value={formData.crop || ""}
              onChange={(e) => handleChange("crop", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={formData.description || ""}
              onChange={(e) => handleChange("description", e.target.value)}
            />
          </div>

          <DialogFooter className="pt-4 flex justify-between">
            <Button type="button" variant="destructive" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Expense</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
