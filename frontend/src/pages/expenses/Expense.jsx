import { useState, useEffect } from "react";
import { dataStore } from "@/utils/dataStore";
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Expense = () => {
  const [expenses, setExpenses] = useState([]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [formData, setFormData] = useState({
    date: "",
    category: "Fertilizer",
    amount: "",
    crop: "",
    description: "",
  });

  useEffect(() => {
    setExpenses(dataStore.getExpenses());
  }, []);

  const filteredExpenses =
    filterCategory === "all"
      ? expenses
      : expenses.filter((exp) => exp.category === filterCategory);

  const totalExpenses = filteredExpenses.reduce(
    (sum, exp) => sum + exp.amount,
    0
  );

  const categoryData = Object.entries(
    expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {})
  ).map(([name, value]) => ({ name, value }));

  const cropData = expenses.reduce((acc, exp) => {
    const existing = acc.find((c) => c.crop === exp.crop);
    if (existing) existing.amount += exp.amount;
    else acc.push({ crop: exp.crop, amount: exp.amount });
    return acc;
  }, []);

  const COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"];

  const handleOpenModal = (expense) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        date: expense.date,
        category: expense.category,
        amount: expense.amount.toString(),
        crop: expense.crop,
        description: expense.description,
      });
    } else {
      setEditingExpense(null);
      setFormData({
        date: new Date().toISOString().split("T")[0],
        category: "Fertilizer",
        amount: "",
        crop: "",
        description: "",
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingExpense(null);
    setFormData({
      date: "",
      category: "Fertilizer",
      amount: "",
      crop: "",
      description: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...formData, amount: parseFloat(formData.amount) };
    if (editingExpense) dataStore.updateExpense(editingExpense.id, payload);
    else dataStore.addExpense({ userId: "1", ...payload });
    setExpenses(dataStore.getExpenses());
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      dataStore.deleteExpense(id);
      setExpenses(dataStore.getExpenses());
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <TypographyH2>Expense Management</TypographyH2>
        <Button onClick={() => handleOpenModal()}>
          <Icon name="Plus" />
          Add Expense
        </Button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <TypographyH4>Expenses by Category</TypographyH4>
          <ResponsiveContainer width="95%" height={300}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
                label={({ name, percent }) =>
                  `${name}: ${(percent * 100).toFixed(0)}%`
                }
                labelLine={false}
              >
                {categoryData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card>
          <TypographyH4>Expenses by Crop</TypographyH4>
          <ResponsiveContainer width="95%" height={350}>
            <BarChart data={cropData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="crop" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(v) => `₹${v.toLocaleString()}`} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="amount"
                fill="#ef4444"
                name="Amount (₹)"
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Total & Filter */}
      <Card>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="space-y-2">
            <TypographyH4>Total Expenses</TypographyH4>
            <TypographyH2 className="text-red-600">
              ₹{totalExpenses.toLocaleString()}
            </TypographyH2>
          </div>
          <div>
            <Select
              value={filterCategory}
              onValueChange={(value) => setFilterCategory(value)}
            >
              <SelectTrigger className="w-full md:w-36">
                <Icon name="Filter" />
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Fertilizer">Fertilizer</SelectItem>
                <SelectItem value="Labor">Labor</SelectItem>
                <SelectItem value="Seeds">Seeds</SelectItem>
                <SelectItem value="Equipment">Equipment</SelectItem>
                <SelectItem value="Others">Others</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Expenses Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Crop</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell>
                    {new Date(exp.date).toLocaleDateString("en-IN")}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        exp.category === "Fertilizer"
                          ? "bg-green-100 text-green-700"
                          : exp.category === "Labor"
                          ? "bg-blue-100 text-blue-700"
                          : exp.category === "Seeds"
                          ? "bg-yellow-100 text-yellow-700"
                          : exp.category === "Equipment"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {exp.category}
                    </span>
                  </TableCell>
                  <TableCell>{exp.crop}</TableCell>
                  <TableCell>{exp.description}</TableCell>
                  <TableCell>₹{exp.amount.toLocaleString()}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      size="icon"
                      variant="goast"
                      onClick={() => handleOpenModal(exp)}
                    >
                      <Icon name="Edit2" />
                    </Button>
                    <Button
                      size="icon"
                      variant="goast"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(exp.id)}
                    >
                      <Icon name="Trash2" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <TypographyH4>
                {editingExpense ? "Edit Expense" : "Add Expense"}
              </TypographyH4>
              <Button size="icon" variant="ghost" onClick={handleCloseModal}>
                <Icon name="X" size={22} />
              </Button>
            </div>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="Fertilizer">Fertilizer</option>
                  <option value="Labor">Labor</option>
                  <option value="Seeds">Seeds</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Others">Others</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Amount (₹)
                </label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Crop</label>
                <input
                  type="text"
                  required
                  value={formData.crop}
                  onChange={(e) =>
                    setFormData({ ...formData, crop: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded-lg outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleCloseModal}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  {editingExpense ? "Update" : "Add"} Expense
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};
