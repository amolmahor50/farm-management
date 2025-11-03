import { Card } from "@/components/ui/card";
import { TypographyH3 } from "@/custom/Typography";
import { Icon } from "@/custom/Icon";

export const SummaryCard = ({ title, icon, value, color = "#9ca3af" }) => {
  return (
    <Card className="md:p-4">
      <div className="flex items-center gap-3">
        {/* Icon Circle with Gradient */}
        <div
          className="sm:w-12 sm:h-12 w-10 h-10 rounded-full flex justify-center items-center shadow-md"
          style={{
            background: `linear-gradient(135deg, ${color} 0%, ${shadeColor(
              color,
              -20
            )} 100%)`,
          }}
        >
          <Icon name={icon} size={20} color="white" />
        </div>

        {/* Text Section */}
        <div>
          <TypographyH3 className="capitalize">{value}</TypographyH3>
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </div>
    </Card>
  );
};

// 🌈 Utility: slightly darken/lighten a color for gradient effect
function shadeColor(color, percent) {
  const f = parseInt(color.slice(1), 16);
  const t = percent < 0 ? 0 : 255;
  const p = Math.abs(percent) / 100;
  const R = f >> 16;
  const G = (f >> 8) & 0x00ff;
  const B = f & 0x0000ff;
  return (
    "#" +
    (
      0x1000000 +
      (Math.round((t - R) * p) + R) * 0x10000 +
      (Math.round((t - G) * p) + G) * 0x100 +
      (Math.round((t - B) * p) + B)
    )
      .toString(16)
      .slice(1)
  );
}
