import { useNavigate, useLocation } from "react-router-dom";
import { Icon } from "@/custom/Icon";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { TypographyH5 } from "../../custom/Typography";

export const Sidebar = ({ isOpen, onClose }) => {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: "LayoutDashboard",
      path: "/dashboard",
    },
    {
      id: "expenses",
      label: "Expenses",
      icon: "TrendingDown",
      path: "/expenses",
    },
    { id: "yields", label: "Yields", icon: "TrendingUp", path: "/yields" },
    { id: "loans", label: "Loans", icon: "Wallet", path: "/loans" },
    { id: "tasks", label: "Tasks", icon: "CheckSquare", path: "/tasks" },
    { id: "alerts", label: "Alerts", icon: "Bell", path: "/alerts" },
    {
      id: "market",
      label: "Market Prices",
      icon: "ShoppingCart",
      path: "/market",
    },
    { id: "reports", label: "Reports", icon: "FileText", path: "/reports" },
    {
      id: "community",
      label: "Community Forum",
      icon: "Users",
      path: "/community",
    },
    {
      id: "knowledge",
      label: "Knowledge Hub",
      icon: "BookOpen",
      path: "/knowledge",
    },
    {
      id: "consultation",
      label: "Expert Consultation",
      icon: "Stethoscope",
      path: "/consultation",
    },
    { id: "insurance", label: "Insurance", icon: "Shield", path: "/insurance" },
    {
      id: "rotation",
      label: "Crop Rotation",
      icon: "RefreshCw",
      path: "/rotation",
    },
    { id: "weather", label: "Weather", icon: "CloudSun", path: "/weather" },
    {
      id: "ai-insights",
      label: "AI Insights",
      icon: "Brain",
      path: "/ai-insights",
    },
  ];

  const handleMenuClick = (path) => {
    navigate(path);
    if (onClose) onClose();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 shadow-xl 
          z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static 
          flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Header */}
        <div className="p-5 border-b border-gray-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="bg-primary w-10 h-10 rounded-full flex justify-center items-center shadow-sm">
              <Icon name="Leaf" color="white" />
            </div>
            <div>
              <TypographyH5>FarmTrack</TypographyH5>
              <p className="text-xs text-gray-500 truncate">
                {user?.farmName || "My Smart Farm"}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="lg:hidden"
          >
            <Icon name="X" className="w-5 h-5 text-gray-600" />
          </Button>
        </div>

        {/* Scrollable Menu Area */}
        <div className="flex-1 min-h-0">
          {" "}
          {/* 👈 ensures ScrollArea works inside flex */}
          <ScrollArea className="h-full px-3 py-4">
            <TooltipProvider>
              <ul className="space-y-1">
                {menuItems.map(({ id, label, icon, path }) => {
                  const isActive = location.pathname === path;
                  return (
                    <li key={id}>
                      <Tooltip delayDuration={300}>
                        <TooltipTrigger asChild>
                          <Button
                            variant={isActive ? "secondary" : "ghost"}
                            onClick={() => handleMenuClick(path)}
                            className={`w-full justify-start gap-3 px-4 py-2.5 text-sm rounded-lg font-medium transition-all
                              ${
                                isActive
                                  ? "bg-green-100 text-primary hover:bg-green-200"
                                  : "text-gray-700 hover:bg-gray-100 hover:text-primary"
                              }`}
                          >
                            <Icon name={icon} className="w-5 h-5" />
                            <span className="truncate">{label}</span>
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent
                          side="right"
                          className="hidden lg:block"
                        >
                          {label}
                        </TooltipContent>
                      </Tooltip>
                    </li>
                  );
                })}
              </ul>
            </TooltipProvider>
          </ScrollArea>
        </div>

        <Separator />

        {/* Bottom Section (User Info + Logout) */}
        <div className="p-4 border-t border-gray-100 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="w-9 h-9 border border-gray-200">
                <AvatarImage src={user?.avatar || ""} alt={user?.name} />
                <AvatarFallback>
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-gray-800 leading-tight">
                  {user?.name || "User"}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email || "user@email.com"}
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Icon name="LogOut" />
            </Button>
          </div>
        </div>
      </aside>
    </>
  );
};
