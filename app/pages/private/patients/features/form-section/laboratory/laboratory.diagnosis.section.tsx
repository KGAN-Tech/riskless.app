import React from "react";
import AutocompleteInput from "~/app/pages/private/patients/components/form.field/auto.complete.input";

interface LaboratoryDiagnosisSectionProps {
  consultationData: any;
  updateConsultation: (path: string[], value: any) => void;
  diagnosisSuggestions: string[];
}

export const LaboratoryDiagnosisSection: React.FC<
  LaboratoryDiagnosisSectionProps
> = ({ consultationData, updateConsultation, diagnosisSuggestions }) => {
  return (
    <div className="space-y-6">
      {/* Diagnosis Section */}
      <div className="bg-white shadow rounded-xl p-5 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800">Diagnosis</h3>
        <div className="space-y-4">
          {consultationData.diagnosis.entries.map(
            (entry: { value: string; notes: string }, index: number) => (
              <div
                key={index}
                className="relative border rounded-lg p-4 bg-gray-50 space-y-3"
              >
                {/* Remove button */}
                <button
                  type="button"
                  className="absolute top-2 right-2 px-2 py-1 bg-red-100 text-red-700 rounded-md text-xs hover:bg-red-200"
                  onClick={() => {
                    const updated = consultationData.diagnosis.entries.filter(
                      (_: any, i: number) => i !== index
                    );
                    updateConsultation(["diagnosis", "entries"], updated);
                  }}
                >
                  Remove
                </button>

                {/* Diagnosis input */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diagnosis {index + 1}
                  </label>
                  <AutocompleteInput
                    value={entry.value}
                    onChange={(val) => {
                      const updated = [...consultationData.diagnosis.entries];
                      updated[index] = { ...updated[index], value: val };
                      updateConsultation(["diagnosis", "entries"], updated);
                    }}
                    suggestions={diagnosisSuggestions}
                    placeholder="Enter diagnosis..."
                  />
                </div>

                {/* Notes textarea */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border rounded-lg min-h-[70px] text-sm"
                    placeholder="Notes for this diagnosis..."
                    value={entry.notes}
                    onChange={(e) => {
                      const updated = [...consultationData.diagnosis.entries];
                      updated[index].notes = e.target.value;
                      updateConsultation(["diagnosis", "entries"], updated);
                    }}
                  />
                </div>
              </div>
            )
          )}

          {/* Add button */}
          <button
            type="button"
            className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200"
            onClick={() =>
              updateConsultation(
                ["diagnosis", "entries"],
                [
                  ...consultationData.diagnosis.entries,
                  { value: "", notes: "" },
                ]
              )
            }
          >
            + Add Diagnosis
          </button>
        </div>
      </div>
    </div>
  );
};
