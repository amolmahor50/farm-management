import { Shield, Plus } from "lucide-react";
import { useInsurance, useDeleteInsurance } from "@/hooks/useInsurance";
import { Button } from "@/components/ui/button";
import { Icon } from "@/custom/Icon";
import { TypographyH2, TypographyMuted } from "@/custom/Typography";
import { SummaryCard } from "@/components/SummaryCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Loading } from "@/components/Loading";
import { EmptyState } from "@/components/EmptyState";

export const Insurance = () => {
  const { data: insurance = [], isLoading } = useInsurance();
  const deleteInsuranceMutation = useDeleteInsurance();
  const insuranceArr = Array.isArray(insurance)
    ? insurance
    : Array.isArray(insurance?.data)
    ? insurance.data
    : [];

  const activeInsurance = insuranceArr.filter((i) => i.status === "Active");
  const expiredInsurance = insuranceArr.filter((i) => i.status === "Expired");

  const totalCoverage = insuranceArr.reduce(
    (sum, i) => sum + (Number(i.coverage) || 0),
    0
  );
  const totalPremium = insuranceArr.reduce(
    (sum, i) => sum + (Number(i.premium) || 0),
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <TypographyH2>Insurance Management</TypographyH2>
          <TypographyMuted>Track your crop insurance policies</TypographyMuted>
        </div>
        <Button>
          <Plus className="w-5 h-5 mr-2" />
          New Policy
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Policies"
          icon="Shield"
          value={insuranceArr.length}
          color="#3b82f6"
        />
        <SummaryCard
          title="Total Coverage"
          icon="Wallet"
          value={`₹${totalCoverage.toLocaleString("en-IN")}`}
          color="#10b981"
        />
        <SummaryCard
          title="Total Premium"
          icon="DollarSign"
          value={`₹${totalPremium.toLocaleString("en-IN")}`}
          color="#ef4444"
        />
      </div>

      {isLoading ? (
        <Loading />
      ) : insurance.length > 0 ? (
        <>
          {/* Active Insurance */}
          {activeInsurance.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Active Policies
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {activeInsurance.map((policy) => (
                  <div
                    key={policy._id}
                    className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="bg-blue-600 p-3 rounded-lg">
                        <Shield className="w-6 h-6 text-white" />
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                        {policy.status}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {policy.provider}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Policy: {policy.policyNumber}
                    </p>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Crop:</span>
                        <span className="font-semibold text-gray-800">
                          {policy.crop}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Coverage:</span>
                        <span className="font-semibold text-gray-800">
                          ₹{Number(policy.coverage).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Premium:</span>
                        <span className="font-semibold text-gray-800">
                          ₹{Number(policy.premium).toLocaleString("en-IN")}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Valid Until:</span>
                        <span className="font-semibold text-gray-800">
                          {new Date(policy.endDate).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Expired Insurance */}
          {expiredInsurance.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Expired Policies
              </h3>
              <div className="space-y-3">
                {expiredInsurance.map((policy) => (
                  <div
                    key={policy._id}
                    className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center"
                  >
                    <div>
                      <p className="font-medium text-gray-800">
                        {policy.provider}
                      </p>
                      <p className="text-sm text-gray-600">
                        {policy.crop} - {policy.policyNumber}
                      </p>
                    </div>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                      Expired
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          icon={<Icon name="Shield" size={32} />}
          title="No Insurance Policies"
          description="You haven't added any insurance policies yet. Start by adding your first policy."
          button={
            <Button>
              <Plus className="w-5 h-5 mr-2" />
              New Policy
            </Button>
          }
        />
      )}
    </div>
  );
};
