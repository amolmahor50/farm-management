import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTrigger,
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
import { useExpenses } from "@/contexts/ExpenseContext";
import { CATEGORIES, PAYMENT_METHODS } from "@/constants/expensesConstants";
import { toastError } from "../../utils/toast";

export const QuickExpense = ({ expense, trigger }) => {
  const today = new Date().toISOString().split("T")[0];
  const { addExpense, updateExpense } = useExpenses();

  const [formData, setFormData] = useState({
    date: today,
    category: "",
    amount: "",
    description: "",
    paymentMethod: "cash",
  });

  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      if (expense) {
        setFormData({
          date: expense.date?.split("T")[0] || today,
          category: expense.category || "",
          amount: expense.amount || "",
          description: expense.description || "",
          paymentMethod: expense.paymentMethod || "cash",
        });
      } else {
        setFormData({
          date: today,
          category: "",
          amount: "",
          description: "",
          paymentMethod: "cash",
        });
      }
      setErrors({});
    }
  }, [open, expense]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.date) newErrors.date = "Please select a date.";
    if (!formData.category) newErrors.category = "Please choose a category.";
    if (!formData.amount || Number(formData.amount) <= 0)
      newErrors.amount = "Enter a valid positive amount.";
    if (!formData.description.trim())
      newErrors.description = "Description cannot be empty.";
    if (!formData.paymentMethod)
      newErrors.paymentMethod = "Please select a payment method.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSaving(true);
    try {
      if (expense?._id) {
        await updateExpense(expense._id, formData);
      } else {
        await addExpense(formData);
      }
      setOpen(false);
    } catch (error) {
      console.error("Expense save failed:", error);
      toastError("Please try again...");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent className="max-h-[80vh] md:max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{expense ? "Edit Expense" : "Add Expense"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          {/* Date */}
          <div className="space-y-1">
            <Label>Date</Label>
            <Input
              type="date"
              required
              value={formData.date}
              onChange={(e) => handleChange("date", e.target.value)}
            />
            {errors.date && (
              <p className="text-red-500 text-sm">{errors.date}</p>
            )}
          </div>

          {/* Category */}
          <div className="space-y-1">
            <Label>Category</Label>
            <Select
              value={formData.category}
              onValueChange={(val) => handleChange("category", val)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <Label>Amount (₹)</Label>
            <Input
              type="number"
              value={formData.amount}
              onChange={(e) => handleChange("amount", e.target.value)}
            />
            {errors.amount && (
              <p className="text-red-500 text-sm">{errors.amount}</p>
            )}
          </div>

          {/* Payment Method */}
          <div className="space-y-1">
            <Label>Payment Method</Label>
            <Select
              value={formData.paymentMethod}
              onValueChange={(val) => handleChange("paymentMethod", val)}
              required
            >
              <SelectTrigger className="w-full capitalize">
                <SelectValue placeholder="Select payment method" />
              </SelectTrigger>
              <SelectContent>
                {PAYMENT_METHODS.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method.charAt(0).toUpperCase() + method.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm">{errors.paymentMethod}</p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              rows={3}
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          <DialogFooter className="pt-4 flex justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={() => setOpen(false)}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving
                ? "Saving..."
                : expense
                ? "Update Expense"
                : "Add Expense"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
