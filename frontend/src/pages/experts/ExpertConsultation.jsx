import { useState, useEffect } from 'react';
import { Calendar, Star } from 'lucide-react';
import { dataStore } from '../../utils/dataStore';

export const ExpertConsultation = () => {
  const [experts, setExperts] = useState([]);
  const [consultations, setConsultations] = useState([]);

  useEffect(() => {
    setExperts(dataStore.getExperts());
    setConsultations(dataStore.getConsultations());
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Expert Consultation</h2>
        <p className="text-gray-600 mt-1">Get professional advice from agricultural experts</p>
      </div>

      {/* Experts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experts.map((expert) => (
          <div key={expert.id} className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center gap-4 mb-4">
              <img
                src={expert.avatar}
                alt={expert.name}
                className="w-16 h-16 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-800">{expert.name}</h3>
                <p className="text-sm text-gray-600">{expert.specialization}</p>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Experience:</span>
                <span className="font-semibold">{expert.experience} years</span>
              </div>
              <div className="flex justify-between text-sm items-center">
                <span className="text-gray-600">Rating:</span>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">{expert.rating}</span>
                </div>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Fee:</span>
                <span className="font-semibold">₹{expert.consultationFee}</span>
              </div>
            </div>

            <button className="w-full px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" />
              Book Consultation
            </button>
          </div>
        ))}
      </div>

      {/* Consultations */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">My Consultations</h3>
        <div className="space-y-3">
          {consultations.map((consultation) => (
            <div
              key={consultation.id}
              className="p-4 bg-gray-50 rounded-lg flex justify-between items-center"
            >
              <div>
                <p className="font-medium text-gray-800">{consultation.expertName}</p>
                <p className="text-sm text-gray-600">{consultation.topic}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {consultation.date} at {consultation.time}
                </p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  consultation.status === 'Scheduled'
                    ? 'bg-blue-100 text-blue-700'
                    : consultation.status === 'Completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {consultation.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
