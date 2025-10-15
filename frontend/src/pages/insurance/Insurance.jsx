import { useState, useEffect } from 'react';
import { Shield, Plus } from 'lucide-react';
import { dataStore } from '../../utils/dataStore';

export const Insurance = () => {
  const [insurance, setInsurance] = useState([]);

  useEffect(() => {
    setInsurance(dataStore.getInsurance());
  }, []);

  const activeInsurance = insurance.filter(i => i.status === 'Active');
  const expiredInsurance = insurance.filter(i => i.status === 'Expired');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Insurance Management</h2>
          <p className="text-gray-600 mt-1">Track your crop insurance policies</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
          <Plus className="w-5 h-5" />
          New Policy
        </button>
      </div>

      {/* Active Insurance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activeInsurance.map((policy) => (
          <div key={policy.id} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-600 p-3 rounded-lg">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                {policy.status}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-2">{policy.provider}</h3>
            <p className="text-sm text-gray-600 mb-4">Policy: {policy.policyNumber}</p>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Crop:</span>
                <span className="font-semibold text-gray-800">{policy.crop}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Coverage:</span>
                <span className="font-semibold text-gray-800">₹{policy.coverage.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Premium:</span>
                <span className="font-semibold text-gray-800">₹{policy.premium.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Valid Until:</span>
                <span className="font-semibold text-gray-800">{new Date(policy.endDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Expired Insurance */}
      {expiredInsurance.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Expired Policies</h3>
          <div className="space-y-3">
            {expiredInsurance.map((policy) => (
              <div key={policy.id} className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
                <div>
                  <p className="font-medium text-gray-800">{policy.provider}</p>
                  <p className="text-sm text-gray-600">{policy.crop} - {policy.policyNumber}</p>
                </div>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                  Expired
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
