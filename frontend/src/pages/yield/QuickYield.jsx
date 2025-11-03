import { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
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

// ✅ Label Component
const FieldLabel = ({ text, required }) => (
  <Label className="flex items-center gap-1 font-medium">
    {text.charAt(0).toUpperCase() + text.slice(1)}
    {required ? (
      <span className="text-red-500">*</span>
    ) : (
      <span className="text-gray-400 text-xs">(optional)</span>
    )}
  </Label>
);

export const QuickYield = ({ trigger, yieldData = null, view = false }) => {
  const { addYield, editYield, loading } = useYields();
  const [open, setOpen] = useState(false);
  const today = new Date().toISOString().split("T")[0];

  const [form, setForm] = useState({
    cropName: "",
    cropType: "",
    variety: "",
    season: "",
    plantingDate: today,
    harvestDate: "",
    expectedHarvestDate: "",
    quantity: "",
    unit: "",
    areaValue: "",
    areaUnit: "",
    qualityGrade: "",
    sellingPricePerUnit: "",
    sellingTotalPrice: "",
    buyerName: "",
    buyerPhone: "",
    buyerType: "",
    totalExpense: "",
    profitLoss: "",
    status: "planted",
    notes: "",
    rainfall: "",
    minTemp: "",
    maxTemp: "",
    tags: "",
  });
  const [errors, setErrors] = useState({});

  // ✅ Preload data
  useEffect(() => {
    if (!yieldData) return;
    setForm({
      cropName: yieldData.cropName || "",
      cropType: yieldData.cropType || "",
      variety: yieldData.variety || "",
      season: yieldData.season || "",
      plantingDate: yieldData.plantingDate
        ? new Date(yieldData.plantingDate).toISOString().split("T")[0]
        : today,
      harvestDate: yieldData.harvestDate
        ? new Date(yieldData.harvestDate).toISOString().split("T")[0]
        : "",
      expectedHarvestDate: yieldData.expectedHarvestDate
        ? new Date(yieldData.expectedHarvestDate).toISOString().split("T")[0]
        : "",
      quantity: yieldData.quantity || "",
      unit: yieldData.unit || "",
      areaValue: yieldData.areaUsed?.value || "",
      areaUnit: yieldData.areaUsed?.unit || "",
      qualityGrade: yieldData.qualityGrade || "",
      sellingPricePerUnit: yieldData.sellingPrice?.pricePerUnit || "",
      sellingTotalPrice: yieldData.sellingPrice?.totalPrice || "",
      buyerName: yieldData.buyer?.name || "",
      buyerPhone: yieldData.buyer?.phone || "",
      buyerType: yieldData.buyer?.type || "",
      totalExpense: yieldData.totalExpense || "",
      profitLoss: yieldData.profitLoss || "",
      status: yieldData.status || "planted",
      notes: yieldData.notes || "",
      rainfall: yieldData.weatherConditions?.rainfall || "",
      minTemp: yieldData.weatherConditions?.temperature?.min || "",
      maxTemp: yieldData.weatherConditions?.temperature?.max || "",
      tags: yieldData.tags?.join(", ") || "",
    });
  }, [yieldData, open]);

  // ✅ Auto calculations
  useEffect(() => {
    const total =
      (Number(form.quantity) || 0) * (Number(form.sellingPricePerUnit) || 0);
    const profit = total - (Number(form.totalExpense) || 0);
    setForm((prev) => ({
      ...prev,
      sellingTotalPrice: total.toFixed(2),
      profitLoss: profit.toFixed(2),
    }));
  }, [form.quantity, form.sellingPricePerUnit, form.totalExpense]);

  // ✅ Change Handler
  // When `view` is true we must ignore all changes so inputs/selects remain read-only
  const change = (f, v) => {
    if (view) return; // ignore changes in view mode
    setForm((p) => ({ ...p, [f]: v }));
    setErrors((p) => ({ ...p, [f]: "" }));
  };

  // ✅ Validation
  const validate = () => {
    const e = {};
    if (!form.cropName.trim()) e.cropName = "Crop name is required";
    if (!form.cropType) e.cropType = "Select crop type";
    if (!form.season) e.season = "Select season";
    if (!form.quantity) e.quantity = "Enter quantity";
    if (!form.unit) e.unit = "Select unit";
    if (!form.sellingPricePerUnit)
      e.sellingPricePerUnit = "Enter price per unit";
    return e;
  };

  // ✅ Submit Handler
  const submit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) return setErrors(v);

    const payload = {
      cropName: form.cropName.trim(),
      cropType: form.cropType,
      variety: form.variety || undefined,
      season: form.season,
      plantingDate: form.plantingDate,
      harvestDate: form.harvestDate || null,
      expectedHarvestDate: form.expectedHarvestDate || null,
      quantity: Number(form.quantity),
      unit: form.unit,
      areaUsed: {
        value: Number(form.areaValue) || 0,
        unit: form.areaUnit || undefined,
      },
      qualityGrade: form.qualityGrade || undefined,
      sellingPrice: {
        pricePerUnit: Number(form.sellingPricePerUnit),
        totalPrice: Number(form.sellingTotalPrice),
        currency: "INR",
      },
      buyer: {
        name: form.buyerName,
        phone: form.buyerPhone,
        type: form.buyerType,
      },
      totalExpense: Number(form.totalExpense) || 0,
      profitLoss: Number(form.profitLoss) || 0,
      status: form.status,
      notes: form.notes,
      weatherConditions: {
        rainfall: Number(form.rainfall) || 0,
        temperature: {
          min: Number(form.minTemp) || 0,
          max: Number(form.maxTemp) || 0,
        },
      },
      tags: form.tags ? form.tags.split(",").map((t) => t.trim()) : [],
    };

    try {
      yieldData?._id
        ? await editYield(yieldData._id, payload)
        : await addYield(payload);
      setOpen(false);
    } catch (err) {
      console.error("Error saving yield:", err);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {trigger || (
          <Button>
            <Icon name="Plus" /> {view ? "View Yield" : "Add Yield"}
          </Button>
        )}
      </SheetTrigger>

      <SheetContent side="right" className="overflow-y-auto max-h-screen">
        <SheetHeader>
          <SheetTitle className="text-xl font-semibold text-gray-800">
            {view ? "View Yield" : yieldData ? "Edit Yield" : "Add New Yield"}
          </SheetTitle>
        </SheetHeader>

        <form onSubmit={submit} className="space-y-6 p-4 text-gray-700">
          {/* 🌾 Crop Information */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1">
              <FieldLabel text="Crop Name" required />
              <Input
                value={form.cropName}
                onChange={(e) => change("cropName", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <FieldLabel text="Crop Type" required />
              <Select
                value={form.cropType}
                onValueChange={(v) => change("cropType", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select crop type" />
                </SelectTrigger>
                <SelectContent>
                  {cropTypes.map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <FieldLabel text="Variety" />
              <Input
                value={form.variety}
                onChange={(e) => change("variety", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <FieldLabel text="Season" required />
              <Select
                value={form.season}
                onValueChange={(v) => change("season", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select season" />
                </SelectTrigger>
                <SelectContent>
                  {seasons.map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <FieldLabel text="Planting Date" required />
              <Input
                type="date"
                value={form.plantingDate}
                onChange={(e) => change("plantingDate", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <FieldLabel text="Expected Harvest Date" />
              <Input
                type="date"
                value={form.expectedHarvestDate}
                onChange={(e) => change("expectedHarvestDate", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <FieldLabel text="Harvest Date" />
              <Input
                type="date"
                value={form.harvestDate}
                onChange={(e) => change("harvestDate", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <FieldLabel text="Status" />
              <Select
                value={form.status}
                onValueChange={(v) => change("status", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {["planted", "growing", "harvested", "sold"].map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 📦 Quantity, Area & Quality */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1">
              <FieldLabel text="Quantity" required />
              <Input
                type="number"
                value={form.quantity}
                onChange={(e) => change("quantity", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <FieldLabel text="Unit" required />
              <Select
                value={form.unit}
                onValueChange={(v) => change("unit", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {units.map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <FieldLabel text="Area Value" />
              <Input
                type="number"
                value={form.areaValue}
                onChange={(e) => change("areaValue", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <FieldLabel text="Area Unit" />
              <Select
                value={form.areaUnit}
                onValueChange={(v) => change("areaUnit", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select area unit" />
                </SelectTrigger>
                <SelectContent>
                  {["acre", "hectare", "bigha", "guntha"].map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <FieldLabel text="Quality Grade" />
              <Select
                value={form.qualityGrade}
                onValueChange={(v) => change("qualityGrade", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select quality grade" />
                </SelectTrigger>
                <SelectContent>
                  {["A", "B", "C", "D"].map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 💰 Pricing */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1">
              <FieldLabel text="Price per Unit" required />
              <Input
                type="number"
                value={form.sellingPricePerUnit}
                onChange={(e) => change("sellingPricePerUnit", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <FieldLabel text="Total Price" />
              <Input type="number" readOnly value={form.sellingTotalPrice} />
            </div>

            <div className="space-y-1">
              <FieldLabel text="Total Expense" />
              <Input
                type="number"
                value={form.totalExpense}
                onChange={(e) => change("totalExpense", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <FieldLabel text="Profit / Loss" />
              <Input type="number" readOnly value={form.profitLoss} />
            </div>
          </div>

          {/* 👤 Buyer Details */}
          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-1">
              <FieldLabel text="Buyer Name" />
              <Input
                value={form.buyerName}
                onChange={(e) => change("buyerName", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <FieldLabel text="Buyer Phone" />
              <Input
                type="tel"
                value={form.buyerPhone}
                onChange={(e) => change("buyerPhone", e.target.value)}
              />
            </div>

            <div className="space-y-1">
              <FieldLabel text="Buyer Type" />
              <Select
                value={form.buyerType}
                onValueChange={(v) => change("buyerType", v)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select buyer type" />
                </SelectTrigger>
                <SelectContent>
                  {buyerTypes.map((x) => (
                    <SelectItem key={x} value={x}>
                      {x}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* 🌦 Weather Conditions */}
          <div className="grid grid-cols-3 gap-5">
            <div className="space-y-1">
              <FieldLabel text="Rainfall (mm)" />
              <Input
                type="number"
                value={form.rainfall}
                onChange={(e) => change("rainfall", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <FieldLabel text="Min Temp (°C)" />
              <Input
                type="number"
                value={form.minTemp}
                onChange={(e) => change("minTemp", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <FieldLabel text="Max Temp (°C)" />
              <Input
                type="number"
                value={form.maxTemp}
                onChange={(e) => change("maxTemp", e.target.value)}
              />
            </div>
          </div>

          {/* 🏷 Tags & Notes */}
          <div className="space-y-1">
            <FieldLabel text="Tags" />
            <Input
              placeholder="organic, export, premium"
              value={form.tags}
              onChange={(e) => change("tags", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <FieldLabel text="Notes" />
            <Textarea
              placeholder="Add remarks..."
              value={form.notes}
              onChange={(e) => change("notes", e.target.value)}
            />
          </div>

          {/* Submit */}
          {!view && (
            <SheetFooter className="flex justify-end">
              <Button type="submit">
                {loading && <Spinner />}
                {yieldData ? "Update Yield" : "Add Yield"}
              </Button>
            </SheetFooter>
          )}
        </form>
      </SheetContent>
    </Sheet>
  );
};
