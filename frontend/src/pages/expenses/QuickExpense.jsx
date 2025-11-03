import { useEffect, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useExpenses } from "@/contexts/ExpenseContext";
import { CATEGORIES, PAYMENT_METHODS } from "@/constants/expensesConstants";

export const QuickExpense = ({ expense, trigger, view = false }) => {
  const today = new Date().toISOString().split("T")[0];
  const { addExpense, updateExpense } = useExpenses();

  const [formData, setFormData] = useState({
    date: today,
    category: "",
    subCategory: "",
    amount: "",
    description: "",
    paymentMethod: "cash",
    vendor: { name: "", phone: "", address: "" },
    quantity: "",
    unit: "",
    isRecurring: false,
    recurringFrequency: "",
    tags: "",
  });

  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Prefill when editing or viewing
  useEffect(() => {
    if (open) {
      if (expense) {
        setFormData({
          date: expense.date?.split("T")[0] || today,
          category: expense.category || "",
          subCategory: expense.subCategory || "",
          amount: expense.amount || "",
          description: expense.description || "",
          paymentMethod: expense.paymentMethod || "cash",
          vendor: expense.vendor || { name: "", phone: "", address: "" },
          quantity: expense.quantity || "",
          unit: expense.unit || "",
          isRecurring: expense.isRecurring || false,
          recurringFrequency: expense.recurringFrequency || "",
          tags: (expense.tags || []).join(", "),
        });
      } else {
        // Reset for new
        setFormData({
          date: today,
          category: "",
          subCategory: "",
          amount: "",
          description: "",
          paymentMethod: "cash",
          vendor: { name: "", phone: "", address: "" },
          quantity: "",
          unit: "",
          isRecurring: false,
          recurringFrequency: "",
          tags: "",
        });
      }
      setErrors({});
    }
  }, [open, expense]);

  const handleChange = (field, value) => {
    if (view) return; // prevent edits in view mode
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  // ✅ Validate required fields only
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
    if (view) return; // no submit in view mode
    if (!validate()) return;

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags
          ? formData.tags.split(",").map((t) => t.trim())
          : [],
      };

      if (expense?._id) {
        await updateExpense(expense._id, payload);
      } else {
        await addExpense(payload);
      }
      setOpen(false);
    } catch (error) {
      console.error("Expense save failed:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{trigger}</SheetTrigger>

      <SheetContent side="right" className="p-0 overflow-y-auto">
        <SheetHeader className="p-6 pb-2 border-b">
          <SheetTitle>
            {view ? "View Expense" : expense ? "Edit Expense" : "Add Expense"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-6 py-4">
          {/* Date */}
          <div className="space-y-1">
            <Label>Date</Label>
            <Input
              type="date"
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
            {view ? (
              <Input value={formData.category} />
            ) : (
              <Select
                value={formData.category}
                onValueChange={(val) => handleChange("category", val)}
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
            )}
            {errors.category && (
              <p className="text-red-500 text-sm">{errors.category}</p>
            )}
          </div>

          {/* Sub-Category */}
          <div className="space-y-1">
            <Label>Sub-Category (Optional)</Label>
            <Input
              placeholder="Optional sub-category"
              value={formData.subCategory}
              onChange={(e) => handleChange("subCategory", e.target.value)}
            />
          </div>

          {/* Quantity + Unit */}
          <div className="flex gap-2">
            <div className="w-1/2 space-y-1">
              <Label>Quantity (Optional)</Label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
              />
            </div>
            <div className="w-1/2 space-y-1">
              <Label>Unit (Optional)</Label>
              <Input
                value={formData.unit}
                onChange={(e) => handleChange("unit", e.target.value)}
              />
            </div>
          </div>

          {/* Amount */}
          <div className="space-y-1">
            <Label>Amount (₹)</Label>
            <Input
              type="number"
              placeholder="Enter total expense amount"
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
            {view ? (
              <Input value={formData.paymentMethod} />
            ) : (
              <Select
                value={formData.paymentMethod}
                onValueChange={(val) => handleChange("paymentMethod", val)}
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
            )}
            {errors.paymentMethod && (
              <p className="text-red-500 text-sm">{errors.paymentMethod}</p>
            )}
          </div>

          {/* Vendor Info */}
          <div className="space-y-1">
            <Label>Vendor Name (Optional)</Label>
            <Input
              value={formData.vendor.name}
              onChange={(e) =>
                handleChange("vendor", {
                  ...formData.vendor,
                  name: e.target.value,
                })
              }
            />
            <Label>Vendor Phone (Optional)</Label>
            <Input
              value={formData.vendor.phone}
              onChange={(e) =>
                handleChange("vendor", {
                  ...formData.vendor,
                  phone: e.target.value,
                })
              }
            />
            <Label>Vendor Address (Optional)</Label>
            <Textarea
              rows={2}
              value={formData.vendor.address}
              onChange={(e) =>
                handleChange("vendor", {
                  ...formData.vendor,
                  address: e.target.value,
                })
              }
            />
          </div>

          {/* Recurring Expense */}
          <div className="space-y-1">
            <Label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={formData.isRecurring}
                onChange={(e) => handleChange("isRecurring", e.target.checked)}
              />
              Is Recurring? (Optional)
            </Label>

            {formData.isRecurring &&
              (view ? (
                <Input value={formData.recurringFrequency} />
              ) : (
                <Select
                  value={formData.recurringFrequency}
                  onValueChange={(val) =>
                    handleChange("recurringFrequency", val)
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select frequency" />
                  </SelectTrigger>
                  <SelectContent>
                    {["daily", "weekly", "monthly", "yearly"].map((f) => (
                      <SelectItem key={f} value={f}>
                        {f.charAt(0).toUpperCase() + f.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
          </div>

          {/* Tags */}
          <div className="space-y-1">
            <Label>Tags (comma-separated) (Optional)</Label>
            <Input
              placeholder="e.g. organic, fuel, tools"
              value={formData.tags}
              onChange={(e) => handleChange("tags", e.target.value)}
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <Label>Description</Label>
            <Textarea
              rows={3}
              placeholder="Briefly describe this expense"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>
        </form>

        {/* Footer */}
        <SheetFooter className="flex justify-between p-6 border-t">
          {view ? (
            <SheetClose asChild>
              <Button variant="secondary">Close</Button>
            </SheetClose>
          ) : (
            <>
              <Button
                type="submit"
                disabled={isSaving}
                className="flex items-center gap-2"
                onClick={handleSubmit}
              >
                {isSaving && <Spinner />}
                {isSaving
                  ? expense
                    ? "Updating..."
                    : "Saving..."
                  : expense
                  ? "Update Expense"
                  : "Add Expense"}
              </Button>

              <SheetClose asChild>
                <Button
                  type="button"
                  variant="destructive"
                  disabled={isSaving}
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </Button>
              </SheetClose>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
