import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/atoms/tabs';
import { Button } from '@/components/atoms/button';
import { Expand, Minimize, Plus } from 'lucide-react';
import { AppointmentsTable } from './appointments.table';
import { ProgressOverview } from './progress.overview';
import { AppointmentFormModal } from './appointment.form.modal';
import { format, isPast, isToday } from 'date-fns';

interface Appointment {
  id: string;
  patientId: string;
  facilityId: string;
  status: 'rescheduled' | 'on_going' | 'done' | 'canceled' | 'pending';
  date: string; // Use string to match API
  patient?: {
    firstName: string;
    lastName: string;
    middleName?: string;
  };
  patientName?: string;
  time?: string;
  phone?: string;
  email?: string;
  notes?: string;
}

interface AppointmentPanelProps {
  selectedDate: Date;
  isExpanded: boolean;
  onToggleExpand: () => void;
  appointments: Appointment[];
  onAddAppointment: (appointment: Omit<Appointment, 'id'>) => Promise<void>;
  onUpdateAppointment: (appointment: Appointment) => Promise<void>;
  onDeleteAppointment: (appointmentId: string) => Promise<void>;
}

export function AppointmentPanel({ 
  selectedDate, 
  isExpanded, 
  onToggleExpand,
  appointments,
  onAddAppointment,
  onUpdateAppointment,
  onDeleteAppointment
}: AppointmentPanelProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  
  // Check if the selected date is in the past (excluding today)
  const isPastDate = isPast(selectedDate) && !isToday(selectedDate);

  const handleAddAppointment = async (appointmentData: any) => {
    try {
      // Extract patient info from the appointmentData
      // The modal should now pass the complete patient information
      const patientName = appointmentData.patient 
        ? `${appointmentData.patient.firstName} ${appointmentData.patient.lastName}`.trim()
        : appointmentData.patientName || 'New Patient';

      // Transform the data to match our Appointment interface
      const newAppointment: Omit<Appointment, 'id'> = {
        patientId: appointmentData.patientId,
        facilityId: appointmentData.facilityId,
        status: appointmentData.status,
        date: appointmentData.date, // Should be in YYYY-MM-DD format
        patientName: patientName,
        patient: appointmentData.patient, // Include full patient object if available
        time: appointmentData.time || formatTimeFromDate(appointmentData.date),
        phone: appointmentData.phone || '',
        email: appointmentData.email || '',
        notes: appointmentData.notes || '',
      };

      // Call the parent's onAddAppointment function
      await onAddAppointment(newAppointment);
      
      // Close the modal only after successful creation
      setIsFormOpen(false);
      
    } catch (error) {
      console.error('Failed to add appointment:', error);
      // Keep modal open so user can try again
      // You might want to show an error toast here
    }
  };

  // Helper function to format time from ISO date string
  const formatTimeFromDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (error) {
      return '00:00 AM';
    }
  };

  return (
    <div className={`transition-all duration-300 ${isExpanded ? 'w-full' : 'w-2/5'} bg-white shadow-xl border-l border-gray-200 flex flex-col`}>
      {/* Panel Header */}
      <div className="px-6 py-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              {format(selectedDate, 'EEEE, MMMM d')}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {appointments.length} {appointments.length === 1 ? 'appointment' : 'appointments'} scheduled
            </p>
          </div>
          <div className="flex items-center space-x-3">
            {!isPastDate && (
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Appointment
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={onToggleExpand}
              className="border-gray-300 hover:bg-gray-50"
            >
              {isExpanded ? (
                <>
                  <Minimize className="h-4 w-4 mr-2" />
                  Split View
                </>
              ) : (
                <>
                  <Expand className="h-4 w-4 mr-2" />
                  Full Width
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Panel Content */}
      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="appointments" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-2 mx-6 mt-4 bg-gray-100">
            <TabsTrigger value="appointments" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
              Appointments
            </TabsTrigger>
            <TabsTrigger value="progress" className="data-[state=active]:bg-white data-[state=active]:text-blue-600">
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="flex-1 overflow-hidden mt-4">
            <AppointmentsTable 
              selectedDate={selectedDate}
              appointments={appointments}
              onUpdateAppointment={onUpdateAppointment}
              onDeleteAppointment={onDeleteAppointment}
            />
          </TabsContent>

          <TabsContent value="progress" className="flex-1 overflow-hidden mt-4">
            <ProgressOverview selectedDate={selectedDate} />
          </TabsContent>
        </Tabs>
      </div>

      {!isPastDate && (
        <AppointmentFormModal
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSave={handleAddAppointment}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
}