import React, { useEffect, useMemo, useState } from "react";
import { EncounterLayout } from "@/components/templates/layout/encounter.layout";
import { InterviewForm } from "@/components/molecules/InterviewForm";
import { EncounterStepper } from "../../../../components/organisms/encounter/encounter.stepper";

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

// --- reusable initial interviewData ---
const initialInterviewData = {
  reviewOfSystems: {
    mental: { isTrue: null, details: "" },
    respiratory: { isTrue: null, details: "" },
    gi: { isTrue: null, details: "" },
    urinary: { isTrue: null, details: "" },
    genital: { isTrue: null, details: "" },
    female: {
      lastMenstrualPeriod: "",
      firstMenstrualPeriod: "",
      pregnancyCount: "",
    },
  },
  pastMedicalHistory: {
    cancer: { isTrue: false, details: "" },
    allergies: { isTrue: false, details: "" },
    diabetesMellitus: { isTrue: false, details: "" },
    hypertension: { isTrue: false, details: "" },
    heartDisease: { isTrue: false, details: "" },
    stroke: { isTrue: false, details: "" },
    bronchialAsthma: { isTrue: false, details: "" },
    copd: { isTrue: false, details: "" },
    tuberculosis: { isTrue: false, details: "" },
    asthma: { isTrue: false, details: "" },
    cerebrovascularDisease: { isTrue: false, details: "" },
    coronaryArteryDisease: { isTrue: false, details: "" },
    emphysema: { isTrue: false, details: "" },
    epilepsy: { isTrue: false, details: "" },
    hepatitis: { isTrue: false, details: "" },
    hyperlipidemia: { isTrue: false, details: "" },
    pulmonaryTuberculosis: { isTrue: false, details: "" },
    extrapulmonaryTuberculosis: { isTrue: false, details: "" },
    urinaryTractInfection: { isTrue: false, details: "" },
    mentalIllness: { isTrue: false, details: "" },
    others: { isTrue: false, details: "" },
  },
  socialHistory: {
    smoker: { isTrue: null, years: "", sticksPerDay: "" },
    alcohol: { isTrue: null, years: "", qtyPerWeek: "" },
    sexuallyActive: { isTrue: null, details: "" },
  },
  familyMedicalHistory: {
    cancer: { isTrue: false, details: "" },
    allergies: { isTrue: false, details: "" },
    diabetesMellitus: { isTrue: false, details: "" },
    hypertension: { isTrue: false, details: "" },
    heartDisease: { isTrue: false, details: "" },
    stroke: { isTrue: false, details: "" },
    bronchialAsthma: { isTrue: false, details: "" },
    copd: { isTrue: false, details: "" },
    tuberculosis: { isTrue: false, details: "" },
    asthma: { isTrue: false, details: "" },
    cerebrovascularDisease: { isTrue: false, details: "" },
    coronaryArteryDisease: { isTrue: false, details: "" },
    emphysema: { isTrue: false, details: "" },
    epilepsy: { isTrue: false, details: "" },
    hepatitis: { isTrue: false, details: "" },
    hyperlipidemia: { isTrue: false, details: "" },
    pulmonaryTuberculosis: { isTrue: false, details: "" },
    extrapulmonaryTuberculosis: { isTrue: false, details: "" },
    urinaryTractInfection: { isTrue: false, details: "" },
    mentalIllness: { isTrue: false, details: "" },
    others: { isTrue: false, details: "" },
  },
  immunizations: {
    tetanus: { isTrue: false, date: "" },
    measlesMumpsRubella: { isTrue: false, date: "" },
    hepatitisB: { isTrue: false, date: "" },
    influenza: { isTrue: false, date: "" },
    covid19: { isTrue: false, date: "" },
  },
  obGyne: {
    familyPlanningAccess: null,
    menstrual: {
      applicable: true,
      menarcheAge: "",
      onsetSexAge: "",
      menopause: null,
      menopauseAge: "",
      lastMenstrualPeriod: "",
      birthControlMethod: "",
      periodDurationDays: "",
      intervalCycleDays: "",
      padsPerDay: "",
    },
    pregnancy: {
      applicable: true,
      gravidity: "",
      parity: "",
      typeOfDelivery: "",
      numFullTerm: "",
      numPremature: "",
      numAbortion: "",
      numLivingChildren: "",
      preeclampsia: false,
    },
  },
};

export const CountersInterviewPage: React.FC = () => {
  const stepKeys = ["ros", "pmh", "fmh", "imm", "ob"] as const;
  const [currentStep, setCurrentStep] = useState(0);
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

  const [currentPatientId, setCurrentPatientId] = useState<string>("1");
  const [interviewData, setInterviewData] = useState(initialInterviewData);

  // Reset interview when switching patients
  useEffect(() => {
    setInterviewData(initialInterviewData);
  }, [currentPatientId]);

  // Stepper sync with query string
  useEffect(() => {
    if (typeof window === "undefined") return;
    const readFromQuery = () => {
      const params = new URLSearchParams(window.location.search);
      const tab = params.get("tab");
      const idx = tab ? stepKeys.indexOf(tab as any) : -1;
      if (idx >= 0 && idx !== currentStep) setCurrentStep(idx);
    };
    readFromQuery();
    const onPop = () => readFromQuery();
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [currentStep]);

  const updateQueryStep = (nextIndex: number) => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    params.set("tab", stepKeys[nextIndex]);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState(null, "", newUrl);
  };

  const handleStepChange = (index: number) => {
    setCurrentStep(index);
    updateQueryStep(index);
  };

  const handleSave = () => {
    console.log("Saving interview data:", interviewData);
    // Here you would typically save to your backend
    alert("Interview saved successfully!");
  };

  // Validation functions for each step
  const stepValidators = [
    // Step 0: Review of Systems - No required fields, allow free navigation
    (data: any) => {
      return [];
    },
    // Step 1: Past Medical History - No required fields, allow free navigation
    (data: any) => {
      return [];
    },
    // Step 2: Family Medical History - No required fields, allow free navigation
    (data: any) => {
      return [];
    },
    // Step 3: Immunizations - No required fields, allow free navigation
    (data: any) => {
      return [];
    },
    // Step 4: OB-Gyne History - No required fields, allow free navigation
    (data: any) => {
      return [];
    },
  ];

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

  // --- queue functions ---
  const serveNext = () => {
    setPatients((prev) => {
      const updated = prev.map((p) =>
        p.status === "serving" ? { ...p, status: "completed" as const } : p
      );
      const waiting = updated.find((p) => p.status === "waiting");
      if (!waiting) return updated;
      setCurrentPatientId(waiting.id);
      return updated.map((p) =>
        p.id === waiting.id ? { ...p, status: "serving" as const } : p
      );
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

  const queueLabel = activePatient
    ? `Queue #${activePatient.queueNumber} • ${activePatient.status
        .charAt(0)
        .toUpperCase()}${activePatient.status.slice(1)}`
    : undefined;

  return (
    <EncounterLayout
      patients={patients}
      currentPatientId={currentPatientId}
      onServeNext={serveNext}
      onSkipPatient={skipCurrent}
      onRecallPatient={recallSkipped}
      onPatientsReorder={setPatients}
      topBarTitle="Interview"
      onBack={handleBack}
      providers={["Dr. Jose Rizal", "Dr. Juan Luna"]}
      selectedProvider="Dr. Jose Rizal"
      onProviderChange={(p) => console.log("Selected provider:", p)}
      time="2:02:42 PM"
      profileData={profileData as ProfileData}
      queueLabel={queueLabel}
      onMedicineClick={() => console.log("Medicine clicked")}
      onLabClick={() => console.log("Lab clicked")}
      onCertificateClick={() => console.log("Certificate clicked")}
      onCancel={() => console.log("Cancelled")}
      onSubmit={() => console.log("Submitted")}
      cancelLabel="Back"
      submitLabel="Save Interview"
    >
      <div className="mx-auto space-y-2">
        <EncounterStepper
          currentStep={currentStep}
          steps={[
            "Review Of Systems",
            "Past Medical History",
            "Family Medical History",
            "OB-Gyne History",
            "Immunizations",
          ]}
          onStepChange={handleStepChange}
        />

        <InterviewForm
          interviewData={interviewData}
          onInterviewChange={(data: any) => setInterviewData(data as any)}
          isFemale={profileData?.gender?.toLowerCase() === "female"}
          showReviewOfSystems={currentStep === 0}
          showPastMedicalHistory={currentStep === 1}
          showFamilyHistory={currentStep === 2}
          showObGyne={currentStep === 3}
          showImmunizations={currentStep === 4}
        />
      </div>
    </EncounterLayout>
  );
};
