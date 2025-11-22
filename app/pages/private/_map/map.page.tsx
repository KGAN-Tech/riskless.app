import { useEffect, useState } from "react";
import type { LatLngTuple } from "leaflet";
import { Compass } from "lucide-react";
import { DestinationSearch } from "~/app/components/templates/cards/destination.search";
import {
  RiskMap,
  type Facility,
} from "~/app/components/templates/cards/risk.map";
import { useRoad } from "~/app/hooks/use.road";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { Textarea } from "@/components/atoms/textarea";
import { Label } from "@/components/atoms/label";
import { Input } from "@/components/atoms/input";
import { reportService } from "~/app/services/report.service";
import { activityService } from "~/app/services/activity.service";
import { facilityService } from "~/app/services/facility.service";
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";

export function MapPage() {
  const { items: roads = [] } = useRoad();
  const [destination, setDestination] = useState<string>("");
  const [destinationCoords, setDestinationCoords] =
    useState<LatLngTuple | null>(null);
  const [currentLocation, setCurrentLocation] = useState<LatLngTuple | null>(
    null
  );

  const [showIncidentModal, setShowIncidentModal] = useState(false);
  const [showRoadReportModal, setShowRoadReportModal] = useState(false);
  const [clickedCoords, setClickedCoords] = useState<[number, number] | null>(
    null
  );

  const [incidentDescription, setIncidentDescription] = useState("");
  const [incidentFiles, setIncidentFiles] = useState<File[]>([]);
  const [roadReason, setRoadReason] = useState("");
  const [roadFiles, setRoadFiles] = useState<File[]>([]);

  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [loading, setLoading] = useState(false);

  const handleMapAction = (action: string, coords: [number, number]) => {
    setClickedCoords(coords);
    if (action === "startTravel") setDestinationCoords(coords);
    if (action === "reportIncident") setShowIncidentModal(true);
    if (action === "reportHighRisk") setShowRoadReportModal(true);
  };

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setCurrentLocation([pos.coords.latitude, pos.coords.longitude]),
      (err) => console.warn("Location denied:", err),
      { enableHighAccuracy: true }
    );
  }, []);

  const fetchFacilities = async () => {
    setLoading(true);
    try {
      const res = await facilityService.getAll();
      const list = res?.data ?? [];
      setFacilities(Array.isArray(list) ? list : []);
    } catch (err) {
      console.error("Error fetching facilities:", err);
      setFacilities([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFacilities();
  }, []);

  const handleIncidentFilesChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files) setIncidentFiles(Array.from(e.target.files));
  };
  const handleRoadFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setRoadFiles(Array.from(e.target.files));
  };

  // --- Incident submission with activity ---
  const submitIncident = async () => {
    if (!incidentDescription.trim())
      return alert("Please describe the incident.");

    const formData = new FormData();
    formData.append("title", "Incident Report");
    formData.append("description", incidentDescription);
    if (clickedCoords) {
      formData.append("latitude", String(clickedCoords[0]));
      formData.append("longitude", String(clickedCoords[1]));
    }
    incidentFiles.forEach((file) => formData.append("files", file));
    formData.append("createdById", getUserFromLocalStorage()?.user?.id || "");

    try {
      const reportResponse = await reportService.create(formData);
      const reportId = reportResponse.data?.id;

      if (reportId) {
        await activityService.create({
          title: "New Incident Reported",
          description: incidentDescription,
          reportId,
          type: "incidents",
          latitude: clickedCoords?.[0],
          longitude: clickedCoords?.[1],
          createdById: getUserFromLocalStorage()?.user?.id,
        });
      }

      alert("Incident submitted and activity created!");
      setIncidentDescription("");
      setIncidentFiles([]);
      setShowIncidentModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to submit incident.");
    }
  };

  // --- Road report submission with activity ---
  const submitRoadReport = async () => {
    if (!roadReason.trim()) return alert("Please provide a reason.");

    const formData = new FormData();
    formData.append("title", "High-Risk Road Report");
    formData.append("description", roadReason);
    if (clickedCoords) {
      formData.append("latitude", String(clickedCoords[0]));
      formData.append("longitude", String(clickedCoords[1]));
    }
    roadFiles.forEach((file) => formData.append("files", file));
    formData.append("createdById", getUserFromLocalStorage()?.user?.id || "");

    try {
      const reportResponse = await reportService.create(formData);
      const reportId = reportResponse.data?.id;

      if (reportId) {
        await activityService.create({
          title: "New High-Risk Road Reported",
          description: roadReason,
          reportId,
          type: "road_reports",
          latitude: clickedCoords?.[0],
          longitude: clickedCoords?.[1],
          createdById: getUserFromLocalStorage()?.user?.id,
        });
      }

      alert("Road report submitted and activity created!");
      setRoadReason("");
      setRoadFiles([]);
      setShowRoadReportModal(false);
    } catch (err) {
      console.error(err);
      alert("Failed to submit road report.");
    }
  };

  return (
    <div className="h-full overflow-y-auto pb-20">
      <div className="p-4 space-y-4">
        <h2 className="text-foreground flex items-center gap-2">
          <Compass className="w-5 h-5 text-primary" /> Navigate Safely
        </h2>

        <DestinationSearch
          destination={destination}
          setDestination={setDestination}
        />

        <RiskMap
          currentLocation={currentLocation as LatLngTuple}
          destination={destinationCoords as LatLngTuple}
          highRiskRoads={roads}
          onChooseAction={handleMapAction}
          facilities={facilities}
        />

        {/* Incident Modal */}
        <Dialog open={showIncidentModal} onOpenChange={setShowIncidentModal}>
          <DialogContent className="max-w-[90%] rounded-3xl">
            <DialogHeader>
              <DialogTitle>Report Incident</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Label>Describe the incident</Label>
              <Textarea
                value={incidentDescription}
                onChange={(e) => setIncidentDescription(e.target.value)}
              />
              <Label>Attach Pictures</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleIncidentFilesChange}
              />
              {incidentFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {incidentFiles.map((file, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
              <Button className="bg-primary w-full" onClick={submitIncident}>
                Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Road Report Modal */}
        <Dialog
          open={showRoadReportModal}
          onOpenChange={setShowRoadReportModal}
        >
          <DialogContent className="max-w-[90%] rounded-3xl">
            <DialogHeader>
              <DialogTitle>Report High-Risk Road</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <Label>Location</Label>
              <Input
                value={clickedCoords ? clickedCoords.join(", ") : ""}
                readOnly
              />
              <Label>Reason</Label>
              <Textarea
                value={roadReason}
                onChange={(e) => setRoadReason(e.target.value)}
              />
              <Label>Attach Pictures</Label>
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleRoadFilesChange}
              />
              {roadFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {roadFiles.map((file, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      className="w-20 h-20 object-cover rounded-md"
                    />
                  ))}
                </div>
              )}
              <Button className="bg-primary w-full" onClick={submitRoadReport}>
                Submit
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
