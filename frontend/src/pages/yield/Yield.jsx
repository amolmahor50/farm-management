import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/custom/Icon";
import {
  TypographyH2,
  TypographyH4,
  TypographySmall,
} from "@/custom/Typography";
import { SummaryCard } from "@/components/SummaryCard";
import { useYields, useDeleteYield } from "@/hooks/useYields";
import { QuickYield } from "./QuickYield";
import YieldsTable from "./YieldsTable";
import { Loading } from "@/components/Loading";
import { EmptyState } from "@/components/EmptyState";
import { Card } from "@/components/ui/card";

export const Yield = () => {
  const { data: yields = [], isLoading } = useYields();
  const yieldsArr = Array.isArray(yields)
    ? yields
    : Array.isArray(yields?.data)
    ? yields.data
    : [];
  const deleteYieldMutation = useDeleteYield();

  // Format numbers with commas
  const formatRupees = (num) =>
    new Intl.NumberFormat("en-IN", { maximumFractionDigits: 2 }).format(num);

  // Convert any yield’s quantity to kg
  const toKg = (quantity, unit) => {
    if (!quantity) return 0;
    if (unit === "quintal") return quantity * 100;
    if (unit === "ton") return quantity * 1000;
    if (unit === "kg") return quantity;
    return 0;
  };

  // Totals
  const totalIncome =
    yieldsArr.reduce(
      (sum, y) => sum + (Number(y.sellingPrice?.totalPrice) || 0),
      0
    ) || 0;

  const totalQuantityKg =
    yieldsArr.reduce((sum, y) => sum + toKg(Number(y.quantity), y.unit), 0) ||
    0;

  const totalHarvests = yieldsArr.length || 0;

  // Derived totals from summary (if available)
  // Derive summary per crop from yields (expenses not available here, default to 0)
  const summary = yieldsArr.reduce((acc, y) => {
    const cropName = y?.cropName || y?.crop || "Unknown";
    const revenue = Number(y.sellingPrice?.totalPrice) || 0;
    const qty = Number(y.quantity) || 0;
    let item = acc.find((i) => i.cropName === cropName);
    if (item) {
      item.totalRevenue += revenue;
      item.totalQuantity += qty;
      item.totalExpense = item.totalExpense || 0;
      item.profit = item.totalRevenue - (item.totalExpense || 0);
    } else {
      acc.push({
        _id: cropName,
        cropName,
        totalRevenue: revenue,
        totalQuantity: qty,
        totalExpense: 0,
        profit: revenue,
      });
    }
    return acc;
  }, []);

  const totalExpenses =
    summary.reduce((sum, s) => sum + (Number(s.totalExpense) || 0), 0) || 0;

  const netProfit =
    summary.reduce((sum, s) => sum + (Number(s.profit) || 0), 0) || 0;

  const avgYieldPerCrop =
    summary?.length > 0 ? totalQuantityKg / summary.length : 0;

  const avgIncomePerHarvest =
    totalHarvests > 0 ? totalIncome / totalHarvests : 0;

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

  // Loading state
  if (isLoading) return <Loading />;

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
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Total Income"
              icon="IndianRupee"
              value={`₹${formatRupees(totalIncome)}`}
              color="#22c55e" // green
            />
            <SummaryCard
              title="Total Production"
              icon="Package"
              value={formatQuantity(totalQuantityKg)}
              color="#3b82f6" // blue
            />
            <SummaryCard
              title="Total Harvests"
              icon="Leaf"
              value={totalHarvests}
              color="#f59e0b" // amber
            />
            <SummaryCard
              title="Total Expenses"
              icon="TrendingDown"
              value={`₹${formatRupees(totalExpenses)}`}
              color="#ef4444" // red
            />
            <SummaryCard
              title="Net Profit"
              icon="TrendingUp"
              value={`₹${formatRupees(netProfit)}`}
              color={netProfit >= 0 ? "#22c55e" : "#ef4444"} // green/red
            />
            <SummaryCard
              title="Avg Yield per Crop"
              icon="BarChart3"
              value={`${formatRupees(avgYieldPerCrop.toFixed(2))} kg`}
              color="#14b8a6" // teal
            />
            <SummaryCard
              title="Avg Income per Harvest"
              icon="Wallet"
              value={`₹${formatRupees(avgIncomePerHarvest.toFixed(2))}`}
              color="#8b5cf6" // violet
            />
          </div>

          {/* Table */}
          <YieldsTable yields={yieldsArr} />

          {/* Crop Summary Cards */}
          {summary?.length > 0 && (
            <div className="mt-6">
              <TypographyH4 className="p-4 text-lg">Crop Summary</TypographyH4>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {summary.map((item) => {
                  const isProfit = (item.profit || 0) >= 0;
                  const profitColor = isProfit
                    ? "text-green-600"
                    : "text-red-600";

                  return (
                    <Card key={item._id} className="gap-1 p-3">
                      <TypographySmall className="text-gray-600 capitalize">
                        {item.cropName}
                      </TypographySmall>

                      <TypographyH4 className="font-semibold text-green-700">
                        ₹{formatRupees(item.totalRevenue || 0)}
                      </TypographyH4>

                      <h1 className={`font-semibold ${profitColor}`}>
                        {isProfit ? "Profit" : "Loss"} – ₹
                        {formatRupees(Math.abs(item.profit || 0))}
                      </h1>

                      <p className="text-xs text-gray-500">
                        Qty: {item.totalQuantity} | Expenses: ₹
                        {formatRupees(item.totalExpense || 0)}
                      </p>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        <EmptyState
          icon={<Icon name="Sprout" size={22} />}
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
