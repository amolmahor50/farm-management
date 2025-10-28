import { Card } from "@/components/ui/card";
import { TypographyH3 } from "@/custom/Typography";
import { Icon } from "@/custom/Icon";

const colorMap = {
  red: "from-red-500 to-red-600",
  green: "from-green-500 to-green-600",
  blue: "from-blue-500 to-blue-600",
  orange: "from-orange-500 to-orange-600",
};

export const SummaryCard = ({ title, icon, value, color }) => (
  <Card>
    <div className="flex items-center gap-3">
      <div
        className={`bg-gradient-to-br ${colorMap[color]} w-12 h-12 rounded-full flex justify-center items-center`}
      >
        <Icon name={icon} size={20} color="white" />
      </div>
      <div>
        <TypographyH3>{value.toLocaleString()}</TypographyH3>
        <p className="text-sm opacity-90">{title}</p>
      </div>
    </div>
  </Card>
);
