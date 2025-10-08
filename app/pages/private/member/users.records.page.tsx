import { useEffect, useState } from "react";
import { Button } from "@/components/atoms/button";
import { useNavigate } from "react-router";
import { useFPERegistrationForm } from "@/hooks/use.fpe.form";
import { ArrowLeft } from "lucide-react";
import { MedicalRecordCard, VitalSignsCard } from "@/components/organisms/cards";
import AOS from "aos";
import "aos/dist/aos.css";

// Compound components
const MedicalConditions = ({ fpeData }: { fpeData: any }) => {
  const conditions = fpeData.history?.medical?.conditions;
  const diagnosedConditions = conditions
    ? Object.entries(conditions).filter(([_, data]: [string, any]) => data.isDiagnosed)
    : [];

  return (
    <div
      className="bg-white rounded-2xl shadow-md p-4"
      data-aos="fade-up"
      data-aos-delay="200"
    >
      <h3 className="font-semibold mb-3 text-blue-900">Medical Conditions</h3>
      <div className="space-y-2 text-sm text-gray-700">
        {diagnosedConditions.length > 0 ? (
          diagnosedConditions.map(([condition, data]: [string, any]) => (
            <div key={condition} className="flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              <span className="font-medium capitalize">
                {condition.replace(/([A-Z])/g, " $1").trim()}
              </span>
              {data.details && (
                <span className="text-gray-500">- {data.details}</span>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic">No medical conditions recorded</p>
        )}
      </div>
    </div>
  );
};

const LifestyleInfo = ({ fpeData }: { fpeData: any }) => {
  const social = fpeData.history?.social;
  const lifestyle = fpeData.history?.medical?.lifestyle;

  return (
    <div
      className="bg-white rounded-2xl shadow-md p-4"
      data-aos="fade-up"
      data-aos-delay="200"
    >
      <h3 className="font-semibold mb-3 text-blue-900">Lifestyle Information</h3>
      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              social?.smoker ? "bg-red-500" : "bg-green-500"
            }`}
          ></span>
          <span>Smoker: {social?.smoker ? "Yes" : "No"}</span>
          {social?.smoker && social?.smokingYears && (
            <span className="text-gray-500">({social.smokingYears} years)</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              social?.alcohol ? "bg-red-500" : "bg-green-500"
            }`}
          ></span>
          <span>Alcohol: {social?.alcohol ? "Yes" : "No"}</span>
          {social?.alcohol && social?.alcoholYears && (
            <span className="text-gray-500">({social.alcoholYears} years)</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              lifestyle?.sexuallyActive?.isYes ? "bg-blue-500" : "bg-gray-400"
            }`}
          ></span>
          <span>
            Sexually Active: {lifestyle?.sexuallyActive?.isYes ? "Yes" : "No"}
          </span>
        </div>
      </div>
    </div>
  );
};

const Measurements = ({ fpeData }: { fpeData: any }) => (
  <div
    className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
    data-aos="fade-up"
    data-aos-delay="200"
  >
    {[
      {
        label: "Height",
        value: fpeData.physicalExam?.height?.centimeter
          ? `${fpeData.physicalExam.height.centimeter} cm`
          : "Not recorded",
      },
      {
        label: "Weight",
        value: fpeData.physicalExam?.weight?.kilograms
          ? `${fpeData.physicalExam.weight.kilograms} kg`
          : "Not recorded",
      },
      {
        label: "Blood Type",
        value: fpeData.physicalExam?.bloodType || "Not recorded",
      },
      {
        label: "Allergies",
        value: fpeData.history?.medical?.conditions?.allergies?.isDiagnosed
          ? fpeData.history.medical.conditions.allergies.details || "Yes"
          : "None",
      },
    ].map((item) => (
      <VitalSignsCard key={item.label} label={item.label} value={item.value} />
    ))}
  </div>
);

const NavigationButtons = ({ navigate }: { navigate: any }) => (
  <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    <Button
      className="w-full bg-blue-600 text-white rounded-xl shadow"
      onClick={() => navigate("/medical-record/FPE")}
    >
      Medical Records (FPE)
    </Button>
    <Button
      className="w-full bg-blue-600 text-white rounded-xl shadow"
      onClick={() => navigate("/consultation")}
    >
      Consultation History
    </Button>
    <Button
      className="w-full bg-green-600 text-white rounded-xl shadow"
      onClick={() => navigate("/forms")}
    >
      Download Form
    </Button>
  </div>
);

const MedicalRecordPage = () => {
  const navigate = useNavigate();
  const { formData: fpeData } = useFPERegistrationForm();
  const [medicalRecordData, setMedicalRecordData] = useState<any | null>(null);

  useEffect(() => {
    setTimeout(() => {
      setMedicalRecordData({
        name: "Samantha Lee",
        age: 30,
        gender: "Female",
        bloodType: fpeData.physicalExam?.bloodType || "A+",
        address: "123 Main St, City, Country",
        phone: "555-1234",
        email: "samantha@gmail.com",
        highPriority: fpeData.history?.medical?.conditions?.hypertension
          ?.isDiagnosed
          ? "Hypertension"
          : "None",
      });
    }, 500);
  }, [fpeData]);

  if (!medicalRecordData) {
    return (
      <div className="flex flex-col h-screen bg-[#f6f8fa] items-center justify-center">
        <div className="text-blue-600 font-semibold text-lg">
          Loading medical record...
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
            <h1 className="text-xl font-medium">Medical Records</h1>
            <p className="text-sm text-muted-foreground">View and manage your health records</p>
          </div>
        </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile card */}
        <div className="p-4">
          <MedicalRecordCard>
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center shadow">
                <img
                  src="/placeholder-avatar.jpg"
                  alt="Medical Record"
                  className="w-16 h-16 rounded-full object-cover"
                />
              </div>
              <div className="text-center sm:text-left">
                <h2 className="text-2xl font-bold text-white">
                  {medicalRecordData.name}
                </h2>
                <p className="text-blue-100">
                  Age {medicalRecordData.age} • {medicalRecordData.gender} •{" "}
                  {medicalRecordData.bloodType}
                </p>
                <p className="text-blue-100">
                  Address: {medicalRecordData.address}
                </p>
                <p className="text-blue-100">
                  Contact#: {medicalRecordData.phone}
                </p>
                <p className="text-blue-100">
                  Email: {medicalRecordData.email}
                </p>
                <div className="mt-2">
                  <span className="bg-white text-blue-700 text-xs font-semibold px-3 py-1 rounded-full shadow">
                    {medicalRecordData.highPriority}
                  </span>
                </div>
              </div>
            </div>
          </MedicalRecordCard>
        </div>

        {/* Vital signs */}
        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "Blood Pressure",
              value: fpeData.physicalExam?.bloodPressure
                ? `${fpeData.physicalExam.bloodPressure.systolic}/${fpeData.physicalExam.bloodPressure.diastolic}`
                : "Not recorded",
            },
            {
              label: "Heart Rate",
              value: fpeData.physicalExam?.heartRate?.value
                ? `${fpeData.physicalExam.heartRate.value} bpm`
                : "Not recorded",
            },
            {
              label: "BMI",
              value: fpeData.physicalExam?.bmi
                ? fpeData.physicalExam.bmi.toFixed(1)
                : "Not calculated",
            },
            {
              label: "Temperature",
              value: fpeData.physicalExam?.temperature?.value
                ? `${fpeData.physicalExam.temperature.value}°C`
                : "Not recorded",
            },
          ].map((item, index) => (
            <VitalSignsCard
              key={item.label}
              label={item.label}
              value={item.value}
              dataAos="zoom-in"
              dataAosDelay={`${300 + index * 100}`}
            />
          ))}
        </div>

        {/* Conditions + Lifestyle */}
        <div className="p-4">
          <MedicalConditions fpeData={fpeData} />
        </div>
        <div className="p-4">
          <LifestyleInfo fpeData={fpeData} />
        </div>

        {/* Measurements */}
        <Measurements fpeData={fpeData} />

        {/* Navigation buttons */}
        <NavigationButtons navigate={navigate} />
      </div>
    </div>
  );
};

export default MedicalRecordPage;
