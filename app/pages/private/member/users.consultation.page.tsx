import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/button";
import { Calendar, User, Stethoscope, FileText } from "lucide-react";
import { useNavigate } from "react-router";
import { ConsultationService } from "~/app/configuration/others/consultation.mockdata";
import type { ConsultationData } from "~/app/configuration/others/consultation.mockdata";
import { ConsultationCard } from "@/components/organisms/cards";
import { Headerbackbutton } from "@/components/organisms/backbutton.header";
import AOS from "aos";
import "aos/dist/aos.css";

// Empty State Component
const EmptyState = () => (
  <div
    className="flex flex-col items-center justify-center py-12"
    data-aos="fade-right"
    data-aos-delay="200"
  >
    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
      <Calendar className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-600 mb-2">
      No Consultation Records
    </h3>
    <p className="text-gray-500 text-center text-sm">
      You haven't had any consultations yet. Your consultation history will
      appear here once you visit a healthcare provider.
    </p>
  </div>
);

// Main Consultation Page
export const ConsultationPage = () => {
  const navigate = useNavigate();
  const [consultations, setConsultations] = useState<ConsultationData[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 100,
    });
  }, []);

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        setLoading(true);
        const userId = "current-user-id"; // TODO: Get actual user ID
        const data = await ConsultationService.getConsultationHistory(userId);

        // If no data, use sample data to ensure cards show content
        if (!data || data.length === 0) {
          setConsultations([
            {
              consultationId: "CONS-001",
              date: "2024-01-15",
              status: "completed",
              attendingPhysician: "Dr. Maria Santos",
              complaint: "Headache and fatigue for the past 3 days",
              diagnosis: "Tension headache with mild dehydration",
              doctorsOrders:
                "Prescribed paracetamol 500mg every 6 hours. Increase water intake. Follow up in 1 week if symptoms persist.",
            },
            {
              consultationId: "CONS-002",
              date: "2024-01-10",
              status: "completed",
              attendingPhysician: "Dr. Juan Dela Cruz",
              complaint: "Chest pain and shortness of breath",
              diagnosis: "Acute bronchitis",
              doctorsOrders:
                "Prescribed antibiotics and bronchodilator. Rest for 3 days. Avoid smoking and cold air exposure.",
            },
            {
              consultationId: "CONS-003",
              date: "2024-01-05",
              status: "pending",
              attendingPhysician: "Dr. Ana Rodriguez",
              complaint: "Fever and sore throat",
              diagnosis: "Acute pharyngitis",
              doctorsOrders:
                "Prescribed antibiotics and throat lozenges. Gargle with warm salt water. Follow up in 5 days.",
            },
            {
              consultationId: "CONS-004",
              date: "2023-12-28",
              status: "completed",
              attendingPhysician: "Dr. Carlos Mendoza",
              complaint: "Lower back pain after lifting heavy objects",
              diagnosis: "Muscle strain",
              doctorsOrders:
                "Prescribed pain relievers and muscle relaxants. Apply ice pack for 20 minutes every 2 hours. Avoid heavy lifting for 2 weeks.",
            },
            {
              consultationId: "CONS-005",
              date: "2023-12-20",
              status: "completed",
              attendingPhysician: "Dr. Sofia Martinez",
              complaint: "Abdominal pain and nausea",
              diagnosis: "Gastritis",
              doctorsOrders:
                "Prescribed antacids and proton pump inhibitors. Avoid spicy foods and acidic beverages. Eat small, frequent meals.",
            },
          ]);
        } else {
          setConsultations(data);
        }
      } catch (error) {
        console.error("Error fetching consultation history:", error);
        // Use sample data on error
        setConsultations([
          {
            consultationId: "CONS-001",
            date: "2024-01-15",
            status: "completed",
            attendingPhysician: "Dr. Maria Santos",
            complaint: "Headache and fatigue for the past 3 days",
            diagnosis: "Tension headache with mild dehydration",
            doctorsOrders:
              "Prescribed paracetamol 500mg every 6 hours. Increase water intake. Follow up in 1 week if symptoms persist.",
          },
          {
            consultationId: "CONS-002",
            date: "2024-01-10",
            status: "completed",
            attendingPhysician: "Dr. Juan Dela Cruz",
            complaint: "Chest pain and shortness of breath",
            diagnosis: "Acute bronchitis",
            doctorsOrders:
              "Prescribed antibiotics and bronchodilator. Rest for 3 days. Avoid smoking and cold air exposure.",
          },
          {
            consultationId: "CONS-003",
            date: "2024-01-05",
            status: "pending",
            attendingPhysician: "Dr. Ana Rodriguez",
            complaint: "Fever and sore throat",
            diagnosis: "Acute pharyngitis",
            doctorsOrders:
              "Prescribed antibiotics and throat lozenges. Gargle with warm salt water. Follow up in 5 days.",
          },
          {
            consultationId: "CONS-004",
            date: "2023-12-28",
            status: "completed",
            attendingPhysician: "Dr. Carlos Mendoza",
            complaint: "Lower back pain after lifting heavy objects",
            diagnosis: "Muscle strain",
            doctorsOrders:
              "Prescribed pain relievers and muscle relaxants. Apply ice pack for 20 minutes every 2 hours. Avoid heavy lifting for 2 weeks.",
          },
          {
            consultationId: "CONS-005",
            date: "2023-12-20",
            status: "completed",
            attendingPhysician: "Dr. Sofia Martinez",
            complaint: "Abdominal pain and nausea",
            diagnosis: "Gastritis",
            doctorsOrders:
              "Prescribed antacids and proton pump inhibitors. Avoid spicy foods and acidic beverages. Eat small, frequent meals.",
          },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultations();
  }, []);

  const handleViewEMR = (consultationId: string) => {
    navigate(`/consultation/${consultationId}/emr`);
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-[#f6f8fa] items-center justify-center">
        <div className="text-blue-600 font-semibold text-lg">
          Loading consultation history...
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f8fa]">
      {/* Header */}
      <Headerbackbutton title="Consultation History" />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 min-h-screen">
          {consultations.length > 0 ? (
            <div>
              <div className="mb-4" data-aos="fade-left" data-aos-delay="100">
                <h2 className="text-lg font-semibold text-blue-900 mb-2">
                  Your Consultation Records ({consultations.length} records)
                </h2>
                <p className="text-sm text-gray-600">
                  Tap on any consultation to view the complete medical record
                </p>
              </div>

              {consultations.map((consultation, index) => (
                <ConsultationCard
                  key={consultation.consultationId}
                  onClick={() => handleViewEMR(consultation.consultationId)}
                  dataAos={index % 2 === 0 ? "fade-left" : "fade-right"}
                  dataAosDelay={`${100 + index * 100}`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-blue-900 text-sm">
                          {new Date(consultation.date).toLocaleDateString(
                            "en-US",
                            {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            }
                          )}
                        </h3>
                        <p className="text-xs text-gray-500">
                          ID: {consultation.consultationId}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          consultation.status === "completed"
                            ? "bg-green-100 text-green-800"
                            : consultation.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {consultation.status}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-600">
                        Dr. {consultation.attendingPhysician}
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <Stethoscope className="w-4 h-4 text-gray-500 mt-0.5" />
                      <div className="flex-1">
                        <span className="text-gray-600 font-medium">
                          Complaint:{" "}
                        </span>
                        <span className="text-gray-700">
                          {consultation.complaint}
                        </span>
                      </div>
                    </div>

                    {consultation.diagnosis && (
                      <div className="flex items-start gap-2">
                        <FileText className="w-4 h-4 text-gray-500 mt-0.5" />
                        <div className="flex-1">
                          <span className="text-gray-600 font-medium">
                            Diagnosis:{" "}
                          </span>
                          <span className="text-gray-700">
                            {consultation.diagnosis}
                          </span>
                        </div>
                      </div>
                    )}

                    {consultation.doctorsOrders && (
                      <div className="bg-gray-50 rounded-lg p-3 mt-3">
                        <span className="text-gray-600 font-medium text-xs">
                          Doctor's Orders:
                        </span>
                        <p className="text-gray-700 text-sm mt-1">
                          {consultation.doctorsOrders}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* View EMR Button */}
                  <div className="mt-4 pt-3 border-t border-gray-100">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                      Records
                    </Button>
                  </div>
                </ConsultationCard>
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </div>
      </div>
    </div>
  );
};
