"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  AlertTriangle,
  Info,
  CheckCircle,
  Clock,
  Eye,
  Archive,
} from "lucide-react";
import { useInventory } from "@/contexts/inventory-context";

export default function Notifications() {
  const { notifications, markNotificationRead } = useInventory();
  const [filter, setFilter] = useState("all");

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === "all") return true;
    if (filter === "unread") return !notification.read;
    return notification.priority === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;
  const highPriorityCount = notifications.filter(
    (n) => n.priority === "HighPriority" && !n.read
  ).length;

  const getNotificationIcon = (type) => {
    switch (type) {
      case "estoque_baixo":
        return <AlertTriangle className="h-5 w-5 text-red-400" />;
      case "vencimento":
        return <Clock className="h-5 w-5 text-yellow-400" />;
      case "status_pedido":
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case "sistema":
        return <Info className="h-5 w-5 text-blue-400" />;
      default:
        return <Bell className="h-5 w-5 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HighPriority":
        return "bg-red-900 text-red-300 border-red-700";
      case "media":
        return "bg-yellow-900 text-yellow-300 border-yellow-700";
      case "baixa":
        return "bg-blue-900 text-blue-300 border-blue-700";
      default:
        return "bg-gray-900 text-gray-300 border-gray-700";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Agora mesmo";
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    if (diffInHours < 48) return "Ontem";
    return date.toLocaleDateString("pt-BR");
  };

  return (
    <div className="space-y-6">
      {/* Cabeçalho */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-200">
            Notifications and Alerts
          </h2>
          <p className="text-gray-400">
            Stay updated with system alerts and important notifications
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge
            variant="outline"
            className="bg-red-950 text-red-300 border-red-800"
          >
            {highPriorityCount} High Priority
          </Badge>
          <Badge
            variant="outline"
            className="bg-blue-950 text-blue-300 border-blue-800"
          >
            {unreadCount} Unread
          </Badge>
        </div>
      </div>

      {/* Cards de Resumo */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              Total Notifications
            </CardTitle>
            <Bell className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-200">
              {notifications.length}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              Unread
            </CardTitle>
            <Eye className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-400">
              {unreadCount}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              High Priority
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-400">
              {highPriorityCount}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900 border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-200">
              Action Required
            </CardTitle>
            <CheckCircle className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">
              {notifications.filter((n) => n.actionRequired && !n.read).length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifications List */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="text-gray-200">All Notifications</CardTitle>
            <Tabs value={filter} onValueChange={(value) => setFilter(value)}>
              <TabsList className="bg-gray-800 border-gray-700">
                <TabsTrigger
                  value="all"
                  className="data-[state=active]:bg-blue-600"
                >
                  All
                </TabsTrigger>
                <TabsTrigger
                  value="unread"
                  className="data-[state=active]:bg-blue-600"
                >
                  Unread
                </TabsTrigger>
                <TabsTrigger
                  value="HighPriority"
                  className="data-[state=active]:bg-blue-600"
                >
                  High
                </TabsTrigger>
                <TabsTrigger
                  value="media"
                  className="data-[state=active]:bg-blue-600"
                >
                  Medium
                </TabsTrigger>
                <TabsTrigger
                  value="baixa"
                  className="data-[state=active]:bg-blue-600"
                >
                  Low
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredNotifications.length === 0 ? (
              <div className="text-center py-8">
                <Bell className="h-12 w-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400">No notifications found</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-all hover:bg-gray-800/50 ${
                    notification.read
                      ? "bg-gray-900/50 border-gray-800"
                      : "bg-gray-800 border-gray-700"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3">
                      {getNotificationIcon(notification.type)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-medium text-gray-200">
                            {notification.title}
                          </h4>
                          <Badge
                            variant="outline"
                            className={getPriorityColor(notification.priority)}
                          >
                            {notification.priority}
                          </Badge>
                          {notification.actionRequired && (
                            <Badge
                              variant="outline"
                              className="bg-orange-900 text-orange-300 border-orange-700"
                            >
                              Action Required
                            </Badge>
                          )}
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-400 mb-2">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(notification.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {!notification.read && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => markNotificationRead(notification.id)}
                          className="border-gray-700 hover:bg-gray-800"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-700 hover:bg-gray-800 bg-transparent"
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Ações Rápidas */}
      <Card className="bg-gray-900 border-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-200">Notification Settings</CardTitle>
          <CardDescription className="text-gray-400">
            Configure your notification preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <Button
              variant="outline"
              className="border-gray-700 hover:bg-gray-800 text-gray-200 bg-transparent"
              onClick={() =>
                notifications
                  .filter((n) => !n.read)
                  .forEach((n) => markNotificationRead(n.id))
              }
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark All as Read
            </Button>
            <Button
              variant="outline"
              className="border-gray-700 hover:bg-gray-800 text-gray-200 bg-transparent"
            >
              <Bell className="h-4 w-4 mr-2" />
              Set Up Alerts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
