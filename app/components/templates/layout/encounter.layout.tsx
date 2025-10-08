import React, { useState } from "react";
import { EncounterSidebar } from "~/app/components/organisms/encounter.sidebar";
import { EncounterTopBar } from "../../organisms/encounter/encounter.top.bar";
import { EncounterPatientProfileHeader } from "../../organisms/encounter/encounter.patient.profile.header";
import { HistoryModal } from "../../organisms/modal/history.modal";
import EkasEpressPrintableFormModal from "~/app/components/organisms/modal/ekas.epress.printable.form.modal";
import PrintableMedicalCertificateModal from "@/components/organisms/modal/medical.certificate.printable.form.modal";

// ---- Types ---- //
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
  initials: string;
  name: string;
  age: number | string;
  gender: string;
  bloodType: string;
  medicalAlerts?: string[];
}

interface EncounterLayoutProps {
  children: React.ReactNode;

  // Sidebar
  patients?: Patient[];
  onPatientsReorder?: (patients: Patient[]) => void;
  onServeNext?: () => void;
  onSkipPatient?: () => void;
  onRecallPatient?: () => void;
  currentPatientId?: string;

  // TopBar
  topBarTitle?: string;
  onBack?: () => void;
  providers?: string[];
  selectedProvider?: string;
  onProviderChange?: (provider: string) => void;
  time?: string;

  // ProfileHeader
  profileData?: ProfileData;
  queueLabel?: string;
  onMedicineClick?: () => void;
  onLabClick?: () => void;
  onCertificateClick?: () => void;
  profileCollapsed?: boolean;

  // ActionBar
  onCancel?: () => void;
  onSubmit?: () => void;
  cancelLabel?: string;
  submitLabel?: string;
  submitDisabled?: boolean;

  // Modal Data
  ekasRecord?: any;
  epressRecord?: any;
}

// ---- Layout Component ---- //
export const EncounterLayout: React.FC<EncounterLayoutProps> = ({
  children,

  // Sidebar
  patients = [],
  onPatientsReorder,
  onServeNext,
  onSkipPatient,
  onRecallPatient,
  currentPatientId,

  // TopBar
  topBarTitle = "Interview",
  onBack,
  providers,
  selectedProvider,
  onProviderChange,
  time,

  // ProfileHeader
  profileData,
  queueLabel,
  onMedicineClick,
  profileCollapsed,
}) => {
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showPrintableModal, setShowPrintableModal] = useState(false);
  const [currentModalType, setCurrentModalType] = useState<
    "ekas" | "epress" | "medcert" | null
  >("ekas");
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  // Open History Modal and set the type
  const onHistoryClick = () => {
    setShowHistoryModal(true); // Open history modal
    onMedicineClick?.(); // Call the optional callback
  };

  const handleClosePrintableModal = () => {
    setShowPrintableModal(false); // Close printable form modal
    setSelectedRecord(null); // Reset selected record
  };

  // When a record is selected in the History Modal, open the correct form modal
  const onSelectRecord = (type: "ekas" | "epress" | "medcert", record: any) => {
    setCurrentModalType(type); // Set the current modal type (ekas, epress, or medcert)
    setSelectedRecord(record); // Set the selected record to show in the modal
    setShowHistoryModal(false); // Close the history modal
    setShowPrintableModal(true); // Open the corresponding printable form modal
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50 overflow-hidden">
      <EncounterSidebar
        patients={patients}
        onPatientsReorder={onPatientsReorder || (() => {})}
        onServeNext={onServeNext || (() => {})}
        onSkipPatient={onSkipPatient || (() => {})}
        onRecallPatient={onRecallPatient || (() => {})}
        currentPatientId={currentPatientId}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <EncounterTopBar
          title={topBarTitle}
          onBack={onBack || (() => {})}
          providers={providers}
          selectedProvider={selectedProvider}
          onProviderChange={onProviderChange}
          time={time}
        />

        {profileData && (
          <EncounterPatientProfileHeader
            profileData={profileData}
            queueLabel={queueLabel}
            onHistoryClick={onHistoryClick} // Open history modal when clicked
            defaultCollapsed={profileCollapsed}
          />
        )}

        <div className="p-2">{children}</div>
      </main>

      {/* History Modal */}
      <HistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        onSelectRecord={onSelectRecord} // Handle record selection and open form modal
      />

      {/* Printable Form Modals */}
      <EkasEpressPrintableFormModal
        isOpen={showPrintableModal && currentModalType !== "medcert"} // Only show if it's 'ekas' or 'epress'
        onClose={handleClosePrintableModal}
        type={currentModalType}
        record={selectedRecord}
      />

      <PrintableMedicalCertificateModal
        isOpen={showPrintableModal && currentModalType === "medcert"} // Show only if it's 'medcert'
        onClose={handleClosePrintableModal}
        record={selectedRecord}
      />
    </div>
  );
};
