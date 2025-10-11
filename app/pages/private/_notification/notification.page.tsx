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
} from "lucide-react";

export function NotificationPage() {
  const notifications = {
    alerts: [
      {
        id: 1,
        title: "Road Closure Alert",
        message: "Highway 101 northbound closed due to accident",
        location: "Highway 101, Mile 45",
        time: "15 mins ago",
        isNew: true,
      },
      {
        id: 2,
        title: "Weather Warning",
        message: "Heavy rain expected in your area. Drive carefully.",
        location: "San Francisco Bay Area",
        time: "1 hour ago",
        isNew: true,
      },
      {
        id: 3,
        title: "High Risk Zone Alert",
        message: "You're approaching a high-risk area. Slow down.",
        location: "Route 66, Exit 23",
        time: "3 hours ago",
        isNew: false,
      },
    ],
    news: [
      {
        id: 1,
        title: "New Safety Initiative Launched",
        message: "City launches new road safety program with improved signage",
        source: "City Safety Department",
        time: "2 hours ago",
        isNew: true,
      },
      {
        id: 2,
        title: "Road Safety Statistics 2025",
        message: "Annual report shows 15% decrease in road accidents",
        source: "Department of Transportation",
        time: "1 day ago",
        isNew: false,
      },
      {
        id: 3,
        title: "Community Safety Workshop",
        message: "Join our free road safety workshop this Saturday",
        source: "Emergency Services",
        time: "2 days ago",
        isNew: false,
      },
    ],
    updates: [
      {
        id: 1,
        title: "App Update Available",
        message:
          "Version 2.1 includes new map features and performance improvements",
        time: "1 day ago",
        isNew: true,
      },
      {
        id: 2,
        title: "Report Status Updated",
        message: "Your incident report from Oct 5 has been resolved",
        time: "2 days ago",
        isNew: false,
      },
      {
        id: 3,
        title: "New Feature: Voice Reports",
        message: "You can now submit reports using voice commands",
        time: "1 week ago",
        isNew: false,
      },
    ],
    rescue: [
      {
        id: 1,
        title: "Emergency Preparedness Tips",
        message: "10 essential items to keep in your car for emergencies",
        organization: "Red Cross",
        time: "3 hours ago",
        isNew: true,
      },
      {
        id: 2,
        title: "First Aid Training",
        message: "Free first aid training sessions available this month",
        organization: "Medical Emergency Services",
        time: "1 day ago",
        isNew: false,
      },
      {
        id: 3,
        title: "Winter Driving Safety",
        message: "Essential tips for safe driving in winter conditions",
        organization: "Highway Patrol",
        time: "5 days ago",
        isNew: false,
      },
    ],
  };

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
            {notifications.alerts.map((alert) => (
              <Card
                key={alert.id}
                className="p-4 rounded-2xl calm-shadow border-border hover:border-primary/30 transition-all"
              >
                <div className="flex gap-3">
                  <div className="w-11 h-11 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm text-foreground">{alert.title}</p>
                      {alert.isNew && (
                        <Badge className="bg-primary text-white hover:bg-primary flex-shrink-0 text-xs rounded-full border-0">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-primary" />
                        <span className="truncate">{alert.location}</span>
                      </div>
                      <span>·</span>
                      <span>{alert.time}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="news" className="space-y-3 mt-4">
            {notifications.news.map((news) => (
              <Card
                key={news.id}
                className="p-4 rounded-2xl calm-shadow border-border hover:border-primary/30 transition-all"
              >
                <div className="flex gap-3">
                  <div className="w-11 h-11 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Newspaper className="w-6 h-6 text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm text-foreground">{news.title}</p>
                      {news.isNew && (
                        <Badge className="bg-primary text-white hover:bg-primary flex-shrink-0 text-xs rounded-full border-0">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {news.message}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="truncate">{news.source}</span>
                      <span>·</span>
                      <span>{news.time}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="updates" className="space-y-3 mt-4">
            {notifications.updates.map((update) => (
              <Card
                key={update.id}
                className="p-4 rounded-2xl calm-shadow border-border hover:border-primary/30 transition-all"
              >
                <div className="flex gap-3">
                  <div className="w-11 h-11 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                    <Info className="w-6 h-6 text-pink-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm text-foreground">{update.title}</p>
                      {update.isNew && (
                        <Badge className="bg-primary text-white hover:bg-primary flex-shrink-0 text-xs rounded-full border-0">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {update.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {update.time}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="rescue" className="space-y-3 mt-4">
            {notifications.rescue.map((rescue) => (
              <Card
                key={rescue.id}
                className="p-4 rounded-2xl calm-shadow border-border hover:border-primary/30 transition-all"
              >
                <div className="flex gap-3">
                  <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <AlertTriangle className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <p className="text-sm text-foreground">{rescue.title}</p>
                      {rescue.isNew && (
                        <Badge className="bg-primary text-white hover:bg-primary flex-shrink-0 text-xs rounded-full border-0">
                          New
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">
                      {rescue.message}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="truncate">{rescue.organization}</span>
                      <span>·</span>
                      <span>{rescue.time}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
