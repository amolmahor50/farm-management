import { useState } from "react";
import { Plus, Edit2, Trash2, TrendingUp } from "lucide-react";
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
import {
  TypographyH2,
  TypographyH4,
  TypographyMuted,
  TypographySmall,
} from "@/custom/Typography";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SummaryCard } from "@/components/SummaryCard";

// Example mock data (replace this with your actual data)
import { mockYields } from "../../data/mockData";

export const Yield = () => {
  const [yields] = useState(mockYields);

  const totalIncome = yields.reduce((sum, y) => sum + y.totalIncome, 0);
  const totalQuantity = yields.reduce((sum, y) => sum + y.quantity, 0);

  const cropSummary = yields.reduce((acc, y) => {
    const existing = acc.find((item) => item.crop === y.crop);
    if (existing) {
      existing.quantity += y.quantity;
      existing.income += y.totalIncome;
      existing.count += 1;
    } else {
      acc.push({
        crop: y.crop,
        quantity: y.quantity,
        income: y.totalIncome,
        count: 1,
        avgPrice: y.pricePerUnit,
      });
    }
    return acc;
  }, []);

  cropSummary.forEach((item) => {
    item.avgPrice = item.income / item.quantity;
  });

  const timelineData = yields.map((y) => ({
    date: new Date(y.date).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
    }),
    crop: y.crop,
    quantity: y.quantity,
    income: y.totalIncome,
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <TypographyH2>Yield Management</TypographyH2>
        <Button>
          <Icon name="Plus" />
          Add Yield
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Income"
          icon="TrendingUp"
          value={`${totalIncome.toLocaleString()}`}
          color="green"
        />

        <SummaryCard
          title="Total Production"
          icon="TrendingUp"
          value={`${totalQuantity.toLocaleString()} kg`}
          color="blue"
        />
        <SummaryCard
          title="Total Harvests"
          icon="TrendingUp"
          value={yields.length}
          color="orange"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Crop-wise Summary */}
        <Card>
          <TypographyH4>Production and Income by Crop</TypographyH4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cropSummary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="crop" tick={{ fontSize: 12 }} />
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
              <Tooltip contentStyle={{ fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
              <Bar
                yAxisId="left"
                dataKey="quantity"
                fill="#10b981"
                name="Quantity (kg)"
                barSize={30}
              />
              <Bar
                yAxisId="right"
                dataKey="income"
                fill="#3b82f6"
                name="Income (₹)"
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Yield Timeline */}
        <Card>
          <TypographyH4>Yield Timeline</TypographyH4>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={timelineData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                formatter={(value) => value.toLocaleString()}
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

      {/* Recent Yields Table */}
      <Card>
        <TypographyH4>Recent Yields</TypographyH4>
        <div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Crop</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price/Unit</TableHead>
                <TableHead>Total Income</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {yields.map((yieldItem) => (
                <TableRow key={yieldItem.id}>
                  <TableCell>
                    {new Date(yieldItem.date).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                      {yieldItem.crop}
                    </span>
                  </TableCell>
                  <TableCell>
                    {yieldItem.quantity} {yieldItem.unit}
                  </TableCell>
                  <TableCell> ₹{yieldItem.pricePerUnit}</TableCell>
                  <TableCell>
                    ₹{yieldItem.totalIncome.toLocaleString()}
                  </TableCell>

                  <TableCell>
                    <Button variant="goast">
                      <Icon name="Edit2" />
                    </Button>
                    <Button
                      variant="goast"
                      className="text-red-600 hover:bg-red-50"
                    >
                      <Icon name="Trash2" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={2}>Total</TableCell>
                <TableCell colSpan={2}>{totalQuantity} kg</TableCell>
                <TableCell
                  colSpan={4}
                >{`₹ ${totalIncome.toLocaleString()}`}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </Card>

      {/* Crop Performance */}
      <Card>
        <TypographyH4>Crop-wise Summary</TypographyH4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {cropSummary.map((crop) => (
            <div
              key={crop.crop}
              className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg"
            >
              <TypographySmall>{crop.crop}</TypographySmall>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <TypographyMuted>Total Production:</TypographyMuted>
                  <TypographySmall>{crop.quantity} kg</TypographySmall>
                </div>
                <div className="flex justify-between">
                  <TypographyMuted>Total Income:</TypographyMuted>
                  <span className="font-semibold text-green-600">
                    ₹{crop.income.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <TypographyMuted>Avg Price/kg:</TypographyMuted>
                  <TypographySmall>₹{crop.avgPrice.toFixed(2)}</TypographySmall>
                </div>
                <div className="flex justify-between">
                  <TypographyMuted>Harvests:</TypographyMuted>
                  <TypographySmall>{crop.count}</TypographySmall>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
