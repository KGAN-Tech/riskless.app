import React from "react";
import { Input, Textarea } from "~/app/components/atoms/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/atoms/card";
import { Button } from "@/components/atoms/button";
import type { EncounterForm } from "~/app/model/_encounter.model";
import {
  type DiseaseHistory,
  type ReportStatus,
  type Remarks,
  PhysicalExamStatus,
} from "~/app/model/interview.model";

interface SurgicalHistorySectionProps {
  encounterForm: EncounterForm;
  setEncounterForm: React.Dispatch<React.SetStateAction<EncounterForm>>;
}

export const SurgicalHistorySection = ({
  encounterForm,
  setEncounterForm,
}: SurgicalHistorySectionProps) => {
  const surgical = encounterForm.interview?.history.surgical ?? [];

  const handleChange = (
    index: number,
    field: keyof DiseaseHistory,
    value: any
  ) => {
    setEncounterForm((prev) => {
      if (!prev.interview) return prev;
      const updated = [...(prev.interview.history.surgical || [])];
      updated[index] = { ...updated[index], [field]: value };
      return {
        ...prev,
        interview: {
          ...prev.interview,
          history: {
            ...prev.interview.history,
            surgical: updated,
          },
        },
      };
    });
  };

  const addSurgery = () => {
    const newSurgery: DiseaseHistory = {
      diseaseCode: "",
      description: "",
      details: "",
      surgicalDate: new Date(),
      status: "unvalidated" as ReportStatus,
      remarks: { value: "", type: "default" },
      tag: PhysicalExamStatus.initial,
    };
    setEncounterForm((prev) => {
      if (!prev.interview) return prev;
      return {
        ...prev,
        interview: {
          ...prev.interview,
          history: {
            ...prev.interview.history,
            surgical: [...(prev.interview.history.surgical || []), newSurgery],
          },
        },
      };
    });
  };

  const removeSurgery = (index: number) => {
    setEncounterForm((prev) => {
      if (!prev.interview) return prev;
      const updated = [...(prev.interview.history.surgical || [])];
      updated.splice(index, 1);
      return {
        ...prev,
        interview: {
          ...prev.interview,
          history: {
            ...prev.interview.history,
            surgical: updated,
          },
        },
      };
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">🩺 Surgical History</h3>

      {surgical.length === 0 && (
        <p className="text-muted-foreground text-sm">
          No surgical history added yet. Click <strong>Add Surgery</strong> to
          start.
        </p>
      )}

      {surgical.map((surg, index) => (
        <Card key={index} className="shadow-sm border rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Surgery {index + 1}</CardTitle>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => removeSurgery(index)}
            >
              Remove
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Disease Code"
                variant="floating"
                type="text"
                placeholder="Disease Code"
                value={surg.diseaseCode ?? ""}
                onChange={(e) =>
                  handleChange(index, "diseaseCode", e.target.value)
                }
              />
              <Input
                label="Description"
                variant="floating"
                type="text"
                placeholder="Description"
                value={surg.description ?? ""}
                onChange={(e) =>
                  handleChange(index, "description", e.target.value)
                }
              />
              <Input
                label="Date of Surgery"
                variant="floating"
                type="date"
                value={
                  surg.surgicalDate
                    ? new Date(surg.surgicalDate).toISOString().substring(0, 10)
                    : ""
                }
                onChange={(e) =>
                  handleChange(index, "surgicalDate", new Date(e.target.value))
                }
              />
              <div className="flex flex-col">
                <select
                  className="border rounded-md px-2 py-2 text-sm"
                  value={surg.tag ?? PhysicalExamStatus.initial}
                  onChange={(e) =>
                    handleChange(
                      index,
                      "tag",
                      e.target.value as PhysicalExamStatus
                    )
                  }
                >
                  <option value="initial">Initial</option>
                  <option value="specific">Specific</option>
                </select>
              </div>
            </div>

            <Textarea
              label="Remarks"
              variant="floating"
              placeholder="Remarks"
              className="mt-4"
              value={surg.remarks?.value ?? ""}
              onChange={(e) =>
                handleChange(index, "remarks", {
                  ...surg.remarks,
                  value: e.target.value,
                } as Remarks)
              }
            />
          </CardContent>
        </Card>
      ))}

      <Button variant="outline" onClick={addSurgery}>
        ➕ Add Surgery
      </Button>
    </div>
  );
};

export default SurgicalHistorySection;
