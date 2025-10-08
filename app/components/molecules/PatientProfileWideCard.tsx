import React from "react";
import {
  Pill,
  FlaskConical,
  ScrollText,
  AlertTriangle,
  UserRound,
  CalendarDays,
  Phone,
  MapPin,
  Clock3,
  UsersRound,
} from "lucide-react";

type EmergencyContact = {
  name: string;
  relationship: string;
  phone: string;
};

interface PatientProfileWideCardProps {
  patient: {
    name: string;
    initials: string;
    age: number;
    gender: string;
    bloodType: string;
    dateOfBirth: string;
    phone: string;
    address: string;
    lastVisit: string;
    medicalAlerts: string[];
    emergencyContact: EmergencyContact;
  };
  queueLabel?: string;

  // Optional action handlers
  onMedicine?: () => void;
  onLaboratory?: () => void;
  onCertificate?: () => void;
  className?: string;
  hideHeader?: boolean;
}

export const PatientProfileWideCard: React.FC<PatientProfileWideCardProps> = ({
  patient,
  queueLabel,
  onMedicine,
  onLaboratory,
  onCertificate,
  className,
  hideHeader,
}) => {
  return (
    <section
      className={[
        "rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden",
        className ?? "",
      ].join(" ")}
    >
      {/* Header */}
      {!hideHeader && (
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between px-6 py-5 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 shrink-0 rounded-full bg-white text-blue-700 ring-1 ring-blue-200 flex items-center justify-center font-semibold">
              {patient.initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold text-slate-900">
                  {patient.name}
                </h2>
                <span className="inline-flex items-center gap-1 rounded-full bg-blue-600/10 text-blue-700 text-[11px] font-medium px-2 py-0.5">
                  <UserRound className="h-3.5 w-3.5" />
                  {patient.age} • {patient.gender}
                </span>
              </div>
              <div className="mt-1 flex items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-white text-slate-700 text-xs px-2 py-0.5 ring-1 ring-slate-200">
                  Blood Type: <span className="ml-1 font-semibold">{patient.bloodType}</span>
                </span>
                {patient.medicalAlerts?.length > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-rose-600/10 text-rose-700 text-[11px] px-2 py-0.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    {patient.medicalAlerts.length} alert
                    {patient.medicalAlerts.length > 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            {/* Icon-only quick actions */}
            <IconGhostButton
              ariaLabel="Medicine"
              title="Medicine"
              onClick={onMedicine}
            >
              <Pill className="h-5 w-5" />
            </IconGhostButton>

            <IconGhostButton
              ariaLabel="Laboratory"
              title="Laboratory"
              onClick={onLaboratory}
            >
              <FlaskConical className="h-5 w-5" />
            </IconGhostButton>

            <IconGhostButton
              ariaLabel="Medical Certificate"
              title="Medical Certificate"
              onClick={onCertificate}
            >
              <ScrollText className="h-5 w-5" />
            </IconGhostButton>

            {queueLabel && (
              <span className="ml-1 inline-flex items-center rounded-full bg-amber-100 text-amber-900 text-xs font-medium px-3 py-1">
                {queueLabel}
              </span>
            )}
          </div>
        </header>
      )}

      {/* Body */}
      <div className="px-6 py-5">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Left: Key details (spans 2 cols on xl) */}
          <div className="xl:col-span-2">
            <SectionLabel>Patient Details</SectionLabel>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <InfoCard
                icon={<CalendarDays className="h-5 w-5" />}
                label="Date of Birth"
                value={patient.dateOfBirth}
              />
              <InfoCard
                icon={<Phone className="h-5 w-5" />}
                label="Phone"
                value={patient.phone}
              />
              <InfoCard
                icon={<MapPin className="h-5 w-5" />}
                label="Address"
                value={patient.address}
                className="sm:col-span-2"
              />
              <InfoCard
                icon={<Clock3 className="h-5 w-5" />}
                label="Last Visit"
                value={patient.lastVisit}
              />
            </div>
          </div>

          {/* Right: Clinical + emergency */}
          <div className="space-y-6">
            <div>
              <SectionLabel>Medical Alerts</SectionLabel>
              <div className="mt-3 flex flex-wrap gap-2">
                {patient.medicalAlerts?.length ? (
                  patient.medicalAlerts.map((a, i) => (
                    <span
                      key={i}
                      className="rounded-full bg-rose-50 text-rose-700 text-xs font-medium px-2.5 py-1 ring-1 ring-rose-200"
                    >
                      {a}
                    </span>
                  ))
                ) : (
                  <p className="text-sm text-slate-500">No active alerts.</p>
                )}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2">
                <UsersRound className="h-5 w-5 text-blue-600" />
                <h3 className="text-sm font-semibold text-slate-900">
                  Emergency Contact
                </h3>
              </div>
              <div className="mt-2 text-sm">
                <p className="font-medium text-slate-900">
                  {patient.emergencyContact.name} ({patient.emergencyContact.relationship})
                </p>
                <p className="text-slate-600">{patient.emergencyContact.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

/* —————————————————— Helper subcomponents —————————————————— */

const SectionLabel: React.FC<React.PropsWithChildren> = ({ children }) => (
  <div className="text-[11px] uppercase tracking-wide text-slate-500 font-medium">
    {children}
  </div>
);

const InfoCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  className?: string;
}> = ({ icon, label, value, className }) => (
  <div
    className={[
      "rounded-xl border border-slate-200 bg-white px-4 py-3",
      "hover:shadow-sm transition-shadow",
      className ?? "",
    ].join(" ")}
  >
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-blue-600">{icon}</div>
      <div>
        <div className="text-xs font-medium text-slate-500">{label}</div>
        <div className="text-sm text-slate-900">{value}</div>
      </div>
    </div>
  </div>
);

const IconGhostButton: React.FC<
  React.ButtonHTMLAttributes<HTMLButtonElement> & { ariaLabel: string }
> = ({ ariaLabel, className, children, ...props }) => (
  <button
    aria-label={ariaLabel}
    className={[
      "inline-flex h-9 w-9 items-center justify-center rounded-full",
      "text-blue-700 hover:text-blue-800",
      "bg-white/80 hover:bg-white",
      "ring-1 ring-blue-200 hover:ring-blue-300",
      "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
      "transition-colors",
      className ?? "",
    ].join(" ")}
    {...props}
  >
    <span className="sr-only">{ariaLabel}</span>
    {children}
  </button>
);
