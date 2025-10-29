import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useYields } from "@/contexts/YieldContext";
import { Icon } from "@/custom/Icon";
import {
  cropTypes,
  seasons,
  units,
  buyerTypes,
} from "@/constants/yieldConstants";

export const QuickYield = ({ trigger, yieldData = null }) => {
  const { addYield, editYield } = useYields();
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  // ✅ Initial Form State
  const [formData, setFormData] = useState({
    cropName: "",
    cropType: "",
    season: "",
    plantingDate: today,
    quantity: "",
    unit: "",
    sellingPricePerUnit: "",
    sellingTotalPrice: "",
    buyerName: "",
    buyerPhone: "",
    buyerType: "",
    notes: "",
  });

  // ✅ Error State
  const [errors, setErrors] = useState({});

  // ✅ Load Existing Data (for Edit)
  useEffect(() => {
    if (yieldData) {
      setFormData({
        cropName: yieldData.cropName || "",
        cropType: yieldData.cropType || "",
        season: yieldData.season || "",
        plantingDate: yieldData.plantingDate
          ? new Date(yieldData.plantingDate).toISOString().split("T")[0]
          : today,
        quantity: yieldData.quantity || "",
        unit: yieldData.unit || "",
        sellingPricePerUnit: yieldData.sellingPrice?.pricePerUnit || "",
        sellingTotalPrice: yieldData.sellingPrice?.totalPrice || "",
        buyerName: yieldData.buyer?.name || "",
        buyerPhone: yieldData.buyer?.phone || "",
        buyerType: yieldData.buyer?.type || "",
        notes: yieldData.notes || "",
      });
    }
  }, [yieldData, open]);

  // ✅ Auto calculate total price
  useEffect(() => {
    if (formData.quantity && formData.sellingPricePerUnit) {
      const total =
        Number(formData.quantity) * Number(formData.sellingPricePerUnit);
      setFormData((prev) => ({
        ...prev,
        sellingTotalPrice: total.toFixed(2),
      }));
    }
  }, [formData.quantity, formData.sellingPricePerUnit]);

  // ✅ Handle change
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" })); // clear error when typing
  };

  // ✅ Validation
  const validate = () => {
    const newErrors = {};
    if (!formData.cropName.trim()) newErrors.cropName = "Crop name is required";
    if (!formData.cropType) newErrors.cropType = "Select crop type";
    if (!formData.season) newErrors.season = "Select season";
    if (!formData.quantity) newErrors.quantity = "Enter quantity";
    if (!formData.unit) newErrors.unit = "Select unit";
    if (!formData.sellingPricePerUnit)
      newErrors.sellingPricePerUnit = "Enter price per unit";
    return newErrors;
  };

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }

    try {
      const payload = {
        cropName: formData.cropName.trim(),
        cropType: formData.cropType,
        season: formData.season,
        plantingDate: formData.plantingDate,
        quantity: Number(formData.quantity),
        unit: formData.unit,
        sellingPrice: {
          pricePerUnit: Number(formData.sellingPricePerUnit),
          totalPrice: Number(formData.sellingTotalPrice),
          currency: "INR",
        },
        buyer: {
          name: formData.buyerName,
          phone: formData.buyerPhone,
          type: formData.buyerType,
        },
        notes: formData.notes,
      };

      if (yieldData?._id) {
        await editYield(yieldData._id, payload);
      } else {
        await addYield(payload);
      }

      setOpen(false);
    } catch (error) {
      console.error("Error saving yield:", error);
    }
  };

  // ✅ UI
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {trigger ? (
        <DialogTrigger asChild>{trigger}</DialogTrigger>
      ) : (
        <DialogTrigger asChild>
          <Button>
            <Icon name="Plus" /> Add Yield
          </Button>
        </DialogTrigger>
      )}

      <DialogContent className="max-h-[85vh] md:max-w-2xl overflow-y-auto rounded-2xl shadow-lg border border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-800">
            {yieldData ? "Edit Yield" : "Add New Yield"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-3 text-gray-700">
          {/* Crop Details */}
          <div className="grid grid-cols-2 gap-4">
            {/* Crop Name */}
            <div className="space-y-2">
              <Label>Crop Name *</Label>
              <Input
                placeholder="e.g., Wheat"
                value={formData.cropName}
                onChange={(e) => handleChange("cropName", e.target.value)}
              />
              {errors.cropName && (
                <p className="text-red-500 text-sm">{errors.cropName}</p>
              )}
            </div>

            {/* Crop Type */}
            <div className="space-y-2">
              <Label>Crop Type *</Label>
              <Select
                value={formData.cropType}
                onValueChange={(v) => handleChange("cropType", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select crop type" />
                </SelectTrigger>
                <SelectContent>
                  {cropTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.cropType && (
                <p className="text-red-500 text-sm">{errors.cropType}</p>
              )}
            </div>

            {/* Season */}
            <div className="space-y-2">
              <Label>Season *</Label>
              <Select
                value={formData.season}
                onValueChange={(v) => handleChange("season", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.season && (
                <p className="text-red-500 text-sm">{errors.season}</p>
              )}
            </div>

            {/* Planting Date */}
            <div className="space-y-2">
              <Label>Planting Date (optional)</Label>
              <Input
                type="date"
                value={formData.plantingDate}
                onChange={(e) => handleChange("plantingDate", e.target.value)}
              />
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label>Quantity *</Label>
              <Input
                type="number"
                placeholder="e.g., 500"
                value={formData.quantity}
                onChange={(e) => handleChange("quantity", e.target.value)}
              />
              {errors.quantity && (
                <p className="text-red-500 text-sm">{errors.quantity}</p>
              )}
            </div>

            {/* Unit */}
            <div className="space-y-2">
              <Label>Unit *</Label>
              <Select
                value={formData.unit}
                onValueChange={(v) => handleChange("unit", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.unit && (
                <p className="text-red-500 text-sm">{errors.unit}</p>
              )}
            </div>
          </div>

          {/* Price & Buyer Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Price per Unit (₹) *</Label>
              <Input
                type="number"
                value={formData.sellingPricePerUnit}
                onChange={(e) =>
                  handleChange("sellingPricePerUnit", e.target.value)
                }
              />
              {errors.sellingPricePerUnit && (
                <p className="text-red-500 text-sm">
                  {errors.sellingPricePerUnit}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Total Price (₹)</Label>
              <Input
                type="number"
                value={formData.sellingTotalPrice}
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label>Buyer Name (optional)</Label>
              <Input
                value={formData.buyerName}
                onChange={(e) => handleChange("buyerName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Buyer Phone (optional)</Label>
              <Input
                value={formData.buyerPhone}
                onChange={(e) => handleChange("buyerPhone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Buyer Type (optional)</Label>
              <Select
                value={formData.buyerType}
                onValueChange={(v) => handleChange("buyerType", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select buyer type" />
                </SelectTrigger>
                <SelectContent>
                  {buyerTypes.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label>Notes (optional)</Label>
            <Textarea
              placeholder="Add any remarks..."
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </div>

          {/* Footer */}
          <DialogFooter className="pt-5 flex justify-end gap-3">
            <Button
              variant="destructive"
              type="button"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {yieldData ? "Update Yield" : "Add Yield"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
