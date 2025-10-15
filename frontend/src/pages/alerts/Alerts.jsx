import { Icon } from "@/custom/Icon";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { mockAlerts } from "@/data/mockData";
import {
  TypographyH1,
  TypographyH2,
  TypographyH3,
  TypographyMuted,
  TypographySmall,
} from "../../custom/Typography";

const ALERT_TYPES = {
  EMI: { icon: "Wallet", color: "blue" },
  Task: { icon: "Calendar", color: "green" },
  Weather: { icon: "CloudRain", color: "orange" },
  Pest: { icon: "Bug", color: "red" },
  Disease: { icon: "AlertCircle", color: "red" },
  Default: { icon: "Bell", color: "gray" },
};

export const Alerts = () => {
  const unreadAlerts = mockAlerts.filter((a) => !a.read);
  const readAlerts = mockAlerts.filter((a) => a.read);

  const getType = (type) => ALERT_TYPES[type] || ALERT_TYPES.Default;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <TypographyH2>Notifications & Alerts</TypographyH2>
        {unreadAlerts.length > 0 && (
          <Button variant="link">Mark All as Read</Button>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          {
            title: "Unread Alerts",
            count: unreadAlerts.length,
            icon: "AlertCircle",
            color: "red",
          },
          {
            title: "Read Alerts",
            count: readAlerts.length,
            icon: "CheckCircle",
            color: "green",
          },
          {
            title: "Total Alerts",
            count: mockAlerts.length,
            icon: "Bell",
            color: "blue",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="bg-card rounded-xl flex items-center gap-6 p-6"
          >
            <div
              className={`bg-gradient-to-br rounded-full from-${card.color}-500 to-${card.color}-600 w-12 h-12 flex justify-center items-center`}
            >
              <Icon name={card.icon} size={22} color="white" />
            </div>
            <div className="flex flex-col">
              <TypographyH2>{card.count}</TypographyH2>
              <TypographyMuted>{card.title}</TypographyMuted>
            </div>
          </div>
        ))}
      </div>

      {/* Alerts List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {["Unread", "Read"].map((status) => {
          const alerts = status === "Unread" ? unreadAlerts : readAlerts;
          if (!alerts.length) return null;

          return (
            <Card key={status}>
              <TypographyH3 className="flex items-center gap-2">
                <Icon
                  name={status === "Unread" ? "Bell" : "CheckCircle"}
                  sizze={22}
                  className={
                    status === "Unread" ? "text-red-600" : "text-green-600"
                  }
                />
                {status} Alerts
              </TypographyH3>
              <div className="space-y-3">
                {alerts.map((alert) => {
                  const { icon, color } = getType(alert.type);
                  return (
                    <Card
                      key={alert.id}
                      className={`p-4 ${
                        status === "Unread"
                          ? "bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500"
                          : "bg-gray-50 border border-gray-200 opacity-75"
                      } rounded-lg`}
                    >
                      <div className="flex md:items-start md:flex-row flex-col justify-between gap-4">
                        <div className="flex items-start gap-3 flex-1">
                          <div
                            className={`p-2 rounded-full h-11 w-11 flex justify-center items-center border bg-[#009896]`}
                          >
                            <Icon name={icon} color="white" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <TypographySmall>{alert.title}</TypographySmall>
                              {status === "Unread" && (
                                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-700 mb-2">
                              {alert.message}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(alert.date).toLocaleDateString("en-IN")}
                            </p>
                          </div>
                        </div>
                        {status === "Unread" && (
                          <Button variant="link">Mark as read</Button>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Categories & Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Categories */}
        <Card className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200">
          <TypographyH3>Alert Categories</TypographyH3>
          <div className="space-y-2">
            {Object.keys(ALERT_TYPES).map((type) => {
              if (type === "Default") return null;
              const count = mockAlerts.filter((a) => a.type === type).length;
              const { icon, color } = ALERT_TYPES[type];
              return (
                <div
                  key={type}
                  className="flex justify-between items-center p-2 bg-card rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1 rounded-full h-10 w-10 flex justify-center items-center bg-primary/20`}
                    >
                      <Icon size={18} name={icon} />
                    </div>
                    <TypographySmall>{type} Alerts</TypographySmall>
                  </div>
                  <span className="h-6 w-6 flex justify-center items-center bg-blue-600 text-white rounded-full text-xs font-semibold">
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Settings */}
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200">
          <TypographyH3>Alert Settings</TypographyH3>
          <div className="space-y-3">
            {[
              "EMI Reminders",
              "Task Notifications",
              "Weather Alerts",
              "Pest & Disease Alerts",
            ].map((setting) => (
              <div
                key={setting}
                className="flex justify-between items-center p-3 bg-card rounded-lg"
              >
                <TypographySmall>{setting}</TypographySmall>
                <Switch defaultChecked />
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
