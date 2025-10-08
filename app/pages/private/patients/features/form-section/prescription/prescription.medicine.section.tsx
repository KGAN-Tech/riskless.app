import AutocompleteInput from "~/app/pages/private/patients/components/form.field/auto.complete.input";

interface PrescriptionMedicationSectionProps {
  consultationData: any;
  updateConsultation: (path: string[], value: any) => void;
  medicationSuggestions: string[];
}

export const PrescriptionMedicationSection = ({
  consultationData,
  updateConsultation,
  medicationSuggestions,
}: PrescriptionMedicationSectionProps) => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-xl p-5 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Medications</h3>
        <div className="space-y-4">
          {consultationData.diagnosis.medications.map(
            (
              med: { name: string; quantity: string; remarks: string },
              index: number
            ) => (
              <div
                key={index}
                className="border rounded-lg p-4 space-y-3 bg-gray-50"
              >
                {/* Top row: med name + quantity + remove */}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <AutocompleteInput
                      value={med.name}
                      onChange={(val) => {
                        const updated = [
                          ...consultationData.diagnosis.medications,
                        ];
                        updated[index].name = val;
                        updateConsultation(
                          ["diagnosis", "medications"],
                          updated
                        );
                      }}
                      suggestions={medicationSuggestions}
                      placeholder={`Medication #${index + 1}`}
                    />
                  </div>
                  <input
                    type="text"
                    className="w-32 px-3 py-2 border rounded-lg text-sm"
                    placeholder="Quantity"
                    value={med.quantity}
                    onChange={(e) => {
                      const updated = [
                        ...consultationData.diagnosis.medications,
                      ];
                      updated[index].quantity = e.target.value;
                      updateConsultation(["diagnosis", "medications"], updated);
                    }}
                  />
                  <button
                    type="button"
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm hover:bg-red-200"
                    onClick={() => {
                      const updated =
                        consultationData.diagnosis.medications.filter(
                          (_: any, i: number) => i !== index
                        );
                      updateConsultation(["diagnosis", "medications"], updated);
                    }}
                  >
                    Remove
                  </button>
                </div>

                {/* Remarks textarea */}
                <textarea
                  className="w-full px-3 py-2 border rounded-lg min-h-[60px] text-sm"
                  placeholder="Remarks..."
                  value={med.remarks}
                  onChange={(e) => {
                    const updated = [...consultationData.diagnosis.medications];
                    updated[index].remarks = e.target.value;
                    updateConsultation(["diagnosis", "medications"], updated);
                  }}
                />
              </div>
            )
          )}

          {/* Add medication button */}
          <button
            type="button"
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200"
            onClick={() =>
              updateConsultation(
                ["diagnosis", "medications"],
                [
                  ...consultationData.diagnosis.medications,
                  { name: "", quantity: "", remarks: "" },
                ]
              )
            }
          >
            + Add Medication
          </button>
        </div>
      </div>
    </div>
  );
};
