import { useState } from "react";
import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { RadioGroup, RadioGroupItem } from "~/app/components/atoms/radio-group";
import { Checkbox } from "@/components/atoms/checkbox";
import ImagingResults from "./ImagingResults.component";

interface LaboratoryExam {
  id: string;
  name: string;
  isDoctorRecommended: boolean;
  isClientRequested: "request" | "refuse" | null;
  status: "D" | "N" | "W" | "X";
}

const initialExams: LaboratoryExam[] = [
  {
    id: "1",
    name: "Random Blood Sugar",
    isDoctorRecommended: false,
    isClientRequested: null,
    status: "N",
  },
  {
    id: "2",
    name: "CBC w/ platelet count",
    isDoctorRecommended: false,
    isClientRequested: null,
    status: "N",
  },
  {
    id: "3",
    name: "Chest X-Ray",
    isDoctorRecommended: false,
    isClientRequested: null,
    status: "N",
  },
  {
    id: "4",
    name: "Creatinine",
    isDoctorRecommended: false,
    isClientRequested: null,
    status: "N",
  },
  {
    id: "5",
    name: "Electrocardiogram (ECG)",
    isDoctorRecommended: false,
    isClientRequested: null,
    status: "N",
  },
  {
    id: "6",
    name: "Fasting Blood Sugar",
    isDoctorRecommended: false,
    isClientRequested: null,
    status: "N",
  },
  {
    id: "7",
    name: "Fecal Occult Blood",
    isDoctorRecommended: false,
    isClientRequested: null,
    status: "N",
  },
  {
    id: "8",
    name: "Fecalysis",
    isDoctorRecommended: false,
    isClientRequested: null,
    status: "N",
  },
  {
    id: "9",
    name: "HbA1c",
    isDoctorRecommended: false,
    isClientRequested: null,
    status: "N",
  },
  {
    id: "10",
    name: "Lipid Profile",
    isDoctorRecommended: false,
    isClientRequested: null,
    status: "N",
  },
  {
    id: "11",
    name: "Oral Glucose Tolerance Test",
    isDoctorRecommended: false,
    isClientRequested: null,
    status: "N",
  },
  {
    id: "12",
    name: "Pap Smear",
    isDoctorRecommended: false,
    isClientRequested: null,
    status: "N",
  },
  {
    id: "13",
    name: "PPD Test (Tuberculosis)",
    isDoctorRecommended: false,
    isClientRequested: null,
    status: "N",
  },
  {
    id: "14",
    name: "Sputum Microscopy",
    isDoctorRecommended: false,
    isClientRequested: null,
    status: "N",
  },
  {
    id: "15",
    name: "Urinalysis",
    isDoctorRecommended: false,
    isClientRequested: null,
    status: "N",
  },
];

interface PlanManagementProps {
  record: any;
  onBack: () => void;
  onNext: () => void;
}

export default function PlanManagement({
  record,
  onBack,
  onNext,
}: PlanManagementProps) {
  const [activeTab, setActiveTab] = useState<"plan" | "results">("plan");
  const [exams, setExams] = useState<LaboratoryExam[]>(initialExams);
  const [otherExam, setOtherExam] = useState("");

  const handleDoctorRecommendation = (examId: string, recommended: boolean) => {
    setExams((prev) =>
      prev.map((exam) =>
        exam.id === examId
          ? { ...exam, isDoctorRecommended: recommended }
          : exam
      )
    );
  };

  const handleClientRequest = (
    examId: string,
    request: "request" | "refuse"
  ) => {
    setExams((prev) =>
      prev.map((exam) =>
        exam.id === examId ? { ...exam, isClientRequested: request } : exam
      )
    );
  };

  const handleStatusChange = (
    examId: string,
    status: "D" | "N" | "W" | "X"
  ) => {
    setExams((prev) =>
      prev.map((exam) => (exam.id === examId ? { ...exam, status } : exam))
    );
  };

  const addOtherExam = () => {
    if (otherExam.trim()) {
      const newExam: LaboratoryExam = {
        id: Date.now().toString(),
        name: otherExam.trim(),
        isDoctorRecommended: false,
        isClientRequested: null,
        status: "N",
      };
      setExams((prev) => [...prev, newExam]);
      setOtherExam("");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "D":
        return "bg-green-200 text-green-900";
      case "N":
        return "bg-yellow-200 text-yellow-900";
      case "W":
        return "bg-gray-200 text-gray-900";
      case "X":
        return "bg-red-200 text-red-900";
      default:
        return "bg-gray-200 text-gray-900";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "D":
        return "Done";
      case "N":
        return "Not yet done";
      case "W":
        return "Waived";
      case "X":
        return "Deferred";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      {/* Fixed Header */}
      <div className="bg-white border-b px-4 py-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div>
            <nav className="text-sm text-gray-500 mb-1" aria-label="Breadcrumb">
              <ol className="list-reset flex gap-2">
                <li>
                  <a href="/konsulta" className="hover:underline">
                    Konsulta
                  </a>
                </li>
                <li>/</li>
                <li>
                  <a href="#" onClick={onBack} className="hover:underline">
                    Laboratory
                  </a>
                </li>
                <li>/</li>
                <li className="text-gray-700 font-medium">Plan Management</li>
              </ol>
            </nav>
            <h1 className="text-xl font-semibold text-gray-800 mt-1">
              {record.orderNo} - {record.memberName}
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            {record.serviceType} • {record.service}
          </div>
        </div>
      </div>

      {/* Fixed Tabs */}
      <div className="bg-white border-b flex-shrink-0">
        <div className="px-4">
          <div className="flex justify-center space-x-8">
            <button
              onClick={() => setActiveTab("plan")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "plan"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              1 Plan/Management
            </button>
            <button
              onClick={() => setActiveTab("results")}
              className={`py-3 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "results"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              2 Laboratory/Imaging Results
            </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        {activeTab === "plan" ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg border p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">
                PLAN/MANAGEMENT
              </h2>

              {/* Legend */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium text-gray-700 mb-3">
                  Status Legend:
                </h3>
                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div className="flex flex-col items-center gap-2">
                    <span className="w-8 h-8 bg-green-200 text-green-900 rounded-lg text-center text-sm font-bold flex items-center justify-center shadow-sm">
                      D
                    </span>
                    <span className="text-center text-gray-700 font-medium">
                      Done
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="w-8 h-8 bg-yellow-200 text-yellow-900 rounded-lg text-center text-sm font-bold flex items-center justify-center shadow-sm">
                      N
                    </span>
                    <span className="text-center text-gray-700 font-medium">
                      Not yet done
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="w-8 h-8 bg-gray-200 text-gray-900 rounded-lg text-center text-sm font-bold flex items-center justify-center shadow-sm">
                      W
                    </span>
                    <span className="text-center text-gray-700 font-medium">
                      Waived
                    </span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <span className="w-8 h-8 bg-red-200 text-red-900 rounded-lg text-center text-sm font-bold flex items-center justify-center shadow-sm">
                      X
                    </span>
                    <span className="text-center text-gray-700 font-medium">
                      Deferred
                    </span>
                  </div>
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3 font-medium text-gray-700">
                        Laboratory/imaging
                      </th>
                      <th className="text-center p-3 font-medium text-gray-700">
                        Is Doctor Recommended?
                      </th>
                      <th className="text-center p-3 font-medium text-gray-700">
                        Is Client Requested?
                      </th>
                      <th className="text-center p-3 font-medium text-gray-700">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {exams.map((exam) => (
                      <tr key={exam.id} className="border-b hover:bg-gray-50">
                        <td className="p-3">
                          <span className="font-medium text-gray-800">
                            {exam.name}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <RadioGroup
                            value={exam.isDoctorRecommended ? "yes" : "no"}
                            onValueChange={(value) =>
                              handleDoctorRecommendation(
                                exam.id,
                                value === "yes"
                              )
                            }
                            className="flex justify-center"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="yes"
                                  id={`yes-${exam.id}`}
                                />
                                <Label htmlFor={`yes-${exam.id}`}>Yes</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="no"
                                  id={`no-${exam.id}`}
                                />
                                <Label htmlFor={`no-${exam.id}`}>No</Label>
                              </div>
                            </div>
                          </RadioGroup>
                        </td>
                        <td className="p-3 text-center">
                          <RadioGroup
                            value={exam.isClientRequested || ""}
                            onValueChange={(value) =>
                              handleClientRequest(
                                exam.id,
                                value as "request" | "refuse"
                              )
                            }
                            className="flex justify-center"
                          >
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="request"
                                  id={`request-${exam.id}`}
                                />
                                <Label htmlFor={`request-${exam.id}`}>
                                  Request
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem
                                  value="refuse"
                                  id={`refuse-${exam.id}`}
                                />
                                <Label htmlFor={`refuse-${exam.id}`}>
                                  Refuse
                                </Label>
                              </div>
                            </div>
                          </RadioGroup>
                        </td>
                        <td className="p-3 text-center">
                          <RadioGroup
                            value={exam.status}
                            onValueChange={(value) =>
                              handleStatusChange(
                                exam.id,
                                value as "D" | "N" | "W" | "X"
                              )
                            }
                            className="flex justify-center"
                          >
                            <div className="flex items-center space-x-2">
                              {(["D", "N", "W", "X"] as const).map((status) => (
                                <div
                                  key={status}
                                  className="flex items-center space-x-1"
                                >
                                  <RadioGroupItem
                                    value={status}
                                    id={`${status}-${exam.id}`}
                                  />
                                  <Label
                                    htmlFor={`${status}-${exam.id}`}
                                    className={`w-8 h-8 rounded-lg text-center text-sm font-bold cursor-pointer flex items-center justify-center shadow-sm hover:shadow-md transition-shadow ${getStatusColor(
                                      status
                                    )}`}
                                  >
                                    {status}
                                  </Label>
                                </div>
                              ))}
                            </div>
                          </RadioGroup>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Add Other Exam */}
              <div className="mt-6 p-4 border rounded-lg">
                <h3 className="font-medium text-gray-700 mb-3">
                  OTHER DIAGNOSTIC EXAM
                </h3>
                <div className="flex gap-3">
                  <Input
                    placeholder="Enter exam name"
                    value={otherExam}
                    onChange={(e) => setOtherExam(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={addOtherExam} variant="outline">
                    Add Exam
                  </Button>
                </div>
              </div>

              {/* Note */}
              <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-700">
                  <strong>NOTE:</strong> In generation of the Konsulta XML
                  Report for the encoded laboratory/imaging results, always
                  based in the Consultation Date of the applicable transaction.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-end space-x-4">
                <Button variant="outline" onClick={onBack}>
                  Cancel
                </Button>
                <Button onClick={() => setActiveTab("results")}>
                  Next: Laboratory/Imaging Results
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-lg border p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">
                  LABORATORY/IMAGING RESULTS
                </h2>
                <Button variant="outline" onClick={() => setActiveTab("plan")}>
                  ← Back to Plan/Management
                </Button>
              </div>

              <ImagingResults />

              <div className="flex justify-end mt-6">
                <Button onClick={onNext}>Complete Process</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
