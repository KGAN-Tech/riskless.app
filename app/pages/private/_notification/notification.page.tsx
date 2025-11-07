import { useEffect, useState, type JSX } from "react";
import { Card } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/tabs";
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
  const [notifications, setNotifications] = useState<{
    alerts: NotificationType[];
    news: NotificationType[];
    updates: NotificationType[];
    rescue: NotificationType[];
  }>({ alerts: [], news: [], updates: [], rescue: [] });

  const [selectedNotification, setSelectedNotification] =
    useState<NotificationType | null>(null);

  const fetchNotifications = async () => {
    try {
      const res = await notificationService.getAll();
      const data = res.data;

      const alerts = data.filter((n: any) => n.type === "alert");
      const news = data.filter((n: any) => n.type === "news");
      const updates = data.filter((n: any) => n.type === "app_update");
      const rescue = data.filter((n: any) => n.type === "rescue");

      setNotifications({
        alerts,
        news,
        updates,
        rescue,
      });
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const renderNotificationCard = (
    item: NotificationType,
    icon: JSX.Element,
    extra?: JSX.Element
  ) => (
    <Card
      key={item.id}
      onClick={() => setSelectedNotification(item)}
      className="p-4 rounded-2xl calm-shadow border-border hover:border-primary/30 transition-all cursor-pointer"
    >
      <div className="flex gap-3">
        <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
          {icon}
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
          {extra}
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

        {/* Tabs */}
        <Tabs defaultValue="alerts" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-green-50 rounded-2xl p-1">
            <TabsTrigger
              value="alerts"
              className="data-[state=active]:bg-white data-[state=active]:text-primary text-xs rounded-xl"
            >
              Alerts
            </TabsTrigger>
            <TabsTrigger
              value="news"
              className="data-[state=active]:bg-white data-[state=active]:text-primary text-xs rounded-xl"
            >
              News
            </TabsTrigger>
            <TabsTrigger
              value="updates"
              className="data-[state=active]:bg-white data-[state=active]:text-primary text-xs rounded-xl"
            >
              Updates
            </TabsTrigger>
            <TabsTrigger
              value="rescue"
              className="data-[state=active]:bg-white data-[state=active]:text-primary text-xs rounded-xl"
            >
              Rescue
            </TabsTrigger>
          </TabsList>

          <TabsContent value="alerts" className="space-y-3 mt-4">
            {notifications.alerts.map((item) =>
              renderNotificationCard(
                item,
                <AlertTriangle className="w-6 h-6 text-red-500" />,
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-primary" />
                    <span className="truncate">Location info</span>
                  </div>
                </div>
              )
            )}
          </TabsContent>

          <TabsContent value="news" className="space-y-3 mt-4">
            {notifications.news.map((item) =>
              renderNotificationCard(
                item,
                <Newspaper className="w-6 h-6 text-blue-500" />
              )
            )}
          </TabsContent>

          <TabsContent value="updates" className="space-y-3 mt-4">
            {notifications.updates.map((item) =>
              renderNotificationCard(
                item,
                <Info className="w-6 h-6 text-pink-500" />
              )
            )}
          </TabsContent>

          <TabsContent value="rescue" className="space-y-3 mt-4">
            {notifications.rescue.map((item) =>
              renderNotificationCard(
                item,
                <AlertTriangle className="w-6 h-6 text-primary" />
              )
            )}
          </TabsContent>
        </Tabs>
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
