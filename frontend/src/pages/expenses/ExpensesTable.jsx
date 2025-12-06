import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Icon } from "@/custom/Icon";
import { TypographyH4 } from "@/custom/Typography";
import { QuickExpense } from "./QuickExpense";
import { useExpenses, useDeleteExpense } from "@/hooks/useExpenses";
import { capitalize } from "@/utils/capatalize";
import { CATEGORIES, PAYMENT_METHODS } from "@/constants/expensesConstants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { formatDateTime } from "@/utils/formatDateTime";
import { DeleteDialog } from "@/components/DeleteDialog";

// 🧩 Helper: category badge style
const getCategoryBadge = (category) => {
  const colorMap = {
    fertilizer: "bg-green-100 text-green-700",
    labor: "bg-blue-100 text-blue-700",
    seeds: "bg-yellow-100 text-yellow-700",
    equipment: "bg-red-100 text-red-700",
    irrigation: "bg-cyan-100 text-cyan-700",
    other: "bg-gray-100 text-gray-700",
  };
  return colorMap[category?.toLowerCase()] || "bg-gray-100 text-gray-700";
};

// 🧩 Filter logic
const applyFilters = (expenses, filters) => {
  const { category, payment, minAmount, maxAmount } = filters;
  return expenses.filter((exp) => {
    const matchCategory =
      category === "all" || exp.category?.toLowerCase() === category;
    const matchPayment =
      payment === "all" || exp.paymentMethod?.toLowerCase() === payment;
    const amount = Number(exp.amount) || 0;
    const matchAmount =
      (!minAmount || amount >= minAmount) &&
      (!maxAmount || amount <= maxAmount);
    return matchCategory && matchPayment && matchAmount;
  });
};

export default function ExpensesTable() {
  const { data: expenses = [] } = useExpenses();
  const expensesArr = Array.isArray(expenses)
    ? expenses
    : Array.isArray(expenses?.data)
    ? expenses.data
    : [];
  const deleteMutation = useDeleteExpense();

  const [filters, setFilters] = useState({
    category: "all",
    payment: "all",
    minAmount: "",
    maxAmount: "",
  });

  //  Pagination
  const [page, setPage] = useState(1);
  const perPage = 10;
  const startIndex = (page - 1) * perPage;
  const endIndex = page * perPage;

  //  Apply filters
  const filteredExpenses = useMemo(
    () => applyFilters(expensesArr, filters),
    [expensesArr, filters]
  );

  const totalPages = Math.ceil(filteredExpenses.length / perPage);
  const paginatedExpenses = filteredExpenses.slice(startIndex, endIndex);

  const total = useMemo(
    () =>
      filteredExpenses.reduce((sum, exp) => sum + (Number(exp.amount) || 0), 0),
    [filteredExpenses]
  );

  //  Delete Expense
  const handleDelete = async (id) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (err) {
      console.error("Failed to delete expense:", err);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <TypographyH4>
          Total:{" "}
          <span className="text-red-600">₹{total.toLocaleString("en-IN")}</span>
        </TypographyH4>

        <div className="flex flex-wrap gap-3">
          {/* Category Filter */}
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              value={filters.category}
              onValueChange={(v) => setFilters((f) => ({ ...f, category: v }))}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Category" />
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

          {/* Payment Filter */}
          <div className="space-y-2">
            <Label>Payment</Label>
            <Select
              value={filters.payment}
              onValueChange={(v) => setFilters((f) => ({ ...f, payment: v }))}
            >
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Payment" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                {PAYMENT_METHODS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {capitalize(p.replace("_", " "))}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Amount Filter */}
          <div className="space-y-2">
            <Label>Min ₹</Label>
            <Input
              className="w-[90px]"
              value={filters.minAmount}
              onChange={(e) =>
                setFilters((f) => ({ ...f, minAmount: e.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Max ₹</Label>
            <Input
              className="w-[90px]"
              value={filters.maxAmount}
              onChange={(e) =>
                setFilters((f) => ({ ...f, maxAmount: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      {/* Table (desktop) */}
      <div className="">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedExpenses.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-gray-500"
                >
                  No matching expenses.
                </TableCell>
              </TableRow>
            ) : (
              paginatedExpenses.map((exp) => (
                <TableRow key={exp._id}>
                  <TableCell>{formatDateTime(exp.date)}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${getCategoryBadge(
                        exp.category
                      )}`}
                    >
                      {exp.category || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell className="whitespace-pre-wrap break-words">
                    {exp?.description
                      ? exp.description.length > 30
                        ? `${exp.description.slice(0, 30)}....`
                        : exp.description
                      : "—"}
                  </TableCell>
                  <TableCell>
                    ₹{Number(exp.amount || 0).toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="capitalize">
                    {exp.paymentMethod || "—"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <Icon name="Ellipsis" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <QuickExpense
                            view
                            expense={exp}
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start"
                              >
                                <Icon name="Eye" /> View
                              </Button>
                            }
                          />
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <QuickExpense
                            expense={exp}
                            trigger={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full justify-start"
                              >
                                <Icon name="Edit2" /> Edit
                              </Button>
                            }
                          />
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <DeleteDialog
                            title="Delete this expense?"
                            description="This action cannot be undone. The expense will be permanently removed."
                            triggerText="Delete"
                            icon="Trash2"
                            onDelete={() => handleDelete(exp._id)}
                          />
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination>
          <PaginationContent className="flex justify-center">
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
              />
            </PaginationItem>
            <span className="px-4 text-sm text-gray-600">
              Page {page} of {totalPages}
            </span>
            <PaginationItem>
              <PaginationNext
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </Card>
  );
}
