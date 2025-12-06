import { useMemo } from "react";
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
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icon } from "@/custom/Icon";
import {
  TypographyH2,
  TypographyH4,
  TypographyMuted,
  TypographyH3,
  TypographySmall,
} from "@/custom/Typography";
import { SummaryCard } from "@/components/SummaryCard";
import { useExpenses } from "@/hooks/useExpenses";
import { useYields } from "@/hooks/useYields";
import { useLoans } from "@/hooks/useLoans";
import { Loading } from "@/components/Loading";

const ExportButtons = ({ type }) => (
  <div className="flex gap-2">
    <Button size="sm" onClick={() => alert(`Exporting ${type} CSV`)}>
      <Icon name="Download" color="white" size={16} /> CSV
    </Button>
    <Button
      size="sm"
      variant="destructive"
      onClick={() => alert(`Exporting ${type} PDF`)}
    >
      <Icon name="FileText" color="white" size={16} /> PDF
    </Button>
  </div>
);

const ReportCard = ({ title, children, type }) => (
  <Card className="gap-4">
    <div className="flex justify-between md:items-center md:flex-row gap-3 flex-col">
      <TypographyH4>{title}</TypographyH4>
      {type && <ExportButtons type={type} />}
    </div>
    {children}
  </Card>
);

export const Reports = () => {
  const { data: expenses = [], isLoading: expensesLoading } = useExpenses();
  const { data: yields = [], isLoading: yieldsLoading } = useYields();
  const { data: loans = [], isLoading: loansLoading } = useLoans();

  if (expensesLoading || yieldsLoading || loansLoading) return <Loading />;

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

  const totalExpenses = expensesArr.reduce(
    (sum, exp) => sum + (Number(exp.amount) || 0),
    0
  );
  const totalIncome = yieldsArr.reduce(
    (sum, y) =>
      sum + (Number(y.totalIncome || y.sellingPrice?.totalPrice) || 0),
    0
  );
  const totalLoans = loansArr.reduce(
    (sum, l) => sum + (Number(l.amount || l.principal) || 0),
    0
  );
  const netProfit = totalIncome - totalExpenses;

  // Monthly financial summary
  const monthlyData = expensesArr.reduce((acc, exp) => {
    const month = exp?.date
      ? new Date(exp.date).toLocaleString("default", { month: "short" })
      : "Unknown";
    const existing = acc.find((item) => item.month === month);
    if (existing) existing.expenses += Number(exp.amount) || 0;
    else
      acc.push({
        month,
        expenses: Number(exp.amount) || 0,
        income: 0,
        profit: 0,
      });
    return acc;
  }, []);
  yieldsArr.forEach((y) => {
    const month = y?.date
      ? new Date(y.date).toLocaleString("default", { month: "short" })
      : "Unknown";
    const existing = monthlyData.find((item) => item.month === month);
    if (existing) {
      existing.income +=
        Number(y.totalIncome || y.sellingPrice?.totalPrice) || 0;
      existing.profit = existing.income - existing.expenses;
    }
  });

  // Crop-wise performance
  const cropPerformance = yieldsArr.reduce((acc, y) => {
    const existing = acc.find((c) => c.crop === y.crop);
    if (existing) {
      existing.income += Number(y.totalIncome) || 0;
      existing.quantity += Number(y.quantity) || 0;
    } else
      acc.push({
        crop: y.crop,
        income: Number(y.totalIncome) || 0,
        quantity: Number(y.quantity) || 0,
      });
    return acc;
  }, []);
  expensesArr.forEach((exp) => {
    const existing = cropPerformance.find((c) => c.crop === exp.crop);
    if (existing) existing.income -= Number(exp.amount) || 0;
  });

  const topExpenseCategory = Object.entries(
    expensesArr.reduce(
      (acc, exp) => (
        (acc[exp.category] =
          (acc[exp.category] || 0) + (Number(exp.amount) || 0)),
        acc
      ),
      {}
    )
  ).sort((a, b) => b[1] - a[1])[0]?.[0];

  return (
    <div className="space-y-6">
      <TypographyH2>Reports & Analytics</TypographyH2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SummaryCard
          icon="TrendingUp"
          value={`₹${totalIncome.toLocaleString()}`}
          title="Total Income"
          color="green"
        />
        <SummaryCard
          icon="TrendingUp"
          value={`₹${totalExpenses.toLocaleString()}`}
          title="Total Expenses"
          color="red"
        />
        <SummaryCard
          icon="TrendingUp"
          value={`₹${totalLoans.toLocaleString()}`}
          title="Total Loans"
          color="blue"
        />
        <SummaryCard
          icon="TrendingUp"
          value={`₹${netProfit.toLocaleString()}`}
          title="Net Profit"
          color="orange"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ReportCard title="Monthly Financial Summary" type="monthly">
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v) => `₹${v.toLocaleString()}`}
                contentStyle={{ fontSize: "12px" }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line
                type="monotone"
                dataKey="income"
                stroke="#10b981"
                strokeWidth={3}
                name="Income"
              />
              <Line
                type="monotone"
                dataKey="expenses"
                stroke="#ef4444"
                strokeWidth={3}
                name="Expenses"
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#3b82f6"
                strokeWidth={3}
                name="Profit"
              />
            </LineChart>
          </ResponsiveContainer>
        </ReportCard>

        <ReportCard title="Crop-wise Profit Analysis" type="crop">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={cropPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="crop" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(v) => v.toLocaleString()}
                contentStyle={{ fontSize: "12px" }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="quantity"
                fill="#10b981"
                name="Quantity (kg)"
                barSize={28}
              />
              <Bar
                dataKey="income"
                fill="#3b82f6"
                name="Net Profit (₹)"
                barSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>

      {/* Expense & Yield Reports */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ReportCard title="Expense Report" type="expenses">
          <div className="space-y-3 mb-4">
            {expensesArr.slice(0, 5).map((exp) => (
              <div
                key={exp.id || exp._id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <TypographySmall>{exp.category}</TypographySmall>
                  <TypographyMuted>
                    {exp.crop} -{" "}
                    {exp.date
                      ? new Date(exp.date).toLocaleDateString("en-IN")
                      : "-"}
                  </TypographyMuted>
                </div>
                <TypographySmall className="text-red-600">
                  ₹{(Number(exp.amount) || 0).toLocaleString()}
                </TypographySmall>
              </div>
            ))}
          </div>
        </ReportCard>

        <ReportCard title="Yield Report" type="yields">
          <div className="space-y-3 mb-4">
            {yieldsArr.map((y) => (
              <div
                key={y.id || y._id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <TypographySmall>{y.crop}</TypographySmall>
                  <TypographyMuted>
                    {y.quantity} {y.unit} -{" "}
                    {y.date
                      ? new Date(y.date).toLocaleDateString("en-IN")
                      : "-"}
                  </TypographyMuted>
                </div>
                <TypographySmall className="text-green-600">
                  ₹
                  {(
                    Number(y.totalIncome || y.sellingPrice?.totalPrice) || 0
                  ).toLocaleString()}
                </TypographySmall>
              </div>
            ))}
          </div>
        </ReportCard>
      </div>

      {/* Insights */}
      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <TypographyH4>Report Insights</TypographyH4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="gap-2">
            <TypographySmall>Best Performing Crop</TypographySmall>
            <TypographyH3 className="text-green-600">
              {cropPerformance.sort((a, b) => b.income - a.income)[0]?.crop}
            </TypographyH3>
            <TypographyMuted>Highest net profit</TypographyMuted>
          </Card>
          <Card className="gap-2">
            <TypographySmall>Highest Expense Category</TypographySmall>
            <TypographyH3 className="text-red-600">
              {topExpenseCategory}
            </TypographyH3>
            <TypographyMuted>Needs attention</TypographyMuted>
          </Card>
          <Card className="gap-2">
            <TypographySmall>Profit Margin</TypographySmall>
            <TypographyH3 className="text-blue-600">
              {totalIncome
                ? ((netProfit / totalIncome) * 100).toFixed(1)
                : "0.0"}
              %
            </TypographyH3>
            <TypographyMuted>Overall efficiency</TypographyMuted>
          </Card>
        </div>
      </Card>
    </div>
  );
};
