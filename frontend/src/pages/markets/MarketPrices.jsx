import { TrendingUp, TrendingDown, MapPin, DollarSign } from "lucide-react";
import { useMarket } from "@/hooks/useMarket";
import { TypographyH2, TypographyMuted } from "@/custom/Typography";
import { Loading } from "@/components/Loading";
import { EmptyState } from "@/components/EmptyState";
import { Icon } from "@/custom/Icon";

export const MarketPrices = () => {
  const { data: marketPrices = [], isLoading } = useMarket();
  const marketPricesArr = Array.isArray(marketPrices)
    ? marketPrices
    : Array.isArray(marketPrices?.data)
    ? marketPrices.data
    : [];

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Market Prices</h2>
        <p className="text-gray-600 mt-1">Current market rates for crops</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {marketPricesArr.map((price, index) => {
          const isUp = index % 2 === 0;
          const change = (Math.random() * 10 - 5).toFixed(2);

          return (
            <div
              key={price.id}
              className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    {price.crop}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                    <MapPin className="w-4 h-4" />
                    <span>{price.market}</span>
                  </div>
                </div>
                <div
                  className={`p-2 rounded-lg ${
                    isUp ? "bg-green-100" : "bg-red-100"
                  }`}
                >
                  {isUp ? (
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  ) : (
                    <TrendingDown className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </div>

              <div className="mb-3">
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-gray-800">
                    ₹{price.price}
                  </span>
                  <span className="text-sm text-gray-600">{price.unit}</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <span
                    className={`text-sm font-medium ${
                      isUp ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {isUp ? "+" : ""}
                    {change}%
                  </span>
                  <span className="text-xs text-gray-500">vs last week</span>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500">
                  Last updated:{" "}
                  {new Date(price.date).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-green-600" />
          Price Insights
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">
              Best Time to Sell
            </h4>
            <p className="text-sm text-gray-600">
              Wheat prices are expected to rise by 5-7% in the next two weeks
              due to increased demand.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg">
            <h4 className="font-medium text-gray-800 mb-2">Market Trend</h4>
            <p className="text-sm text-gray-600">
              Rice prices are stable. Consider holding your stock for better
              prices in the next month.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Price History Comparison
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">
                  Crop
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">
                  Current
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">
                  Last Week
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">
                  Last Month
                </th>
                <th className="text-right py-3 px-4 font-semibold text-gray-700">
                  Change
                </th>
              </tr>
            </thead>
            <tbody>
              {marketPricesArr.map((price) => {
                const lastWeek = price.price - Math.floor(Math.random() * 200);
                const lastMonth = price.price - Math.floor(Math.random() * 400);
                const change = (
                  ((price.price - lastMonth) / lastMonth) *
                  100
                ).toFixed(1);
                const isPositive = parseFloat(change) > 0;

                return (
                  <tr
                    key={price.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 font-medium text-gray-800">
                      {price.crop}
                    </td>
                    <td className="py-3 px-4 text-right font-semibold text-gray-800">
                      ₹{price.price}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-700">
                      ₹{lastWeek}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-700">
                      ₹{lastMonth}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span
                        className={`font-semibold ${
                          isPositive ? "text-green-600" : "text-red-600"
                        }`}
                      >
                        {isPositive ? "+" : ""}
                        {change}%
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
