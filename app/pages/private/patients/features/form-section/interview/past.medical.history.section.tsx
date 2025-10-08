import React from "react";
import { Input, Textarea } from "~/app/components/atoms/input";
import { LIBRARY } from "~/app/configuration/const.config";
import type { EncounterForm } from "~/app/model/_encounter.model";
import type {
  DiseaseHistory,
  PhysicalExamStatus,
  Remarks,
  ReportStatus,
} from "~/app/model/interview.model";

interface PastMedicalHistorySectionProps {
  encounterForm: EncounterForm;
  setEncounterForm: React.Dispatch<React.SetStateAction<EncounterForm>>;
}

const PastMedicalHistorySection = ({
  encounterForm,
  setEncounterForm,
}: PastMedicalHistorySectionProps) => {
  const pastMedicalHistoryData: DiseaseHistory[] =
    encounterForm.interview?.history?.medicalSpecific ?? [];

  const handleToggleCondition = (key: string, checked: boolean) => {
    if (checked) {
      // ✅ Add condition if not already exists
      const alreadyExists = pastMedicalHistoryData.some(
        (d) => d.diseaseCode === key
      );
      if (alreadyExists) return;

      const newCondition: DiseaseHistory = {
        diseaseCode: key,
        details: {},
        surgicalDate: new Date(),
        status: "unvalidated" as ReportStatus,
        remarks: { value: "", type: "default" }, // ✅ type is literal
        tag: "initial" as PhysicalExamStatus,
      };

      setEncounterForm((prev) => {
        const updated: EncounterForm = structuredClone(prev);
        if (!updated.interview?.history?.medicalSpecific) {
          updated.interview!.history!.medicalSpecific = [];
        }
        updated.interview!.history!.medicalSpecific.push(newCondition);
        return updated;
      });
    } else {
      // ❌ Remove condition
      setEncounterForm((prev) => {
        const updated: EncounterForm = structuredClone(prev);
        if (updated.interview?.history?.medicalSpecific) {
          updated.interview.history.medicalSpecific =
            updated.interview.history.medicalSpecific.filter(
              (d) => d.diseaseCode !== key
            );
        }
        return updated;
      });
    }
  };

  const handleUpdateRemarks = (key: string, value: string) => {
    setEncounterForm((prev) => {
      const updated: EncounterForm = structuredClone(prev);
      if (updated.interview?.history?.medicalSpecific) {
        updated.interview.history.medicalSpecific =
          updated.interview.history.medicalSpecific.map((d) =>
            d.diseaseCode === key
              ? { ...d, remarks: { value: value ?? "", type: "default" } }
              : d
          );
      }
      return updated;
    });
  };

  const handleDetails = (key: string, field: string, value: string) => {
    setEncounterForm((prev) => {
      const updated: EncounterForm = structuredClone(prev);
      if (updated.interview?.history?.medicalSpecific) {
        updated.interview.history.medicalSpecific =
          updated.interview.history.medicalSpecific.map((d) =>
            d.diseaseCode === key
              ? {
                  ...d,
                  details: {
                    ...d.details,
                    [field]: value ?? "",
                  },
                }
              : d
          );
      }
      return updated;
    });
  };

  return (
    <div className="mb-8">
      {/* Header */}
      <h3 className="text-xl font-bold text-gray-800 border-b pb-2 mb-4">
        Past Medical History
      </h3>

      {/* Checkbox list */}
      <div className="space-y-4">
        {LIBRARY.MEDICAL_HISTORY.map((condition) => {
          const isChecked = pastMedicalHistoryData.some(
            (d) => d.diseaseCode === condition.key
          );
          const entry = pastMedicalHistoryData.find(
            (d) => d.diseaseCode === condition.key
          );

          return (
            <div
              key={condition.key}
              className="border rounded-xl p-4 bg-white shadow-sm"
            >
              {/* Checkbox */}
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={(e) =>
                    handleToggleCondition(condition.key, e.target.checked)
                  }
                />
                <span className="font-medium text-gray-800">
                  {condition.label}
                </span>
              </label>

              {/* Show fields + remarks if checked */}
              {isChecked && entry && (
                <div className="mt-3 space-y-3">
                  {/* Dynamic fields */}
                  {condition.details?.fields?.length ? (
                    condition.details.metadata?.type === "fraction" &&
                    condition.details.fields.length >= 2 ? (
                      <div>
                        <div className="flex items-center space-x-2">
                          <Input
                            variant="floating"
                            type={condition.details.fields[0].type}
                            placeholder={condition.details.fields[0].label}
                            label={condition.details.fields[0].label}
                            value={
                              entry.details?.[
                                condition.details.fields[0].field
                              ] ?? ""
                            }
                            onChange={(e) =>
                              handleDetails(
                                entry.diseaseCode ?? "",
                                condition.details.fields[0].field ?? "",
                                e.target.value
                              )
                            }
                          />
                          <span>/</span>
                          <Input
                            variant="floating"
                            type={condition.details.fields[1].type}
                            label={condition.details.fields[1].label}
                            placeholder={condition.details.fields[1].label}
                            value={
                              entry.details?.[
                                condition.details.fields[1].field
                              ] ?? ""
                            }
                            onChange={(e) =>
                              handleDetails(
                                entry.diseaseCode ?? "",
                                condition.details.fields[1].field ?? "",
                                e.target.value
                              )
                            }
                          />
                          {condition.details.metadata?.unit && (
                            <span className="ml-2 text-sm text-gray-600">
                              {condition.details.metadata.unit}
                            </span>
                          )}
                        </div>
                      </div>
                    ) : (
                      condition.details.fields.map((detail) => (
                        <div key={detail.key}>
                          <Input
                            variant="floating"
                            type={detail.type}
                            label={detail.label}
                            placeholder={detail.label}
                            className="w-full border rounded-lg p-2 text-sm"
                            value={entry.details?.[detail.field] ?? ""}
                            onChange={(e) =>
                              handleDetails(
                                entry.diseaseCode ?? "",
                                detail.field ?? "",
                                e.target.value
                              )
                            }
                          />
                          {condition.details.metadata?.unit && (
                            <span className="ml-2 text-sm text-gray-600">
                              {condition.details.metadata.unit}
                            </span>
                          )}
                        </div>
                      ))
                    )
                  ) : null}

                  {/* Remarks */}
                  <div>
                    <Textarea
                      variant="floating"
                      label="Remarks (if any)"
                      className="w-full border rounded-lg p-2 text-sm"
                      placeholder="Enter remarks..."
                      value={entry.remarks?.value ?? ""}
                      onChange={(e) =>
                        handleUpdateRemarks(
                          entry?.diseaseCode ?? "",
                          e.target.value
                        )
                      }
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PastMedicalHistorySection;
