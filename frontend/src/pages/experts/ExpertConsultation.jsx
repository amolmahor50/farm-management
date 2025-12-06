import { useState } from "react";
import { Star, Calendar } from "lucide-react";
import { useExperts } from "@/hooks/useExperts";
import { Button } from "@/components/ui/button";
import { Icon } from "@/custom/Icon";
import {
  TypographyH2,
  TypographyMuted,
  TypographySmall,
} from "@/custom/Typography";
import { Loading } from "@/components/Loading";
import { EmptyState } from "@/components/EmptyState";

export const ExpertConsultation = () => {
  const { data: experts = [], isLoading } = useExperts();
  const [selectedExpert, setSelectedExpert] = useState(null);
  const expertsArr = Array.isArray(experts)
    ? experts
    : Array.isArray(experts?.data)
    ? experts.data
    : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <TypographyH2>Expert Consultation</TypographyH2>
        <TypographyMuted>
          Get professional advice from agricultural experts
        </TypographyMuted>
      </div>

      {isLoading ? (
        <Loading />
      ) : expertsArr.length > 0 ? (
        <>
          {/* Experts List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {expertsArr.map((expert) => (
              <div
                key={expert._id}
                className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-center gap-4 mb-4">
                  {expert.profileImage && (
                    <img
                      src={expert.profileImage}
                      alt={expert.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  )}
                  <div>
                    <TypographySmall className="font-semibold text-gray-800">
                      {expert.name}
                    </TypographySmall>
                    <TypographyMuted>{expert.specialization}</TypographyMuted>
                  </div>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Experience:</span>
                    <span className="font-semibold">
                      {expert.yearsOfExperience || 0} years
                    </span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-gray-600">Rating:</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">
                        {expert.rating || 0}
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Fee:</span>
                    <span className="font-semibold">
                      ₹{expert.consultationFee?.toLocaleString() || 0}
                    </span>
                  </div>
                </div>

                <Button className="w-full">
                  <Calendar className="w-4 h-4 mr-2" />
                  Book Consultation
                </Button>
              </div>
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={<Icon name="Users" size={32} />}
          title="No Experts Available"
          description="No agricultural experts are available for consultation at the moment."
        />
      )}
    </div>
  );
};
