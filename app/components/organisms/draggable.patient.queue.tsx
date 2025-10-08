import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PatientQueueCard } from "../molecules/patient.queue.card";

interface PatientDetails {
  id: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  sex?: "male" | "female";
  birthDate?: string; // ISO string from API
  userName?: string;
  contacts?: any[];
  images?: any[];
}

interface Patient {
  id: string;
  number: string; // queue number (e.g. "001")
  status: "waiting" | "next" | "now_serving" | "done" | "skipped";
  tags?: string[];
  date?: string;
  position?: string;
  patient: PatientDetails;
  estimatedWait?: string;
  priority?: "high" | "normal" | "low";
  counter?: any;
  encounter?: any;
  user?: any;
  queueType?: string;
  timestamp?: string;
  metadata?: any;
}

interface RawPatient {
  id: string;
  number: string;
  status: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    middleName?: string;
    sex?: "male" | "female";
    birthDate?: string;
    userName?: string;
    contacts?: any[];
    images?: any[];
  };
  tags?: string[];
  date?: string;
  position?: string;
  counter?: any;
  encounter?: any;
  user?: any;
  queueType?: string;
  timestamp?: string;
  metadata?: any;
}

interface DraggablePatientQueueProps {
  patients: RawPatient[];
  onPatientsReorder: (patients: Patient[]) => void;
  currentPatientId?: string;
}

// Utility: normalize raw API patient into Patient interface
const mapPatient = (raw: RawPatient): Patient => {
  return {
    id: raw.id,
    number: raw.number,
    status:
      raw.status === "waiting" ||
      raw.status === "next" ||
      raw.status === "now_serving" ||
      raw.status === "done" ||
      raw.status === "skipped"
        ? (raw.status as Patient["status"])
        : "waiting", // fallback
    patient: {
      id: raw.patient.id,
      firstName: raw.patient.firstName,
      middleName: raw.patient.middleName,
      lastName: raw.patient.lastName,
      sex: raw.patient.sex,
      birthDate: raw.patient.birthDate,
      userName: raw.patient.userName,
      contacts: raw.patient.contacts || [],
      images: raw.patient.images || [], // Preserve images during mapping
    },
    // Preserve all other queue properties
    tags: raw.tags || [],
    date: raw.date,
    position: raw.position,
    counter: raw.counter,
    encounter: raw.encounter,
    user: raw.user,
    queueType: raw.queueType,
    timestamp: raw.timestamp,
    metadata: raw.metadata,
  };
};

export const DraggablePatientQueue: React.FC<DraggablePatientQueueProps> = ({
  patients,
  onPatientsReorder,
  currentPatientId,
}) => {
  const [activePatient, setActivePatient] = useState<Patient | null>(null);

  // ✅ Only show waiting + next
  const mappedPatients = patients
    .map(mapPatient)
    .filter((p) => p.status === "waiting" || p.status === "next")
    .sort((a, b) => {
      if (a.status === "next" && b.status !== "next") return -1;
      if (b.status === "next" && a.status !== "next") return 1;
      return 0;
    });

  // Configure sensors for @dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Require 8px of movement before activating drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handle drag start event
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const patient = mappedPatients.find((p) => p.id === active.id);
    setActivePatient(patient || null);
  };

  // Handle drag end event
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = mappedPatients.findIndex((patient) => patient.id === active.id);
      const newIndex = mappedPatients.findIndex((patient) => patient.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedPatients = arrayMove(mappedPatients, oldIndex, newIndex);
        onPatientsReorder(reorderedPatients);
      }
    }

    setActivePatient(null);
  };

  // Get sortable IDs for DndContext
  const sortableIds = mappedPatients.map((patient) => patient.id);

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {mappedPatients.map((patient) => (
            <PatientQueueCard
              key={patient.id}
              patient={patient}
              isCurrentPatient={patient.id === currentPatientId}
            />
          ))}
        </div>
      </SortableContext>

      {/* Drag Overlay for smooth dragging experience */}
      <DragOverlay>
        {activePatient ? (
          <div className="transform rotate-3 scale-105 shadow-2xl opacity-90">
            <PatientQueueCard
              patient={activePatient}
              isCurrentPatient={activePatient.id === currentPatientId}
            />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
