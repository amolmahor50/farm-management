import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Icon } from "@/custom/Icon";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिंदी" },
  { code: "mr", name: "मराठी" },
];

export const Header = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);

  // 🧩 Load saved language from localStorage on mount
  useEffect(() => {
    const savedLang = localStorage.getItem("lang");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
  }, [i18n]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("lang", lng);
    setLanguageMenuOpen(false);
  };

  return (
    <header className="bg-background border-b sticky top-0 z-40 shadow-sm backdrop-blur-md">
      <div className="flex items-center justify-between px-3 md:px-6 py-3">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Mobile Menu Button */}
          <Button
            onClick={onMenuClick}
            variant="ghost"
            size="icon"
            className="lg:hidden"
          >
            <Icon name="Menu" className="text-foreground" />
          </Button>

          <div className="hidden lg:block">
            <h1 className="text-xl font-semibold text-foreground flex items-center gap-1">
              🌾 Farm Management
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("welcome")}, {user?.name || "Guest"}
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-1 md:gap-3">
          {/* 🌐 Language Selector */}
          <DropdownMenu
            open={languageMenuOpen}
            onOpenChange={setLanguageMenuOpen}
          >
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-2 text-sm font-medium hover:bg-accent"
              >
                <Icon name="Globe" className="w-4 h-4 text-foreground" />
                <span>
                  {languages.find((l) => l.code === i18n.language)?.name ||
                    "English"}
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-36">
              <DropdownMenuLabel>Select Language</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={`flex justify-between cursor-pointer transition-all ${
                    i18n.language === lang.code
                      ? "bg-green-50 text-green-600 font-semibold"
                      : ""
                  }`}
                >
                  {lang.name}
                  {i18n.language === lang.code && (
                    <Icon name="Check" className="w-4 h-4 text-green-600" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* 🔔 Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative hover:bg-accent"
          >
            <Icon name="Bell" className="text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
          </Button>

          {/* 👤 User Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 hover:bg-accent transition-all"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user?.avatar || ""} alt={user?.name} />
                  <AvatarFallback>
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden sm:block text-sm font-medium text-foreground">
                  {user?.name || "User"}
                </span>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel className="text-gray-700">
                Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />

              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Icon name="UserCircle" />
                Profile
              </DropdownMenuItem>

              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                <Icon name="Settings" />
                Settings
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                onClick={logout}
                className="flex items-center gap-2 text-red-600 cursor-pointer hover:bg-red-50"
              >
                <Icon name="LogOut" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
