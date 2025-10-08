import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/button";
import {
  ArrowLeft,
  Calendar,
  User,
  Stethoscope,
  FileText,
  Pill,
  Activity,
  TestTube,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router";
import { ConsultationService } from "~/app/configuration/others/consultation.mockdata";
import type { ConsultationData } from "~/app/configuration/others/consultation.mockdata";
import { Headerbackbutton } from "@/components/organisms/backbutton.header";
import { MedicalRecordCard } from "@/components/organisms/cards";
import AOS from "aos";
import "aos/dist/aos.css";

// EMR Header Component
const EMRHeader = ({ consultation }: { consultation: ConsultationData }) => (
  <MedicalRecordCard
    data-aos="fade-down"
    data-aos-duration="800"
    data-aos-delay="100"
  >
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow">
        <FileText className="w-8 h-8 text-blue-600" />
      </div>
      <div className="flex-1">
        <h2 className="text-xl font-bold text-white">
          Electronic Medical Record
        </h2>
        <p className="text-blue-100">
          Consultation ID: {consultation.consultationId}
        </p>
        <p className="text-blue-100">
          Date:{" "}
          {new Date(consultation.date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>
      <div className="text-right">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
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
  </MedicalRecordCard>
);

// Patient Information Component
const PatientInfo = ({ consultation }: { consultation: ConsultationData }) => (
  <div className="bg-white rounded-2xl shadow-md p-4 h-full">
    <h3 className="font-semibold mb-3 text-blue-900 flex items-center gap-2">
      <User className="w-5 h-5" />
      Patient Information
    </h3>
    <div className="space-y-2 text-sm text-gray-700">
      <div className="flex items-center gap-2">
        <span className="font-medium">Attending Physician:</span>
        <span>{consultation.attendingPhysician}</span>
      </div>
      {consultation.followUpDate && (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="font-medium">Follow-up Date:</span>
          <span>
            {new Date(consultation.followUpDate).toLocaleDateString()}
          </span>
        </div>
      )}
    </div>
  </div>
);

// Chief Complaint Component
const ChiefComplaint = ({
  consultation,
}: {
  consultation: ConsultationData;
}) => (
  <div className="bg-white rounded-2xl shadow-md p-4 h-full">
    <h3 className="font-semibold mb-3 text-blue-900 flex items-center gap-2">
      <AlertCircle className="w-5 h-5" />
      Chief Complaint
    </h3>
    <div className="text-sm text-gray-700">
      <p className="bg-gray-50 rounded-lg p-3">{consultation.complaint}</p>
    </div>
  </div>
);

// Vital Signs Component
const VitalSigns = ({ consultation }: { consultation: ConsultationData }) => {
  if (!consultation.vitalSigns) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 h-full">
      <h3 className="font-semibold mb-3 text-blue-900 flex items-center gap-2">
        <Activity className="w-5 h-5" />
        Vital Signs
      </h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        {consultation.vitalSigns.bloodPressure && (
          <div className="p-3 bg-blue-50 rounded-lg">
            <span className="font-medium text-blue-900">Blood Pressure</span>
            <p className="text-blue-700 font-semibold">
              {consultation.vitalSigns.bloodPressure}
            </p>
          </div>
        )}
        {consultation.vitalSigns.heartRate && (
          <div className="p-3 bg-red-50 rounded-lg">
            <span className="font-medium text-red-900">Heart Rate</span>
            <p className="text-red-700 font-semibold">
              {consultation.vitalSigns.heartRate} bpm
            </p>
          </div>
        )}
        {consultation.vitalSigns.temperature && (
          <div className="p-3 bg-orange-50 rounded-lg">
            <span className="font-medium text-orange-900">Temperature</span>
            <p className="text-orange-700 font-semibold">
              {consultation.vitalSigns.temperature}°C
            </p>
          </div>
        )}
        {consultation.vitalSigns.weight && (
          <div className="p-3 bg-green-50 rounded-lg">
            <span className="font-medium text-green-900">Weight</span>
            <p className="text-green-700 font-semibold">
              {consultation.vitalSigns.weight} kg
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Diagnosis Component
const Diagnosis = ({ consultation }: { consultation: ConsultationData }) => (
  <div className="bg-white rounded-2xl shadow-md p-4 h-full">
    <h3 className="font-semibold mb-3 text-blue-900 flex items-center gap-2">
      <Stethoscope className="w-5 h-5" />
      Diagnosis
    </h3>
    <div className="text-sm text-gray-700">
      <p className="bg-blue-50 rounded-lg p-3 text-blue-900 font-medium">
        {consultation.diagnosis || "No diagnosis recorded"}
      </p>
    </div>
  </div>
);

// Medications Component
const Medications = ({ consultation }: { consultation: ConsultationData }) => {
  if (!consultation.medications || consultation.medications.length === 0)
    return null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 h-full">
      <h3 className="font-semibold mb-3 text-blue-900 flex items-center gap-2">
        <Pill className="w-5 h-5" />
        Medications
      </h3>
      <div className="space-y-3">
        {consultation.medications.map((medication, index) => (
          <div
            key={index}
            className="bg-yellow-50 rounded-lg p-3 border-l-4 border-yellow-400"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-yellow-900">
                {medication.name}
              </h4>
              <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-1 rounded">
                {medication.dosage}
              </span>
            </div>
            <div className="space-y-1 text-sm text-yellow-800">
              <p>
                <span className="font-medium">Frequency:</span>{" "}
                {medication.frequency}
              </p>
              <p>
                <span className="font-medium">Duration:</span>{" "}
                {medication.duration}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Laboratory Tests Component
const LaboratoryTests = ({
  consultation,
}: {
  consultation: ConsultationData;
}) => {
  if (
    !consultation.laboratoryTests ||
    consultation.laboratoryTests.length === 0
  )
    return null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 h-full">
      <h3 className="font-semibold mb-3 text-blue-900 flex items-center gap-2">
        <TestTube className="w-5 h-5" />
        Laboratory Tests
      </h3>
      <div className="space-y-3">
        {consultation.laboratoryTests.map((test, index) => (
          <div
            key={index}
            className="bg-purple-50 rounded-lg p-3 border-l-4 border-purple-400"
          >
            <div className="flex justify-between items-start mb-2">
              <h4 className="font-semibold text-purple-900">{test.testName}</h4>
              <span
                className={`text-xs px-2 py-1 rounded ${
                  test.status === "completed"
                    ? "bg-green-200 text-green-800"
                    : test.status === "pending"
                    ? "bg-yellow-200 text-yellow-800"
                    : "bg-blue-200 text-blue-800"
                }`}
              >
                {test.status}
              </span>
            </div>
            {test.result && (
              <p className="text-sm text-purple-800">
                <span className="font-medium">Result:</span> {test.result}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Doctor's Orders Component
const DoctorsOrders = ({
  consultation,
}: {
  consultation: ConsultationData;
}) => {
  if (!consultation.doctorsOrders) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 h-full">
      <h3 className="font-semibold mb-3 text-blue-900 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Doctor's Orders
      </h3>
      <div className="text-sm text-gray-700">
        <div className="bg-green-50 rounded-lg p-3 border-l-4 border-green-400">
          <p className="text-green-900">{consultation.doctorsOrders}</p>
        </div>
      </div>
    </div>
  );
};

// Notes Component
const Notes = ({ consultation }: { consultation: ConsultationData }) => {
  if (!consultation.notes) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-4 h-full">
      <h3 className="font-semibold mb-3 text-blue-900 flex items-center gap-2">
        <FileText className="w-5 h-5" />
        Clinical Notes
      </h3>
      <div className="text-sm text-gray-700">
        <div className="bg-gray-50 rounded-lg p-3">
          <p>{consultation.notes}</p>
        </div>
      </div>
    </div>
  );
};

// Main EMR Page
const EMRPage = () => {
  const navigate = useNavigate();
  const { consultationId } = useParams<{ consultationId: string }>();
  const [consultation, setConsultation] = useState<ConsultationData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: "ease-in-out",
      once: true,
      offset: 80,
    });
  }, []);

  useEffect(() => {
    const fetchConsultationDetails = async () => {
      if (!consultationId) {
        navigate("/consultation");
        return;
      }

      try {
        setLoading(true);
        const data = await ConsultationService.getConsultationDetails(
          consultationId
        );
        setConsultation(data);
      } catch (error) {
        console.error("Error fetching consultation details:", error);
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
    };

    fetchConsultationDetails();
  }, [consultationId, navigate]);

  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-[#f6f8fa] items-center justify-center">
        <div className="text-blue-600 font-semibold text-lg">
          Loading medical record...
        </div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="flex flex-col h-screen bg-[#f6f8fa] items-center justify-center">
        <div className="text-red-600 font-semibold text-lg">
          Medical record not found
        </div>
        <Button onClick={() => navigate("/consultation")} className="mt-4">
          Back to Consultations
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-[#f6f8fa]">
      {/* Header */}
      <Headerbackbutton title="Medical Record" />

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-4">
          {/* EMR Header */}
          <EMRHeader consultation={consultation} />

          {/* Two-column layout for cards */}
          <div
            className="space-y-4"
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-offset="80"
          >
            {/* First row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <PatientInfo consultation={consultation} />
              <ChiefComplaint consultation={consultation} />
            </div>

            {/* Second row */}
            {consultation.vitalSigns && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <VitalSigns consultation={consultation} />
                <Diagnosis consultation={consultation} />
              </div>
            )}

            {/* Third row - Medications or single card */}
            {consultation.medications &&
              consultation.medications.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Medications consultation={consultation} />
                  {consultation.laboratoryTests &&
                  consultation.laboratoryTests.length > 0 ? (
                    <LaboratoryTests consultation={consultation} />
                  ) : consultation.doctorsOrders ? (
                    <DoctorsOrders consultation={consultation} />
                  ) : consultation.notes ? (
                    <Notes consultation={consultation} />
                  ) : (
                    <div /> // Empty div to maintain grid structure
                  )}
                </div>
              )}

            {/* Fourth row - Lab tests or single card */}
            {consultation.laboratoryTests &&
              consultation.laboratoryTests.length > 0 &&
              (!consultation.medications ||
                consultation.medications.length === 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <LaboratoryTests consultation={consultation} />
                  {consultation.doctorsOrders ? (
                    <DoctorsOrders consultation={consultation} />
                  ) : consultation.notes ? (
                    <Notes consultation={consultation} />
                  ) : (
                    <div /> // Empty div to maintain grid structure
                  )}
                </div>
              )}

            {/* Fifth row - Doctor's orders or single card */}
            {consultation.doctorsOrders &&
              (!consultation.medications ||
                consultation.medications.length === 0) &&
              (!consultation.laboratoryTests ||
                consultation.laboratoryTests.length === 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <DoctorsOrders consultation={consultation} />
                  {consultation.notes ? (
                    <Notes consultation={consultation} />
                  ) : (
                    <div /> // Empty div to maintain grid structure
                  )}
                </div>
              )}

            {/* Sixth row - Notes if it's the only one left */}
            {consultation.notes &&
              (!consultation.medications ||
                consultation.medications.length === 0) &&
              (!consultation.laboratoryTests ||
                consultation.laboratoryTests.length === 0) &&
              !consultation.doctorsOrders && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Notes consultation={consultation} />
                  <div /> {/* Empty div to maintain grid structure */}
                </div>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EMRPage;
