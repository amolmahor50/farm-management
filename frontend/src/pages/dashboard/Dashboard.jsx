import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
} from "recharts";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TypographyH2, TypographyH3 } from "@/custom/Typography";
import { Icon } from "@/custom/Icon";
import { SummaryCard } from "@/components/SummaryCard";
import { QuickLoan } from "@/pages/loans/QuickLoan";
import { QuickYield } from "@/pages/yield/QuickYield";
import { QuickExpense } from "@/pages/expenses/QuickExpense";
import { useExpenses } from "@/hooks/useExpenses";
import { useYields } from "@/hooks/useYields";
import { useLoans } from "@/hooks/useLoans";
import { useTasks } from "@/hooks/useTasks";
import { Loading } from "@/components/Loading";

export function Dashboard() {
  const { data: expenses = [], isLoading: expensesLoading } = useExpenses();
  const { data: yields = [], isLoading: yieldsLoading } = useYields();
  const { data: loans = [], isLoading: loansLoading } = useLoans();
  const { data: tasks = [], isLoading: tasksLoading } = useTasks();
  const [modalType, setModalType] = useState(null);
  const navigate = useNavigate();

  const isLoading =
    expensesLoading || yieldsLoading || loansLoading || tasksLoading;

  if (isLoading) return <Loading />;

  // Normalize API responses: some endpoints return an object like { data: [...] }
  const expensesArr = Array.isArray(expenses)
    ? expenses
    : Array.isArray(expenses?.data)
    ? expenses.data
    : [];
  const yieldsArr = Array.isArray(yields)
    ? yields
    : Array.isArray(yields?.data)
    ? yields.data
    : [];
  const loansArr = Array.isArray(loans)
    ? loans
    : Array.isArray(loans?.data)
    ? loans.data
    : [];
  const tasksArr = Array.isArray(tasks)
    ? tasks
    : Array.isArray(tasks?.data)
    ? tasks.data
    : [];

  // Summary calculations
  const totalExpenses = expensesArr.reduce(
    (sum, e) => sum + (Number(e.amount) || 0),
    0
  );
  const totalIncome = yieldsArr.reduce(
    (sum, y) => sum + (Number(y.sellingPrice?.totalPrice) || 0),
    0
  );
  const activeLoans = loansArr.filter(
    (l) => l.status?.toLowerCase() === "active"
  );
  const totalLoanAmount = activeLoans.reduce(
    (sum, l) => sum + (Number(l.principal) || 0),
    0
  );
  const netProfit = totalIncome - totalExpenses;

  // Expense by category
  const pieData = Object.entries(
    expensesArr.reduce((acc, exp) => {
      const cat = exp?.category || "Uncategorized";
      acc[cat] = (acc[cat] || 0) + (Number(exp.amount) || 0);
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

  // Monthly income vs expense
  const monthlyData = [];
  expensesArr.forEach((e) => {
    const month = e?.date
      ? new Date(e.date).toLocaleString("default", { month: "short" })
      : "Unknown";
    const found = monthlyData.find((m) => m.month === month);
    if (found) found.expenses += Number(e.amount) || 0;
    else
      monthlyData.push({ month, expenses: Number(e.amount) || 0, income: 0 });
  });
  yieldsArr.forEach((y) => {
    const month = y?.date
      ? new Date(y.date).toLocaleString("default", { month: "short" })
      : "Unknown";
    const found = monthlyData.find((m) => m.month === month);
    const income = Number(y.sellingPrice?.totalPrice) || 0;
    if (found) found.income += income;
    else monthlyData.push({ month, expenses: 0, income });
  });

  // Yield data (bar)
  const yieldData = yieldsArr.reduce((acc, y) => {
    const cropName = y?.cropName || y?.crop || "Unknown";
    const found = acc.find((i) => i.crop === cropName);
    if (found) {
      found.quantity += Number(y.quantity) || 0;
      found.income += Number(y.sellingPrice?.totalPrice) || 0;
    } else
      acc.push({
        crop: cropName,
        quantity: Number(y.quantity) || 0,
        income: Number(y.sellingPrice?.totalPrice) || 0,
      });
    return acc;
  }, []);

  const handleQuickAdd = (type) => {
    setModalType(type);
  };

  const handleView = (path) => {
    navigate(path);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center">
        <TypographyH2>Dashboard Overview</TypographyH2>
        <div className="flex items-center gap-2">
          <QuickExpense
            trigger={
              <Button size="xs" variant="destructive">
                <Icon name="Plus" /> Add Expense
              </Button>
            }
          />
          <QuickYield
            trigger={
              <Button size="xs">
                <Icon name="Plus" /> Add Yield
              </Button>
            }
          />
          <Button
            size="xs"
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => handleQuickAdd("loan")}
          >
            <Icon name="Plus" /> Add Loan
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryCard
          title="Total Expenses"
          icon="TrendingDown"
          value={totalExpenses}
          color="red"
        />
        <SummaryCard
          title="Total Income"
          icon="TrendingUp"
          value={totalIncome}
          color="green"
        />
        <SummaryCard
          title="Active Loans"
          icon="Wallet"
          value={totalLoanAmount}
          color="blue"
        />
        <SummaryCard
          title="Net Profit"
          icon="RefreshCw"
          value={netProfit}
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Monthly Income vs Expenses"
          onView={() => handleView("/analytics")}
        >
          {monthlyData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(v) => `₹${v.toLocaleString()}`}
                  contentStyle={{ fontSize: "12px" }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="income"
                  stroke="#10b981"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="expenses"
                  stroke="#ef4444"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <NoData />
          )}
        </ChartCard>

        <ChartCard
          title="Expenses by Category"
          onView={() => handleView("/expenses")}
        >
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                  labelStyle={{ fontSize: "12px" }}
                >
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(v) => `₹${v.toLocaleString()}`}
                  contentStyle={{ fontSize: "12px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <NoData />
          )}
        </ChartCard>
      </div>

      {/* Yield Summary & Loans */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ChartCard
          title="Crop-wise Yield Summary"
          onView={() => handleView("/yields")}
        >
          {yieldData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yieldData} barCategoryGap="25%">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="crop" tick={{ fontSize: 13 }} />
                <YAxis
                  yAxisId="left"
                  stroke="#10b981"
                  tick={{ fontSize: 13 }}
                />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  stroke="#3b82f6"
                  tick={{ fontSize: 13 }}
                />
                <Tooltip contentStyle={{ fontSize: "12px" }} />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar
                  yAxisId="left"
                  dataKey="quantity"
                  fill="#10b981"
                  name="Quantity (kg)"
                  barSize={28}
                />
                <Bar
                  yAxisId="right"
                  dataKey="income"
                  fill="#3b82f6"
                  name="Income (₹)"
                  barSize={28}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoData />
          )}
        </ChartCard>

        <Card className="relative">
          <div className="flex justify-between items-center mb-2">
            <TypographyH3>Active Loans</TypographyH3>
            <Button size="xs" onClick={() => handleView("/loans")}>
              View All
            </Button>
          </div>
          {activeLoans.length > 0 ? (
            <div className="space-y-3">
              {activeLoans.slice(0, 5).map((loan) => (
                <div key={loan._id} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-medium">
                      {loan.lender?.name || "Unknown"}
                    </span>
                    <span className="font-bold text-blue-600">
                      ₹{Number(loan.principal).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    EMI: ₹{Number(loan.emiAmount).toLocaleString()} (
                    {loan.paidEmis || 0}/{loan.tenure?.months || 0})
                  </p>
                  <div className="h-2 bg-gray-200 rounded-full mt-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{
                        width: `${
                          ((loan.paidEmis || 0) / (loan.tenure?.months || 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <NoData />
          )}
        </Card>
      </div>

      {/* Tasks */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="relative">
          <div className="flex justify-between items-center mb-2">
            <TypographyH3>Upcoming Tasks</TypographyH3>
            <Button size="xs" onClick={() => handleView("/tasks")}>
              View All
            </Button>
          </div>
          {tasksArr.filter((t) => t.status === "Pending").length > 0 ? (
            <div className="space-y-3">
              {tasksArr
                .filter((t) => t.status === "Pending")
                .slice(0, 5)
                .map((t) => (
                  <div
                    key={t._id}
                    className="p-3 border rounded-lg flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-medium">{t.title}</h4>
                      <p className="text-sm text-gray-600">
                        {t.crop} • {t.category}
                      </p>
                    </div>
                    <div className="text-right text-sm">
                      <p>{new Date(t.date).toLocaleDateString()}</p>
                      <p className="text-gray-500">{t.time}</p>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <NoData />
          )}
        </Card>
      </div>

      {/* Quick Add Modals */}
      {modalType === "expense" && (
        <QuickExpense open={true} onClose={() => setModalType(null)} />
      )}
      {modalType === "yield" && (
        <QuickYield open={true} onClose={() => setModalType(null)} />
      )}
      {modalType === "loan" && (
        <QuickLoan open={true} onClose={() => setModalType(null)} />
      )}
    </div>
  );
}

const ChartCard = ({ title, onView, children }) => (
  <Card className="relative">
    <div className="flex justify-between items-center mb-2">
      <TypographyH3>{title}</TypographyH3>
      {onView && (
        <Button size="xs" onClick={onView}>
          View All
        </Button>
      )}
    </div>
    <div>{children}</div>
  </Card>
);

const NoData = () => (
  <div className="flex flex-col items-center justify-center h-56 text-gray-500">
    <Icon name="Inbox" size={36} className="mb-2 opacity-70" />
    <p>No data available</p>
  </div>
);
