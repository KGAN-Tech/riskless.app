import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
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

export default function ClinicDetailView() {
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

  
  
  return (
    <div>
      <h1>{facility.name}</h1>

      <h2>Addresses</h2>
      {facility.addresses.map((address, index) => (
        <div key={index} style={{ marginBottom: "1rem" }}>
          <div>{address.unit && `Unit: ${address.unit}`}</div>
          <div>{address.buildingName && `Building: ${address.buildingName}`}</div>
          <div>{address.houseNo && `House No: ${address.houseNo}`}</div>
          <div>{address.street && `Street: ${address.street}`}</div>
          <div>{address.barangay?.value && `Barangay: ${address.barangay.value}`}</div>
          <div>{address.city?.value && `City: ${address.city.value}`}</div>
          <div>{address.province?.value && `Province: ${address.province.value}`}</div>
          <div>{address.zipCode && `ZIP Code: ${address.zipCode}`}</div>
          <div>{address.country && `Country: ${address.country}`}</div>
        </div>
      ))}

      <h2>Contacts</h2>
      {facility.contacts.map((contact, index) => (
        <div key={index}>
          <strong>{contact.type}:</strong> {contact.value}
        </div>
      ))}

      
    </div>
  );
}
