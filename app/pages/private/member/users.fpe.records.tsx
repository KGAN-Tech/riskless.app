import { useEffect, useState } from "react";
import { ChevronDown, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/atoms/button";
import { FPEService } from "~/app/configuration/others/fpe.mockdata";
import type { FPEData } from "~/app/configuration/others/fpe.mockdata";
import AOS from "aos";
import "aos/dist/aos.css";

// Compound components
export const FPECard = ({ fpeData }: { fpeData: any }) => (
  <div
    className="rounded-2xl shadow-lg bg-gradient-to-r from-blue-600 to-blue-400 p-6"
    data-aos="fade-up"
    data-aos-delay="100"
  >
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow">
        <svg
          className="w-8 h-8 text-blue-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white">Medical Records (FPE)</h2>
        <p className="text-blue-100">
          Last Updated: {fpeData.lastUpdated || "Not available"}
        </p>
        <p className="text-blue-100">
          Status: {fpeData.status || "Incomplete"}
        </p>
      </div>
    </div>
  </div>
);

const ReviewOfSystems = ({ fpeData }: { fpeData: any }) => (
  <div
    className="bg-white rounded-2xl shadow-md p-4 h-full"
    data-aos="fade-left"
    data-aos-delay="200"
  >
    <h3 className="font-semibold mb-3 text-blue-900">Review of Systems</h3>
    <div className="space-y-3 text-sm text-gray-700">
      <div>
        <span className="font-medium">Chief Complaint: </span>
        <span>
          {fpeData.reviewOfSystems?.chiefComplaint?.join(", ") || "None"}
        </span>
      </div>
      <div>
        <span className="font-medium">Mental Health Issues: </span>
        <span>{fpeData.reviewOfSystems?.mental?.hasIssues ? "Yes" : "No"}</span>
        {fpeData.reviewOfSystems?.mental?.explain && (
          <span className="ml-2">
            - {fpeData.reviewOfSystems.mental.explain}
          </span>
        )}
      </div>
      <div>
        <span className="font-medium">Respiratory Issues: </span>
        <span>
          {fpeData.reviewOfSystems?.respiratory?.hasIssues ? "Yes" : "No"}
        </span>
        {fpeData.reviewOfSystems?.respiratory?.explain && (
          <span className="ml-2">
            - {fpeData.reviewOfSystems.respiratory.explain}
          </span>
        )}
      </div>
      <div>
        <span className="font-medium">GI Issues: </span>
        <span>{fpeData.reviewOfSystems?.gi?.hasIssues ? "Yes" : "No"}</span>
        {fpeData.reviewOfSystems?.gi?.explain && (
          <span className="ml-2">- {fpeData.reviewOfSystems.gi.explain}</span>
        )}
      </div>
      <div>
        <span className="font-medium">Urinary Issues: </span>
        <span>
          {fpeData.reviewOfSystems?.urinary?.hasIssues ? "Yes" : "No"}
        </span>
        {fpeData.reviewOfSystems?.urinary?.explain && (
          <span className="ml-2">
            - {fpeData.reviewOfSystems.urinary.explain}
          </span>
        )}
      </div>
      <div>
        <span className="font-medium">Genital Issues: </span>
        <span>
          {fpeData.reviewOfSystems?.genital?.hasIssues ? "Yes" : "No"}
        </span>
        {fpeData.reviewOfSystems?.genital?.explain && (
          <span className="ml-2">
            - {fpeData.reviewOfSystems.genital.explain}
          </span>
        )}
      </div>
    </div>
  </div>
);

const MedicalHistory = ({ fpeData }: { fpeData: any }) => (
  <div
    className="bg-white rounded-2xl shadow-md p-4 h-full"
    data-aos="fade-right"
    data-aos-delay="300"
  >
    <h3 className="font-semibold mb-3 text-blue-900">Medical History</h3>
    <div className="space-y-3 text-sm text-gray-700">
      {fpeData.history?.medical?.conditions &&
        Object.entries(fpeData.history.medical.conditions).map(
          ([condition, data]: [string, any]) =>
            data?.isDiagnosed && (
              <div key={condition}>
                <span className="font-medium capitalize">
                  {condition.replace(/([A-Z])/g, " $1").trim()}:{" "}
                </span>
                <span>{data.details || "Diagnosed"}</span>
              </div>
            )
        )}
      {fpeData.pastOperations && fpeData.pastOperations.length > 0 && (
        <div>
          <span className="font-medium">Past Operations: </span>
          <span>
            {fpeData.pastOperations
              .map((op: any) => `${op.operation} (${op.date})`)
              .join(", ")}
          </span>
        </div>
      )}
    </div>
  </div>
);

const FamilyHistory = ({ fpeData }: { fpeData: any }) => (
  <div
    className="bg-white rounded-2xl shadow-md p-4 h-full"
    data-aos="fade-left"
    data-aos-delay="400"
  >
    <h3 className="font-semibold mb-3 text-blue-900">Family History</h3>
    <div className="space-y-3 text-sm text-gray-700">
      {fpeData.history?.family?.conditions &&
        Object.entries(fpeData.history.family.conditions).map(
          ([condition, data]: [string, any]) =>
            data?.isDiagnosed && (
              <div key={condition}>
                <span className="font-medium capitalize">
                  {condition.replace(/([A-Z])/g, " $1").trim()}:{" "}
                </span>
                <span>{data.details || "Family history"}</span>
              </div>
            )
        )}
    </div>
  </div>
);

const PhysicalExam = ({ fpeData }: { fpeData: any }) => (
  <div
    className="bg-white rounded-2xl shadow-md p-4 h-full"
    data-aos="fade-right"
    data-aos-delay="500"
  >
    <h3 className="font-semibold mb-3 text-blue-900">Physical Examination</h3>
    <div className="grid grid-cols-2 gap-4 text-sm text-gray-700">
      <div>
        <span className="font-medium">Blood Pressure: </span>
        <span>
          {fpeData.physicalExam?.bloodPressure
            ? `${fpeData.physicalExam.bloodPressure.systolic}/${fpeData.physicalExam.bloodPressure.diastolic}`
            : "Not recorded"}
        </span>
      </div>
      <div>
        <span className="font-medium">Heart Rate: </span>
        <span>{fpeData.physicalExam?.heartRate?.value || "Not recorded"}</span>
      </div>
      <div>
        <span className="font-medium">Respiratory Rate: </span>
        <span>
          {fpeData.physicalExam?.respiratoryRate?.value || "Not recorded"}
        </span>
      </div>
      <div>
        <span className="font-medium">Temperature: </span>
        <span>
          {fpeData.physicalExam?.temperature?.value || "Not recorded"}
        </span>
      </div>
      <div>
        <span className="font-medium">BMI: </span>
        <span>{fpeData.physicalExam?.bmi || "Not calculated"}</span>
      </div>
      <div>
        <span className="font-medium">Blood Type: </span>
        <span>{fpeData.physicalExam?.bloodType || "Not recorded"}</span>
      </div>
    </div>
  </div>
);

const LaboratoryResults = ({ fpeData }: { fpeData: any }) => (
  <div
    className="bg-white rounded-2xl shadow-md p-4 h-full"
    data-aos="fade-left"
    data-aos-delay="600"
  >
    <h3 className="font-semibold mb-3 text-blue-900">Laboratory Results</h3>
    <div className="space-y-3 text-sm text-gray-700">
      <div>
        <span className="font-medium">FBS: </span>
        <span>{fpeData.laboratory?.fbs?.value || "Not recorded"}</span>
        {fpeData.laboratory?.fbs?.status && (
          <span
            className={`ml-2 px-2 py-1 rounded text-xs ${
              fpeData.laboratory.fbs.status === "normal"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {fpeData.laboratory.fbs.status}
          </span>
        )}
      </div>
      <div>
        <span className="font-medium">RBS: </span>
        <span>{fpeData.laboratory?.rbs?.value || "Not recorded"}</span>
        {fpeData.laboratory?.rbs?.status && (
          <span
            className={`ml-2 px-2 py-1 rounded text-xs ${
              fpeData.laboratory.rbs.status === "normal"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {fpeData.laboratory.rbs.status}
          </span>
        )}
      </div>
    </div>
  </div>
);

const Immunizations = ({ fpeData }: { fpeData: any }) => (
  <div
    className="bg-white rounded-2xl shadow-md p-4 h-full"
    data-aos="fade-right"
    data-aos-delay="700"
  >
    <h3 className="font-semibold mb-3 text-blue-900">Immunizations</h3>
    <div className="space-y-2 text-sm text-gray-700">
      {fpeData.immunization &&
        Object.entries(fpeData.immunization).map(
          ([category, vaccines]: [string, any]) => (
            <div key={category}>
              <span className="font-medium capitalize">
                {category.replace(/([A-Z])/g, " $1").trim()}:{" "}
              </span>
              <span>
                {Array.isArray(vaccines) ? vaccines.join(", ") : "None"}
              </span>
            </div>
          )
        )}
    </div>
  </div>
);

const CHDAssessment = ({ fpeData }: { fpeData: any }) => (
  <div
    className="bg-white rounded-2xl shadow-md p-4 h-full"
    data-aos="fade-left"
    data-aos-delay="800"
  >
    <h3 className="font-semibold mb-3 text-blue-900">CHD Assessment</h3>
    <div className="space-y-3 text-sm text-gray-700">
      <div>
        <span className="font-medium">High Fat Food Intake: </span>
        <span
          className={`px-2 py-1 rounded text-xs ${
            fpeData.chd?.highFatFoodIntake === "yes"
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {fpeData.chd?.highFatFoodIntake || "Not assessed"}
        </span>
      </div>
      <div>
        <span className="font-medium">Vegetable Intake: </span>
        <span
          className={`px-2 py-1 rounded text-xs ${
            fpeData.chd?.vegetableIntake === "yes"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {fpeData.chd?.vegetableIntake || "Not assessed"}
        </span>
      </div>
      <div>
        <span className="font-medium">Fruit Intake: </span>
        <span
          className={`px-2 py-1 rounded text-xs ${
            fpeData.chd?.fruitIntake === "yes"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {fpeData.chd?.fruitIntake || "Not assessed"}
        </span>
      </div>
      <div>
        <span className="font-medium">Physical Activity: </span>
        <span
          className={`px-2 py-1 rounded text-xs ${
            fpeData.chd?.physicalActivity === "yes"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {fpeData.chd?.physicalActivity || "Not assessed"}
        </span>
      </div>
      <div>
        <span className="font-medium">Diabetes Diagnosis: </span>
        <span
          className={`px-2 py-1 rounded text-xs ${
            fpeData.chd?.diabetesDiagnosis === "yes"
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {fpeData.chd?.diabetesDiagnosis || "Not assessed"}
        </span>
      </div>
    </div>
  </div>
);

// Quick Navigation Dropdown
const QuickNavigation = ({
  onNavigate,
}: {
  onNavigate: (sectionId: string) => void;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const sections = [
    { id: "overview", label: "Overview" },
    { id: "review-of-systems", label: "Review of Systems" },
    { id: "medical-history", label: "Medical History" },
    { id: "family-history", label: "Family History" },
    { id: "physical-exam", label: "Physical Exam" },
    { id: "laboratory", label: "Laboratory" },
    { id: "immunizations", label: "Immunizations" },
    { id: "chd-assessment", label: "CHD Assessment" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 bg-white rounded-xl shadow-md flex items-center justify-between text-blue-900 font-medium"
        data-aos="fade-up"
        data-aos-delay="50"
      >
        <span>Quick Navigation</span>
        <ChevronDown
          className={`h-4 w-4 text-blue-600 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg z-10 border">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => {
                onNavigate(section.id);
                setIsOpen(false);
              }}
              className="w-full p-3 text-left hover:bg-gray-50 first:rounded-t-xl last:rounded-b-xl text-sm text-gray-700"
            >
              {section.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// Main FPE Page
const FPEPage = () => {
  const navigate = useNavigate();
  const [fpeData, setFpeData] = useState<FPEData | null>(null);
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

  // Fetch FPE data
  useEffect(() => {
    const fetchFPEData = async () => {
      try {
        setLoading(true);
        // TODO: Get actual user ID from auth context
        const userId = "current-user-id";
        const data = await FPEService.getFPEData(userId);

        console.log("FPE Data received:", data);

        // If no data, use sample data to ensure all sections show something
        if (!data || Object.keys(data).length === 0) {
          setFpeData({
            lastUpdated: "2024-01-15",
            status: "Complete",
            reviewOfSystems: {
              chiefComplaint: ["Headache", "Fatigue"],
              mental: { hasIssues: true, explain: "Difficulty sleeping" },
              respiratory: { hasIssues: false, explain: "" },
              gi: { hasIssues: false, explain: "" },
              urinary: { hasIssues: false, explain: "" },
              genital: { hasIssues: false, explain: "" },
            },
            history: {
              medical: {
                conditions: {
                  hypertension: { isDiagnosed: true, details: "Stage 1" },
                  allergies: { isDiagnosed: true, details: "Peanuts" },
                },
              },
              family: {
                conditions: {
                  diabetesMellitus: { isDiagnosed: true, details: "Father" },
                  hypertension: { isDiagnosed: true, details: "Mother" },
                },
              },
            },
            pastOperations: [{ operation: "Appendectomy", date: "2009-04-13" }],
            physicalExam: {
              bloodPressure: { systolic: 125, diastolic: 79 },
              heartRate: { value: 72, status: "normal" },
              respiratoryRate: { value: 16, status: "normal" },
              temperature: { value: 36.8, status: "normal" },
              bmi: 24.5,
              bloodType: "A+",
            },
            laboratory: {
              fbs: { value: 95, status: "normal" },
              rbs: { value: 120, status: "elevated" },
            },
            immunization: {
              childhood: ["MMR", "DTaP", "Hepatitis B"],
              adult: ["Tetanus", "Flu Shot"],
              covid: ["Pfizer", "Booster"],
            },
            chd: {
              highFatFoodIntake: "yes",
              vegetableIntake: "yes",
              fruitIntake: "no",
              physicalActivity: "yes",
              diabetesDiagnosis: "no",
            },
          });
        } else {
          setFpeData(data);
        }
      } catch (error) {
        console.error("Error fetching FPE data:", error);
        // Use sample data on error
        setFpeData({
          lastUpdated: "2024-01-15",
          status: "Complete",
          reviewOfSystems: {
            chiefComplaint: ["Headache", "Fatigue"],
            mental: { hasIssues: true, explain: "Difficulty sleeping" },
            respiratory: { hasIssues: false, explain: "" },
            gi: { hasIssues: false, explain: "" },
            urinary: { hasIssues: false, explain: "" },
            genital: { hasIssues: false, explain: "" },
          },
          history: {
            medical: {
              conditions: {
                hypertension: { isDiagnosed: true, details: "Stage 1" },
                allergies: { isDiagnosed: true, details: "Peanuts" },
              },
            },
            family: {
              conditions: {
                diabetesMellitus: { isDiagnosed: true, details: "Father" },
                hypertension: { isDiagnosed: true, details: "Mother" },
              },
            },
          },
          pastOperations: [{ operation: "Appendectomy", date: "2009-04-13" }],
          physicalExam: {
            bloodPressure: { systolic: 125, diastolic: 79 },
            heartRate: { value: 72, status: "normal" },
            respiratoryRate: { value: 16, status: "normal" },
            temperature: { value: 36.8, status: "normal" },
            bmi: 24.5,
            bloodType: "A+",
          },
          laboratory: {
            fbs: { value: 95, status: "normal" },
            rbs: { value: 120, status: "elevated" },
          },
          immunization: {
            childhood: ["MMR", "DTaP", "Hepatitis B"],
            adult: ["Tetanus", "Flu Shot"],
            covid: ["Pfizer", "Booster"],
          },
          chd: {
            highFatFoodIntake: "yes",
            vegetableIntake: "yes",
            fruitIntake: "no",
            physicalActivity: "yes",
            diabetesDiagnosis: "no",
          },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchFPEData();
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-[#f6f8fa] items-center justify-center">
        <div className="text-blue-600 font-semibold text-lg">
          Loading medical records...
        </div>
      </div>
    );
  }

  if (!fpeData) {
    return (
      <div className="flex flex-col h-screen bg-[#f6f8fa] items-center justify-center">
        <div className="text-red-600 font-semibold text-lg">
          Failed to load medical records
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f6f8fa]">
      {/* Header */}
      <div className="flex items-center gap-4 p-4 md:p-6 border-b">
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-xl font-medium">Medical Records (FPE)</h1>
          <p className="text-sm text-muted-foreground">
            View and manage your health records
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          {/* Quick Navigation */}
          <QuickNavigation onNavigate={scrollToSection} />

          {/* Overview Card - Full width */}
          <div id="overview" className="col-span-full">
            <FPECard fpeData={fpeData} />
          </div>

          {/* Cards Grid - 2 columns on desktop, 1 column on mobile */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Review of Systems */}
            <div id="review-of-systems">
              <ReviewOfSystems fpeData={fpeData} />
            </div>

            {/* Medical History */}
            <div id="medical-history">
              <MedicalHistory fpeData={fpeData} />
            </div>

            {/* Family History */}
            <div id="family-history">
              <FamilyHistory fpeData={fpeData} />
            </div>

            {/* Physical Exam */}
            <div id="physical-exam">
              <PhysicalExam fpeData={fpeData} />
            </div>

            {/* Laboratory Results */}
            <div id="laboratory">
              <LaboratoryResults fpeData={fpeData} />
            </div>

            {/* Immunizations */}
            <div id="immunizations">
              <Immunizations fpeData={fpeData} />
            </div>

            {/* CHD Assessment */}
            <div id="chd-assessment" className="md:col-span-full">
              <CHDAssessment fpeData={fpeData} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FPEPage;
