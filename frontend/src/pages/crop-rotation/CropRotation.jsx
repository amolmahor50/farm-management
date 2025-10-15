import { useEffect, useState } from "react";
import { Repeat } from "lucide-react";
import { dataStore } from "../../utils/dataStore";

export const CropRotation = () => {
  const [rotations, setRotations] = useState([]);

  useEffect(() => {
    setRotations(dataStore.getCropRotations());
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <h2 className="text-2xl font-bold text-gray-800">
        Crop Rotation Planner
      </h2>

      {/* Crop Rotation Cards */}
      <div className="grid gap-6">
        {rotations.map((rotation) => (
          <div key={rotation.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-4">
              <Repeat className="w-6 h-6 text-green-600" />
              <h3 className="text-lg font-semibold text-gray-800">
                {rotation.currentCrop} - {rotation.season}
              </h3>
            </div>
            <p className="text-gray-600 mb-3">
              Suggested Next Crops: {rotation.suggestedCrops.join(", ")}
            </p>
            <p className="text-sm text-gray-500">{rotation.benefits}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
