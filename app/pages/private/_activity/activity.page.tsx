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
  X,
  FileText,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/atoms/tabs";
import { activityService } from "~/app/services/activity.service";
import { reportService } from "~/app/services/report.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

export function ActivityPage() {
  const [activeTab, setActiveTab] = useState<"activities" | "reports">(
    "activities"
  );
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [filterReportType, setFilterReportType] = useState("all");

  const [activities, setActivities] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalItem, setModalItem] = useState<any | null>(null);

  const user = getUserFromLocalStorage().user;

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "activities") {
        const res = await activityService.getAll({ createdById: user.id });
        setActivities(res.data ?? []);
      } else {
        const res = await reportService.getAll({ createdById: user.id });
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
            {status || "Unknown"}
          </Badge>
        );
    }
  };

  const getTypeBadge = (type: string) =>
    type === "incident" || type === "incidents" ? (
      <Badge
        variant="outline"
        className="border-primary text-primary rounded-full"
      >
        Incident
      </Badge>
    ) : type === "road_report" ? (
      <Badge
        variant="outline"
        className="border-pink-300 text-pink-600 rounded-full"
      >
        Road Report
      </Badge>
    ) : type === "travel" ? (
      <Badge
        variant="outline"
        className="border-pink-300 text-blue-600 rounded-full"
      >
        Travel
      </Badge>
    ) : (
      <Badge
        variant="outline"
        className="border-gray-300 text-gray-600 rounded-full"
      >
        {type || "Unknown"}
      </Badge>
    );

  const filteredActivities = activities.filter((item) => {
    if (
      filterStatus.toLowerCase() !== "all" &&
      item.status.toLowerCase() !== filterStatus.toLowerCase()
    )
      return false;
    if (
      filterType.toLowerCase() !== "all" &&
      item.type.toLowerCase() !== filterType.toLowerCase()
    )
      return false;
    return true;
  });

  const filteredReports = reports.filter((item) => {
    if (
      filterStatus.toLowerCase() !== "all" &&
      item.status.toLowerCase() !== filterStatus.toLowerCase()
    )
      return false;
    if (
      filterReportType.toLowerCase() !== "all" &&
      item.type.toLowerCase() !== filterReportType.toLowerCase()
    )
      return false;
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
              {item.location || `${item.latitude}, ${item.longitude}`}
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
            onClick={() => setModalItem(item)}
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );

  const renderNoData = (type: "activities" | "reports") => (
    <div className="text-center py-12 space-y-4">
      <div className="flex justify-center">
        <div className="p-4 bg-muted/50 rounded-full">
          <FileText className="w-8 h-8 text-muted-foreground" />
        </div>
      </div>
      <div className="space-y-2">
        <h3 className="font-medium text-foreground">No {type} found</h3>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          {type === "activities"
            ? "You haven't created any activities yet. Your activities will appear here once you submit them."
            : "You haven't created any reports yet. Your reports will appear here once you submit them."}
        </p>
      </div>
    </div>
  );

  return (
    <div className="h-full overflow-y-auto pb-20 p-4 space-y-4">
      {/* Page Header */}
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
          <div className="flex justify-between items-center gap-3 mb-4">
            <div></div>
            <div>
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="border-border rounded-2xl">
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="incidents">Incidents</SelectItem>
                  <SelectItem value="road_report">Road Reports</SelectItem>
                  <SelectItem value="travel">Travel</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            {loading ? (
              <p>Loading...</p>
            ) : filteredActivities.length > 0 ? (
              filteredActivities.map(renderCard)
            ) : (
              renderNoData("activities")
            )}
          </div>
        </TabsContent>

        {/* Reports Tab */}
        <TabsContent value="reports">
          <div className="flex justify-between items-center gap-3 mb-4">
            <div></div>
            <div>
              <Select
                value={filterReportType}
                onValueChange={setFilterReportType}
              >
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
          </div>

          <div className="space-y-3">
            {loading ? (
              <p>Loading...</p>
            ) : filteredReports.length > 0 ? (
              filteredReports.map(renderCard)
            ) : (
              renderNoData("reports")
            )}
          </div>
        </TabsContent>
      </Tabs>

      {/* Modal */}
      {modalItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
            <Button
              variant="ghost"
              className="absolute top-2 right-2 p-2"
              onClick={() => setModalItem(null)}
            >
              <X className="w-4 h-4" />
            </Button>

            <h3 className="text-lg font-bold mb-2">{modalItem.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">
              {modalItem.description}
            </p>

            <div className="flex gap-2 mb-3">
              {getStatusBadge(modalItem.status || "unknown")}
              {getTypeBadge(modalItem.type || "unknown")}
            </div>

            <div className="text-xs text-muted-foreground mb-3 space-y-1">
              <p>
                <MapPin className="inline w-3 h-3 mr-1 text-primary" />
                {modalItem.location ||
                  `${modalItem.latitude}, ${modalItem.longitude}`}
              </p>
              {modalItem.date && modalItem.time && (
                <p>
                  <Calendar className="inline w-3 h-3 mr-1 text-pink-400" />
                  {modalItem.date} {modalItem.time}
                </p>
              )}
            </div>

            {/* Images */}
            {modalItem.images && modalItem.images.length > 0 && (
              <div className="grid grid-cols-1 gap-2 mb-3">
                {modalItem.images.map((img: string, idx: number) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Image ${idx + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            {/* Created By */}
            {modalItem.createdBy && (
              <div className="text-xs text-muted-foreground mt-2">
                <p>
                  <span className="font-semibold">Created by:</span>{" "}
                  {modalItem.createdBy.userName}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
