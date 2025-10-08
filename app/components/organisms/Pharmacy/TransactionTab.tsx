import React, { useState } from 'react';
import { Input } from '@/components/atoms/input';
import { Button } from '@/components/atoms/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/atoms/card';
import { Badge } from '@/components/atoms/badge';
import { DispenseModal } from './DispenseModal';
import { CameraScanner } from './CameraScanner';
import { PrescriptionHistoryModal } from './PrescriptionHistoryModal';
import { 
  Search, 
  Pill, 
  Camera, 
  User, 
  Calendar, 
  Package, 
  ChevronDown, 
  ChevronUp, 
  History
} from 'lucide-react';

interface Patient {
  id: string;
  name: string;
  age: number;
  diagnosis: string;
  consultationDate: string;
  prescriptions: any[];
  prescriptionHistory?: PrescriptionHistory[];
}

interface PrescriptionHistory {
  date: string;
  prescribedBy: string;
  medicines: {
    name: string;
    quantity: number;
    dosage: string;
  }[];
}

interface InventoryItem {
  medicine: string;
  available: number;
  expiry: string;
}

interface DispensedRecord {
  id: string;
  patientName: string;
  medicine: string;
  quantity: number;
  timestamp: string;
  remainingStock: number;
}

interface TransactionTabProps {
  inventory: Record<string, InventoryItem>;

  onDispenseComplete: (dispensedMedicines: { medicine: string; quantity: number; patientName: string }[]) => void;
}

export function TransactionTab({ inventory, onDispenseComplete }: TransactionTabProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isDispenseModalOpen, setIsDispenseModalOpen] = useState(false);
  const [isCameraScannerOpen, setIsCameraScannerOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [expandedPatientId, setExpandedPatientId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);

  // Mock patient data with more examples and prescription history
  const patients: Patient[] = [
    {
      id: '1',
      name: 'John Smith',
      age: 45,
      diagnosis: 'Hypertension',
      consultationDate: '2024-01-15',
      prescriptions: [
        { id: '1', medicine: 'Amlodipine 5mg', quantity: 30, frequency: 'Once daily' },
        { id: '2', medicine: 'Metformin 500mg', quantity: 60, frequency: 'Twice daily' },
        { id: '3', medicine: 'Metformin 200mg', quantity: 60, frequency: 'Twice daily' },
        { id: '4', medicine: 'Metformin 100mg', quantity: 60, frequency: 'Twice daily' },
        { id: '5', medicine: 'Metformin 500mg', quantity: 60, frequency: 'Twice daily' }
      ],
      prescriptionHistory: [
        {
          date: '2023-12-15',
          prescribedBy: 'Dr. Johnson',
          medicines: [
            { name: 'Amlodipine 5mg', quantity: 30, dosage: 'Once daily' },
            { name: 'Amlodipine 5mg', quantity: 30, dosage: 'Once daily' },
            { name: 'Amlodipine 5mg', quantity: 30, dosage: 'Once daily' },
            { name: 'Lisinopril 10mg', quantity: 30, dosage: 'Once daily' },
            { name: 'Lisinopril 5mg', quantity: 30, dosage: 'Once daily' },
          ]
        },
        {
          date: '2023-11-10',
          prescribedBy: 'Dr. Johnson',
          medicines: [
            { name: 'Amlodipine 5mg', quantity: 30, dosage: 'Once daily' },
            { name: 'Amlodipine 5mg', quantity: 30, dosage: 'Once daily' },
            { name: 'Amlodipine 5mg', quantity: 30, dosage: 'Once daily' },
            { name: 'Amlodipine 5mg', quantity: 30, dosage: 'Once daily' },
          ]
        }
      ]
    },
    {
      id: '2',
      name: 'Maria Garcia',
      age: 32,
      diagnosis: 'Respiratory Infection',
      consultationDate: '2024-01-14',
      prescriptions: [
        { id: '3', medicine: 'Amoxicillin 500mg', quantity: 21, frequency: 'Three times daily' },
        { id: '4', medicine: 'Cough Syrup', quantity: 1, frequency: 'As needed' }
      ],
      prescriptionHistory: [
        {
          date: '2023-12-10',
          prescribedBy: 'Dr. Martinez',
          medicines: [
            { name: 'Ibuprofen 400mg', quantity: 20, dosage: 'As needed for pain' }
          ]
        }
      ]
    },
    {
      id: '3',
      name: 'Robert Johnson',
      age: 58,
      diagnosis: 'Diabetes Type 2',
      consultationDate: '2024-01-13',
      prescriptions: [
        { id: '5', medicine: 'Insulin Glargine', quantity: 3, frequency: 'Once daily' },
        { id: '6', medicine: 'Metformin 1000mg', quantity: 30, frequency: 'Twice daily' }
      ],
      prescriptionHistory: [
        {
          date: '2023-12-13',
          prescribedBy: 'Dr. Williams',
          medicines: [
            { name: 'Insulin Glargine', quantity: 3, dosage: 'Once daily' },
            { name: 'Metformin 1000mg', quantity: 30, dosage: 'Twice daily' }
          ]
        },
        {
          date: '2023-11-13',
          prescribedBy: 'Dr. Williams',
          medicines: [
            { name: 'Insulin Glargine', quantity: 2, dosage: 'Once daily' },
            { name: 'Metformin 500mg', quantity: 60, dosage: 'Twice daily' }
          ]
        }
      ]
    },
  ];

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPatients = filteredPatients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleDispense = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsDispenseModalOpen(true);
  };

  const handleViewHistory = (patient: Patient) => {
    setSelectedPatient(patient);
    setIsHistoryModalOpen(true);
  };

  const handleCameraScan = (patientData: any) => {
    // Handle scanned patient data
    const foundPatient = patients.find(p => p.id === patientData.patientId);
    if (foundPatient) {
      setSelectedPatient(foundPatient);
      setIsDispenseModalOpen(true);
    }
    setIsCameraScannerOpen(false);
  };

  const getAvailabilityStatus = (medicine: string, requestedQty: number) => {
    const stock = inventory?.[medicine];
    if (!stock) return { status: 'unavailable', available: 0 };
    
    if (stock.available >= requestedQty) {
      return { status: 'available', available: stock.available };
    } else if (stock.available > 0) {
      return { status: 'limited', available: stock.available };
    } else {
      return { status: 'unavailable', available: stock.available };
    }
  };

  const togglePatientExpansion = (patientId: string) => {
    setExpandedPatientId(expandedPatientId === patientId ? null : patientId);
  };

  return (
    <div className="space-y-6">
      {/* Search and Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
          <Input
            placeholder="Search patient by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
          />
        </div>
        <Button
          onClick={() => setIsCameraScannerOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white gap-2"
        >
          <Camera className="h-4 w-4" />
          <span className="hidden sm:inline">Scan QR Code</span>
          <span className="sm:hidden">Scan</span>
        </Button>
      </div>

      {/* Patient Table */}
      <Card className="border-blue-100 bg-white">
        <CardHeader>
          <CardTitle className="text-blue-900 flex items-center gap-2">
            <User className="h-5 w-5" />
            Patient List
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {/* Desktop Table View */}
          <div className="hidden lg:block">
            <div className="bg-white from-blue-50 to-indigo-50 p-4 rounded-t-lg border-b border-blue-100">
              <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-blue-900 uppercase tracking-wide">
                <div className="col-span-2">Patient Info</div>
                <div className="col-span-2">Consultation</div>
                <div className="col-span-3">Prescriptions</div>
                <div className="col-span-2">Quantity Prescribed</div>
                <div className="col-span-3 text-center">Actions</div>
              </div>
            </div>
            <div className="divide-y divide-gray-100">
              {currentPatients.map((patient, index) => (
                <React.Fragment key={patient.id}>
                  <div className={`p-3 hover:bg-gradient-to-r hover:from-blue-25 hover:to-indigo-25 transition-all duration-200 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                  }`}>
                    <div className="grid grid-cols-12 gap-4 items-center">
                      {/* Patient Info */}
                      <div className="col-span-2">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                            {patient.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">{patient.name}</p>
                            <p className="text-gray-600 text-xs">Age: {patient.age}</p>
                          </div>
                        </div>
                      </div>

                      {/* Consultation Info */}
                      <div className="col-span-2">
                        <div className="space-y-1">
                          <p className="font-medium text-gray-900 text-xs">{patient.diagnosis}</p>
                          <div className="flex items-center gap-1 text-gray-600 text-xs">
                            <Calendar className="h-3 w-3 text-blue-500" />
                            <span>{patient.consultationDate}</span>
                          </div>
                        </div>
                      </div>

                      {/* Prescriptions Summary */}
                      <div className="col-span-3">
                        <div className="flex flex-wrap gap-1">
                          {patient.prescriptions.slice(0, 3).map((prescription) => (
                            <Badge 
                              key={prescription.id}
                              variant="outline" 
                              className="border-blue-200 text-blue-700 bg-blue-50 text-xs"
                            >
                              <Pill className="h-3 w-3 mr-1" />
                              {prescription.medicine.split(' ')[0]}
                            </Badge>
                          ))}
                          {patient.prescriptions.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{patient.prescriptions.length - 3} more
                            </Badge>
                          )}
                        </div>
                      </div>

                      {/* Quantity Prescribed */}
                      <div className="col-span-2">
                        <div className="flex flex-wrap gap-2">
                          {patient.prescriptions.slice(0, 3).map((prescription) => (
                            <Badge 
                              key={prescription.id}
                              className="bg-gray-100 text-gray-800 border-gray-200 text-xs"
                            >
                              {prescription.quantity} units
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="col-span-3 flex justify-center items-center gap-2">
                        <Button
                          onClick={() => handleDispense(patient)}
                          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-1 text-xs font-medium rounded-lg"
                        >
                          Dispense
                        </Button>
                        <Button
                          onClick={() => handleViewHistory(patient)}
                          variant="outline"
                          className="text-blue-600 border-blue-200 hover:bg-blue-50 px-3 py-1 text-xs font-medium rounded-lg flex items-center gap-1"
                        >
                          <History className="h-3 w-3" />
                          History
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => togglePatientExpansion(patient.id)}
                          className="text-gray-600 border-gray-200 hover:bg-gray-50 h-8 w-8 p-0"
                        >
                          {expandedPatientId === patient.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Expanded Row for Prescription Details */}
                  {expandedPatientId === patient.id && (
                    <div className="bg-blue-25 p-3 border-b border-blue-100">
                      <div className="mb-2 font-medium text-blue-900 text-sm">Current Prescription Details</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                        {patient.prescriptions.map((prescription) => {
                          const availability = getAvailabilityStatus(prescription.medicine, prescription.quantity);
                          return (
                            <Card key={prescription.id} className="border-blue-100 p-2">
                              <CardContent className="p-2">
                                <div className="flex items-start justify-between mb-2">
                                  <div className="flex items-center gap-2">
                                    <div className="h-5 w-5 bg-blue-100 rounded-full flex items-center justify-center">
                                      <Pill className="h-3 w-3 text-blue-600" />
                                    </div>
                                    <span className="font-medium text-gray-900 text-xs">{prescription.medicine}</span>
                                  </div>
                                  <Badge 
                                    className={`text-xs font-medium ${
                                      availability.status === 'available' ? 'bg-green-100 text-green-800 border-green-200' :
                                      availability.status === 'limited' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                      'bg-red-100 text-red-800 border-red-200'
                                    }`}
                                  >
                                    <Package className="h-3 w-3 mr-1" />
                                    {availability.available} available
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-1 text-xs">
                                  <div>
                                    <span className="font-medium text-gray-600">Quantity:</span>
                                    <p className="text-gray-900">{prescription.quantity}</p>
                                  </div>
                                  <div>
                                    <span className="font-medium text-gray-600">Frequency:</span>
                                    <p className="text-blue-600">{prescription.frequency}</p>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>

            {/* Pagination Controls */}
            {filteredPatients.length > itemsPerPage && (
              <div className="flex justify-center items-center p-4 border-t border-gray-200">
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    &lt;
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <Button
                      key={number}
                      variant={currentPage === number ? "default" : "outline"}
                      size="sm"
                      onClick={() => paginate(number)}
                      className="h-8 w-8 p-0"
                    >
                      {number}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    &gt;
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Card View */}
          <div className="lg:hidden space-y-3 p-3">
            {currentPatients.map((patient) => (
              <div key={patient.id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-3 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{patient.name}</p>
                        <p className="text-xs text-gray-600">Age: {patient.age}</p>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePatientExpansion(patient.id)}
                      className="text-gray-600 border-gray-200 hover:bg-gray-50 h-7 w-7 p-0"
                    >
                      {expandedPatientId === patient.id ? 
                        <ChevronUp className="h-3 w-3" /> : 
                        <ChevronDown className="h-3 w-3" />
                      }
                    </Button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-3 space-y-3">
                  {/* Diagnosis and Date */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">Diagnosis</p>
                      <p className="text-xs font-medium text-gray-900">{patient.diagnosis}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-gray-500">Date</p>
                      <div className="flex items-center gap-1 text-xs text-gray-900">
                        <Calendar className="h-3 w-3 text-blue-500" />
                        <span>{patient.consultationDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Prescription Summary */}
                  <div className="flex flex-wrap gap-1">
                    {patient.prescriptions.slice(0, 3).map((prescription) => (
                      <Badge 
                        key={prescription.id}
                        className="bg-blue-100 text-blue-800 border-blue-200 text-xs"
                      >
                        <Pill className="h-3 w-3 mr-1" />
                        {prescription.medicine.split(' ')[0]} ({prescription.quantity})
                      </Badge>
                    ))}
                    {patient.prescriptions.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{patient.prescriptions.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  {/* Expanded Prescriptions */}
                  {expandedPatientId === patient.id && (
                    <div className="space-y-2 pt-2 border-t border-gray-100">
                      <p className="font-medium text-blue-900 text-xs">Current Prescriptions:</p>
                      {patient.prescriptions.map((prescription) => {
                        const availability = getAvailabilityStatus(prescription.medicine, prescription.quantity);
                        return (
                          <div key={prescription.id} className="bg-gray-50 border border-gray-200 rounded p-2">
                            <div className="flex items-start justify-between mb-1">
                              <div className="flex items-center gap-1 flex-1">
                                <div className="h-4 w-4 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <Pill className="h-2 w-2 text-blue-600" />
                                </div>
                                <span className="text-xs font-medium text-gray-900 leading-tight">{prescription.medicine}</span>
                              </div>
                              <Badge 
                                className={`text-xs font-medium ml-1 ${
                                  availability.status === 'available' ? 'bg-green-100 text-green-800 border-green-200' :
                                  availability.status === 'limited' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' :
                                  'bg-red-100 text-red-800 border-red-200'
                                }`}
                              >
                                <Package className="h-2 w-2 mr-1" />
                                {availability.available}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-gray-600">Qty: {prescription.quantity}</span>
                              <span className="text-blue-600">{prescription.frequency}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleDispense(patient)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2 text-xs rounded-lg"
                    >
                      Dispense
                    </Button>
                    <Button
                      onClick={() => handleViewHistory(patient)}
                      variant="outline"
                      className="text-blue-600 border-blue-200 hover:bg-blue-50 font-medium py-2 text-xs rounded-lg flex items-center gap-1"
                    >
                      <History className="h-3 w-3" />
                      History
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination Controls for Mobile */}
            {filteredPatients.length > itemsPerPage && (
              <div className="flex justify-center items-center pt-3">
                <div className="flex space-x-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    &lt;
                  </Button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <Button
                      key={number}
                      variant={currentPage === number ? "default" : "outline"}
                      size="sm"
                      onClick={() => paginate(number)}
                      className="h-8 w-8 p-0 text-xs"
                    >
                      {number}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    &gt;
                  </Button>
                </div>
              </div>
            )}
          </div>

          {filteredPatients.length === 0 && searchTerm && (
            <div className="p-6 text-center">
              <p className="text-blue-600">No patients found matching "{searchTerm}"</p>
            </div>
          )}

          {filteredPatients.length === 0 && !searchTerm && (
            <div className="p-6 text-center">
              <p className="text-blue-600">No patients available</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <DispenseModal
        isOpen={isDispenseModalOpen}
        onClose={() => setIsDispenseModalOpen(false)}
        patient={selectedPatient}
        inventory={inventory || {}}
        onDispenseComplete={onDispenseComplete}
      />

      <CameraScanner
        isOpen={isCameraScannerOpen}
        onClose={() => setIsCameraScannerOpen(false)}
        onScan={handleCameraScan}
      />

      {/* Prescription History Modal */}
      <PrescriptionHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        patient={selectedPatient}
      />
    </div>
  );
}