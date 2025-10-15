import { useState } from "react";
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
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/custom/Icon";
import {
  TypographyH2,
  TypographyH4,
  TypographyMuted,
  TypographySmall,
} from "@/custom/Typography";
import { SummaryCard } from "@/components/SummaryCard";

// Example mock data import
import { mockLoans } from "../../data/mockData";

export const Loans = () => {
  const [loans] = useState(mockLoans);

  const activeLoans = loans.filter((l) => l.status === "Active");
  const completedLoans = loans.filter((l) => l.status === "Completed");

  const totalLoanAmount = activeLoans.reduce((sum, l) => sum + l.amount, 0);
  const totalPaidAmount = activeLoans.reduce(
    (sum, l) => sum + l.emiAmount * l.paidEmis,
    0
  );
  const totalRemainingAmount = activeLoans.reduce(
    (sum, l) => sum + l.emiAmount * (l.totalEmis - l.paidEmis),
    0
  );

  const loansByLender = loans.reduce((acc, loan) => {
    const existing = acc.find((item) => item.lender === loan.lenderName);
    if (existing) {
      existing.amount += loan.amount;
    } else {
      acc.push({ lender: loan.lenderName, amount: loan.amount });
    }
    return acc;
  }, []);

  const statusData = [
    { name: "Active", value: activeLoans.length, color: "#3b82f6" },
    { name: "Completed", value: completedLoans.length, color: "#10b981" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <TypographyH2>Loans Management</TypographyH2>
        <Button>
          <Icon name="Plus" />
          Add Loan
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Loan Amount"
          icon="Wallet"
          value={`${totalLoanAmount.toLocaleString()}`}
          color="blue"
        />
        <SummaryCard
          title="Total Paid"
          icon="CheckCircle"
          value={`${totalPaidAmount.toLocaleString()}`}
          color="green"
        />
        <SummaryCard
          title="Total Amount"
          icon="AlertCircle"
          value={`${totalRemainingAmount.toLocaleString()}`}
          color="red"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Loans by Lender */}
        <Card>
          <TypographyH4>Loans by Lender</TypographyH4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={loansByLender}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="lender" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => `₹${value.toLocaleString()}`}
                contentStyle={{ fontSize: "12px" }}
              />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar
                dataKey="amount"
                fill="#3b82f6"
                name="Loan Amount (₹)"
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Loan Status Distribution */}
        <Card>
          <TypographyH4>Loan Status Distribution </TypographyH4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={statusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Active Loans */}
      <Card>
        <TypographyH4>Active Loans</TypographyH4>
        <div className="space-y-4 md:grid grid-cols-2 gap-6">
          {activeLoans.map((loan) => {
            const progress = (loan.paidEmis / loan.totalEmis) * 100;
            const remainingAmount =
              loan.emiAmount * (loan.totalEmis - loan.paidEmis);

            return (
              <div
                key={loan.id}
                className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg"
              >
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4">
                  <div className="mb-4">
                    <TypographyH4>{loan.lenderName}</TypographyH4>
                    <TypographyMuted>
                      Started:{" "}
                      {new Date(loan.startDate).toLocaleDateString("en-IN")}
                    </TypographyMuted>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      ₹{loan.amount.toLocaleString()}
                    </p>
                    <TypographyMuted>
                      {loan.interestRate}% interest
                    </TypographyMuted>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <TypographyMuted>EMI Amount</TypographyMuted>
                    <TypographySmall>
                      ₹{loan.emiAmount.toLocaleString()}
                    </TypographySmall>
                  </div>
                  <div>
                    <TypographyMuted>EMIs Paid</TypographyMuted>
                    <TypographySmall>
                      {loan.paidEmis}/{loan.totalEmis}
                    </TypographySmall>
                  </div>
                  <div>
                    <TypographyMuted>Next EMI Date</TypographyMuted>
                    <TypographySmall>
                      {new Date(loan.nextEmiDate).toLocaleDateString("en-IN")}
                    </TypographySmall>
                  </div>
                  <div>
                    <TypographyMuted>Remaining</TypographyMuted>
                    <TypographySmall className=" text-red-600">
                      ₹{remainingAmount.toLocaleString()}
                    </TypographySmall>
                  </div>
                </div>

                <div>
                  <TypographyMuted className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Progress</span>
                    <span>{progress.toFixed(1)}% completed</span>
                  </TypographyMuted>
                  <div className="bg-white rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-end gap-2 mt-4">
                  <Button size="sm" variant="outline">
                    <Icon name="Edit2" />
                    Edit
                  </Button>
                  <Button size="sm" variant="destructive">
                    <Icon name="Trash2" />
                    Delete
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Completed Loans */}
      {completedLoans.length > 0 && (
        <Card>
          <TypographyH4>Completed Loans</TypographyH4>
          <div className="space-y-3">
            {completedLoans.map((loan) => (
              <div
                key={loan.id}
                className="p-4 bg-green-50 rounded-lg flex justify-between items-center"
              >
                <div>
                  <TypographySmall>{loan.lenderName}</TypographySmall>
                  <TypographyMuted>
                    ₹{loan.amount.toLocaleString()} - {loan.interestRate}%
                    interest
                  </TypographyMuted>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="CheckCircle" color="green" size={20} />
                  <span className="text-sm font-medium text-green-600">
                    Completed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* EMI Reminder Section */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <Icon name="AlertCircle" color="orange" size={26} />
          <div className="space-y-4">
            <TypographyH4>Upcoming EMI Reminders</TypographyH4>
            <div className="space-y-2">
              {activeLoans.map((loan) => (
                <div
                  key={loan.id}
                  className="flex justify-between items-center"
                >
                  <TypographyMuted>{loan.lenderName}</TypographyMuted>
                  <TypographySmall className="text-orange-600">
                    ₹{loan.emiAmount.toLocaleString()} due on{" "}
                    {new Date(loan.nextEmiDate).toLocaleDateString("en-IN")}
                  </TypographySmall>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
