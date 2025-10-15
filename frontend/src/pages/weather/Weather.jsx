import { Cloud } from "lucide-react";
import { mockWeather } from "../../data/mockData";

export const Weather = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">
        Weather & Suggestions
      </h2>
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-8 text-white">
        <div className="flex items-center gap-4 mb-6">
          <Cloud className="w-16 h-16" />
          <div>
            <h3 className="text-3xl font-bold">{mockWeather.temperature}°C</h3>
            <p className="text-blue-100">{mockWeather.condition}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div>
            <p className="text-blue-200 text-sm">Rainfall</p>
            <p className="text-xl font-semibold">{mockWeather.rainfall}mm</p>
          </div>
          <div>
            <p className="text-blue-200 text-sm">Humidity</p>
            <p className="text-xl font-semibold">{mockWeather.humidity}%</p>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Farming Suggestions
        </h3>
        <ul className="space-y-2">
          {mockWeather.suggestions.map((s, i) => (
            <li key={i} className="flex items-center gap-2 text-gray-700">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              {s}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
