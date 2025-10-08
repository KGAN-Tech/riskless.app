import React, { useState, type JSX } from "react";
import {
  ChevronDown,
  User,
  Building,
  FileText,
  Heart,
  ClipboardList,
  FlaskConical,
  Pill,
  Eye,
  Pencil,
  File,
} from "lucide-react";
import { MdNumbers } from "react-icons/md";
import { Button } from "~/app/components/atoms/button";
import { encounterService } from "~/app/services/encounter.service";
import { useNavigate } from "react-router";

interface EncounterTabProps {
  encounters: any[];
  member: any;
  facilityId: string;
}

export default function EncounterTab({
  encounters,
  member,
  facilityId,
}: EncounterTabProps) {
  const navigate = useNavigate();
  const [selectedViews, setSelectedViews] = useState<Record<string, string>>(
    {}
  );
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const views = [
    { id: "Summary", icon: <FileText size={16} />, page: "Encounter" },
    { id: "Interview", icon: <User size={16} />, page: "Encounter" },
    { id: "Vitals", icon: <Heart size={16} />, page: "Encounter" },
    {
      id: "Consultation",
      icon: <ClipboardList size={16} />,
      page: "Encounter",
    },
    { id: "Laboratory", icon: <FlaskConical size={16} />, page: "Encounter" },
    { id: "Prescription", icon: <Pill size={16} />, page: "Encounter" },
    { id: "Documents", icon: <File size={16} />, page: "Encounter" },
    { id: "Queue", icon: <MdNumbers size={16} />, page: "Encounter" },
  ];

  const getDefaultView = (encounterId: string) => {
    return (
      selectedViews[encounterId] || (views.length > 0 ? views[0].id : "Summary")
    );
  };

  const handleViewChange = (encounterId: string, view: string) => {
    setSelectedViews((prev) => ({
      ...prev,
      [encounterId]: view,
    }));
  };

  const handleCreateEncounter = async () => {
    try {
      setIsLoading(true);
      const data = {
        patientId: member.person.id,
        facilityId: facilityId,
        type: {
          transaction: "initial",
          package: "konsulta_package",
          service: "physical",
        },
        withConsent: true,
        effectivityYear: new Date().getFullYear().toString(), // ✅ fixed
        transactionDate: new Date().toISOString(),
        remarks: "Initial consultation for annual check-up",
        status: "pending",
      };
      await encounterService.create(data);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error creating encounter:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Modal Component
  const ConfirmationModal = () => {
    if (!isModalOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-500/50 ">
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
          <h2 className="text-lg font-semibold text-teal-800">
            Confirm New Encounter
          </h2>
          <p className="text-gray-600 mt-2">
            Are you sure you want to create a new encounter for{" "}
            <span className="font-medium">
              {member?.person?.firstName} {member?.person?.lastName}
            </span>
            ?
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700"
              onClick={() => setIsModalOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white"
              onClick={handleCreateEncounter}
              disabled={isLoading}
            >
              {isLoading ? "Creating..." : "Confirm"}
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Dropdown component
  const ViewDropdown = ({
    encounterId,
    currentView,
  }: {
    encounterId: string;
    currentView: string;
  }) => {
    const isOpen = openDropdown === encounterId;

    return (
      <div className="relative">
        <button
          onClick={() => setOpenDropdown(isOpen ? null : encounterId)}
          className="flex items-center gap-2 px-3 py-2 border border-teal-200 rounded-lg text-teal-800 bg-white hover:bg-teal-50 transition-colors text-sm font-medium"
        >
          {views.find((v) => v.id === currentView)?.icon}
          {currentView}
          <ChevronDown size={16} />
        </button>
        {isOpen && (
          <div className="fixed inset-0 z-50 mt-45 mr-18 flex items-start justify-end">
            {/* Backdrop */}
            <div
              className="absolute inset-0"
              onClick={() => setOpenDropdown(null)}
            />

            {/* Dropdown menu */}
            <div className="relative mt-12 mr-4 bg-white shadow-lg rounded-lg w-48 border border-teal-100 py-1 z-50">
              {views.map((view) => (
                <button
                  key={view.id}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-teal-50 transition-colors"
                  onClick={() => {
                    handleViewChange(encounterId, view.id);
                    setOpenDropdown(null);
                  }}
                >
                  {view.icon}
                  {view.id}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  const renderViewContent = (encounter: any, view: string) => {
    switch (view) {
      case "Summary":
        return (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-teal-800">
                  Encounter Summary
                </h3>
                <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                  <Building size={14} />
                  <span>{encounter.facility.name}</span>
                </div>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  encounter.status === "pending"
                    ? "bg-amber-100 text-amber-800"
                    : encounter.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {encounter.status}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-teal-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-teal-700 mb-2">
                  Transaction Details
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction #:</span>
                    <span className="font-mono text-teal-800">
                      {encounter.transactionNo}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Package:</span>
                    <span className="text-teal-800 capitalize">
                      {encounter.type?.package.replace("_", " ") || "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Service:</span>
                    <span className="text-teal-800 capitalize">
                      {encounter.type?.service || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Additional Information
                </h4>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consent:</span>
                    <span
                      className={
                        encounter.withConsent
                          ? "text-green-600 font-medium"
                          : "text-amber-600"
                      }
                    >
                      {encounter.withConsent ? "Provided" : "Not Provided"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Effectivity:</span>
                    <span className="text-teal-800">
                      {encounter.effectivityYear}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-sm font-medium text-blue-700 mb-2">
                Remarks
              </h4>
              <p className="text-blue-800">{encounter.remarks}</p>
            </div>
          </div>
        );

      case "Interview":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-teal-800 mb-2">
                Patient Interview
              </h3>
              <p className="text-gray-600 text-sm">
                Basic health assessment and history
              </p>
            </div>

            {encounter.interview ? (
              <div className="space-y-6">
                {/* Social History */}
                <div className="bg-teal-50 p-4 rounded-lg">
                  <h4 className="font-medium text-teal-700 mb-3">
                    Social History
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Smoker:</span>
                      <span className="font-medium">
                        {encounter.interview.history.social.isSmoker
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Drinker:</span>
                      <span className="font-medium">
                        {encounter.interview.history.social.isDrinker
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Drug Use:</span>
                      <span className="font-medium">
                        {encounter.interview.history.social.isIllicitDrugUser
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Sexually Active:</span>
                      <span className="font-medium">
                        {encounter.interview.history.social.isSexuallyActive
                          ? "Yes"
                          : "No"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Menstrual History (if applicable) */}
                {encounter.interview.history.menstrual.isApplicable && (
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <h4 className="font-medium text-pink-700 mb-3">
                      Menstrual History
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Last Period:</span>
                        <span className="font-medium">
                          {new Date(
                            encounter.interview.history.menstrual.lastMensPeriod
                          ).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Menopause:</span>
                        <span className="font-medium">
                          {encounter.interview.history.menstrual.isMenopause
                            ? "Yes"
                            : "No"}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Pregnancy History (if applicable) */}
                {encounter.interview.history.pregnancy.isApplicable && (
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-700 mb-3">
                      Pregnancy History
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-800">
                          {encounter.interview.history.pregnancy.pregnancyCount}
                        </div>
                        <div className="text-xs text-gray-600">Pregnancies</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-800">
                          {encounter.interview.history.pregnancy.deliveryCount}
                        </div>
                        <div className="text-xs text-gray-600">Deliveries</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-800">
                          {
                            encounter.interview.history.pregnancy
                              .liveChildrenCount
                          }
                        </div>
                        <div className="text-xs text-gray-600">
                          Live Children
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-purple-800">
                          {encounter.interview.history.pregnancy.abortionCount}
                        </div>
                        <div className="text-xs text-gray-600">Abortions</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <User size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">
                  No interview data available for this encounter.
                </p>
              </div>
            )}
          </div>
        );

      case "Vitals":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-teal-800 mb-2">
                Vital Signs
              </h3>
              <p className="text-gray-600 text-sm">
                Patient's physiological measurements
              </p>
            </div>

            {encounter.vital ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-red-50 p-4 rounded-lg text-center">
                  <Heart size={24} className="mx-auto text-red-500 mb-2" />
                  <h4 className="text-sm text-red-700 mb-1">Heart Rate</h4>
                  <p className="text-xl font-semibold text-red-800">72</p>
                  <p className="text-xs text-red-600">bpm</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg text-center">
                  <svg
                    className="mx-auto mb-2 text-blue-500"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3 9H21M7 15H17M12 3V21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <h4 className="text-sm text-blue-700 mb-1">Blood Pressure</h4>
                  <p className="text-xl font-semibold text-blue-800">120/80</p>
                  <p className="text-xs text-blue-600">mmHg</p>
                </div>
                <div className="bg-amber-50 p-4 rounded-lg text-center">
                  <svg
                    className="mx-auto mb-2 text-amber-500"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M12 9V12M12 12V15M12 12H9M12 12H15M12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  <h4 className="text-sm text-amber-700 mb-1">Temperature</h4>
                  <p className="text-xl font-semibold text-amber-800">98.6</p>
                  <p className="text-xs text-amber-600">°F</p>
                </div>
                <div className="bg-teal-50 p-4 rounded-lg text-center">
                  <svg
                    className="mx-auto mb-2 text-teal-500"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                    <path
                      d="M15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15C13.6569 15 15 13.6569 15 12Z"
                      stroke="currentColor"
                      strokeWidth="2"
                    />
                  </svg>
                  <h4 className="text-sm text-teal-700 mb-1">Oxygen Sat</h4>
                  <p className="text-xl font-semibold text-teal-800">98%</p>
                  <p className="text-xs text-teal-600">SpO2</p>
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <Heart size={32} className="mx-auto text-gray-400 mb-2" />
                <p className="text-gray-500">
                  No vitals recorded for this encounter.
                </p>
              </div>
            )}
          </div>
        );

      case "Consultation":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-teal-800 mb-2">
                Consultation Notes
              </h3>
              <p className="text-gray-600 text-sm">
                Physician's assessment and recommendations
              </p>
            </div>

            {encounter.consultation ? (
              <div className="bg-white border border-teal-100 rounded-lg p-4">
                <h4 className="font-medium text-teal-700 mb-2">
                  Clinical Impression
                </h4>
                <p className="text-gray-700 mb-4">
                  {encounter.consultation.notes ||
                    "No detailed notes available."}
                </p>

                <h4 className="font-medium text-teal-700 mb-2">Plan</h4>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Follow up in 2 weeks</li>
                  <li>Continue current medications</li>
                  <li>Lifestyle modifications as discussed</li>
                </ul>
              </div>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg text-center">
                <ClipboardList
                  size={32}
                  className="mx-auto text-gray-400 mb-2"
                />
                <p className="text-gray-500">
                  No consultation data available for this encounter.
                </p>
              </div>
            )}
          </div>
        );

      case "Laboratory":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-teal-800 mb-2">
                Laboratory Results
              </h3>
              <p className="text-gray-600 text-sm">
                Diagnostic tests and findings
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <FlaskConical size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">
                No laboratory results available for this encounter.
              </p>
            </div>
          </div>
        );

      case "Prescription":
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-teal-800 mb-2">
                Prescriptions
              </h3>
              <p className="text-gray-600 text-sm">
                Medications and treatments prescribed
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg text-center">
              <Pill size={32} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">
                No prescriptions issued for this encounter.
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div className="bg-gray-50 p-6 rounded-lg text-center">
            <FileText size={32} className="mx-auto text-gray-400 mb-2" />
            <p className="text-gray-500">
              Select a view to see encounter details
            </p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="flex justify-between w-full">
        <div>
          <h2 className="text-lg font-semibold text-teal-800">Encounters</h2>
          <p className="text-gray-600 text-sm">
            List of all encounters for this patient
          </p>
        </div>
        <Button
          onClick={() => setIsModalOpen(true)}
          className="bg-white border border-teal-500 hover:bg-teal-300 text-gray-600"
        >
          Add Encounter
        </Button>
      </div>
      <div className="flex flex-col h-full">
        {/* Header or other content */}

        <div className="flex-1 overflow-y-auto max-h-[650px] p-2">
          {encounters.length > 0 ? (
            encounters.map((encounter) => {
              const isToday =
                new Date(encounter.transactionDate).toDateString() ===
                new Date().toDateString();

              return (
                <div key={encounter.id} className="encounter-card-wrapper">
                  <div className="flex bg-white rounded-lg shadow overflow-hidden mb-2">
                    {/* Date Sidebar */}
                    <div className="bg-sky-700 text-white flex flex-col items-center justify-between px-3 py-4 w-20">
                      <div className="text-center">
                        <p className="text-xs">
                          {new Date(encounter.transactionDate).getFullYear()}
                        </p>
                        <p className="text-xl font-bold">
                          {new Date(encounter.transactionDate).getDate()}
                        </p>
                        <p className="text-xs uppercase">
                          {new Date(encounter.transactionDate).toLocaleString(
                            "default",
                            {
                              month: "short",
                            }
                          )}
                        </p>
                      </div>
                      <p className="text-xs">
                        {new Date(encounter.transactionDate).toLocaleTimeString(
                          [],
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>
                    </div>

                    {/* Right Content */}
                    <div className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h2 className="text-xl font-bold text-teal-800 uppercase">
                            {encounter.patient.lastName},{" "}
                            {encounter.patient.firstName}{" "}
                            {encounter.patient.middleName}
                          </h2>
                          <div className="flex items-center gap-2 mt-1 text-sm text-gray-600">
                            <Building size={14} />
                            <span>{encounter.facility.name}</span>
                          </div>
                        </div>

                        {/* Dropdown */}
                        <ViewDropdown
                          encounterId={encounter.id}
                          currentView={getDefaultView(encounter.id)}
                        />
                      </div>

                      {/* Content */}
                      {renderViewContent(
                        encounter,
                        getDefaultView(encounter.id)
                      )}

                      <div className="flex justify-between items-center py-2 border-t mt-2">
                        {/* Left actions */}
                        {isToday && (
                          <div className="flex gap-3">
                            <button className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm">
                              Create Queue
                            </button>
                            <button className="px-3 py-1.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition text-sm">
                              Photo Consent
                            </button>
                          </div>
                        )}

                        {/* Right icons */}
                        <div className="flex gap-3">
                          <button
                            onClick={() =>
                              navigate(
                                `/member/${encounter?.patient?.User[0]?.id}?page=encounter&transaction=${encounter?.id}`
                              )
                            }
                            className="p-2 rounded-full hover:bg-gray-100 transition"
                          >
                            <Eye className="w-5 h-5 text-blue-600" />
                          </button>
                          <button className="p-2 rounded-full hover:bg-gray-100 transition">
                            <Pencil className="w-5 h-5 text-green-600" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-center py-12 bg-white rounded-lg shadow border border-teal-100">
              <FileText size={48} className="mx-auto text-teal-300 mb-4" />
              <p className="text-gray-500">
                No encounters found for this patient.
              </p>
            </div>
          )}
        </div>
      </div>

      <ConfirmationModal />
    </div>
  );
}
