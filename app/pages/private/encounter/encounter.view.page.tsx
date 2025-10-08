import { useEncounter } from "~/app/hooks/use.encounter";
import PatientRecord from "../patients/patient.records";

interface EncounterViewPageProps {
  currentPatientId?: string | null;
  patientData?: any; // Optional patient data from queue
}
export const EcounterViewPage = ({
  currentPatientId,
  patientData,
}: EncounterViewPageProps) => {
  const {
    activePage,
    selectedView,
    setSelectedView,
    handleSelectPage,
    member,
    memberLoading,
    encounters,
    encountersLoading,
    selectedEncounter,
    encounterLoading,
    getUserData,
    memberError,
    encountersError,
    encounterError,
  } = useEncounter(currentPatientId as string, patientData);

  return (
    <div className="space-y-6">
      {" "}
      <PatientRecord
        activePage={activePage}
        selectedView={selectedView}
        setSelectedView={setSelectedView}
        handleSelectPage={handleSelectPage}
        member={member}
        memberLoading={memberLoading}
        encounters={encounters}
        encountersLoading={encountersLoading}
        selectedEncounter={selectedEncounter}
        encounterLoading={encounterLoading}
        getUserData={getUserData}
        memberError={memberError}
        encountersError={encountersError}
        encounterError={encounterError}
      />
    </div>
  );
};
