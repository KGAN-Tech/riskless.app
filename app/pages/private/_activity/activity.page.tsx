import { useState } from "react";
import { Card } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import {
  MapPin,
  Calendar,
  AlertCircle,
  CheckCircle,
  Clock,
  Sparkles,
} from "lucide-react";

export function ActivityPage() {
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const activities = [
    {
      id: 1,
      type: "incident",
      title: "Car accident on Highway 101",
      location: "Highway 101, Mile 45",
      date: "2025-10-07",
      time: "14:30",
      status: "resolved",
      description: "Multi-vehicle collision reported",
    },
    {
      id: 2,
      type: "road_report",
      title: "Pothole on Main Street",
      location: "Main Street & 5th Ave",
      date: "2025-10-06",
      time: "09:15",
      status: "pending",
      description: "Large pothole causing traffic issues",
    },
    {
      id: 3,
      type: "incident",
      title: "Road debris hazard",
      location: "Route 66, Exit 23",
      date: "2025-10-05",
      time: "16:45",
      status: "in_progress",
      description: "Debris blocking right lane",
    },
    {
      id: 4,
      type: "road_report",
      title: "Slippery road surface",
      location: "Park Avenue",
      date: "2025-10-04",
      time: "11:20",
      status: "resolved",
      description: "Oil spill on road surface",
    },
    {
      id: 5,
      type: "incident",
      title: "Vehicle breakdown",
      location: "Interstate 5, Southbound",
      date: "2025-10-03",
      time: "08:00",
      status: "resolved",
      description: "Disabled vehicle in slow lane",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return (
          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 rounded-full border-0">
            <CheckCircle className="w-3 h-3 mr-1" />
            Resolved
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 rounded-full border-0">
            <Clock className="w-3 h-3 mr-1" />
            In Progress
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100 rounded-full border-0">
            <AlertCircle className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary" className="rounded-full">
            {status}
          </Badge>
        );
    }
  };

  const getTypeBadge = (type: string) => {
    return type === "incident" ? (
      <Badge
        variant="outline"
        className="border-primary text-primary rounded-full"
      >
        Incident
      </Badge>
    ) : (
      <Badge
        variant="outline"
        className="border-pink-300 text-pink-600 rounded-full"
      >
        Road Report
      </Badge>
    );
  };

  const filteredActivities = activities.filter((activity) => {
    if (filterStatus !== "all" && activity.status !== filterStatus)
      return false;
    if (filterType !== "all" && activity.type !== filterType) return false;
    return true;
  });

  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div>
          <h2 className="text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" />
            My Activity
          </h2>
          <p className="text-sm text-muted-foreground">
            Track your reports and submissions
          </p>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-2 gap-3">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="border-border rounded-2xl">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="border-border rounded-2xl">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="incident">Incidents</SelectItem>
              <SelectItem value="road_report">Road Reports</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Activity List */}
        <div className="space-y-3">
          {filteredActivities.map((activity) => (
            <Card
              key={activity.id}
              className="p-4 rounded-2xl calm-shadow border-border hover:border-primary/30 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-foreground mb-1">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.description}
                    </p>
                  </div>
                  {getTypeBadge(activity.type)}
                </div>

                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-primary" />
                    <span>{activity.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-pink-400" />
                    <span>
                      {activity.date} {activity.time}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-green-100">
                  {getStatusBadge(activity.status)}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-primary h-8 text-xs hover:bg-green-50 rounded-full"
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
