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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const QuickYield = ({ open, onClose, onSubmit }) => {
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({ date: today });

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(formData);
    onClose();
    setFormData({ date: today });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] md:max-w-md overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Yield</DialogTitle>
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
            <Label>Crop</Label>
            <Input
              type="text"
              required
              value={formData.crop || ""}
              onChange={(e) => handleChange("crop", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input
              type="number"
              required
              value={formData.quantity || ""}
              onChange={(e) => handleChange("quantity", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label>Unit</Label>
            <Select
              value={formData.unit || ""}
              onValueChange={(val) => handleChange("unit", val)}
              required
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select unit" />
              </SelectTrigger>
              <SelectContent>
                {["kg", "ton", "quintal"].map((unit) => (
                  <SelectItem key={unit} value={unit}>
                    {unit}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Price per Unit (₹)</Label>
            <Input
              type="number"
              required
              value={formData.pricePerUnit || ""}
              onChange={(e) => handleChange("pricePerUnit", e.target.value)}
            />
          </div>
          <DialogFooter className="pt-4 flex justify-between">
            <Button type="button" variant="destructive" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Yield</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
