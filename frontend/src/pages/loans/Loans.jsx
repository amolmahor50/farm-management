import { useMemo } from "react";
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
import { useLoans } from "@/hooks/useLoans";
import { Loading } from "@/components/Loading";
import { QuickLoan } from "./QuickLoan";
import LoanTable from "./LoanTable";
import { EmptyState } from "@/components/EmptyState";
import { loanTypes, lenderTypes } from "@/constants/loanConstants";

export const Loans = () => {
  const { data: loans = [], isLoading } = useLoans();
  const loansArr = Array.isArray(loans)
    ? loans
    : Array.isArray(loans?.data)
    ? loans.data
    : [];

  if (isLoading) return <Loading />;

  // Normalize data
  const normalizedLoans = useMemo(
    () =>
      loansArr.map((loan) => ({
        id: loan._id,
        lenderName: loan?.lender?.name || "Unknown",
        loanType: loan?.loanType || "N/A",
        principal: Number(loan?.principal || 0),
        totalAmount: Number(loan?.totalAmount || 0),
        remainingAmount: Number(loan?.remainingAmount || 0),
        interestRate: Number(loan?.interestRate || 0),
        totalEmis: loan?.tenure?.months || 0,
        paidEmis: loan?.paidEmis || 0,
        emiAmount: Number(loan?.emiAmount || 0),
        startDate: loan?.startDate,
        endDate: loan?.endDate,
        nextEmiDate: loan?.nextEmiDate,
        status: loan?.status?.toLowerCase() || "pending",
        lenderType: loan?.lender?.type || "other",
      })),
    [loansArr]
  );

  // Categorize loans
  const activeLoans = normalizedLoans.filter(
    (l) => l.status === "active" || l.status === "pending"
  );
  const completedLoans = normalizedLoans.filter(
    (l) => l.status === "completed"
  );

  // Summary totals
  const totalLoanAmount = normalizedLoans.reduce(
    (sum, l) => sum + l.totalAmount,
    0
  );
  const totalPaidAmount = normalizedLoans.reduce(
    (sum, l) => sum + (l.totalAmount - l.remainingAmount),
    0
  );
  const totalRemainingAmount = normalizedLoans.reduce(
    (sum, l) => sum + l.remainingAmount,
    0
  );

  // Normalize date (remove time)
  const normalizeDate = (date) =>
    new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const today = normalizeDate(new Date());

  // Upcoming + overdue EMI reminders (7 days before and any past due EMIs)
  const upcomingLoans = activeLoans.filter((loan) => {
    if (!loan.nextEmiDate) return false;
    const emiDate = normalizeDate(new Date(loan.nextEmiDate));
    const diffDays = Math.ceil((emiDate - today) / (1000 * 60 * 60 * 24));
    return diffDays >= -7 && diffDays <= 7; // 7 days overdue to 7 days ahead
  });

  // Loan amount by type
  const loansByType = loanTypes
    .map((type) => {
      const total = normalizedLoans
        .filter((loan) => loan.loanType === type.value)
        .reduce((sum, l) => sum + l.totalAmount, 0);
      return { name: type.label, value: total };
    })
    .filter((item) => item.value > 0);

  // Loan amount by lender type
  const loansByLenderType = lenderTypes
    .map((type) => {
      const total = normalizedLoans
        .filter((loan) => loan.lenderType === type.value)
        .reduce((sum, l) => sum + l.totalAmount, 0);
      return { name: type.label, value: total };
    })
    .filter((item) => item.value > 0);

  return (
    <>
      {loansArr.length > 0 ? (
        <div className="space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <TypographyH2>Loan Board</TypographyH2>
            <QuickLoan
              trigger={
                <Button>
                  <Icon name="Plus" /> Add Loan
                </Button>
              }
            />
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <SummaryCard
              title="Total Loan Amount"
              icon="Wallet"
              value={`₹${totalLoanAmount.toLocaleString("en-IN")}`}
              color="#3B82F6"
            />
            <SummaryCard
              title="Total Paid"
              icon="CheckCircle"
              value={`₹${totalPaidAmount.toLocaleString("en-IN")}`}
              color="#10B981"
            />
            <SummaryCard
              title="Remaining Amount"
              icon="AlertCircle"
              value={`₹${totalRemainingAmount.toLocaleString("en-IN")}`}
              color="#EF4444"
            />
            <SummaryCard
              title="Active Loans"
              icon="Activity"
              value={activeLoans.length}
              color="#3B82F6"
            />
            <SummaryCard
              title="Completed Loans"
              icon="Check"
              value={completedLoans.length}
              color="#10B981"
            />
            <SummaryCard
              title="Upcoming EMIs"
              icon="Bell"
              value={upcomingLoans.length}
              color="#F59E0B"
            />

            {loansByType.map((loan) => (
              <SummaryCard
                key={loan.name}
                title={`${loan.name} Loans`}
                icon="Wallet"
                value={`₹${loan.value.toLocaleString("en-IN")}`}
                color="#8B5CF6"
              />
            ))}

            {loansByLenderType.map((loan) => (
              <SummaryCard
                key={loan.name}
                title={`${loan.name} Lenders`}
                icon="Wallet"
                value={`₹${loan.value.toLocaleString("en-IN")}`}
                color="#F472B6"
              />
            ))}
          </div>

          <LoanTable />

          {/* EMI Reminders */}
          <Card className="bg-orange-50 border border-orange-200 p-6">
            <div className="flex items-start gap-4">
              <Icon name="AlertTriangle" color="orange" size={26} />
              <div className="space-y-4 w-full">
                <TypographyH4>Upcoming EMI Reminders</TypographyH4>
                {upcomingLoans.length === 0 ? (
                  <TypographyMuted>
                    No EMIs in the last 7 days or next 7 days.
                  </TypographyMuted>
                ) : (
                  <div className="space-y-2">
                    {upcomingLoans.map((loan) => {
                      const emiDate = normalizeDate(new Date(loan.nextEmiDate));
                      const diffDays = Math.ceil(
                        (emiDate - today) / (1000 * 60 * 60 * 24)
                      );

                      return (
                        <div
                          key={loan.id}
                          className="flex justify-between items-center border-b border-orange-100 pb-2"
                        >
                          <TypographyMuted>
                            {loan.lenderName} —{" "}
                            <span className="capitalize">{loan.loanType}</span>
                          </TypographyMuted>
                          <TypographySmall className="text-orange-600">
                            ₹{loan.emiAmount.toLocaleString("en-IN")} due on{" "}
                            {emiDate.toLocaleDateString("en-IN")}{" "}
                            {diffDays === 0
                              ? "(Today)"
                              : diffDays === 1
                              ? "(Tomorrow)"
                              : diffDays < 0
                              ? `(Overdue by ${Math.abs(diffDays)} days)`
                              : `(In ${diffDays} days)`}
                          </TypographySmall>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <EmptyState
          icon={<Icon name="Wallet" size={32} />}
          title="No Loans Yet"
          description="You haven’t added any loans yet. Start by adding your first loan."
          button={
            <QuickLoan
              trigger={
                <Button>
                  <Icon name="Plus" /> Add Loan
                </Button>
              }
            />
          }
        />
      )}
    </>
  );
};
