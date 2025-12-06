import React from "react";
import { Card } from "@/components/ui/card";
import { TypographyH4 } from "@/custom/Typography";

// Simple Bar Chart using CSS for React-JS2 style visualization
export const LoanTypeChart = ({ data }) => {
  if (!data || data.length === 0)
    return <p className="text-gray-500">No data</p>;

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <Card className="p-6">
      <TypographyH4 className="mb-4">Loans by Type</TypographyH4>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.name}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">{item.name}</span>
              <span className="text-sm font-semibold">
                ₹{item.value.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-500 h-3 rounded-full transition-all"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// Lender Type Chart
export const LenderTypeChart = ({ data }) => {
  if (!data || data.length === 0)
    return <p className="text-gray-500">No data</p>;

  const maxValue = Math.max(...data.map((d) => d.value));

  return (
    <Card className="p-6">
      <TypographyH4 className="mb-4">Loans by Lender Type</TypographyH4>
      <div className="space-y-4">
        {data.map((item) => (
          <div key={item.name}>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium capitalize">
                {item.name}
              </span>
              <span className="text-sm font-semibold">
                ₹{item.value.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-purple-500 h-3 rounded-full transition-all"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

// EMI Payment Progress Chart
export const EMIProgressChart = ({ loans }) => {
  if (!loans || loans.length === 0)
    return <p className="text-gray-500">No loans</p>;

  return (
    <Card className="p-6">
      <TypographyH4 className="mb-4">EMI Payment Progress</TypographyH4>
      <div className="space-y-3">
        {loans.slice(0, 5).map((loan) => {
          const totalEmis = loan.totalEmis || 1;
          const paidEmis = loan.paidEmis || 0;
          const progress = (paidEmis / totalEmis) * 100;

          return (
            <div key={loan.id}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium">{loan.lenderName}</span>
                <span className="text-xs text-gray-600">
                  {paidEmis}/{totalEmis} EMIs
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(progress, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

// Status Distribution Donut Chart (CSS-based)
export const StatusDistributionChart = ({ activeCount, completedCount }) => {
  const total = activeCount + completedCount;
  const activePercent = total > 0 ? (activeCount / total) * 100 : 0;

  return (
    <Card className="p-6">
      <TypographyH4 className="mb-4">Loan Status Distribution</TypographyH4>
      <div className="flex items-center justify-between">
        <div className="relative w-24 h-24">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="8"
              strokeDasharray={`${(activePercent / 100) * 251.2} 251.2`}
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              fill="none"
              stroke="#10B981"
              strokeWidth="8"
              strokeDasharray={`${((100 - activePercent) / 100) * 251.2} 251.2`}
              strokeDashoffset={`${-(activePercent / 100) * 251.2}`}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <span className="text-lg font-semibold">{total}</span>
          </div>
        </div>
        <div className="space-y-2 ml-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full" />
            <span className="text-sm">Active: {activeCount}</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-sm">Completed: {completedCount}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};
