import { Card } from "@/components/ui/card";
import { TypographyH3 } from "@/custom/Typography";
import { Icon } from "@/custom/Icon";

export const SummaryCard = ({ title, icon, value, color }) => (
  <Card>
    <div className="flex items-center gap-3">
      <div
        className={`bg-gradient-to-br from-${color}-500 to-${color}-600 w-12 h-12 rounded-full flex justify-center items-center`}
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
