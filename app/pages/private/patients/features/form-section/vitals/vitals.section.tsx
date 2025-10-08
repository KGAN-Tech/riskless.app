import React from "react";
import type { EncounterForm } from "~/app/model/_encounter.model";
import {
  MeasurementUnit,
  PersonBloodType,
  ReportStatus,
  VisionStatus,
  PhysicalExamStatus,
  type Vital,
} from "~/app/model/vitals.model";

// ✅ shadcn/ui imports
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/atoms/card";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/atoms/select";
import { Button } from "@/components/atoms/button";

interface VitalSectionProps {
  encounterForm: EncounterForm;
  setEncounterForm: React.Dispatch<React.SetStateAction<EncounterForm>>;
}

// Default factory for Vital object
const defaultVital = (): Vital => ({
  vision: { left: 0, right: 0, status: VisionStatus.normal, remarks: "" },
  measurement: {
    bloodPressure: { systolic: 0, diastolic: 0, category: "" },
    heartRate: { value: 0, status: PhysicalExamStatus.normal },
    respiratoryRate: { value: 0, status: PhysicalExamStatus.normal },
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
    midUpperArmCirc: 0,
    temperature: { value: 0, unit: MeasurementUnit.celsius },
    status: VisionStatus.normal,
  },
  misc: [],
  blood: { status: ReportStatus.pending },
  status: ReportStatus.pending,
});

const VitalsSection = ({
  encounterForm,
  setEncounterForm,
}: VitalSectionProps) => {
  const vital: Vital = encounterForm.vital ?? defaultVital();
  const measurement = vital.measurement!;

  const [systolic, setSystolic] = React.useState(
    measurement.bloodPressure?.systolic.toString() ?? ""
  );
  const [diastolic, setDiastolic] = React.useState(
    measurement.bloodPressure?.diastolic.toString() ?? ""
  );
  const [heartRate, setHeartRate] = React.useState(
    measurement.heartRate?.value?.toString() ?? ""
  );
  const [respRate, setRespRate] = React.useState(
    measurement.respiratoryRate?.value?.toString() ?? ""
  );
  const [temperature, setTemperature] = React.useState(
    measurement.temperature?.value?.toString() ?? ""
  );
  const [height, setHeight] = React.useState(
    measurement.height?.value?.toString() ?? ""
  );
  const [weight, setWeight] = React.useState(
    measurement.weight?.value?.toString() ?? ""
  );
  const [bmi, setBmi] = React.useState(
    measurement.bmi?.value?.toString() ?? ""
  );

  const updateMeasurement = (path: string[], value: number | string) => {
    setEncounterForm((prev) => {
      const updated: EncounterForm = {
        ...prev,
        vital: prev.vital ?? defaultVital(),
      };
      let current: any = updated.vital!.measurement!;
      for (let i = 0; i < path.length - 1; i++) {
        if (!current[path[i]]) current[path[i]] = {};
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return updated;
    });
  };

  const calculateBMI = () => {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const bmiValue = w / ((h / 100) * (h / 100));
      setBmi(bmiValue.toFixed(2));
      updateMeasurement(["bmi", "value"], bmiValue);
    }
  };

  return (
    <Card className="w-full p-0 border-none">
      <CardHeader>
        <CardTitle>Vitals</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blood Pressure */}
        <div>
          <Label>Blood Pressure</Label>
          <div className="flex items-center space-x-2">
            <Input
              variant="floating"
              label="Systolic"
              type="number"
              placeholder="Systolic"
              value={systolic}
              onChange={(e) => {
                setSystolic(e.target.value);
                updateMeasurement(
                  ["bloodPressure", "systolic"],
                  e.target.value === "" ? 0 : Number(e.target.value)
                );
              }}
            />
            <Input
              variant="floating"
              label="Diastolic"
              type="number"
              placeholder="Diastolic"
              value={diastolic}
              onChange={(e) => {
                setDiastolic(e.target.value);
                updateMeasurement(
                  ["bloodPressure", "diastolic"],
                  e.target.value === "" ? 0 : Number(e.target.value)
                );
              }}
            />
            <span className="text-sm">mmHg</span>
          </div>
        </div>

        {/* Heart Rate */}
        <div>
          <div className="flex items-center space-x-2">
            <Input
              variant="floating"
              label="Heart Rate"
              type="number"
              placeholder="Heart Rate"
              value={heartRate}
              onChange={(e) => {
                setHeartRate(e.target.value);
                updateMeasurement(
                  ["heartRate", "value"],
                  e.target.value === "" ? 0 : Number(e.target.value)
                );
              }}
            />
            <span className="text-sm">/min</span>
          </div>
        </div>

        {/* Respiratory Rate */}
        <div>
          <div className="flex items-center space-x-2">
            <Input
              variant="floating"
              label="Respiratory Rate"
              type="number"
              placeholder="Resp Rate"
              value={respRate}
              onChange={(e) => {
                setRespRate(e.target.value);
                updateMeasurement(
                  ["respiratoryRate", "value"],
                  e.target.value === "" ? 0 : Number(e.target.value)
                );
              }}
            />
            <span className="text-sm">/min</span>
          </div>
        </div>

        {/* Temperature */}
        <div>
          <div className="flex items-center space-x-2">
            <Input
              variant="floating"
              label="Temperature"
              type="number"
              placeholder="Temperature"
              value={temperature}
              onChange={(e) => {
                setTemperature(e.target.value);
                updateMeasurement(
                  ["temperature", "value"],
                  e.target.value === "" ? 0 : Number(e.target.value)
                );
              }}
            />
            <span className="text-sm">°C</span>
          </div>
        </div>

        {/* Height */}
        <div>
          <Input
            variant="floating"
            label="Height (cm)"
            type="number"
            value={height}
            onChange={(e) => {
              setHeight(e.target.value);
              updateMeasurement(
                ["height", "value"],
                e.target.value === "" ? 0 : Number(e.target.value)
              );
            }}
          />
        </div>

        {/* Weight */}
        <div>
          <Input
            variant="floating"
            label="Weight (kg)"
            type="number"
            value={weight}
            onChange={(e) => {
              setWeight(e.target.value);
              updateMeasurement(
                ["weight", "value"],
                e.target.value === "" ? 0 : Number(e.target.value)
              );
            }}
          />
        </div>

        {/* BMI */}
        <div>
          <Label>BMI</Label>
          <div className="flex items-center space-x-2">
            <Input value={bmi} readOnly />
            <Button type="button" onClick={calculateBMI} variant="outline">
              Calculate
            </Button>
          </div>
        </div>

        {/* Vision */}
        <div>
          <Label>Visual Acuity</Label>
          <div className="flex space-x-2">
            <Input
              variant="floating"
              label="Left Eye"
              type="number"
              placeholder="Left Eye"
              value={vital.vision?.left ?? 0}
              onChange={(e) =>
                setEncounterForm((prev) => ({
                  ...prev,
                  vital: {
                    ...prev.vital,
                    vision: {
                      ...prev.vital?.vision,
                      left: Number(e.target.value),
                      right: prev.vital?.vision?.right ?? 0,
                      status: prev.vital?.vision?.status ?? VisionStatus.normal,
                      remarks: prev.vital?.vision?.remarks ?? "",
                    },
                    measurement: prev.vital?.measurement,
                    misc: prev.vital?.misc ?? [],
                    blood: prev.vital?.blood,
                    status: prev.vital?.status ?? ReportStatus.pending,
                  },
                }))
              }
            />
            <Input
              variant="floating"
              label="Right Eye"
              type="number"
              placeholder="Right Eye"
              value={vital.vision?.right ?? 0}
              onChange={(e) =>
                setEncounterForm((prev) => ({
                  ...prev,
                  vital: {
                    ...prev.vital,
                    vision: {
                      ...prev.vital?.vision,
                      left: prev.vital?.vision?.left ?? 0,
                      right: Number(e.target.value),
                      status: prev.vital?.vision?.status ?? VisionStatus.normal,
                      remarks: prev.vital?.vision?.remarks ?? "",
                    },
                    measurement: prev.vital?.measurement,
                    misc: prev.vital?.misc ?? [],
                    blood: prev.vital?.blood,
                    status: prev.vital?.status ?? ReportStatus.pending,
                  },
                }))
              }
            />
          </div>
          <Select
            value={vital.vision?.status ?? VisionStatus.normal}
            onValueChange={(val) =>
              setEncounterForm((prev) => ({
                ...prev,
                vital: {
                  ...(prev.vital ?? defaultVital()),
                  vision: {
                    ...(prev.vital?.vision ?? { left: 0, right: 0 }),
                    status: val as VisionStatus,
                  },
                },
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              {Object.values(VisionStatus).map((val) => (
                <SelectItem key={val} value={val}>
                  {val}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pediatric Measurements */}
        {[
          ["Length", "length"],
          ["Head Circumference", "headCirc"],
          ["Skinfold Thickness", "skinfoldThickness"],
          ["Waist", "waist"],
          ["Hip", "hip"],
          ["Limbs", "limbs"],
          ["Mid-Upper Arm Circ.", "midUpperArmCirc"],
        ].map(([label, key]) => (
          <div key={key}>
            <Label>{label}</Label>
            <Input
              type="number"
              value={(measurement as any)[key] || ""}
              onChange={(e) =>
                updateMeasurement(
                  [key],
                  e.target.value === "" ? 0 : Number(e.target.value)
                )
              }
            />
          </div>
        ))}

        {/* Blood Type */}
        <div>
          <Label>Blood Type</Label>
          <Select
            value={vital.blood?.type ?? ""}
            onValueChange={(val) =>
              setEncounterForm((prev) => ({
                ...prev,
                vital: {
                  ...(prev.vital ?? defaultVital()),
                  blood: {
                    ...(prev.vital?.blood ?? { status: ReportStatus.pending }),
                    type: val as PersonBloodType,
                  },
                },
              }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Blood Type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PersonBloodType).map(([label, val]) => (
                <SelectItem key={val} value={val}>
                  {label.replace("_", "").toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default VitalsSection;
