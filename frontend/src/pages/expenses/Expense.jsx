import { useState, useMemo } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/custom/Icon";
import { TypographyH2, TypographyH4 } from "@/custom/Typography";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { QuickExpense } from "./QuickExpense";
import ExpensesTable from "./ExpensesTable";
import { useExpenses } from "@/contexts/ExpenseContext";
import { CATEGORIES, CATEGORY_COLORS } from "@/constants/expensesConstants";
import { Loading } from "@/components/Loading";
import { EmptyState } from "@/components/EmptyState";

//  Capitalize helper
const capitalize = (str = "") =>
  str.length ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;

export const Expense = () => {
  //  Defensive check if hook returns undefined
  const expenseContext = useExpenses() || {};
  const { expenses, loading, addExpense } = expenseContext;

  const [filterCategory, setFilterCategory] = useState("all");

  //  Defensive: ensure array
  const safeExpenses = Array.isArray(expenses) ? expenses : [];

  //  Filter by category
  const filteredExpenses = useMemo(() => {
    if (filterCategory === "all") return safeExpenses;
    return safeExpenses.filter(
      (exp) => exp?.category?.toLowerCase() === filterCategory.toLowerCase()
    );
  }, [safeExpenses, filterCategory]);

  //  Total amount
  const totalExpenses = useMemo(() => {
    return filteredExpenses.reduce(
      (sum, exp) => sum + (Number(exp?.amount) || 0),
      0
    );
  }, [filteredExpenses]);

  //  Prepare data for Pie & Bar charts
  const categoryData = useMemo(() => {
    const totals = {};
    safeExpenses.forEach((exp) => {
      const category = exp?.category?.toLowerCase() || "unknown";
      const amount = Number(exp?.amount) || 0;
      totals[category] = (totals[category] || 0) + amount;
    });

    return Object.entries(totals).map(([name, value]) => ({
      name: capitalize(name),
      value,
      color: CATEGORY_COLORS[name] || "#9ca3af",
    }));
  }, [safeExpenses]);

  const barData = useMemo(
    () =>
      categoryData.map((d) => ({
        category: d.name,
        amount: d.value,
        color: d.color,
      })),
    [categoryData]
  );

  if (loading) return <Loading />;

  return (
    <>
      {expenses?.length > 0 ? (
        <div className="space-y-6">
          {/*  Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TypographyH2>Expense Management</TypographyH2>
            <QuickExpense
              trigger={
                <Button>
                  <Icon name="Plus" /> Add Expense
                </Button>
              }
              onAdd={addExpense}
            />
          </div>

          {/*  Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 🥧 Pie Chart */}
            <Card className="p-4">
              <TypographyH4>Expenses by Category</TypographyH4>
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      outerRadius={140}
                      dataKey="value"
                      labelLine={false}
                      labelStyle={{ fontSize: "12px" }}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(v) => `₹${Number(v).toLocaleString()}`}
                      contentStyle={{ fontSize: "12px" }}
                    />
                    {/* <Legend /> */}
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center mt-8">
                  No expense data available
                </p>
              )}
            </Card>

            {/* 📊 Bar Chart */}
            <Card className="p-4">
              <TypographyH4>Expenses by Category (Bar)</TypographyH4>
              {barData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={barData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      formatter={(v) => `₹${Number(v).toLocaleString()}`}
                      contentStyle={{ fontSize: "12px" }}
                    />
                    <Legend />
                    <Bar
                      dataKey="amount"
                      name="Amount (₹)"
                      barSize={30}
                      radius={[0, 0, 0, 0]}
                    >
                      {barData.map((entry, index) => (
                        <Cell key={index} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-gray-500 text-center mt-8">
                  No expense data available
                </p>
              )}
            </Card>
          </div>

          {/*  Total + Filter + Table */}
          <Card className="p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div className="space-y-2">
                <TypographyH4>Total Expenses</TypographyH4>
                <TypographyH2 className="text-red-600">
                  ₹{totalExpenses.toLocaleString()}
                </TypographyH2>
              </div>

              {/* Category Filter */}
              <div>
                <Select
                  value={filterCategory}
                  onValueChange={(value) => setFilterCategory(value)}
                >
                  <SelectTrigger className="w-full md:w-40">
                    <Icon name="Filter" />
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {capitalize(cat)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <ExpensesTable filteredExpenses={filteredExpenses} />
          </Card>
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
