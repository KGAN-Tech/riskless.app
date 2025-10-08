import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/atoms/table';
import { CheckCircle, Circle } from 'lucide-react';

interface ProgressOverviewProps {
  selectedDate: Date;
}

interface PatientProgress {
  id: string;
  name: string;
  checkIn: boolean;
  interview: boolean;
  vitals: boolean;
  consultation: boolean;
  laboratory: boolean;
  pharmacy: boolean;
}

// Mock patient progress data
const mockPatientProgress: PatientProgress[] = [
  {
    id: 'p1',
    name: 'Sarah Johnson',
    checkIn: true,
    interview: true,
    vitals: true,
    consultation: true,
    laboratory: true,
    pharmacy: true
  },
  {
    id: 'p2',
    name: 'Michael Chen',
    checkIn: true,
    interview: true,
    vitals: true,
    consultation: true,
    laboratory: false,
    pharmacy: false
  },
  {
    id: 'p3',
    name: 'Emily Rodriguez',
    checkIn: true,
    interview: false,
    vitals: false,
    consultation: false,
    laboratory: false,
    pharmacy: false
  },
  {
    id: 'p4',
    name: 'David Thompson',
    checkIn: true,
    interview: true,
    vitals: true,
    consultation: false,
    laboratory: false,
    pharmacy: false
  },
  {
    id: 'p5',
    name: 'Lisa Wilson',
    checkIn: false,
    interview: false,
    vitals: false,
    consultation: false,
    laboratory: false,
    pharmacy: false
  }
];

const CheckIcon = ({ completed }: { completed: boolean }) => {
  return completed ? (
    <CheckCircle className="h-5 w-5 text-green-600" />
  ) : (
    <Circle className="h-5 w-5 text-gray-300" />
  );
};

export function ProgressOverview({ selectedDate }: ProgressOverviewProps) {
  return (
    <div className="px-4 pb-4 h-full flex flex-col">
      <div className="mb-4">
        <h3 className="text-lg font-medium">Patient Journey Progress</h3>
        <p className="text-sm text-muted-foreground">
          Track each patient's progress through the appointment journey
        </p>
      </div>
      
      <div className="flex-1 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[150px]">Name</TableHead>
              <TableHead className="text-center w-20">Check-in</TableHead>
              <TableHead className="text-center w-20">Interview</TableHead>
              <TableHead className="text-center w-20">Vitals</TableHead>
              <TableHead className="text-center w-20">Consultation</TableHead>
              <TableHead className="text-center w-20">Laboratory</TableHead>
              <TableHead className="text-center w-20">Pharmacy</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockPatientProgress.map((patient) => (
              <TableRow key={patient.id}>
                <TableCell className="font-medium">{patient.name}</TableCell>
                <TableCell className="text-center">
                  <CheckIcon completed={patient.checkIn} />
                </TableCell>
                <TableCell className="text-center">
                  <CheckIcon completed={patient.interview} />
                </TableCell>
                <TableCell className="text-center">
                  <CheckIcon completed={patient.vitals} />
                </TableCell>
                <TableCell className="text-center">
                  <CheckIcon completed={patient.consultation} />
                </TableCell>
                <TableCell className="text-center">
                  <CheckIcon completed={patient.laboratory} />
                </TableCell>
                <TableCell className="text-center">
                  <CheckIcon completed={patient.pharmacy} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}