import { useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Icon } from "@/custom/Icon";
import { TypographyH2 } from "@/custom/Typography";
import { QuickExpense } from "./QuickExpense";
import ExpensesTable from "./ExpensesTable";
import { useExpenses } from "@/hooks/useExpenses";
import { CATEGORIES, CATEGORY_COLORS } from "@/constants/expensesConstants";
import { Loading } from "@/components/Loading";
import { EmptyState } from "@/components/EmptyState";
import { capitalize } from "@/utils/capatalize";
import { SummaryCard } from "@/components/SummaryCard";

export const Expense = () => {
  const { data: expenses = [], isLoading: loading } = useExpenses();
  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  // Compute category-wise total expenses
  const categoryTotals = useMemo(() => {
    const totals = {};
    safeExpenses.forEach((exp) => {
      const category = exp?.category?.toLowerCase() || "unknown";
      const amount = Number(exp?.amount) || 0;
      totals[category] = (totals[category] || 0) + amount;
    });

    return CATEGORIES.map((cat) => ({
      name: capitalize(cat),
      value: totals[cat] || 0,
      color: CATEGORY_COLORS[cat] || "#9ca3af",
      icon: getCategoryIcon(cat),
    }));
  }, [safeExpenses]);

  if (loading) return <Loading />;

  return (
    <>
      {safeExpenses.length > 0 ? (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TypographyH2>Expense Management</TypographyH2>
            <QuickExpense
              trigger={
                <Button>
                  <Icon name="Plus" /> Add Expense
                </Button>
              }
            />
          </div>

          {/* Category-wise Summary Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoryTotals.map((cat, index) => (
              <SummaryCard
                key={index}
                title={cat.name}
                icon={cat.icon}
                value={`₹${cat.value.toLocaleString()}`}
                color={cat.color}
              />
            ))}
          </div>

          {/* Expenses Table */}
          <ExpensesTable />
        </div>
      ) : (
        <EmptyState
          icon={<Icon name="Wallet" size={32} />}
          title="No Expenses Yet"
          description="You haven’t added any expenses yet. Start by adding your first expense record."
          button={
            <QuickExpense
              trigger={
                <Button>
                  <Icon name="Plus" /> Add Expense
                </Button>
              }
            />
          }
        />
      )}
    </>
  );
};

// Function: assign icons to categories
const getCategoryIcon = (category) => {
  switch (category) {
    case "seeds":
      return "Sprout";
    case "fertilizer":
      return "FlaskConical";
    case "pesticide":
      return "Bug";
    case "labor":
      return "Users";
    case "irrigation":
      return "Droplets";
    case "equipment":
      return "Wrench";
    case "transport":
      return "Truck";
    case "electricity":
      return "Zap";
    case "rent":
      return "Home";
    case "other":
      return "Circle";
    default:
      return "Wallet";
  }
};
