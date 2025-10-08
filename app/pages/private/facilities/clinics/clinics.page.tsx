import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { facilityService } from "@/services/facility.service";
import { Card } from "~/app/components/atoms/card";

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
  contacts: Array<{ type: string; value: string }>;
};

export default function ClinicsPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchClinics() {
      try {
        const response = await facilityService.getClinics();
        setFacilities(response.data); 
      } catch (error) {
        console.error("Failed to fetch clinics:", error);
      }
    }
    fetchClinics();
  }, []);

  return (
    <div className="space-y-4 px-4 py-6">
      <div className="border-b pb-2">
        <h1 className="text-2xl font-semibold text-gray-800  border-gray-200 ">
          Facilities
        </h1>
        <p className="text-sm text-gray-500">
          Choose the module of facilities you want to use.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {facilities.map((item) => (
          <Card
            key={item.name}
            className="px-4 py-8 cursor-pointer transition hover:shadow-md hover:bg-gray-50"
            onClick={() => navigate(`/facilities/${item.id}`)}
          >
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="p-2 bg-primary/10 rounded-full ">LOGO</div>
              <p className="text-lg font-medium text-gray-700 text-center capitalize">
                {item.name.toLowerCase()}
              </p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
