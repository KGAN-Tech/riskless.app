import { ArrowLeft, Pill, Clock, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Card } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/atoms/tabs";
import { Progress } from "@/components/atoms/progress";

interface PrescriptionsPageProps {
  onBack: () => void;
}

export function PrescriptionsPage({ onBack }: PrescriptionsPageProps) {
  const activePrescriptions = [
    {
      id: 1,
      medication: "Lisinopril 10mg",
      dosage: "1 tablet daily",
      prescribedBy: "Dr. Sarah Johnson",
      startDate: "2024-08-01",
      endDate: "2024-11-01",
      refills: 2,
      totalRefills: 3,
      instructions: "Take with food in the morning",
      status: "Active",
      progress: 75,
    },
    {
      id: 2,
      medication: "Metformin 500mg",
      dosage: "2 tablets twice daily",
      prescribedBy: "Dr. Sarah Johnson",
      startDate: "2024-07-15",
      endDate: "2024-12-15",
      refills: 0,
      totalRefills: 2,
      instructions: "Take with meals",
      status: "Refill Needed",
      progress: 90,
    },
  ];

  const pastPrescriptions = [
    {
      id: 3,
      medication: "Amoxicillin 500mg",
      dosage: "3 tablets daily",
      prescribedBy: "Dr. Michael Chen",
      startDate: "2024-07-01",
      endDate: "2024-07-10",
      instructions: "Complete full course",
      status: "Completed",
    },
    {
      id: 4,
      medication: "Ibuprofen 400mg",
      dosage: "As needed for pain",
      prescribedBy: "Dr. Sarah Johnson",
      startDate: "2024-06-20",
      endDate: "2024-07-20",
      instructions: "Do not exceed 3 tablets per day",
      status: "Completed",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800";
      case "Refill Needed":
        return "bg-yellow-100 text-yellow-800";
      case "Completed":
        return "bg-blue-100 text-blue-800";
      case "Expired":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "Refill Needed":
        return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
      case "Completed":
        return <CheckCircle className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const ActivePrescriptionCard = ({ prescription }: { prescription: any }) => (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-blue-600" />
          <div>
            <h3 className="font-medium">{prescription.medication}</h3>
            <p className="text-sm text-muted-foreground">{prescription.dosage}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {getStatusIcon(prescription.status)}
          <Badge className={getStatusColor(prescription.status)}>
            {prescription.status}
          </Badge>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="text-sm text-muted-foreground">
          <p><span className="font-medium">Prescribed by:</span> {prescription.prescribedBy}</p>
          <p><span className="font-medium">Instructions:</span> {prescription.instructions}</p>
          <p><span className="font-medium">Period:</span> {prescription.startDate} to {prescription.endDate}</p>
        </div>
        
        {prescription.status === "Active" && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Treatment Progress</span>
              <span>{prescription.progress}%</span>
            </div>
            <Progress value={prescription.progress} className="h-2" />
          </div>
        )}
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Refills: {prescription.refills}/{prescription.totalRefills} remaining
          </div>
          <div className="flex gap-2">
            {prescription.status === "Refill Needed" && (
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                <RefreshCw className="h-3 w-3 mr-1" />
                Request Refill
              </Button>
            )}
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );

  const PastPrescriptionCard = ({ prescription }: { prescription: any }) => (
    <Card className="p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Pill className="h-5 w-5 text-gray-400" />
          <div>
            <h3 className="font-medium">{prescription.medication}</h3>
            <p className="text-sm text-muted-foreground">{prescription.dosage}</p>
          </div>
        </div>
        <Badge className={getStatusColor(prescription.status)}>
          {prescription.status}
        </Badge>
      </div>
      
      <div className="text-sm text-muted-foreground space-y-1">
        <p><span className="font-medium">Prescribed by:</span> {prescription.prescribedBy}</p>
        <p><span className="font-medium">Instructions:</span> {prescription.instructions}</p>
        <p><span className="font-medium">Period:</span> {prescription.startDate} to {prescription.endDate}</p>
      </div>
      
      <div className="flex justify-end mt-3">
        <Button variant="outline" size="sm">
          View Details
        </Button>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-md mx-auto bg-white min-h-screen md:max-w-2xl lg:max-w-4xl md:my-8 md:rounded-xl md:shadow-lg">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 md:p-6 border-b">
          <Button variant="ghost" size="icon" onClick={onBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-medium">Prescriptions</h1>
            <p className="text-sm text-muted-foreground">Manage your medications</p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4 p-4 md:p-6 border-b">
          <Card className="p-3 text-center">
            <div className="text-lg font-semibold text-blue-600">2</div>
            <div className="text-xs text-muted-foreground">Active</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-semibold text-yellow-600">1</div>
            <div className="text-xs text-muted-foreground">Refill Needed</div>
          </Card>
          <Card className="p-3 text-center">
            <div className="text-lg font-semibold text-green-600">4</div>
            <div className="text-xs text-muted-foreground">Total</div>
          </Card>
        </div>

        {/* Content */}
        <div className="p-4 md:p-6">
          <Tabs defaultValue="active" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="past">Past</TabsTrigger>
            </TabsList>
            
            <TabsContent value="active" className="space-y-4">
              {activePrescriptions.length > 0 ? (
                activePrescriptions.map((prescription) => (
                  <ActivePrescriptionCard key={prescription.id} prescription={prescription} />
                ))
              ) : (
                <div className="text-center py-8">
                  <Pill className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No active prescriptions</p>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="past" className="space-y-4">
              {pastPrescriptions.map((prescription) => (
                <PastPrescriptionCard key={prescription.id} prescription={prescription} />
              ))}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}