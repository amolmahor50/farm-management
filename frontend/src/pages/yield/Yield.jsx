import { useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/custom/Icon";
import { TypographyH2, TypographyH4 } from "@/custom/Typography";
import { SummaryCard } from "@/components/SummaryCard";
import { useYields } from "@/contexts/YieldContext";
import { QuickYield } from "./QuickYield";
import YieldsTable from "./YieldsTable";
import { toastError } from "@/utils/toast";
import { Loading } from "@/components/Loading";
import { EmptyState } from "@/components/EmptyState";

export const Yield = () => {
  const { yields, summary, loading, fetchYields } = useYields();

  // Fetch yields & crop summary
  useEffect(() => {
    const load = async () => {
      try {
        await fetchYields();
      } catch {
        toastError("Please refresh and try again.");
      }
    };
    load();
  }, [fetchYields]);

  // Formatter for Rupees (1,32,350 style)
  const formatRupees = (num) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(num);

  // Convert any yield’s quantity to kg
  const toKg = (quantity, unit) => {
    if (!quantity) return 0;

    if (unit === "quintal") return quantity * 100; // 1 quintal = 100 kg
    if (unit === "ton") return quantity * 1000; // 1 ton = 1000 kg
    if (unit === "kg") return quantity; // already in kg

    return 0; // only these 3 are allowed; anything else = 0
  };

  // Totals
  const totalIncome =
    yields?.reduce(
      (sum, y) => sum + (Number(y.sellingPrice?.totalPrice) || 0),
      0
    ) || 0;

  const totalQuantityKg =
    yields?.reduce((sum, y) => sum + toKg(Number(y.quantity), y.unit), 0) || 0;

  const totalHarvests = yields?.length || 0;

  // Convert kg → quintal or ton for display
  const formatQuantity = (kg) => {
    if (kg < 100) {
      return `${formatRupees(kg)} kg`;
    } else if (kg < 10000) {
      const quintals = kg / 100;
      return `${formatRupees(quintals.toFixed(2))} quintal`;
    } else {
      const tons = kg / 1000;
      return `${formatRupees(tons.toFixed(2))} ton`;
    }
  };

  // Crop Summary (same as before)
  const cropSummaryRaw =
    summary && Array.isArray(summary) && summary.length > 0
      ? summary
      : yields?.reduce((acc, y) => {
          const crop = y.cropName || "Unknown";
          const income = Number(y.sellingPrice?.totalPrice) || 0;
          const quantity = Number(toKg(y.quantity, y.unit)) || 0; // convert to kg
          const existing = acc.find((c) => c.crop === crop);

          if (existing) {
            existing.income += income;
            existing.quantity += quantity;
            existing.count += 1;
          } else {
            acc.push({ crop, income, quantity, count: 1 });
          }
          return acc;
        }, []) || [];

  const cropSummary = cropSummaryRaw.map((item) => ({
    crop: item.crop,
    income: item.income || 0,
    quantity: item.quantity || 0,
    count: item.count || 1,
    avgPrice: item.quantity > 0 ? item.income / item.quantity : 0,
  }));

  // Timeline data for line chart
  const timelineData =
    yields?.map((y) => ({
      date: new Date(y.updatedAt || y.plantingDate).toLocaleDateString(
        "en-IN",
        { month: "short", day: "numeric" }
      ),
      crop: y.cropName,
      quantity: Number(toKg(y.quantity, y.unit)) || 0,
      income: Number(y.sellingPrice?.totalPrice) || 0,
    })) || [];

  // Loading state
  if (loading) return <Loading />;

  // UI
  return (
    <>
      {yields?.length > 0 ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TypographyH2>Yield Management</TypographyH2>
            <QuickYield
              trigger={
                <Button>
                  <Icon name="Plus" /> Add Yield
                </Button>
              }
            />
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <SummaryCard
              title="Total Income"
              icon="IndianRupee"
              value={`₹${formatRupees(totalIncome)}`}
              color="green"
            />
            <SummaryCard
              title="Total Production"
              icon="Package"
              value={formatQuantity(totalQuantityKg)}
              color="blue"
            />
            <SummaryCard
              title="Total Harvests"
              icon="Leaf"
              value={totalHarvests}
              color="orange"
            />
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-4">
              <TypographyH4>Production & Income by Crop</TypographyH4>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={cropSummary}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="crop"
                    tick={{ fontSize: 12 }}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                  />
                  <YAxis
                    yAxisId="left"
                    orientation="left"
                    stroke="#10b981"
                    tick={{ fontSize: 12 }}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    stroke="#3b82f6"
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) =>
                      typeof value === "number" ? formatRupees(value) : value
                    }
                    contentStyle={{ fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Bar
                    yAxisId="left"
                    dataKey="quantity"
                    fill="#10b981"
                    name="Quantity (kg)"
                    barSize={25}
                  />
                  <Bar
                    yAxisId="right"
                    dataKey="income"
                    fill="#3b82f6"
                    name="Income (₹)"
                    barSize={25}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card className="p-4">
              <TypographyH4>Yield Timeline</TypographyH4>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={timelineData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value) =>
                      typeof value === "number" ? formatRupees(value) : value
                    }
                    contentStyle={{ fontSize: "12px" }}
                  />
                  <Legend wrapperStyle={{ fontSize: "12px" }} />
                  <Line
                    type="monotone"
                    dataKey="quantity"
                    stroke="#10b981"
                    strokeWidth={2}
                    name="Quantity (kg)"
                  />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Income (₹)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Table */}
          <YieldsTable yields={yields} />
        </div>
      ) : (
        <EmptyState
          icon={<Icon name="Sprout" size={22} />} // You can change icon name if you prefer
          title="No Yields Yet"
          description="You haven’t added any yield data yet. Start by adding your first yield record."
          button={
            <QuickYield
              trigger={
                <Button>
                  <Icon name="Plus" /> Add Yield
                </Button>
              }
            />
          }
        />
      )}
    </>
  );
};
