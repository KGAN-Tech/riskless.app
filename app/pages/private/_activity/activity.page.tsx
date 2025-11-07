import { useEffect, useState } from "react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/tabs";
import { activityService } from "~/app/services/activity.service";
import { reportService } from "~/app/services/report.service";

export function ActivityPage() {
  const [activeTab, setActiveTab] = useState<"activities" | "reports">(
    "activities"
  );
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const [activities, setActivities] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "activities") {
        const res = await activityService.getAll();
        setActivities(res.data ?? []);
      } else {
        const res = await reportService.getAll();
        setReports(res.data ?? []);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return (
          <Badge className="bg-green-100 text-green-700 rounded-full border-0 flex items-center gap-1">
            <CheckCircle className="w-3 h-3" /> Resolved
          </Badge>
        );
      case "in_progress":
        return (
          <Badge className="bg-blue-100 text-blue-700 rounded-full border-0 flex items-center gap-1">
            <Clock className="w-3 h-3" /> In Progress
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-700 rounded-full border-0 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" /> Pending
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
    if (type === "incident") {
      return (
        <Badge
          variant="outline"
          className="border-primary text-primary rounded-full"
        >
          Incident
        </Badge>
      );
    }
    return (
      <Badge
        variant="outline"
        className="border-pink-300 text-pink-600 rounded-full"
      >
        Road Report
      </Badge>
    );
  };

  const filteredActivities = activities.filter((item) => {
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    if (filterType !== "all" && item.type !== filterType) return false;
    return true;
  });

  const filteredReports = reports.filter((item) => {
    if (filterStatus !== "all" && item.status !== filterStatus) return false;
    if (filterType !== "all" && item.type !== filterType) return false;
    return true;
  });

  const renderCard = (item: any) => (
    <Card
      key={item.id}
      className="p-4 rounded-2xl calm-shadow border-border hover:border-primary/30 transition-all"
    >
      <div className="space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <p className="text-foreground mb-1">{item.title}</p>
            <p className="text-xs text-muted-foreground">{item.description}</p>
          </div>
          {getTypeBadge(item.type)}
        </div>

        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-primary" />
            <span>
              {item.location || item.latitude + ", " + item.longitude}
            </span>
          </div>
          {item.date && item.time && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3 text-pink-400" />
              <span>
                {item.date} {item.time}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-green-100">
          {getStatusBadge(item.status)}
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
  );

  return (
    <div className="h-full overflow-y-auto pb-20 p-4 space-y-4">
      <div>
        <h2 className="text-foreground flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" /> My Activity
        </h2>
        <p className="text-sm text-muted-foreground">
          Track your reports and submissions
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "activities" | "reports")}
      >
        <TabsList>
          <TabsTrigger value="activities">Activities</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        {/* Activities Tab */}
        <TabsContent value="activities">
          <div className="grid grid-cols-2 gap-3 mb-4">
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

          <div className="space-y-3">
            {loading ? <p>Loading...</p> : filteredActivities.map(renderCard)}
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <div className="grid grid-cols-2 gap-3 mb-4">
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

          <div className="space-y-3">
            {loading ? <p>Loading...</p> : filteredReports.map(renderCard)}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
