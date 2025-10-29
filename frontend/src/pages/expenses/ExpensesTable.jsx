import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Icon } from "@/custom/Icon";
import { QuickExpense } from "./QuickExpense";
import { useExpenses } from "@/contexts/ExpenseContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function ExpensesTable({ filteredExpenses = [] }) {
  const { removeExpense, expenses } = useExpenses();
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // ✅ Merge filtered + context data
  const expensesList = useMemo(() => {
    const list =
      Array.isArray(filteredExpenses) && filteredExpenses.length > 0
        ? filteredExpenses
        : expenses || [];

    // ✅ Sort newest first
    return [...list].sort((a, b) => {
      const dateA = new Date(a.date || 0).getTime();
      const dateB = new Date(b.date || 0).getTime();
      return dateB - dateA;
    });
  }, [filteredExpenses, expenses]);

  // ✅ Delete expense instantly
  const handleDelete = async (id) => {
    if (!id) return;
    try {
      setIsDeleting(true);
      await removeExpense(id);
    } catch (error) {
      console.error("Delete failed:", error);
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  // ✅ Helper: format date safely
  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    if (isNaN(date)) return "—";
    return date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Payment Type</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {expensesList.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500">
                No expenses found.
              </TableCell>
            </TableRow>
          ) : (
            expensesList.map((exp) => (
              <TableRow key={exp._id}>
                {/* ✅ Date */}
                <TableCell>{formatDate(exp.date)}</TableCell>

                {/* ✅ Category pill */}
                <TableCell>
                  <span
                    className={`px-2 py-1 rounded-full text-xs capitalize font-medium ${
                      exp.category?.toLowerCase() === "fertilizer"
                        ? "bg-green-100 text-green-700"
                        : exp.category?.toLowerCase() === "labor"
                        ? "bg-blue-100 text-blue-700"
                        : exp.category?.toLowerCase() === "seeds"
                        ? "bg-yellow-100 text-yellow-700"
                        : exp.category?.toLowerCase() === "equipment"
                        ? "bg-red-100 text-red-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {exp.category || "N/A"}
                  </span>
                </TableCell>

                {/* ✅ Description */}
                <TableCell>{exp.description?.trim() || "—"}</TableCell>

                {/* ✅ Amount */}
                <TableCell>
                  ₹{Number(exp.amount || 0).toLocaleString("en-IN")}
                </TableCell>

                {/* ✅ Payment Type */}
                <TableCell className="capitalize">
                  {exp.paymentMethod || "—"}
                </TableCell>

                {/* ✅ Actions */}
                <TableCell className="flex gap-2">
                  <QuickExpense
                    expense={exp}
                    trigger={
                      <Button size="icon" variant="ghost" title="Edit Expense">
                        <Icon name="Edit2" />
                      </Button>
                    }
                  />

                  {/* Delete Button */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-600 hover:bg-red-50"
                        onClick={() => setDeleteTarget(exp._id)}
                      >
                        <Icon name="Trash2" />
                      </Button>
                    </AlertDialogTrigger>

                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete this expense?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. It will permanently
                          remove this expense.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          disabled={isDeleting}
                          onClick={() => setDeleteTarget(null)}
                        >
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          disabled={isDeleting}
                          onClick={() => handleDelete(deleteTarget)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
