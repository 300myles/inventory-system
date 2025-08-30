"use client";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Package,
  TrendingUp,
  Users,
  BookCheck,
  Settings,
  Bell,
  Download,
  HomeIcon,
  PackagePlus,
  HistoryIcon,
} from "lucide-react";
import Dashboard from "@/components/dashboard";
import InventoryManager from "@/components/inventory-manager";
import PurchaseOrders from "@/components/purchase-orders";
import Reports from "@/components/reports";
import SystemSettings from "@/components/system-settings";
import Notifications from "@/components/notifications";
import { ThemeProvider, useTheme } from "@/contexts/theme-context";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useInventory } from "@/contexts/inventory-context";
import { useEffect } from "react";

// ElaboratedCoffeeLogo Component
function ElaboratedCoffeeLogo({ size = "large" }) {
  const { theme } = useTheme();
  const logoSize = size === "large" ? "h-12 w-12" : "h-6 w-6";
  const textSize = size === "large" ? "text-2xl" : "text-lg";

  return (
    <div className="flex items-center space-x-3">
      <div className={`relative ${logoSize}`}>
        {/* Círculo externo com gradiente */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 shadow-lg">
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/20 to-transparent"></div>
        </div>

        {/* Círculo interno */}
        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-amber-800 to-amber-900 flex items-center justify-center">
          {/* Grão de café estilizado */}
          <div className="relative">
            <div className="w-6 h-8 bg-gradient-to-b from-amber-200 to-amber-300 rounded-full transform rotate-12 shadow-inner">
              {/* Linha central do grão */}
              <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-0.5 h-6 bg-amber-800 rounded-full"></div>
            </div>
            {/* Vapor estilizado */}
            <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
              <div className="w-0.5 h-2 bg-white/60 rounded-full animate-pulse"></div>
              <div className="absolute -left-1 -top-0.5 w-0.5 h-1.5 bg-white/40 rounded-full animate-pulse delay-300"></div>
              <div className="absolute -right-1 -top-0.5 w-0.5 h-1.5 bg-white/40 rounded-full animate-pulse delay-700"></div>
            </div>
          </div>
        </div>

        {/* Brilho superior */}
        <div className="absolute top-1 left-2 w-2 h-2 bg-white/30 rounded-full blur-sm"></div>

        {/* Status Online Indicator */}
        <div
          className={`absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 ${
            theme === "dark" ? "border-gray-900" : "border-white"
          }`}
        ></div>
      </div>

      {size === "large" && (
        <div>
          <h1
            className={`${textSize} font-bold tracking-wide ${
              theme === "dark" ? "text-gray-100" : "text-gray-900"
            }`}
          >
            TC
          </h1>
          <p
            className={`text-sm font-medium ${
              theme === "dark" ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Inventory Management System
          </p>
        </div>
      )}
    </div>
  );
}

<<<<<<< HEAD
function OliverCoffeeInventorySystemContent() {
  const { theme } = useTheme();
=======
export default function OliverCoffeeInventorySystemContent() {
  const { theme } = useTheme();
  const router = useRouter();
  const { admin } = useInventory();
>>>>>>> d9ed2a4 (update)

  const exportData = () => {
    // Funcionalidade de exportação de dados
    const data = {
      timestamp: new Date().toISOString(),
      system: "Inventory System TC",
      version: "2.0.0",
      theme: theme,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `oliver-coffee-backup-${
      new Date().toISOString().split("T")[0]
    }.json`;
    a.click();
  };

  useEffect(() => {
    if (!admin) router.replace("/login");
  }, [admin]);

  if (!admin) return;

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        theme === "dark"
          ? "bg-gray-950 text-gray-100"
          : "bg-gray-50 text-gray-900"
      }`}
    >
      <header
        className={`shadow-lg border-b transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gray-900 border-gray-800"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <ElaboratedCoffeeLogo size="large" />
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <Button
                variant="outline"
                size="sm"
                onClick={exportData}
                className={`transition-colors hover:cursor-pointer duration-300 ${
                  theme === "dark"
                    ? "border-gray-700 hover:bg-gray-800 text-gray-200"
                    : "border-gray-300 hover:bg-gray-100 text-gray-700"
                }`}
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </Button>
              <Badge
                variant="outline"
                className={`transition-colors duration-300 ${
                  theme === "dark"
                    ? "bg-green-950 text-green-400 border-green-800"
                    : "bg-green-50 text-green-700 border-green-200"
                }`}
              >
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                System Online
              </Badge>
              {/* TODO: Change the element below to admin profile */}
              <div className="text-right">
                <p
                  className={`text-sm font-medium ${
                    theme === "dark" ? "text-gray-200" : "text-gray-800"
                  }`}
                >
                  User Admin
                </p>
                <p
                  className={`text-xs ${
                    theme === "dark" ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  Last Login: 09:30
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList
            className={`grid w-full grid-cols-5 lg:w-full border transition-colors duration-300 ${
              theme === "dark"
                ? "bg-gray-900 border-gray-800"
                : "bg-white border-gray-200"
            }`}
          >
            <TabsTrigger
              value="dashboard"
              className={`flex items-center gap-2 hover:cursor-pointer transition-colors duration-300 ${
                theme === "dark"
                  ? "data-[state=active]:bg-blue-900 data-[state=active]:text-white hover:bg-gray-800"
                  : "data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:bg-gray-100"
              }`}
            >
              <HomeIcon className="h-4 w-4" />
              Home
            </TabsTrigger>
            <TabsTrigger
              value="inventory"
              className={`flex items-center gap-2  hover:cursor-pointer transition-colors duration-300 ${
                theme === "dark"
                  ? "data-[state=active]:bg-blue-900 data-[state=active]:text-white hover:bg-gray-800"
                  : "data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:bg-gray-100"
              }`}
            >
              <PackagePlus className="h-4 w-4" />
              Inventory
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className={`flex items-center gap-2 hover:cursor-pointer transition-colors duration-300 ${
                theme === "dark"
                  ? "data-[state=active]:bg-blue-900 data-[state=active]:text-white hover:bg-gray-800"
                  : "data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:bg-gray-100"
              }`}
            >
              <HistoryIcon className="h-4 w-4" />
              Inventory History
            </TabsTrigger>

            <TabsTrigger
              value="notifications"
              className={`flex items-center hover:cursor-pointer gap-2 transition-colors duration-300 ${
                theme === "dark"
                  ? "data-[state=active]:bg-blue-900 data-[state=active]:text-white hover:bg-gray-800"
                  : "data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:bg-gray-100"
              }`}
            >
              <Bell className="h-4 w-4" />
              Alerts
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className={`flex items-center hover:cursor-pointer gap-2 transition-colors duration-300 ${
                theme === "dark"
                  ? "data-[state=active]:bg-blue-900 data-[state=active]:text-white hover:bg-gray-800"
                  : "data-[state=active]:bg-blue-500 data-[state=active]:text-white hover:bg-gray-100"
              }`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <Dashboard />
          </TabsContent>

          <TabsContent value="inventory">
            <InventoryManager />
          </TabsContent>
          <TabsContent value="orders">
            <PurchaseOrders />
          </TabsContent>

          <TabsContent value="reports">
            <Reports />
          </TabsContent>

          <TabsContent value="notifications">
            <Notifications />
          </TabsContent>

          <TabsContent value="settings">
            <SystemSettings />
          </TabsContent>
        </Tabs>
      </main>

      <footer
        className={`border-t mt-12 md:transition-colors duration-300 ${
          theme === "dark"
            ? "bg-gray-900 border-gray-800"
            : "bg-white border-gray-200"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              {/* TODO: Update this logo to the company's own */}
              <ElaboratedCoffeeLogo size="small" />
              <span
                className={`text-sm ${
                  theme === "dark" ? "text-gray-400" : "text-gray-600"
                }`}
              >
                © 2025 TC. All Rights Reserved.
              </span>
            </div>
            <div
              className={`text-sm ${
                theme === "dark" ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Version 1.0
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
