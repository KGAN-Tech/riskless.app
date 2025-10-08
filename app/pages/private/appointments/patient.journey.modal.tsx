import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/atoms/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/atoms/table';
import { CheckCircle, Circle, Clock, User } from 'lucide-react';
import { format } from 'date-fns';

interface PatientJourneyModalProps {
  patientId: string;
  patientName: string;
  isOpen: boolean;
  onClose: () => void;
}

interface JourneyStep {
  checkIn: boolean;
  interview: boolean;
  vitals: boolean;
  consultation: boolean;
  laboratory: boolean;
  pharmacy: boolean;
}

interface CurrentJourney extends JourneyStep {
  date: Date;
  status: 'in-progress' | 'completed';
}

interface HistoryEntry extends JourneyStep {
  id: string;
  date: Date;
  time: string;
}

// Mock current journey data
const mockCurrentJourney: CurrentJourney = {
  date: new Date('2024-01-15T09:00:00'),
  status: 'in-progress',
  checkIn: true,
  interview: true,
  vitals: true,
  consultation: true,
  laboratory: false,
  pharmacy: false
};

// Mock history data
const mockHistory: HistoryEntry[] = [
  {
    id: '1',
    date: new Date('2024-01-10'),
    time: '10:00 AM',
    checkIn: true,
    interview: true,
    vitals: true,
    consultation: true,
    laboratory: true,
    pharmacy: true
  },
  {
    id: '2',
    date: new Date('2024-01-05'),
    time: '2:00 PM',
    checkIn: true,
    interview: true,
    vitals: true,
    consultation: true,
    laboratory: false,
    pharmacy: false
  },
  {
    id: '3',
    date: new Date('2023-12-20'),
    time: '11:30 AM',
    checkIn: true,
    interview: true,
    vitals: true,
    consultation: true,
    laboratory: true,
    pharmacy: true
  },
  {
    id: '4',
    date: new Date('2023-12-01'),
    time: '9:15 AM',
    checkIn: true,
    interview: true,
    vitals: true,
    consultation: true,
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

const StatusIcon = ({ status }: { status: 'in-progress' | 'completed' }) => {
  return status === 'completed' ? (
    <CheckCircle className="h-5 w-5 text-green-600" />
  ) : (
    <Clock className="h-5 w-5 text-yellow-600" />
  );
};

export function PatientJourneyModal({ patientId, patientName, isOpen, onClose }: PatientJourneyModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[85vh] overflow-hidden flex flex-col">
        <DialogHeader className="pb-4 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold text-gray-900">
                Patient Journey - {patientName}
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                Track appointment progress and historical data
              </p>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="current" className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2 bg-gray-100 mx-0">
            <TabsTrigger value="current" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
              Current Visit
            </TabsTrigger>
            <TabsTrigger value="history" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
              History
            </TabsTrigger>
          </TabsList>

          <TabsContent value="current" className="flex-1 overflow-auto mt-6 px-1">
            <div className="space-y-6">
              <div className="flex items-center space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <StatusIcon status={mockCurrentJourney.status} />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {format(mockCurrentJourney.date, 'EEEE, MMMM d, yyyy')}
                  </h4>
                  <p className="text-sm text-gray-600 capitalize">
                    Status: {mockCurrentJourney.status.replace('-', ' ')}
                  </p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-center w-32 font-semibold text-gray-900">Check-in</TableHead>
                      <TableHead className="text-center w-32 font-semibold text-gray-900">Interview</TableHead>
                      <TableHead className="text-center w-32 font-semibold text-gray-900">Vitals</TableHead>
                      <TableHead className="text-center w-32 font-semibold text-gray-900">Consultation</TableHead>
                      <TableHead className="text-center w-32 font-semibold text-gray-900">Laboratory</TableHead>
                      <TableHead className="text-center w-32 font-semibold text-gray-900">Pharmacy</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className="hover:bg-gray-50">
                      <TableCell className="text-center py-6">
                        <CheckIcon completed={mockCurrentJourney.checkIn} />
                      </TableCell>
                      <TableCell className="text-center py-6">
                        <CheckIcon completed={mockCurrentJourney.interview} />
                      </TableCell>
                      <TableCell className="text-center py-6">
                        <CheckIcon completed={mockCurrentJourney.vitals} />
                      </TableCell>
                      <TableCell className="text-center py-6">
                        <CheckIcon completed={mockCurrentJourney.consultation} />
                      </TableCell>
                      <TableCell className="text-center py-6">
                        <CheckIcon completed={mockCurrentJourney.laboratory} />
                      </TableCell>
                      <TableCell className="text-center py-6">
                        <CheckIcon completed={mockCurrentJourney.pharmacy} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history" className="flex-1 overflow-auto mt-6 px-1">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Appointment History</h3>
                  <p className="text-sm text-gray-600">
                    Complete journey tracking for all previous visits
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  {mockHistory.length} previous appointments
                </div>
              </div>
              
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-32 font-semibold text-gray-900">Date</TableHead>
                      <TableHead className="w-24 font-semibold text-gray-900">Time</TableHead>
                      <TableHead className="text-center w-28 font-semibold text-gray-900">Check-in</TableHead>
                      <TableHead className="text-center w-28 font-semibold text-gray-900">Interview</TableHead>
                      <TableHead className="text-center w-28 font-semibold text-gray-900">Vitals</TableHead>
                      <TableHead className="text-center w-28 font-semibold text-gray-900">Consultation</TableHead>
                      <TableHead className="text-center w-28 font-semibold text-gray-900">Laboratory</TableHead>
                      <TableHead className="text-center w-28 font-semibold text-gray-900">Pharmacy</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockHistory.map((entry) => (
                      <TableRow key={entry.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-900">
                          {format(entry.date, 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-gray-600">
                          {entry.time}
                        </TableCell>
                        <TableCell className="text-center">
                          <CheckIcon completed={entry.checkIn} />
                        </TableCell>
                        <TableCell className="text-center">
                          <CheckIcon completed={entry.interview} />
                        </TableCell>
                        <TableCell className="text-center">
                          <CheckIcon completed={entry.vitals} />
                        </TableCell>
                        <TableCell className="text-center">
                          <CheckIcon completed={entry.consultation} />
                        </TableCell>
                        <TableCell className="text-center">
                          <CheckIcon completed={entry.laboratory} />
                        </TableCell>
                        <TableCell className="text-center">
                          <CheckIcon completed={entry.pharmacy} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}