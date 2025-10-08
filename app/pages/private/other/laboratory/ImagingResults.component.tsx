import { useState } from "react";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { RadioGroup, RadioGroupItem } from "~/app/components/atoms/radio-group";
import { Button } from "@/components/atoms/button";

interface TestResult {
  status: "Done" | "Not yet done" | "Deferred" | "Waived";
  facilityType: "within" | "accredited";
  facilityName: string;
  date: string;
  fee: string;
}

interface CBCResult extends TestResult {
  hematocrit: string;
  hemoglobinMgdl: string;
  hemoglobinMmol: string;
  mhc: string;
  mhch: string;
  mcv: string;
  wbc: string;
  myelocyte: string;
  neutrophilsBands: string;
  neutrophilsSegments: string;
  lymphocytes: string;
  monocytes: string;
  eosinophils: string;
  basophils: string;
  platelets: string;
}

interface ChestXRayResult extends TestResult {
  observation: string;
  observationDetails: string;
  findings: string;
  remarks: string;
}

interface CreatinineResult extends TestResult {
  result: string;
}

interface FastingBloodSugarResult extends TestResult {
  glucoseMgdl: string;
  glucoseMmol: string;
}

interface FecalysisResult extends TestResult {
  color: string;
  consistency: string;
  pusCells: string;
  rbc: string;
  wbc: string;
  ova: string;
  parasite: string;
  blood: string;
  occultBlood: string;
}

interface FecalOccultBloodResult extends TestResult {
  result: "Positive" | "Negative";
}

interface HbA1cResult extends TestResult {
  result: string;
}

interface LipidProfileResult extends TestResult {
  ldlCholesterol: string;
  hdlCholesterol: string;
  totalCholesterol: string;
  triglycerides: string;
}

interface OGTTResult extends TestResult {
  fastingMgdl: string;
  fastingMmol: string;
  oneHourMgdl: string;
  oneHourMmol: string;
  twoHourMgdl: string;
  twoHourMmol: string;
}

interface PapSmearResult extends TestResult {
  findings: string;
  impression: string;
}

interface PPDResult extends TestResult {
  result: "Positive" | "Negative";
}

interface SputumMicroscopyResult extends TestResult {
  labResults: "Essentially Normal" | "With Findings";
  findings: string;
  numberOfPlusses: string;
}

interface UrinalysisResult extends TestResult {
  specificGravity: string;
  appearance: string;
  color: string;
  glucose: string;
  proteins: string;
  ketones: string;
  ph: string;
  pusCells: string;
  albumin: string;
  redBloodCells: string;
  whiteBloodCells: string;
  bacteria: string;
  crystals: string;
  bladderCells: string;
  squamousCells: string;
  tubularCells: string;
  broadCasts: string;
  epithelialCellCasts: string;
  granularCasts: string;
  hyalineCasts: string;
  redBloodCellCasts: string;
  waxyCasts: string;
  whiteCellCasts: string;
}

const ImagingResults = () => {
  // Initialize all test results with default values
  const [cbcResult, setCbcResult] = useState<CBCResult>({
    status: "Not yet done",
    facilityType: "within",
    facilityName: "",
    date: "",
    fee: "",
    hematocrit: "",
    hemoglobinMgdl: "",
    hemoglobinMmol: "",
    mhc: "",
    mhch: "",
    mcv: "",
    wbc: "",
    myelocyte: "",
    neutrophilsBands: "",
    neutrophilsSegments: "",
    lymphocytes: "",
    monocytes: "",
    eosinophils: "",
    basophils: "",
    platelets: "",
  });

  const [chestXRayResult, setChestXRayResult] = useState<ChestXRayResult>({
    status: "Not yet done",
    facilityType: "within",
    facilityName: "",
    date: "",
    fee: "",
    observation: "",
    observationDetails: "",
    findings: "",
    remarks: "",
  });

  const [creatinineResult, setCreatinineResult] = useState<CreatinineResult>({
    status: "Not yet done",
    facilityType: "within",
    facilityName: "",
    date: "",
    fee: "",
    result: "",
  });

  const [fastingBloodSugarResult, setFastingBloodSugarResult] =
    useState<FastingBloodSugarResult>({
      status: "Not yet done",
      facilityType: "within",
      facilityName: "",
      date: "",
      fee: "",
      glucoseMgdl: "",
      glucoseMmol: "",
    });

  const [fecalysisResult, setFecalysisResult] = useState<FecalysisResult>({
    status: "Not yet done",
    facilityType: "within",
    facilityName: "",
    date: "",
    fee: "",
    color: "",
    consistency: "",
    pusCells: "",
    rbc: "",
    wbc: "",
    ova: "",
    parasite: "",
    blood: "",
    occultBlood: "",
  });

  const [fecalOccultBloodResult, setFecalOccultBloodResult] =
    useState<FecalOccultBloodResult>({
      status: "Not yet done",
      facilityType: "within",
      facilityName: "",
      date: "",
      fee: "",
      result: "Negative",
    });

  const [hbA1cResult, setHbA1cResult] = useState<HbA1cResult>({
    status: "Not yet done",
    facilityType: "within",
    facilityName: "",
    date: "",
    fee: "",
    result: "",
  });

  const [lipidProfileResult, setLipidProfileResult] =
    useState<LipidProfileResult>({
      status: "Not yet done",
      facilityType: "within",
      facilityName: "",
      date: "",
      fee: "",
      ldlCholesterol: "",
      hdlCholesterol: "",
      totalCholesterol: "",
      triglycerides: "",
    });

  const [ogttResult, setOgttResult] = useState<OGTTResult>({
    status: "Not yet done",
    facilityType: "within",
    facilityName: "",
    date: "",
    fee: "",
    fastingMgdl: "",
    fastingMmol: "",
    oneHourMgdl: "",
    oneHourMmol: "",
    twoHourMgdl: "",
    twoHourMmol: "",
  });

  const [papSmearResult, setPapSmearResult] = useState<PapSmearResult>({
    status: "Not yet done",
    facilityType: "within",
    facilityName: "",
    date: "",
    fee: "",
    findings: "",
    impression: "",
  });

  const [ppdResult, setPpdResult] = useState<PPDResult>({
    status: "Not yet done",
    facilityType: "within",
    facilityName: "",
    date: "",
    fee: "",
    result: "Negative",
  });

  const [sputumMicroscopyResult, setSputumMicroscopyResult] =
    useState<SputumMicroscopyResult>({
      status: "Not yet done",
      facilityType: "within",
      facilityName: "",
      date: "",
      fee: "",
      labResults: "Essentially Normal",
      findings: "",
      numberOfPlusses: "",
    });

  const [urinalysisResult, setUrinalysisResult] = useState<UrinalysisResult>({
    status: "Not yet done",
    facilityType: "within",
    facilityName: "",
    date: "",
    fee: "",
    specificGravity: "",
    appearance: "",
    color: "",
    glucose: "",
    proteins: "",
    ketones: "",
    ph: "",
    pusCells: "",
    albumin: "",
    redBloodCells: "",
    whiteBloodCells: "",
    bacteria: "",
    crystals: "",
    bladderCells: "",
    squamousCells: "",
    tubularCells: "",
    broadCasts: "",
    epithelialCellCasts: "",
    granularCasts: "",
    hyalineCasts: "",
    redBloodCellCasts: "",
    waxyCasts: "",
    whiteCellCasts: "",
  });

  const renderTestCard = (
    title: string,
    result: TestResult,
    setResult: React.Dispatch<React.SetStateAction<any>>,
    children: React.ReactNode
  ) => (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden mb-6 hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-4 flex items-center justify-between">
        <h3 className="text-lg font-bold">{title}</h3>
        <RadioGroup
          value={result.status}
          onValueChange={(
            value: "Done" | "Not yet done" | "Deferred" | "Waived"
          ) => setResult((prev: any) => ({ ...prev, status: value }))}
          className="flex space-x-4"
        >
          {["Done", "Not yet done", "Deferred", "Waived"].map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <RadioGroupItem
                value={status}
                id={`${title}-${status}`}
                className="text-gray-900 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 data-[state=checked]:ring-gray-900 focus:ring-gray-700 focus:border-gray-700"
              />
              <Label
                htmlFor={`${title}-${status}`}
                className="text-white text-sm font-medium cursor-pointer"
              >
                {status}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Common Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Laboratory/Image Done */}
          <div className="space-y-3">
            <Label className="block text-sm font-semibold text-gray-700">
              Laboratory/Image Done
            </Label>
            <RadioGroup
              value={result.facilityType}
              onValueChange={(value: "within" | "accredited") =>
                setResult((prev: any) => ({ ...prev, facilityType: value }))
              }
              className="space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="within"
                  id={`${title}-within`}
                  className="text-gray-900 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 data-[state=checked]:ring-gray-900 focus:ring-gray-700 focus:border-gray-700"
                />
                <Label htmlFor={`${title}-within`} className="text-sm">
                  within the facility
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="accredited"
                  id={`${title}-accredited`}
                  className="text-gray-900 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 data-[state=checked]:ring-gray-900 focus:ring-gray-700 focus:border-gray-700"
                />
                <Label htmlFor={`${title}-accredited`} className="text-sm">
                  in accredited Diagnostic Facilities
                </Label>
                {result.facilityType === "accredited" && (
                  <Input
                    type="text"
                    placeholder="NAME OF HEALTH CARE INSTITUTION"
                    value={result.facilityName}
                    onChange={(e) =>
                      setResult((prev: any) => ({
                        ...prev,
                        facilityName: e.target.value,
                      }))
                    }
                    className="ml-2 flex-1"
                  />
                )}
              </div>
            </RadioGroup>
          </div>

          {/* Date and Fee */}
          <div className="space-y-3">
            <div>
              <Label className="block text-sm font-semibold text-gray-700 mb-2">
                Date of Lab/Image
              </Label>
              <Input
                type="text"
                placeholder="MM/DD/YYYY"
                value={result.date}
                onChange={(e) =>
                  setResult((prev: any) => ({ ...prev, date: e.target.value }))
                }
                className="w-full"
              />
            </div>
            <div>
              <Label className="block text-sm font-semibold text-gray-700 mb-2">
                Laboratory/Imaging Fee
              </Label>
              <div className="flex items-center">
                <span className="text-gray-600 mr-2 font-medium">Php</span>
                <Input
                  type="text"
                  value={result.fee}
                  onChange={(e) =>
                    setResult((prev: any) => ({ ...prev, fee: e.target.value }))
                  }
                  className="flex-1"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Test-specific fields */}
        {children}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 p-4 max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Laboratory/Imaging Results
        </h2>
        <p className="text-gray-600">
          Enter detailed results for each laboratory test
        </p>
      </div>

      {/* CBC w/ platelet count */}
      {renderTestCard(
        "CBC w/ platelet count",
        cbcResult,
        setCbcResult,
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">
                Basic Parameters
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">
                    Hematocrit
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={cbcResult.hematocrit}
                      onChange={(e) =>
                        setCbcResult((prev) => ({
                          ...prev,
                          hematocrit: e.target.value,
                        }))
                      }
                      className="w-24"
                    />
                    <span className="text-gray-600 text-sm">%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">
                    Hemoglobin
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={cbcResult.hemoglobinMgdl}
                      onChange={(e) =>
                        setCbcResult((prev) => ({
                          ...prev,
                          hemoglobinMgdl: e.target.value,
                        }))
                      }
                      className="w-24"
                    />
                    <span className="text-gray-600 text-sm">g/dL</span>
                    <Input
                      type="text"
                      value={cbcResult.hemoglobinMmol}
                      onChange={(e) =>
                        setCbcResult((prev) => ({
                          ...prev,
                          hemoglobinMmol: e.target.value,
                        }))
                      }
                      className="w-24"
                    />
                    <span className="text-gray-600 text-sm">mmol/L</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">
                Differential Count
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">
                    Neutrophils (Segments)
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={cbcResult.neutrophilsSegments}
                      onChange={(e) =>
                        setCbcResult((prev) => ({
                          ...prev,
                          neutrophilsSegments: e.target.value,
                        }))
                      }
                      className="w-20"
                    />
                    <span className="text-gray-600 text-sm">%</span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">
                    Lymphocytes
                  </Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      value={cbcResult.lymphocytes}
                      onChange={(e) =>
                        setCbcResult((prev) => ({
                          ...prev,
                          lymphocytes: e.target.value,
                        }))
                      }
                      className="w-20"
                    />
                    <span className="text-gray-600 text-sm">%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chest X-Ray */}
      {renderTestCard(
        "Chest X-Ray",
        chestXRayResult,
        setChestXRayResult,
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">
                Results
              </h4>
              <div className="space-y-3">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Observation
                  </Label>
                  <Input
                    type="text"
                    placeholder="Select observation type"
                    value={chestXRayResult.observation}
                    onChange={(e) =>
                      setChestXRayResult((prev) => ({
                        ...prev,
                        observation: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Details
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter observation details"
                    value={chestXRayResult.observationDetails}
                    onChange={(e) =>
                      setChestXRayResult((prev) => ({
                        ...prev,
                        observationDetails: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">
                Findings
              </h4>
              <div className="space-y-3">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Findings
                  </Label>
                  <Input
                    type="text"
                    placeholder="Select findings"
                    value={chestXRayResult.findings}
                    onChange={(e) =>
                      setChestXRayResult((prev) => ({
                        ...prev,
                        findings: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">
                    Remarks
                  </Label>
                  <Input
                    type="text"
                    placeholder="Enter remarks"
                    value={chestXRayResult.remarks}
                    onChange={(e) =>
                      setChestXRayResult((prev) => ({
                        ...prev,
                        remarks: e.target.value,
                      }))
                    }
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Creatinine */}
      {renderTestCard(
        "Creatinine",
        creatinineResult,
        setCreatinineResult,
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold text-gray-700">Result</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={creatinineResult.result}
              onChange={(e) =>
                setCreatinineResult((prev) => ({
                  ...prev,
                  result: e.target.value,
                }))
              }
              className="w-32"
            />
            <span className="text-gray-600 font-medium">mg/dL</span>
          </div>
        </div>
      )}

      {/* Fasting Blood Sugar */}
      {renderTestCard(
        "Fasting Blood Sugar",
        fastingBloodSugarResult,
        setFastingBloodSugarResult,
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 border-b pb-2">Glucose</h4>
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold text-gray-700">
              Result
            </Label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={fastingBloodSugarResult.glucoseMgdl}
                  onChange={(e) =>
                    setFastingBloodSugarResult((prev) => ({
                      ...prev,
                      glucoseMgdl: e.target.value,
                    }))
                  }
                  className="w-24"
                />
                <span className="text-gray-600 font-medium">mg/dL</span>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={fastingBloodSugarResult.glucoseMmol}
                  onChange={(e) =>
                    setFastingBloodSugarResult((prev) => ({
                      ...prev,
                      glucoseMmol: e.target.value,
                    }))
                  }
                  className="w-24"
                />
                <span className="text-gray-600 font-medium">mmol/L</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fecalysis */}
      {renderTestCard(
        "Fecalysis",
        fecalysisResult,
        setFecalysisResult,
        <div className="space-y-6 sm:space-y-8">
          {/* Appearance Section */}
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-800 text-base sm:text-lg mb-3 sm:mb-4 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
              Appearance
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 block">
                  Color
                </Label>
                <Input
                  type="text"
                  placeholder="BROWN"
                  value={fecalysisResult.color}
                  onChange={(e) =>
                    setFecalysisResult((prev) => ({
                      ...prev,
                      color: e.target.value,
                    }))
                  }
                  className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700 block">
                  Consistency
                </Label>
                <Input
                  type="text"
                  placeholder="SOFT"
                  value={fecalysisResult.consistency}
                  onChange={(e) =>
                    setFecalysisResult((prev) => ({
                      ...prev,
                      consistency: e.target.value,
                    }))
                  }
                  className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
              <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                <Label className="text-sm font-medium text-gray-700 block">
                  Pus Cells
                </Label>
                <Input
                  type="text"
                  placeholder="0"
                  value={fecalysisResult.pusCells}
                  onChange={(e) =>
                    setFecalysisResult((prev) => ({
                      ...prev,
                      pusCells: e.target.value,
                    }))
                  }
                  className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                />
              </div>
            </div>
          </div>

          {/* Microscopic Section */}
          <div className="bg-gray-50 rounded-lg p-4 sm:p-6 border border-gray-200">
            <h4 className="font-semibold text-gray-800 text-base sm:text-lg mb-3 sm:mb-4 flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3 flex-shrink-0"></span>
              Microscopic Analysis
            </h4>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              {/* Left Column */}
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 block">
                    Red Blood Cells (RBC)
                  </Label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Input
                      type="text"
                      placeholder="0"
                      value={fecalysisResult.rbc}
                      onChange={(e) =>
                        setFecalysisResult((prev) => ({
                          ...prev,
                          rbc: e.target.value,
                        }))
                      }
                      className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                    />
                    <span className="text-gray-600 text-xs sm:text-sm font-medium bg-white px-2 py-2 rounded border text-center sm:text-left">
                      /hpf
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 block">
                    White Blood Cells (WBC)
                  </Label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                    <Input
                      type="text"
                      placeholder="0"
                      value={fecalysisResult.wbc}
                      onChange={(e) =>
                        setFecalysisResult((prev) => ({
                          ...prev,
                          wbc: e.target.value,
                        }))
                      }
                      className="flex-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                    />
                    <span className="text-gray-600 text-xs sm:text-sm font-medium bg-white px-2 py-2 rounded border text-center sm:text-left">
                      /hpf
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 block">
                    Ova
                  </Label>
                  <Input
                    type="text"
                    placeholder="-/-"
                    value={fecalysisResult.ova}
                    onChange={(e) =>
                      setFecalysisResult((prev) => ({
                        ...prev,
                        ova: e.target.value,
                      }))
                    }
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-3 sm:space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 block">
                    Parasite
                  </Label>
                  <Input
                    type="text"
                    placeholder="-/-"
                    value={fecalysisResult.parasite}
                    onChange={(e) =>
                      setFecalysisResult((prev) => ({
                        ...prev,
                        parasite: e.target.value,
                      }))
                    }
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 block">
                    Blood
                  </Label>
                  <Input
                    type="text"
                    placeholder="PRESENT"
                    value={fecalysisResult.blood}
                    onChange={(e) =>
                      setFecalysisResult((prev) => ({
                        ...prev,
                        blood: e.target.value,
                      }))
                    }
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700 block">
                    Occult Blood
                  </Label>
                  <Input
                    type="text"
                    placeholder="NEGATIVE"
                    value={fecalysisResult.occultBlood}
                    onChange={(e) =>
                      setFecalysisResult((prev) => ({
                        ...prev,
                        occultBlood: e.target.value,
                      }))
                    }
                    className="w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500 text-sm sm:text-base"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Fecal Occult Blood */}
      {renderTestCard(
        "Fecal Occult Blood",
        fecalOccultBloodResult,
        setFecalOccultBloodResult,
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold text-gray-700">Result</Label>
          <RadioGroup
            value={fecalOccultBloodResult.result}
            onValueChange={(value: "Positive" | "Negative") =>
              setFecalOccultBloodResult((prev) => ({ ...prev, result: value }))
            }
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="Positive"
                id="fob-positive"
                className="text-gray-900 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 data-[state=checked]:ring-gray-900 focus:ring-gray-700 focus:border-gray-700"
              />
              <Label htmlFor="fob-positive" className="text-sm font-medium">
                Positive
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="Negative"
                id="fob-negative"
                className="text-gray-900 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 data-[state=checked]:ring-gray-900 focus:ring-gray-700 focus:border-gray-700"
              />
              <Label htmlFor="fob-negative" className="text-sm font-medium">
                Negative
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}

      {/* HbA1c */}
      {renderTestCard(
        "HbA1c",
        hbA1cResult,
        setHbA1cResult,
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold text-gray-700">Result</Label>
          <div className="flex items-center space-x-2">
            <Input
              type="text"
              value={hbA1cResult.result}
              onChange={(e) =>
                setHbA1cResult((prev) => ({ ...prev, result: e.target.value }))
              }
              className="w-32"
            />
            <span className="text-gray-600 font-medium">mmol/mol</span>
          </div>
        </div>
      )}

      {/* Lipid Profile */}
      {renderTestCard(
        "Lipid Profile",
        lipidProfileResult,
        setLipidProfileResult,
        <div className="space-y-4">
          <h4 className="font-semibold text-gray-800 border-b pb-2">
            Lipid Measurements
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">
                LDL Cholesterol
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={lipidProfileResult.ldlCholesterol}
                  onChange={(e) =>
                    setLipidProfileResult((prev) => ({
                      ...prev,
                      ldlCholesterol: e.target.value,
                    }))
                  }
                  className="w-24"
                />
                <span className="text-gray-600 text-sm">mg/dL</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">
                HDL Cholesterol
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={lipidProfileResult.hdlCholesterol}
                  onChange={(e) =>
                    setLipidProfileResult((prev) => ({
                      ...prev,
                      hdlCholesterol: e.target.value,
                    }))
                  }
                  className="w-24"
                />
                <span className="text-gray-600 text-sm">mg/dL</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">
                Total Cholesterol
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={lipidProfileResult.totalCholesterol}
                  onChange={(e) =>
                    setLipidProfileResult((prev) => ({
                      ...prev,
                      totalCholesterol: e.target.value,
                    }))
                  }
                  className="w-24"
                />
                <span className="text-gray-600 text-sm">mg/dL</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium text-gray-700">
                Triglycerides
              </Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="text"
                  value={lipidProfileResult.triglycerides}
                  onChange={(e) =>
                    setLipidProfileResult((prev) => ({
                      ...prev,
                      triglycerides: e.target.value,
                    }))
                  }
                  className="w-24"
                />
                <span className="text-gray-600 text-sm">mg/dL</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PPD Test */}
      {renderTestCard(
        "PPD Test (Tuberculosis)",
        ppdResult,
        setPpdResult,
        <div className="flex items-center justify-between">
          <Label className="text-lg font-semibold text-gray-700">Result</Label>
          <RadioGroup
            value={ppdResult.result}
            onValueChange={(value: "Positive" | "Negative") =>
              setPpdResult((prev) => ({ ...prev, result: value }))
            }
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="Positive"
                id="ppd-positive"
                className="text-gray-900 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 data-[state=checked]:ring-gray-900 focus:ring-gray-700 focus:border-gray-700"
              />
              <Label htmlFor="ppd-positive" className="text-sm font-medium">
                Positive
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem
                value="Negative"
                id="ppd-negative"
                className="text-gray-900 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 data-[state=checked]:ring-gray-900 focus:ring-gray-700 focus:border-gray-700"
              />
              <Label htmlFor="ppd-negative" className="text-sm font-medium">
                Negative
              </Label>
            </div>
          </RadioGroup>
        </div>
      )}

      {/* Sputum Microscopy */}
      {renderTestCard(
        "Sputum Microscopy",
        sputumMicroscopyResult,
        setSputumMicroscopyResult,
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-lg font-semibold text-gray-700">
              Lab Results
            </Label>
            <RadioGroup
              value={sputumMicroscopyResult.labResults}
              onValueChange={(value: "Essentially Normal" | "With Findings") =>
                setSputumMicroscopyResult((prev) => ({
                  ...prev,
                  labResults: value,
                }))
              }
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="Essentially Normal"
                  id="sputum-normal"
                  className="text-gray-900 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 data-[state=checked]:ring-gray-900 focus:ring-gray-700 focus:border-gray-700"
                />
                <Label htmlFor="sputum-normal" className="text-sm font-medium">
                  Essentially Normal
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="With Findings"
                  id="sputum-findings"
                  className="text-gray-900 data-[state=checked]:bg-gray-900 data-[state=checked]:border-gray-900 data-[state=checked]:ring-gray-900 focus:ring-gray-700 focus:border-gray-700"
                />
                <Label
                  htmlFor="sputum-findings"
                  className="text-sm font-medium"
                >
                  With Findings
                </Label>
                {sputumMicroscopyResult.labResults === "With Findings" && (
                  <Input
                    type="text"
                    value={sputumMicroscopyResult.findings}
                    onChange={(e) =>
                      setSputumMicroscopyResult((prev) => ({
                        ...prev,
                        findings: e.target.value,
                      }))
                    }
                    className="ml-2 w-48"
                    placeholder="Enter findings"
                  />
                )}
              </div>
            </RadioGroup>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-gray-700">
              Number of Plusses
            </Label>
            <Input
              type="text"
              value={sputumMicroscopyResult.numberOfPlusses}
              onChange={(e) =>
                setSputumMicroscopyResult((prev) => ({
                  ...prev,
                  numberOfPlusses: e.target.value,
                }))
              }
              className="w-32"
            />
          </div>
        </div>
      )}

      {/* Urinalysis */}
      {renderTestCard(
        "Urinalysis",
        urinalysisResult,
        setUrinalysisResult,
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">
                Physical Properties
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">
                    Specific Gravity
                  </Label>
                  <Input
                    type="text"
                    value={urinalysisResult.specificGravity}
                    onChange={(e) =>
                      setUrinalysisResult((prev) => ({
                        ...prev,
                        specificGravity: e.target.value,
                      }))
                    }
                    className="w-24"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">
                    Appearance
                  </Label>
                  <Input
                    type="text"
                    value={urinalysisResult.appearance}
                    onChange={(e) =>
                      setUrinalysisResult((prev) => ({
                        ...prev,
                        appearance: e.target.value,
                      }))
                    }
                    className="w-24"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">
                    Color
                  </Label>
                  <Input
                    type="text"
                    value={urinalysisResult.color}
                    onChange={(e) =>
                      setUrinalysisResult((prev) => ({
                        ...prev,
                        color: e.target.value,
                      }))
                    }
                    className="w-24"
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-800 border-b pb-2">
                Chemical Analysis
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">
                    Glucose
                  </Label>
                  <Input
                    type="text"
                    value={urinalysisResult.glucose}
                    onChange={(e) =>
                      setUrinalysisResult((prev) => ({
                        ...prev,
                        glucose: e.target.value,
                      }))
                    }
                    className="w-24"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">
                    Proteins
                  </Label>
                  <Input
                    type="text"
                    value={urinalysisResult.proteins}
                    onChange={(e) =>
                      setUrinalysisResult((prev) => ({
                        ...prev,
                        proteins: e.target.value,
                      }))
                    }
                    className="w-24"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-700">
                    pH
                  </Label>
                  <Input
                    type="text"
                    value={urinalysisResult.ph}
                    onChange={(e) =>
                      setUrinalysisResult((prev) => ({
                        ...prev,
                        ph: e.target.value,
                      }))
                    }
                    className="w-24"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4 pt-6">
        <Button variant="outline" className="px-8 py-3">
          Save Draft
        </Button>
        <Button className="px-8 py-3 bg-green-600 hover:bg-green-700">
          Submit Results
        </Button>
      </div>
    </div>
  );
};

export default ImagingResults;
