import { mockExpenses, mockYields, mockLoans } from "@/data/mockData";
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
  TypographyH3,
  TypographyH4,
  TypographyMuted,
  TypographySmall,
} from "@/custom/Typography";
import { SummaryCard } from "@/components/SummaryCard";

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
  const totalExpenses = mockExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalIncome = mockYields.reduce((sum, y) => sum + y.totalIncome, 0);
  const totalLoans = mockLoans.reduce((sum, l) => sum + l.amount, 0);
  const netProfit = totalIncome - totalExpenses;

  // Monthly financial summary
  const monthlyData = mockExpenses.reduce((acc, exp) => {
    const month = new Date(exp.date).toLocaleString("default", {
      month: "short",
    });
    const existing = acc.find((item) => item.month === month);
    if (existing) existing.expenses += exp.amount;
    else acc.push({ month, expenses: exp.amount, income: 0, profit: 0 });
    return acc;
  }, []);
  mockYields.forEach((y) => {
    const month = new Date(y.date).toLocaleString("default", {
      month: "short",
    });
    const existing = monthlyData.find((item) => item.month === month);
    if (existing) {
      existing.income += y.totalIncome;
      existing.profit = existing.income - existing.expenses;
    }
  });

  // Crop-wise performance
  const cropPerformance = mockYields.reduce((acc, y) => {
    const existing = acc.find((c) => c.crop === y.crop);
    if (existing) {
      existing.income += y.totalIncome;
      existing.quantity += y.quantity;
    } else
      acc.push({ crop: y.crop, income: y.totalIncome, quantity: y.quantity });
    return acc;
  }, []);
  mockExpenses.forEach((exp) => {
    const existing = cropPerformance.find((c) => c.crop === exp.crop);
    if (existing) existing.income -= exp.amount;
  });

  const topExpenseCategory = Object.entries(
    mockExpenses.reduce(
      (acc, exp) => (
        (acc[exp.category] = (acc[exp.category] || 0) + exp.amount), acc
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
            {mockExpenses.slice(0, 5).map((exp) => (
              <div
                key={exp.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <TypographySmall>{exp.category}</TypographySmall>
                  <TypographyMuted>
                    {exp.crop} -{" "}
                    {new Date(exp.date).toLocaleDateString("en-IN")}
                  </TypographyMuted>
                </div>
                <TypographySmall className="text-red-600">
                  ₹{exp.amount.toLocaleString()}
                </TypographySmall>
              </div>
            ))}
          </div>
        </ReportCard>

        <ReportCard title="Yield Report" type="yields">
          <div className="space-y-3 mb-4">
            {mockYields.map((y) => (
              <div
                key={y.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <TypographySmall>{y.crop}</TypographySmall>
                  <TypographyMuted>
                    {y.quantity} {y.unit} -{" "}
                    {new Date(y.date).toLocaleDateString("en-IN")}
                  </TypographyMuted>
                </div>
                <TypographySmall className="text-green-600">
                  ₹{y.totalIncome.toLocaleString()}
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
              {((netProfit / totalIncome) * 100).toFixed(1)}%
            </TypographyH3>
            <TypographyMuted>Overall efficiency</TypographyMuted>
          </Card>
        </div>
      </Card>
    </div>
  );
};
