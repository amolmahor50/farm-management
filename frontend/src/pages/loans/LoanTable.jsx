"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Icon } from "@/custom/Icon";
import {
  TypographyH4,
  TypographySmall,
  TypographyMuted,
} from "@/custom/Typography";
import { Progress } from "@/components/ui/progress";
import { QuickLoan } from "./QuickLoan";
import { useDeleteLoan } from "@/hooks/useLoans";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { DeleteDialog } from "@/components/DeleteDialog";
import { ConfirmDialog } from "@/components/ConfirmDialog";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";

/* Dialog components */
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

/* Import ShadCN Pagination */
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
} from "@/components/ui/pagination";
import { toastError } from "../../utils/toast";

/* ===============================
   Loan Table Component
================================= */
export default function LoanTable() {
  const { removeLoan, fetchLoans, editLoan, loans } = useLoan();
  const [loadingId, setLoadingId] = useState(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [statusFilter, setStatusFilter] = useState("all");

  /* Pagination state */
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  /* Pay EMI Dialog State */
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [selectedLoan, setSelectedLoan] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");

  /** 🗑️ Handle Delete */
  const handleDelete = async (id) => {
    setLoadingId(id);
    try {
      await removeLoan(id);
      await fetchLoans();
    } catch (err) {
      console.error("Delete failed:", err);
    } finally {
      setLoadingId(null);
    }
  };

  /** 💸 Open Pay EMI Dialog */
  const openPayDialog = (loan) => {
    setSelectedLoan(loan);
    setPaymentAmount(loan.emiAmount || 0);
    setPayDialogOpen(true);
  };

  /** 💸 Confirm Payment */
  const handleConfirmPayment = async () => {
    if (!selectedLoan) return;
    const amount = parseFloat(paymentAmount) || 0;

    const remaining =
      selectedLoan.remainingAmount ||
      (selectedLoan.totalAmount || selectedLoan.principal) -
        (selectedLoan.totalPaid || 0);

    if (amount <= 0) {
      toastError("Enter a valid payment amount!");
      setPayDialogOpen(false);
      return;
    }

    if (amount > remaining) {
      toastError(
        `Payment cannot exceed remaining amount ₹${remaining.toLocaleString(
          "en-IN"
        )}`
      );
      setPayDialogOpen(false);
      return;
    }

    try {
      const newPaid = (selectedLoan.totalPaid || 0) + amount;
      const newRemaining = Math.max(
        (selectedLoan.totalAmount || selectedLoan.principal) - newPaid,
        0
      );
      const status = newRemaining === 0 ? "completed" : "active";

      await editLoan(selectedLoan._id, {
        ...selectedLoan,
        totalPaid: newPaid,
        remainingAmount: newRemaining,
        status,
      });

      await fetchLoans();
      setPayDialogOpen(false);
      setPaymentError(""); // Clear error on success
    } catch (err) {
      console.error("Pay EMI failed:", err);
    }
  };

  /** 💰 Handle Full Payment */
  const handlePayFull = async (loan) => {
    setLoadingId(loan._id);
    try {
      await editLoan(loan._id, {
        ...loan,
        totalPaid: loan.totalAmount || loan.principal,
        remainingAmount: 0,
        status: "completed",
      });
      await fetchLoans();
    } catch (err) {
      console.error("Full payment failed:", err);
    } finally {
      setLoadingId(null);
    }
  };

  /** 🔍 Filter + Sort Loans */
  const filteredLoans = useMemo(() => {
    let filtered = loans?.filter((loan) => {
      const lender = loan?.lender?.name?.toLowerCase() || "";
      const type = loan?.loanType?.toLowerCase() || "";
      const status = loan?.status?.toLowerCase() || "";

      const matchesSearch =
        lender.includes(search.toLowerCase()) ||
        type.includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || status === statusFilter.toLowerCase();

      return matchesSearch && matchesStatus;
    });

    filtered?.sort((a, b) => {
      const valA = a[sortKey] ?? "";
      const valB = b[sortKey] ?? "";

      if (typeof valA === "string" || typeof valB === "string") {
        return sortOrder === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      }

      return sortOrder === "asc" ? valA - valB : valB - valA;
    });

    return filtered || [];
  }, [loans, search, sortKey, sortOrder, statusFilter]);

  /* Pagination Logic */
  const totalPages = Math.ceil(filteredLoans.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const currentLoans = filteredLoans.slice(startIdx, startIdx + itemsPerPage);

  /** 🔄 Toggle Sort */
  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  return (
    <>
      <Card className="md:p-2 w-full overflow-x-auto">
        {/* Header + Controls */}
        <div className="flex px-6 pt-4 flex-col sm:flex-row justify-between gap-3">
          <TypographyH4>All Loans</TypographyH4>
          <div className="flex gap-2">
            <Input
              placeholder="Search lender or type..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-[220px]"
            />
            <Select
              onValueChange={(v) => {
                setStatusFilter(v);
                setCurrentPage(1);
              }}
              defaultValue="all"
            >
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Filter Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Loan Table */}
        <Table>
          <TableHeader>
            <TableRow>
              {[
                { key: "lender", label: "Lender" },
                { key: "loanType", label: "Type" },
                { key: "principal", label: "Principal (₹)" },
                { key: "interestRate", label: "Interest (%)" },
                { key: "emiAmount", label: "EMI (₹)" },
                { key: "emiPaid", label: "EMIs Paid" },
                { key: "totalPaid", label: "Paid (₹)" },
                { key: "remainingAmount", label: "Remaining (₹)" },
                { key: "tenure", label: "Duration" },
                { key: "Date", label: " Date" },
                { key: "status", label: "Status" },
                { key: "progress", label: "Progress" },
                { key: "actions", label: "Actions" },
              ].map((col, index) => (
                <TableHead
                  key={index}
                  className="cursor-pointer select-none whitespace-nowrap"
                  onClick={() =>
                    !["actions", "progress", "guarantor"].includes(col.key)
                      ? toggleSort(col.key)
                      : null
                  }
                >
                  {col.label}
                  {sortKey === col.key && (
                    <Icon
                      name={sortOrder === "asc" ? "ChevronUp" : "ChevronDown"}
                      className="inline-block ml-1"
                    />
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {currentLoans.length === 0 ? (
              <TableRow>
                <TableCell colSpan="14" className="text-center py-10">
                  <TypographyMuted>No loans found.</TypographyMuted>
                </TableCell>
              </TableRow>
            ) : (
              currentLoans.map((loan) => {
                const paid = loan.totalPaid || 0;
                const total = loan.totalAmount || loan.principal || 1;
                const progress = Math.min((paid / total) * 100, 100);
                const totalEMIs = loan.tenure?.months || 0;
                const paidEMIs = loan.emiAmount
                  ? Math.min(Math.floor(paid / loan.emiAmount), totalEMIs)
                  : 0;

                return (
                  <TableRow key={loan._id}>
                    <TableCell className="font-medium whitespace-nowrap capitalize">
                      {loan.lender?.name || "Unknown"}
                      <TypographyMuted className="block text-xs">
                        {loan.lender?.type || "—"}
                      </TypographyMuted>
                    </TableCell>

                    <TableCell className="capitalize">
                      {loan.loanType?.replace("_", " ") || "N/A"}
                    </TableCell>

                    <TableCell>
                      ₹{loan.principal?.toLocaleString("en-IN")}
                    </TableCell>

                    <TableCell>
                      {loan.interestRate || 0}%{" "}
                      <TypographyMuted className="text-xs">
                        {loan.interestType || "simple"}
                      </TypographyMuted>
                    </TableCell>

                    <TableCell>
                      ₹{loan.emiAmount?.toLocaleString("en-IN") || "—"}
                    </TableCell>

                    <TableCell>
                      {paidEMIs}/{totalEMIs}
                    </TableCell>

                    <TableCell>₹{paid.toLocaleString("en-IN")}</TableCell>
                    <TableCell>
                      ₹{loan.remainingAmount?.toLocaleString("en-IN") || 0}
                    </TableCell>

                    <TableCell>{loan.tenure?.months || 0} mo</TableCell>

                    <TableCell className="flex flex-col text-[13px]">
                      <span>
                        {loan.startDate
                          ? new Date(loan.startDate).toLocaleDateString("en-IN")
                          : "N/A"}
                      </span>
                      <span>
                        {loan.endDate
                          ? new Date(loan.endDate).toLocaleDateString("en-IN")
                          : "N/A"}
                      </span>
                    </TableCell>

                    <TableCell>
                      <Tooltip>
                        <TooltipTrigger>
                          <span
                            className={`capitalize px-2 py-1 rounded-full text-xs font-medium ${
                              loan.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : loan.status === "active"
                                ? "bg-blue-100 text-blue-700"
                                : loan.status === "pending"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {loan.status}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          Updated:{" "}
                          {loan.updatedAt
                            ? new Date(loan.updatedAt).toLocaleDateString(
                                "en-IN"
                              )
                            : "N/A"}
                        </TooltipContent>
                      </Tooltip>
                    </TableCell>

                    <TableCell>
                      <div className="space-y-1">
                        <Progress value={progress} className="h-2 w-[80px]" />
                        <TypographySmall>
                          {Math.round(progress)}%
                        </TypographySmall>
                      </div>
                    </TableCell>

                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Icon name="Ellipsis" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="md:w-38 w-32"
                        >
                          {/* View */}
                          <DropdownMenuItem asChild>
                            <QuickLoan
                              view
                              loan={loan}
                              trigger={
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="w-full justify-start font-normal"
                                >
                                  <Icon name="Eye" /> View
                                </Button>
                              }
                            />
                          </DropdownMenuItem>

                          {/* Edit */}
                          {loan.status !== "completed" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <QuickLoan
                                  loan={loan}
                                  trigger={
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="w-full justify-start font-normal"
                                    >
                                      <Icon name="Edit2" /> Edit
                                    </Button>
                                  }
                                />
                              </DropdownMenuItem>
                            </>
                          )}

                          {/* Pay EMI */}
                          {loan.status !== "completed" && (
                            <>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => openPayDialog(loan)}
                                  className="w-full justify-start font-normal"
                                >
                                  <Icon name="CreditCard" /> Pay EMI
                                </Button>
                              </DropdownMenuItem>

                              {/* Pay Full */}
                              <DropdownMenuSeparator />
                              <DropdownMenuItem asChild>
                                <ConfirmDialog
                                  title="Confirm Full Payment"
                                  description={`Are you sure you want to mark "${loan.lender?.name}" loan as fully paid?`}
                                  triggerText="Pay Full"
                                  icon="IndianRupee"
                                  confirmText="Yes, Pay Full"
                                  onConfirm={() => handlePayFull(loan)}
                                />
                              </DropdownMenuItem>
                            </>
                          )}

                          {/* Delete */}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <DeleteDialog
                              title="Delete Loan?"
                              description="This action cannot be undone."
                              triggerText="Delete"
                              icon="Trash2"
                              loading={loadingId === loan._id}
                              onDelete={() => handleDelete(loan._id)}
                            />
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>

        {/* Pagination */}
        {filteredLoans.length > itemsPerPage && (
          <Pagination className="justify-center pt-4">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </PaginationPrevious>
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </PaginationNext>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </Card>

      {/* 💬 Pay EMI Dialog */}
      <Dialog open={payDialogOpen} onOpenChange={setPayDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pay EMI</DialogTitle>
          </DialogHeader>

          {selectedLoan && (
            <div className="space-y-4">
              <TypographySmall className="capitalize mb-3">
                Lender: <strong>{selectedLoan.lender?.name}</strong>
              </TypographySmall>

              <Input
                type="number"
                min="0"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="Enter payment amount"
              />
            </div>
          )}

          <DialogFooter className="flex justify-end space-x-2 mt-4">
            <Button variant="outline" onClick={() => setPayDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmPayment}>Confirm Payment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
