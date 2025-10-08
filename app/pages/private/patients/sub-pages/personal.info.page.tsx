// PersonalInfoPage.tsx
import { useState, type JSX } from "react";
import EncounterTab from "@/pages/private/patients/features/defaults/patient.encounter.tab";

interface PersonalInfoPageProps {
  tabs: string[];
  views: { id: string; icon: JSX.Element; page?: string }[];
  member: any;
  facilityId: string;
  selectedView: string;
  onSelectView: (view: string) => void;
}

export default function PersonalInfoPage({
  tabs,
  views,
  member,
  facilityId,
  selectedView,
  onSelectView,
}: PersonalInfoPageProps) {
  const [activeTab, setActiveTab] = useState("Information");

  const person = member?.person || member; // support both shapes

  return (
    <div className="flex-1 flex flex-col p-6 bg-gray-50 rounded-lg">
      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`relative pb-3 text-sm font-medium transition-colors ${
              activeTab === tab
                ? "text-blue-700"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-700 rounded"></span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="mt-6 flex flex-col gap-6">
        {activeTab === "Information" && person && (
          <div className="flex flex-col gap-6">
            {/* Profile header (optional) */}
            {/* <div className="flex items-center gap-4">
              <img
                src={profileImage}
                alt={person.firstName}
                className="w-20 h-20 rounded-full object-cover border shadow-sm"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {person.firstName} {person.middleName} {person.lastName}{" "}
                  {person.extensionName && person.extensionName !== "N/A"
                    ? person.extensionName
                    : ""}
                </h2>
                <p className="text-gray-500 text-sm">
                  {person.sex} • {person.civilStatus} •{" "}
                  {person.citizenship || "—"}
                </p>
              </div>
            </div> */}

            {/* Basic Information */}
            <Section title="Basic Information">
              <InfoItem
                label="Birth Date"
                value={
                  person.birthDate
                    ? new Date(person.birthDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                    : null
                }
              />
              <InfoItem label="Religion" value={person.religion} />
            </Section>

            {/* Identifications */}
            {person.identifications?.length > 0 && (
              <Section title="Identifications">
                {person.identifications.map((id: any, i: number) => (
                  <InfoItem
                    key={i}
                    label={id.type.replace("_", " ").toUpperCase()}
                    value={id.value}
                  />
                ))}
              </Section>
            )}

            {/* Contacts */}
            {person.contacts?.length > 0 && (
              <Section title="Contacts">
                {person.contacts.map((c: any, i: number) => (
                  <InfoItem
                    key={i}
                    label={c.type.replace("_", " ").toUpperCase()}
                    value={`${c.value} ${
                      c.provider ? `(${c.provider.toUpperCase()})` : ""
                    }`}
                  />
                ))}
              </Section>
            )}

            {/* Address */}
            {person.addresses?.length > 0 && (
              <Section title="Address">
                {person.addresses.map((addr: any, i: number) => (
                  <InfoItem
                    key={i}
                    label={addr.type?.toUpperCase() || "Address"}
                    value={`${addr.barangay?.value || ""}, ${
                      addr.city?.value || ""
                    }, ${addr.province?.value || ""}, ${addr.country || ""}`}
                  />
                ))}
              </Section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* Utility components */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
      <h3 className="font-semibold text-gray-800 mb-3">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
        {children}
      </div>
    </div>
  );
}

function InfoItem({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="flex flex-col">
      <span className="text-gray-500 text-xs font-medium tracking-wide uppercase">
        {label}
      </span>
      <span className="text-gray-800 font-medium mt-0.5">{value || "—"}</span>
    </div>
  );
}
