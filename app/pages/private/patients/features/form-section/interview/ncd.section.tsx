import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/atoms/card";
import { Label } from "@/components/atoms/label";
import { Input } from "@/components/atoms/input";
import { RadioGroup, RadioGroupItem } from "@/components/atoms/radio-group";
import { Checkbox } from "@/components/atoms/checkbox";
import type { EncounterForm } from "~/app/model/_encounter.model";

interface NCDProps {
  encounterForm: EncounterForm;
  setEncounterForm: React.Dispatch<React.SetStateAction<EncounterForm>>;
}

export const NCDSection = ({ encounterForm, setEncounterForm }: NCDProps) => {
  const handleChange = <K extends keyof NonNullable<EncounterForm["ncd"]>>(
    key: K,
    value: NonNullable<EncounterForm["ncd"]>[K]
  ) => {
    setEncounterForm((prev) => ({
      ...prev,
      ncd: {
        ...prev.ncd!,
        [key]: value,
      },
    }));
  };

  /** Reusable Yes/No radio group */
  const YesNoRadio = (key: keyof NonNullable<EncounterForm["ncd"]>) => (
    <RadioGroup
      value={
        encounterForm.ncd?.[key] === true
          ? "yes"
          : encounterForm.ncd?.[key] === false
          ? "no"
          : undefined
      }
      onValueChange={(val) => handleChange(key, val === "yes")}
      className="flex gap-4"
    >
      <div className="flex items-center gap-2">
        <RadioGroupItem value="yes" id={`${String(key)}-yes`} />
        <Label htmlFor={`${String(key)}-yes`}>Yes</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem value="no" id={`${String(key)}-no`} />
        <Label htmlFor={`${String(key)}-no`}>No</Label>
      </div>
    </RadioGroup>
  );

  return (
    <Card className="p-0 border-none">
      <CardHeader>
        <CardTitle className="font-semibold">
          NCD High-Risk Assessment (25+ years)
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Food Intake */}
        <div>
          <Label>Eats processed/fast foods weekly</Label>
          {YesNoRadio("Qid1_Yn")}
        </div>

        {/* Fiber Intake */}
        <div className="grid gap-6">
          <div>
            <Label>3 Servings vegetables daily</Label>
            {YesNoRadio("Qid2_Yn")}
          </div>
          <div>
            <Label>2–3 Servings of fruits daily</Label>
            {YesNoRadio("Qid3_Yn")}
          </div>
        </div>

        {/* Physical Activity */}
        <div>
          <Label>
            At least 2.5 hours/week moderate-intensity physical activity
          </Label>
          {YesNoRadio("Qid4_Yn")}
        </div>

        {/* Diabetes */}
        <div>
          <Label>Was patient diagnosed as having diabetes?</Label>
          {YesNoRadio("Qid5_Yn")}
        </div>

        {encounterForm.ncd?.Qid5_Yn === true && (
          <div className="ml-4">
            <Label>If Yes:</Label>
            {YesNoRadio("Qid6_Yn")}
          </div>
        )}

        {encounterForm.ncd?.Qid5_Yn === false && (
          <div className="ml-4 space-y-2">
            <Label>Does patient have the following symptoms?</Label>
            {["Polyphagia", "Polydipsia", "Polyuria"].map((symptom, idx) => {
              const key = `Qid${7 + idx}_Yn` as keyof NonNullable<
                EncounterForm["ncd"]
              >;
              return (
                <div key={symptom} className="flex items-center gap-2">
                  <Checkbox
                    checked={Boolean(encounterForm.ncd?.[key])}
                    onCheckedChange={(val) => handleChange(key, val)}
                    id={String(key)}
                  />

                  <Label htmlFor={String(key)}>{symptom}</Label>
                </div>
              );
            })}
          </div>
        )}

        {/* Raised Blood Glucose */}
        <div className="space-y-2">
          <Label>Raised Blood Glucose</Label>
          {YesNoRadio("Qid10_Yn")}
          <div className="grid grid-cols-3 gap-4">
            <Input
              type="number"
              placeholder="FBS/RBS mg/dL"
              value={encounterForm.ncd?.Qid19_Fbsmg || ""}
              onChange={(e) =>
                handleChange("Qid19_Fbsmg", Number(e.target.value))
              }
            />
            <Input
              type="number"
              placeholder="mmol/L"
              value={encounterForm.ncd?.Qid19_Fbsmmol || ""}
              onChange={(e) =>
                handleChange("Qid19_Fbsmmol", Number(e.target.value))
              }
            />
            <Input
              type="date"
              value={
                encounterForm.ncd?.Qid19_Fbsdate
                  ? new Date(encounterForm.ncd.Qid19_Fbsdate)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleChange("Qid19_Fbsdate", new Date(e.target.value))
              }
            />
          </div>
        </div>

        {/* Raised Blood Lipids */}
        <div className="space-y-2">
          <Label>Raised Blood Lipids</Label>
          {YesNoRadio("Qid20_Yn")}
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="number"
              placeholder="Total Cholesterol"
              value={encounterForm.ncd?.Qid20_Choleval || ""}
              onChange={(e) =>
                handleChange("Qid20_Choleval", Number(e.target.value))
              }
            />
            <Input
              type="date"
              value={
                encounterForm.ncd?.Qid20_Choledate
                  ? new Date(encounterForm.ncd.Qid20_Choledate)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleChange("Qid20_Choledate", new Date(e.target.value))
              }
            />
          </div>
        </div>

        {/* Urine Ketones */}
        <div className="space-y-2">
          <Label>Presence of Urine Ketones</Label>
          {YesNoRadio("Qid21_Yn")}
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Urine Ketone"
              value={encounterForm.ncd?.Qid21_Ketonval || ""}
              onChange={(e) => handleChange("Qid21_Ketonval", e.target.value)}
            />
            <Input
              type="date"
              value={
                encounterForm.ncd?.Qid21_Ketondate
                  ? new Date(encounterForm.ncd.Qid21_Ketondate)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleChange("Qid21_Ketondate", new Date(e.target.value))
              }
            />
          </div>
        </div>

        {/* Urine Protein */}
        <div className="space-y-2">
          <Label>Presence of Urine Protein</Label>
          {YesNoRadio("Qid22_Yn")}
          <div className="grid grid-cols-2 gap-4">
            <Input
              type="text"
              placeholder="Urine Protein"
              value={encounterForm.ncd?.Qid22_Proteinval || ""}
              onChange={(e) => handleChange("Qid22_Proteinval", e.target.value)}
            />
            <Input
              type="date"
              value={
                encounterForm.ncd?.Qid22_Proteindate
                  ? new Date(encounterForm.ncd.Qid22_Proteindate)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              onChange={(e) =>
                handleChange("Qid22_Proteindate", new Date(e.target.value))
              }
            />
          </div>
        </div>

        {/* Angina / Heart Attack / Stroke */}
        <div className="space-y-2">
          <Label>Questionnaire for Angina/Heart Attack/Stroke</Label>
          {[
            "Had pain/discomfort in chest?",
            "Pain in center chest or left arm?",
            "Pain when walking uphill or hurrying?",
            "Pain slows down when walking?",
            "Pain goes away if standing still or with tablet?",
            "Pain goes away in less than 10 minutes?",
          ].map((q, i) => {
            const key = `Qid${11 + i}_Yn` as keyof NonNullable<
              EncounterForm["ncd"]
            >;
            return (
              <div key={i}>
                <Label>
                  {i + 1}. {q}
                </Label>
                {YesNoRadio(key)}
              </div>
            );
          })}

          <div>
            <Label>7. Severe chest pain lasting half an hour or more?</Label>
            <Input
              type="text"
              placeholder="Describe"
              value={encounterForm.ncd?.Qid17_Abdc || ""}
              onChange={(e) => handleChange("Qid17_Abdc", e.target.value)}
            />
          </div>
        </div>

        {/* Stroke and TIA */}
        <div className="space-y-2">
          <Label>Stroke and TIA (Transient Ischemic Attack)</Label>
          {YesNoRadio("Qid18_Yn")}
          <div>
            <Label>8. Difficulty talking, weakness/numbness one side?</Label>
            {YesNoRadio("Qid23_Yn")}
          </div>
        </div>

        {/* Risk Level */}
        <div className="space-y-2">
          <Label>Risk Level</Label>
          <RadioGroup
            value={encounterForm.ncd?.Qid24_Yn ? "≥40%" : undefined}
            onValueChange={(val) => handleChange("Qid24_Yn", val === "≥40%")}
            className="flex gap-4"
          >
            {["<10%", "10% to <20%", "20% to <30%", "30% to <40%", "≥40%"].map(
              (level) => (
                <div key={level} className="flex items-center gap-2">
                  <RadioGroupItem value={level} id={`risk-${level}`} />
                  <Label htmlFor={`risk-${level}`}>{level}</Label>
                </div>
              )
            )}
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};
