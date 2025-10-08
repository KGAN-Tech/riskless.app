import { useEffect, useState } from "react";
import { Calendar, FileText, Activity, User } from "lucide-react";
import { useNavigate } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";
import { Headerbackbutton } from "@/components/organisms/backbutton.header";
import { encounterService } from "@/services/encounter.service";
import { getUserFromLocalStorage } from "@/utils/auth.helper";
import { Card } from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";

type EncounterSummary = {
  id: string;
  transactionDate?: string;
  createdAt?: string;
  consultation?: { 
    status?: string;
    chiefComplaint?: string;
  };
  facility?: { name?: string };
  vital?: { measurement?: { bloodPressure?: { systolic?: number; diastolic?: number } } };
  interview?: { reviews?: { chiefComplaint?: string[] } };
  prescriptions?: Array<{
    prescribedBy?: {
      firstName?: string;
      lastName?: string;
    };
    dispensedBy?: {
      firstName?: string;
      lastName?: string;
    };
  }>;
};

export function EncounterHistoryPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [encounters, setEncounters] = useState<EncounterSummary[]>([]);

  useEffect(() => {
    AOS.init({ duration: 800, easing: "ease-in-out", once: true, offset: 80 });
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const ls = getUserFromLocalStorage();
        const personId = ls?.user?.person?.id;
        if (!personId) {
          setEncounters([]);
          return;
        }
        const res = await encounterService.getAll({
          patientId: personId,
          page: 1,
          limit: 50,
          sort: "transactionDate",
          order: "desc",
          // include summary fields for cards
          fields: [
            "id",
            "transactionDate",
            "createdAt",
            "facility.name",
            "consultation.status",
            "consultation.chiefComplaint",
            "interview.reviews.chiefComplaint",
            "vital.measurement.bloodPressure.systolic",
            "vital.measurement.bloodPressure.diastolic",
            "prescriptions.prescribedBy.firstName",
            "prescriptions.prescribedBy.lastName",
            "prescriptions.dispensedBy.firstName",
            "prescriptions.dispensedBy.lastName",
          ].join(","),
        });
        const data = (res as any)?.data ?? res ?? [];
        setEncounters(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("Failed to load encounters", e);
        setEncounters([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleOpen = (encounterId: string) => {
    navigate(`/encounter/${encounterId}/emr`);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-[#f6f8fa] items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          {/* Spinning loader */}
          <div className="relative">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-blue-400 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
          </div>
          
          {/* Loading text */}
          <div className="text-center">
            <div className="text-blue-600 font-semibold text-lg mb-1">Loading encounter history...</div>
            <div className="text-blue-400 text-sm">Please wait while we fetch your records</div>
          </div>
          
          {/* Animated dots */}
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f8fa]">
      <Headerbackbutton title="Encounter History" />
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 min-h-screen">
          {encounters.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12" data-aos="fade-up">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Calendar className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Encounter Records</h3>
              <p className="text-gray-500 text-center text-sm">Your encounter history will appear here once available.</p>
            </div>
          ) : (
            <div>
              <div className="mb-4" data-aos="fade-left" data-aos-delay="100">
                <h2 className="text-lg font-semibold text-blue-900 mb-2">
                  Your Encounters ({encounters.length})
                </h2>
                <p className="text-sm text-gray-600">Tap a card to view the full record</p>
              </div>

              <div className="space-y-3">
                {encounters.map((enc, index) => {
                  const dateStr = enc.transactionDate || enc.createdAt;
                  const bp = enc?.vital?.measurement?.bloodPressure;
                  return (
                    <Card
  key={enc.id}
  className="p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
  data-aos={index % 2 === 0 ? "fade-left" : "fade-right"}
  data-aos-delay={`${100 + index * 80}`}
  onClick={() => handleOpen(enc.id)}
>
  <div className="flex items-start justify-between mb-2">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
        <Activity className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <h3 className="font-semibold text-blue-900 text-sm">
          {dateStr
            ? new Date(dateStr).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "Unknown date"}
        </h3>
        <p className="text-xs text-gray-500">ID: {enc.id}</p>
      </div>
    </div>
    {enc.consultation?.status && (
      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        {enc.consultation?.status}
      </span>
    )}
  </div>

  <div className="flex flex-col gap-2 text-sm">
    <div className="flex items-center gap-2">
      <FileText className="w-4 h-4 text-gray-500" />
      <span className="text-gray-700">{enc.facility?.name || "Facility N/A"}</span>
    </div>
    {/* Prescribing Doctor */}
  <div className="flex items-center gap-2">
    <User className="w-4 h-4 text-gray-500" />
    <span className="text-gray-700"> Doctor:   
      {enc.prescriptions?.[0]?.prescribedBy?.lastName
        ? `${enc.prescriptions[0].prescribedBy.firstName} ${enc.prescriptions[0].prescribedBy.lastName}`
        : "Prescriber N/A"}
    </span>
  </div>
  <div className="flex items-center gap-2">
    <User className="w-4 h-4 text-gray-500" />
    <span className="text-gray-700"> Pharmacist:
      {enc.prescriptions?.[0]?.dispensedBy?.firstName
        ? `${enc.prescriptions[0].dispensedBy.firstName} ${enc.prescriptions[0].dispensedBy.lastName}`
        : "Pharmacist N/A"}
    </span>
  </div>
    <div className="flex items-start gap-2">
      <Activity className="w-4 h-4 text-gray-500 mt-1" />
      <div className="flex flex-wrap gap-1">
        {enc.interview?.reviews?.chiefComplaint && enc.interview.reviews.chiefComplaint.length > 0 ? (
          enc.interview.reviews.chiefComplaint.map((complaint: string, index: number) => (
            <span 
              key={index}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-200"
            >
              {complaint}
            </span>
          ))
        ) : (
          <span className="text-gray-500 text-sm">No complaint provided</span>
        )}
      </div>
    </div>
  </div>

  <div className="mt-3 pt-3 border-t border-gray-100">
    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm">
      View Record
    </Button>
  </div>
</Card>

                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


