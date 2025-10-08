import React, { useEffect, useMemo, useState } from "react";
import { EncounterLayout } from "~/app/components/templates/layout/encounter.layout";
import { WorkflowSteps } from "~/app/components/organisms/encounter/workflow.steps";
import { ScanPrescription } from "./pharmacy/scan.prescription";
import { SummaryPrescription } from "~/app/pages/private/other/counters/pharmacy/summary.prescription";
import { ReceiptPrescription } from "./pharmacy/receipt.prescription";

interface Patient {
  id: string;
  name: string;
  initials: string;
  queueNumber: string;
  status: "waiting" | "serving" | "completed" | "skipped";
  estimatedWait?: string;
  priority?: "high" | "normal" | "low";
}

interface ProfileData {
  name: string;
  initials: string;
  age: number;
  gender: string;
  bloodType: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  lastVisit: string;
  medicalAlerts: string[];
  emergencyContact: { name: string; relationship: string; phone: string };
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  instructions: string;
}

export interface PrescriptionData {
  prescriptionId: string;
  doctorName: string;
  date: string;
  medicines: Medicine[];
  totalAmount: number;
}

const initialPharmacyData = {
  prescriptionImage: null,
  summary: "",
  medicines: [],
  receipt: { number: "", totalAmount: "" },
};

const mockPrescriptionData: PrescriptionData = {
  prescriptionId: "RX-2024-001",
  doctorName: "Dr. Maria Santos",
  date: "August 28, 2024",
  medicines: [
    {
      id: "1",
      name: "Amoxicillin",
      dosage: "500mg",
      quantity: 21,
      unitPrice: 15.0,
      totalPrice: 315.0,
      instructions: "Take 1 capsule every 8 hours for 7 days",
    },
    {
      id: "2",
      name: "Paracetamol",
      dosage: "500mg",
      quantity: 20,
      unitPrice: 2.5,
      totalPrice: 50.0,
      instructions: "Take 1-2 tablets every 4-6 hours as needed for pain/fever",
    },
    {
      id: "3",
      name: "Omeprazole",
      dosage: "20mg",
      quantity: 14,
      unitPrice: 8.0,
      totalPrice: 112.0,
      instructions: "Take 1 capsule daily before breakfast",
    },
  ],
  totalAmount: 477.0,
};

export const CountersPharmacyPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [prescriptionData, setPrescriptionData] =
    useState(mockPrescriptionData);

  const [pharmacyData, setPharmacyData] = useState(initialPharmacyData);
  const [currentPatientId, setCurrentPatientId] = useState<string>("1");

  const handlePrescriptionSummary = (prescriptionData: PrescriptionData) => {
    setPrescriptionData(prescriptionData);
    setCurrentStep(2);
  };

  const handleSaveEncounter = () => {
    // SAVE LOGIC HERE
  };

  const handleProceedToReceipt = () => {
    setCurrentStep(2);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <SummaryPrescription
            prescriptionData={prescriptionData}
            onProceedToReceipt={handleProceedToReceipt}
            onBack={() => setCurrentStep(1)}
          />
        );
      case 2:
        return (
          <ReceiptPrescription
            prescriptionData={prescriptionData}
            finishEncounter={handleSaveEncounter}
            onBack={() => setCurrentStep(1)}
          />
        );
      default:
        return (
          <ScanPrescription onPrescriptionScanned={handlePrescriptionSummary} />
        );
    }
  };

  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "1",
      name: "Juan Delacruz",
      initials: "JD",
      queueNumber: "01",
      status: "serving",
      priority: "high",
    },
    {
      id: "2",
      name: "Lolona",
      initials: "L",
      queueNumber: "20",
      status: "waiting",
      estimatedWait: "15min",
      priority: "normal",
    },
    {
      id: "3",
      name: "Maria Santos",
      initials: "MS",
      queueNumber: "03",
      status: "waiting",
      estimatedWait: "30min",
      priority: "normal",
    },
    {
      id: "4",
      name: "Pedro Garcia",
      initials: "PG",
      queueNumber: "05",
      status: "waiting",
      estimatedWait: "45min",
      priority: "low",
    },
    {
      id: "5",
      name: "Carlos Reyes",
      initials: "CR",
      queueNumber: "06",
      status: "waiting",
      estimatedWait: "50min",
      priority: "normal",
    },
    {
      id: "6",
      name: "Ana Lopez",
      initials: "AL",
      queueNumber: "07",
      status: "waiting",
      estimatedWait: "55min",
      priority: "normal",
    },
    {
      id: "7",
      name: "Mark Villanueva",
      initials: "MV",
      queueNumber: "08",
      status: "waiting",
      estimatedWait: "60min",
      priority: "low",
    },
    {
      id: "8",
      name: "Grace Tan",
      initials: "GT",
      queueNumber: "09",
      status: "waiting",
      estimatedWait: "65min",
      priority: "normal",
    },
    {
      id: "9",
      name: "Ramon Cruz",
      initials: "RC",
      queueNumber: "10",
      status: "waiting",
      estimatedWait: "70min",
      priority: "normal",
    },
    {
      id: "10",
      name: "Sofia Mendoza",
      initials: "SM",
      queueNumber: "11",
      status: "waiting",
      estimatedWait: "75min",
      priority: "normal",
    },
    {
      id: "11",
      name: "Daniel Perez",
      initials: "DP",
      queueNumber: "12",
      status: "waiting",
      estimatedWait: "80min",
      priority: "low",
    },
    {
      id: "12",
      name: "Irene Gomez",
      initials: "IG",
      queueNumber: "13",
      status: "waiting",
      estimatedWait: "85min",
      priority: "normal",
    },
    {
      id: "13",
      name: "Noel Rivera",
      initials: "NR",
      queueNumber: "14",
      status: "waiting",
      estimatedWait: "90min",
      priority: "normal",
    },
    {
      id: "14",
      name: "Bea Santos",
      initials: "BS",
      queueNumber: "15",
      status: "waiting",
      estimatedWait: "95min",
      priority: "normal",
    },
  ]);

  const patientDetails: Record<string, any> = useMemo(
    () => ({
      "1": {
        age: 34,
        gender: "Male",
        bloodType: "A+",
        dateOfBirth: "March 15, 1989",
        phone: "+63 912 345 6789",
        address: "123 Main St, Quezon City, Philippines",
        lastVisit: "January 15, 2024",
        medicalAlerts: ["Hypertension", "Allergic to Penicillin"],
        emergencyContact: {
          name: "Maria Delacruz",
          relationship: "Wife",
          phone: "+63 918 765 4321",
        },
      },
      "2": {
        age: 29,
        gender: "Female",
        bloodType: "B+",
        dateOfBirth: "May 21, 1995",
        phone: "+63 917 111 2222",
        address: "456 Mabini St, Manila, Philippines",
        lastVisit: "February 10, 2024",
        medicalAlerts: [],
        emergencyContact: {
          name: "Ana Cruz",
          relationship: "Sister",
          phone: "+63 917 555 0000",
        },
      },
      "3": {
        age: 41,
        gender: "Female",
        bloodType: "O-",
        dateOfBirth: "December 3, 1982",
        phone: "+63 915 333 4444",
        address: "789 Rizal Ave, Pasig, Philippines",
        lastVisit: "March 2, 2024",
        medicalAlerts: ["Diabetes Mellitus"],
        emergencyContact: {
          name: "Jose Santos",
          relationship: "Husband",
          phone: "+63 918 333 2222",
        },
      },
      "4": {
        age: 38,
        gender: "Male",
        bloodType: "AB+",
        dateOfBirth: "August 9, 1986",
        phone: "+63 916 222 3333",
        address: "101 Bonifacio St, Makati, Philippines",
        lastVisit: "November 30, 2023",
        medicalAlerts: [],
        emergencyContact: {
          name: "Lara Garcia",
          relationship: "Wife",
          phone: "+63 917 888 9999",
        },
      },
    }),
    []
  );

  const serveNext = () => {
    setPatients((prev) => {
      const updated = prev.map((p) =>
        p.status === "serving" ? { ...p, status: "completed" as const } : p
      );
      const waiting = updated.find((p) => p.status === "waiting");
      if (waiting) {
        setCurrentPatientId(waiting.id);
        return updated.map((p) =>
          p.id === waiting.id ? { ...p, status: "serving" as const } : p
        );
      }
      return updated;
    });
  };

  const skipCurrent = () => {
    setPatients((prev) => {
      const serving = prev.find((p) => p.status === "serving");
      if (!serving) return prev;
      let updated = prev.map((p) =>
        p.id === serving.id ? { ...p, status: "skipped" as const } : p
      );
      const nextWaiting = updated.find((p) => p.status === "waiting");
      if (nextWaiting) {
        setCurrentPatientId(nextWaiting.id);
        updated = updated.map((p) =>
          p.id === nextWaiting.id ? { ...p, status: "serving" as const } : p
        );
      }
      return updated;
    });
  };

  const recallSkipped = () => {
    setPatients((prev) => {
      const firstSkipped = prev.find((p) => p.status === "skipped");
      if (!firstSkipped) return prev;
      return prev.map((p) =>
        p.id === firstSkipped.id ? { ...p, status: "waiting" as const } : p
      );
    });
  };

  const handleBack = () => {
    if (typeof window !== "undefined") {
      if (window.history.length > 1) window.history.back();
      else window.location.href = "/";
    }
  };

  // Reset pharmacy data on patient switch
  useEffect(() => {
    setPharmacyData(initialPharmacyData);
  }, [currentPatientId]);

  const activePatient: Patient | undefined = useMemo(() => {
    return (
      patients.find((p) => p.id === currentPatientId) ||
      patients.find((p) => p.status === "serving") ||
      patients[0]
    );
  }, [patients, currentPatientId]);

  const profileData = useMemo(() => {
    if (!activePatient) return null;
    const more = patientDetails[activePatient.id] || {};
    return {
      name: activePatient.name,
      initials: activePatient.initials,
      age: more.age ?? 0,
      gender: more.gender ?? "-",
      bloodType: more.bloodType ?? "-",
      dateOfBirth: more.dateOfBirth ?? "-",
      phone: more.phone ?? "-",
      address: more.address ?? "-",
      lastVisit: more.lastVisit ?? "-",
      medicalAlerts: more.medicalAlerts ?? [],
      emergencyContact: more.emergencyContact ?? {
        name: "-",
        relationship: "-",
        phone: "-",
      },
    };
  }, [activePatient, patientDetails]);

  const queueLabel = activePatient
    ? `Queue #${activePatient.queueNumber} • ${activePatient.status}`
    : undefined;

  return (
    <EncounterLayout
      patients={patients}
      onServeNext={serveNext}
      onSkipPatient={skipCurrent}
      onRecallPatient={recallSkipped}
      onPatientsReorder={setPatients}
      currentPatientId={currentPatientId}
      topBarTitle="Pharmacy"
      profileData={profileData as ProfileData}
      queueLabel={queueLabel}
      onBack={handleBack}
      providers={["Pharmacy Staff", "Dr. Jose Rizal"]}
      selectedProvider="Pharmacy Staff"
      onProviderChange={(p) => console.log("Provider:", p)}
      time="2:02:42 PM"
      onMedicineClick={() => {}}
      onLabClick={() => {}}
      onCertificateClick={() => {}}
      onCancel={() => console.log("Cancelled")}
      onSubmit={() => console.log("Submitted")}
      cancelLabel="Back"
      submitLabel="Save Prescription"
    >
      <div className="mx-auto space-y-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex">
            {/* Main Content */}
            <div className="flex-1 p-6">
              <WorkflowSteps
                currentStep={currentStep}
                steps={[
                  {
                    number: 1,
                    title: "Step 1",
                    description: "Prescription Summary",
                  },
                  {
                    number: 2,
                    title: "Step 2",
                    description: "Prescription Receipt Review",
                  },
                ]}
              />

              {/* Step Content */}
              <div className="mt-8">{renderCurrentStep()}</div>
            </div>
          </div>
        </div>
      </div>
    </EncounterLayout>
  );
};
