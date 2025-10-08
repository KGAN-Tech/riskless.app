// DefaultPatientPage.tsx
import { useState, useEffect, type JSX, useMemo } from "react";
import CreateQueuePage from "@/pages/private/patients/features/queue/queue.create";
import { queuingService } from "~/app/services/queuing.service";
import { counterService } from "~/app/services/counter.service";
import QueueProgressPage from "@/pages/private/patients/features/queue/queue.progress";
import { useToast } from "~/app/components/atoms/use-toast";
import { io } from "socket.io-client";
import { SOCKET_URL } from "~/app/configuration/socket.config";
import ReviewOfSystemsSection from "@/pages/private/patients/features/form-section/interview/review.of.systems.section";
import AllDocumentsWrapper from "@/pages/private/patients/features/form-section/documents/all.documents.wrapper";
import OBGyneHistorySection from "@/pages/private/patients/features/form-section/interview/ob.gyne.history.section";
import ImmunizationSection from "@/pages/private/patients/features/form-section/interview/immunizations.section";
import { XMLViewerSection } from "@/pages/private/patients/features/form-section/documents/xml.viewer.section";
import type { EncounterForm } from "~/app/model/_encounter.model";
import MedicalHistorySection from "@/pages/private/patients/features/form-section/interview/medical.history.section";
import { SocialHistorySection } from "@/pages/private/patients/features/form-section/interview/social.history";
import {
  MeasurementUnit,
  PersonBloodType,
  PhysicalExamStatus,
  ReportStatus,
  VisionStatus,
} from "~/app/model/vitals.model";
import { NCDSection } from "~/app/pages/private/patients/features/form-section/interview/ncd.section";
import SurgicalHistorySection from "../features/form-section/interview/surgical.history.section";
import VitalsSection from "../features/form-section/vitals/vitals.section";
import { PertinentFindingsSection } from "../features/form-section/vitals/pertinent.findings.section";
import { TAB } from "~/app/configuration/const.config";
import ConsultationReviewOfSystemsSection from "../features/form-section/consultation/chief.complaint.section";
import { useQuery } from "@tanstack/react-query";

interface EncounterPatientPageProps {
  encounter: any;
  member: any;
  facilityId: string;
  views: { id: string; icon: JSX.Element; page?: string }[];
  selectedView: string;
  onSelectView: (view: string) => void;
}

export default function EncounterPatientPage({
  encounter,
  member,
  facilityId,
  selectedView,
}: EncounterPatientPageProps) {
  const socket = io(SOCKET_URL);
  const [activeTab, setActiveTab] = useState<string>("");
  const { toast } = useToast();

  // ✅ Fetch counters with React Query
  const {
    data: counters = [],
    isLoading: countersLoading,
    error: countersError,
  } = useQuery({
    queryKey: ["counters", facilityId],
    queryFn: async () => {
      const res: any = await counterService.getAll({ facilityId });
      return res.data ?? [];
    },
    enabled: !!facilityId, // only run if facilityId exists
  });

  // ✅ Fetch queues with React Query
  const {
    data: queues = [],
    isLoading: queuesLoading,
    error: queuesError,
    refetch: refetchQueues,
  } = useQuery({
    queryKey: ["queues", encounter?.id],
    queryFn: async () => {
      const res: any = await queuingService.getAll({
        encounterId: encounter?.id,
      });
      return res.data ?? [];
    },
    enabled: !!encounter?.id, // only run if encounterId exists
  });

  const [encounterForm, setEncounterForm] = useState<EncounterForm>({
    interview: {
      reviews: {
        chiefComplaint: [],
        mental: { hasIssues: false, explain: "" },
        respiratory: { hasIssues: false, explain: "" },
        gi: { hasIssues: false, explain: "" },
        urinary: { hasIssues: false, explain: "" },
        endocrine: { hasIssues: false, explain: "" },
        genital: { hasIssues: false, explain: "" },
        musculoskeletal: { hasIssues: false, explain: "" },
      },
      history: {
        family: [],
        familySpecific: [],
        medical: [],
        medicalSpecific: [],
        social: {
          isSmoker: false,
          cigarettePkgNo: 0,
          isDrinker: false,
          bottlesNo: 0,
          isIllicitDrugUser: false,
          isSexuallyActive: false,
          status: "unvalidated",
          remarks: { value: "None", type: "default" },
        },
        surgical: [],
        menstrual: {
          menarchePeriod: 0,
          lastMensPeriod: new Date(),
          durationPeriod: 0,
          mensInterval: 0,
          padsPerday: 0,
          onSetSexIc: 0,
          birthControlMethod: "",
          isMenopause: false,
          menopauseAge: 0,
          isApplicable: true,
          status: "unvalidated",
          remarks: { value: "None", type: "default" },
        },
        pregnancy: {
          pregnancyCount: 0,
          deliveryCount: 0,
          deliveryType: "not_applicable",
          fullTermCount: 0,
          prematureCount: 0,
          abortionCount: 0,
          liveChildrenCount: 0,
          withPregIndhyp: false,
          withFamilyPlan: false,
          isApplicable: true,
          status: "unvalidated",
          remarks: "None",
        },
      },
      immunization: [],
    },
    vital: {
      vision: { left: 0, right: 0, status: VisionStatus.normal, remarks: "" },
      measurement: {
        bloodPressure: { systolic: 0, diastolic: 0, category: "" },
        heartRate: { status: PhysicalExamStatus.normal, value: 0 },
        respiratoryRate: { status: PhysicalExamStatus.normal, value: 0 },
        height: { value: 0, unit: MeasurementUnit.cm },
        weight: { value: 0, unit: MeasurementUnit.kg },
        bmi: { value: 0, status: "" },
        zscore: 0,
        length: 0,
        headCirc: 0,
        skinfoldThickness: 0,
        waist: 0,
        hip: 0,
        limbs: 0,
        temperature: { value: 0, unit: MeasurementUnit.celsius },
        midUpperArmCirc: 0,
        status: VisionStatus.normal,
      },
      misc: [],
      blood: {
        type: PersonBloodType.O,
        status: ReportStatus.pending,
        remarks: "",
      },
      status: ReportStatus.pending,
    },
    ncd: {
      Qid1_Yn: false,
      Qid2_Yn: false,
      Qid3_Yn: false,
      Qid4_Yn: false,
      Qid5_Yn: false,
      Qid6_Yn: false,
      Qid7_Yn: false,
      Qid8_Yn: false,
      Qid9_Yn: false,
      Qid10_Yn: false,
      Qid11_Yn: false,
      Qid12_Yn: false,
      Qid13_Yn: false,
      Qid14_Yn: false,
      Qid15_Yn: false,
      Qid16_Yn: false,
      Qid17_Abdc: "",
      Qid18_Yn: false,
      Qid19_Fbsmg: 0,
      Qid19_Fbsmmol: 0,
      Qid19_Fbsdate: new Date(),
      Qid20_Yn: false,
      Qid20_Choleval: 0,
      Qid20_Choledate: new Date(),
      Qid21_Yn: false,
      Qid21_Ketonval: "",
      Qid21_Ketondate: new Date(),
      Qid22_Yn: false,
      Qid22_Proteinval: "",
      Qid22_Proteindate: new Date(),
      Qid23_Yn: false,
      Qid24_Yn: false,
      status: "validated",
      remarks: "",
    },
  });

  // Filter tabs based on selected view
  const filteredTabs = TAB.PATIENT_PORTAL.ENCOUNTER.filter(
    (tab) => tab.category === selectedView.toLowerCase()
  );

  // Reset active tab when view changes
  useMemo(() => {
    if (filteredTabs.length > 0) {
      setActiveTab(filteredTabs[0].id);
    } else {
      setActiveTab("");
    }
  }, [selectedView]);

  const handleCreateQueue = async (payload: any) => {
    try {
      await queuingService.create(payload);
      await refetchQueues(); // ✅ refresh queues after creating one
      toast({
        title: "Queue created",
        description: "The queue has been successfully created.",
      });
    } catch (error) {
      console.error("Failed to create queue", error);
      toast({
        title: "Error",
        description: "Failed to create queue. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4">
      {/* Tabs */}
      <p className="bg-blue-500 text-white text-xs py-2 px-4 rounded-r-full w-fit mb-4">
        Transaction No:{" "}
        <span className="font-semibold">
          {encounter?.transactionNo || "N/A"}
        </span>
      </p>
      <div className="flex gap-6 border-b">
        {filteredTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-2 text-sm font-medium ${
              activeTab === tab.id
                ? "border-b-2 border-blue-700 text-blue-700"
                : "text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-4 flex flex-col gap-4 overflow-y-auto h-[calc(90vh-180px)]">
        {selectedView === "Queue" ? (
          <>
            {activeTab === "queue_create" && (
              <div>
                <CreateQueuePage
                  counters={counters}
                  patientId={member?.person?.id}
                  userId={member?.id}
                  facilityId={facilityId}
                  onCreate={async (payload) => {
                    handleCreateQueue(payload);
                  }}
                />
              </div>
            )}
          </>
        ) : selectedView === "Interview" ? (
          <div className="bg-white shadow rounded-lg p-6">
            {activeTab === "interview_review_of_systems" && (
              <ReviewOfSystemsSection
                encounterForm={encounterForm}
                setEncounterForm={setEncounterForm}
                isFemale={true}
              />
            )}
            {activeTab === "interview_medical_history" && (
              <MedicalHistorySection
                encounterForm={encounterForm}
                setEncounterForm={setEncounterForm}
              />
            )}

            {activeTab === "interview_social_history" && (
              <SocialHistorySection
                encounterForm={encounterForm}
                setEncounterForm={setEncounterForm}
              />
            )}
            {activeTab === "interview_ob_gyne_history" && (
              <OBGyneHistorySection
                encounterForm={encounterForm}
                setEncounterForm={setEncounterForm}
              />
            )}

            {activeTab === "interview_immunizations" && (
              <ImmunizationSection
                encounterForm={encounterForm}
                setEncounterForm={setEncounterForm}
              />
            )}
            {activeTab === "interview_ncd" && (
              <NCDSection
                encounterForm={encounterForm}
                setEncounterForm={setEncounterForm}
              />
            )}
            {activeTab === "interview_surgical_history" && (
              <SurgicalHistorySection
                encounterForm={encounterForm}
                setEncounterForm={setEncounterForm}
              />
            )}
          </div>
        ) : selectedView === "Vitals" ? (
          <div className="bg-white shadow rounded-lg p-6">
            {activeTab === "vitals" && (
              <VitalsSection
                encounterForm={encounterForm}
                setEncounterForm={setEncounterForm}
              />
            )}
            {activeTab === "vitals_pertinent_findings" && (
              <PertinentFindingsSection
                encounterForm={encounterForm}
                setEncounterForm={setEncounterForm}
              />
            )}
            {/*         
            {activeTab === "vitals_laboratory_imaging" && (
              <LaboratoryImagingSection
                vitalsData={vitalsData}
                updateVitals={updateVitals}
              />
            )}
            {activeTab === "vitals_chd" && (
              <CHDSection vitalsData={vitalsData} updateVitals={updateVitals} />
            )}  */}
          </div>
        ) : selectedView === "Consultation" ? (
          <div className="bg-white shadow rounded-lg p-6">
            {activeTab === "consultation_chief_complaint" && (
              <ConsultationReviewOfSystemsSection
                encounterForm={encounterForm}
                setEncounterForm={setEncounterForm}
              />
            )}
            {/* 
            {activeTab === "consultation_physical_exam_findings" && (
              // <PhysicalExamFindingsSection
              //   consultationData={consultationData}
              //   updateConsultation={(data: any) => setvitalsData(data as any)}
              // />
            )}
            {activeTab === "consultation_diagnosis" && (
              // <DiagnosisSection
              //   consultationData={consultationData}
              //   updateConsultation={(data: any) => setvitalsData(data as any)}
              //   diagnosisSuggestions={diagnosisSuggestions} // Array of diagnosis suggestions
              //   medicationSuggestions={medicationSuggestions} // Array of medication suggestions
              // />
            )}
            {activeTab === "consultation_plan_management" && (
              <PlanManagementSection
                consultationData={consultationData}
                updateConsultation={(data: any) => setvitalsData(data as any)}
              />
            )} */}
          </div>
        ) : selectedView === "Laboratory" ? (
          <div className="bg-white shadow rounded-lg p-6">
            {/* {activeTab === "laboratory_diagnosis" && (
              <LaboratoryDiagnosisSection
                consultationData={consultationData}
                updateConsultation={(data: any) => setvitalsData(data as any)}
                diagnosisSuggestions={diagnosisSuggestions} // Array of diagnosis suggestions
              />
            )} */}
          </div>
        ) : selectedView === "Prescription" ? (
          <div className="bg-white shadow rounded-lg p-6">
            {/* {activeTab === "prescription_medications" && (
              <PrescriptionMedicationSection
                consultationData={consultationData}
                updateConsultation={(data: any) => setvitalsData(data as any)}
                medicationSuggestions={medicationSuggestions} // Array of medication suggestions
              />
            )} */}
          </div>
        ) : selectedView === "Documents" ? (
          <div className="bg-white shadow rounded-lg p-6">
            {activeTab === "documents_all" && (
              <AllDocumentsWrapper member={member} encounter={encounter} />
            )}

            {activeTab === "documents_xml_viewer" && <XMLViewerSection />}
          </div>
        ) : (
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-gray-600">{activeTab} content goes here...</p>
          </div>
        )}
      </div>
    </div>
  );
}
