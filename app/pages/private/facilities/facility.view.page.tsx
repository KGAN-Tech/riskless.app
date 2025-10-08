import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { facilityService } from "@/services/facility.service";
import { Card, CardContent, CardHeader, CardTitle } from "~/app/components/atoms/card";
import { Badge } from "~/app/components/atoms/badge";
import { Building2, Mail, MapPin, Phone, Shield } from "lucide-react";

type Facility = {
  id: string;
  name: string;
  addresses: Array<{
    unit?: string;
    buildingName?: string;
    houseNo?: string;
    street?: string;
    province?: { value: string };
    city?: { value: string };
    barangay?: { value: string };
    zipCode?: string;
    country?: string;
  }>;
  encounters: Array<{
    patientId: string;
    effectivityYear: string;
  }>;
  provider: string;
  category: string;
  contacts: Array<{ type: string; value: string }>;
};

export default function FacilityViewPage() {
  const [facility, setFacility] = useState<Facility | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { facilityId: paramFacilityId } = useParams<{ facilityId?: string }>();
  const facilityId: string | undefined = paramFacilityId;

  useEffect(() => {
    async function fetchFacility() {
      try {
        setIsLoading(true);
        setError(null);
        if (!facilityId) throw new Error("No facility ID provided");

        const response = await facilityService.get(facilityId);
        // Assuming your API returns { data: { ...facilityData } }
        setFacility(response.data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch facility details");
      } finally {
        setIsLoading(false);
      }
    }
    fetchFacility();
  }, [facilityId]);

  const fetchFacility = async () => {
    try {
      setIsLoading(true);
      const res: any = await facilityService.get(facilityId as string);

      setFacility(res.data);
    } catch (error) {
      console.error("Error fetching facility:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (facilityId) {
      fetchFacility();
    }
  }, [facilityId]);

  if (isLoading) return <div>Loading facility details...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!facility) return <div>No facility found</div>;
  
  console.log(facility);

  return (
    <div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Facility Information
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                        <p className="font-medium">{facility.addresses.map((address) => address.street).join(", ") || "N/A"}</p>
                        <p className="text-sm text-muted-foreground">{facility.addresses.map((address) => address.city?.value).join(", ") || "Quezon City, Philippines"}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{facility.contacts.find((contact) => contact.type === "phone")?.value || "N/A"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{facility.contacts.find((contact) => contact.type === "email")?.value || "info@facility.com"}</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Shield className="h-4 w-4 text-muted-foreground" />
                        <div>
                        <p className="font-medium">Provider: {facility.provider}</p>
                        <p className="text-sm text-muted-foreground">Category: {facility.category}</p>
                        </div>
                    </div>
                    </div>
                </CardContent>
            </Card>

            {/* Accreditation */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Accreditation & Certification
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="space-y-2">
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Accreditation No.</span>
                        <span className="font-medium">P03037945</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">PMCC No.</span>
                        <span className="font-medium">Z14559</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Certification ID</span>
                        <span className="font-medium">KON-DUMMYCERTS-Z14559</span>
                    </div>
                    <div className="pt-2 border-t">
                        <Badge className="bg-green-50 text-green-700 hover:bg-green-50">
                        Verified & Active
                        </Badge>
                    </div>
                    </div>
                </CardContent>
            </Card>
        </div>

        {/* <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Encounters</h2>
            {!facility?.encounters?.length ? (
                <p>No encounters found.</p>
            ) : (
                <table className="min-w-full border border-gray-300">
                <thead className="bg-gray-100">
                    <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">ID</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Effectivity Year</th>
                    </tr>
                </thead>
                <tbody>
                    {facility.encounters.map((encounter) => (
                    <tr key={encounter.patientId} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2">{encounter.patientId}</td>
                        <td className="border border-gray-300 px-4 py-2">{encounter.effectivityYear}</td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
        </div> */}
    </div>
  );
}
