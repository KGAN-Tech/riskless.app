import React from 'react';
import { InterviewSidebar } from '~/app/components/organisms/encounter.sidebar';

interface Patient {
  id: string;
  name: string;
  initials: string;
  queueNumber: string;
  status: 'waiting' | 'serving' | 'completed' | 'skipped';
  estimatedWait?: string;
  priority?: 'high' | 'normal' | 'low';
}

interface CountersSidebarProps {
  patients: Patient[];
  onPatientsReorder: (patients: Patient[]) => void;
  onServeNext: () => void;
  onSkipPatient: () => void;
  onRecallPatient: () => void;
  currentPatientId?: string;
}

export const CountersSidebar: React.FC<CountersSidebarProps> = (props) => {

  return (
    <InterviewSidebar
      patients={props.patients}
      onPatientsReorder={props.onPatientsReorder}
      onServeNext={props.onServeNext}
      onSkipPatient={props.onSkipPatient}
      onRecallPatient={props.onRecallPatient}
      currentPatientId={props.currentPatientId}
    />
  );
};
