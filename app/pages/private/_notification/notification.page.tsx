import { useEffect, useState, type JSX } from "react";
import { Card } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import {
  Bell,
  AlertTriangle,
  Newspaper,
  MapPin,
  Info,
  Sparkles,
  X,
} from "lucide-react";
import { notificationService } from "@/services/notification.service";

type NotificationType = {
  id: string;
  title: string;
  description: string;
  type: string;
  createdAt: string;
  isNew?: boolean;
};

export function NotificationPage() {
  const [notifications, setNotifications] = useState<NotificationType[]>([]);
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationType | null>(null);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getAll();
      const data = res.data;
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const getIconForType = (type: string) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
      case "news":
        return <Newspaper className="w-6 h-6 text-blue-500" />;
      case "app_update":
        return <Info className="w-6 h-6 text-pink-500" />;
      case "rescue":
        return <AlertTriangle className="w-6 h-6 text-primary" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  const getExtraContent = (type: string) => {
    if (type === "alert") {
      return (
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-primary" />
            <span className="truncate">Location info</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const renderNotificationCard = (item: NotificationType) => (
    <Card
      key={item.id}
      onClick={() => setSelectedNotification(item)}
      className="p-4 rounded-2xl calm-shadow border-border hover:border-primary/30 transition-all cursor-pointer"
    >
      <div className="flex gap-3">
        <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          {getIconForType(item.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <p className="text-sm text-foreground">{item.title}</p>
            {item.isNew && (
              <Badge className="bg-primary text-white hover:bg-primary flex-shrink-0 text-xs rounded-full border-0">
                New
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {item.description}
          </p>
          {getExtraContent(item.type)}
          <p className="text-xs text-muted-foreground">
            {new Date(item.createdAt).toLocaleString()}
          </p>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-foreground flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary" />
              Notifications
            </h2>
            <p className="text-sm text-muted-foreground">
              Stay informed and safe
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Bell className="w-6 h-6 text-primary" />
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-3">
          {notifications.length > 0 ? (
            notifications.map(renderNotificationCard)
          ) : (
            <div className="text-center py-12">
              <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-500 mb-2">
                No notifications
              </h3>
              <p className="text-sm text-muted-foreground">
                You're all caught up! Check back later for new updates.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Notification Modal */}
      {selectedNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-2xl p-6 w-96 relative">
            <button
              onClick={() => setSelectedNotification(null)}
              className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-full"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {selectedNotification.title}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {selectedNotification.description}
            </p>
            <p className="text-xs text-muted-foreground">
              Type: {selectedNotification.type}
            </p>
            <p className="text-xs text-muted-foreground">
              Date: {new Date(selectedNotification.createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
