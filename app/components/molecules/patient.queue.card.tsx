import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface PatientDetails {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  sex?: "male" | "female";
  birthDate?: string;
}

interface Patient {
  id: string;
  number: string; // queue number (e.g. "001")
  status: "waiting" | "next" | "now_serving" | "done" | "skipped";
  patient: PatientDetails;
  estimatedWait?: string;
  priority?: "high" | "normal" | "low";
}

interface PatientQueueCardProps {
  patient: Patient;
  isCurrentPatient: boolean;
}

export const PatientQueueCard = ({
  patient,
  isCurrentPatient,
}: PatientQueueCardProps) => {
  // Initialize sortable functionality
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: patient.id,
  });

  // Apply transform styles for smooth dragging
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Build display values
  const fullName = `${patient.patient.firstName} ${
    patient.patient.middleName ?? ""
  } ${patient.patient.lastName}`.trim();
  const initials = `${patient.patient.firstName?.[0] ?? ""}${
    patient.patient.lastName?.[0] ?? ""
  }`.toUpperCase();

  // ✅ Updated status colors
  const statusColors: Record<Patient["status"], string> = {
    waiting: "bg-yellow-100 text-yellow-800",
    next: "bg-orange-100 text-orange-800",
    now_serving: "bg-green-100 text-green-800",
    done: "bg-blue-100 text-blue-800",
    skipped: "bg-red-100 text-red-800",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-3 rounded-lg shadow-sm border bg-white cursor-move transition-all duration-200
        ${
          isDragging
            ? "opacity-50 shadow-lg scale-105 z-50"
            : "opacity-100 hover:shadow-md"
        } 
        ${isCurrentPatient ? "ring-2 ring-green-500" : ""}
        ${isDragging ? "transform rotate-2" : ""}`}
      {...attributes}
      {...listeners}
    >
      {/* Left: Queue number + patient info */}
      <div className="flex items-center space-x-3">
        {/* Prominent Queue Number */}
        <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-100 border-2 border-blue-200">
          <span className="font-bold text-lg text-blue-800">
            #{patient.number}
          </span>
        </div>
        <div>
          <p className="font-semibold text-xs text-gray-900 truncate max-w-[120px]">
            {fullName}
          </p>
          <p className="text-xs text-yellow-700">
            {patient.status === "next" ? "Up Next" : "Waiting"}
          </p>
        </div>
      </div>

      {/* Drag Handle Visual Indicator */}
      <div className="flex flex-col justify-center items-center space-y-0.5 text-gray-400 opacity-60 hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
        <div className="flex space-x-0.5">
          <div className="w-1 h-1 bg-current rounded-full"></div>
          <div className="w-1 h-1 bg-current rounded-full"></div>
        </div>
        <div className="flex space-x-0.5">
          <div className="w-1 h-1 bg-current rounded-full"></div>
          <div className="w-1 h-1 bg-current rounded-full"></div>
        </div>
        <div className="flex space-x-0.5">
          <div className="w-1 h-1 bg-current rounded-full"></div>
          <div className="w-1 h-1 bg-current rounded-full"></div>
        </div>
      </div>
    </div>
  );
};
