import React from "react";
import type { EncounterForm } from "~/app/model/_encounter.model";
import PastMedicalHistorySection from "./past.medical.history.section";
import FamilyMedicalHistorySection from "./family.medical.history.section";

interface MedicalHistorySectionProps {
  encounterForm: EncounterForm;
  setEncounterForm: React.Dispatch<React.SetStateAction<EncounterForm>>;
}

export const MedicalHistorySection = ({
  encounterForm,
  setEncounterForm,
}: MedicalHistorySectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <PastMedicalHistorySection
        encounterForm={encounterForm}
        setEncounterForm={setEncounterForm}
      />
      <FamilyMedicalHistorySection
        encounterForm={encounterForm}
        setEncounterForm={setEncounterForm}
      />
    </div>
  );
};

export default MedicalHistorySection;
