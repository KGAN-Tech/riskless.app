import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { facilityService } from "@/services/facility.service";
import { Card } from "~/app/components/atoms/card";
import { Filter } from "lucide-react";
import { Button } from "~/app/components/atoms/button";

type Facility = {
  id: string;
  name: string;
  category: string; // make sure this exists in your data
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

export default function FacilitiesPage() {
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const navigate = useNavigate();

  console.log("facilities", facilities);

  useEffect(() => {
    async function fetchClinics() {
      try {
        const response = await facilityService.getClinics();
        const data = response.data;
        setFacilities(data);

        // Extract unique categories + "All"
        const uniqueCategories = Array.from(
          new Set(data.map((facility: Facility) => facility.category))
        );
        setCategories(["All", ...uniqueCategories as string[]]);
      } catch (error) {
        console.error("Failed to fetch clinics:", error);
      }
    }
    fetchClinics();
  }, []);

  // Filter facilities by selected category
  const filteredFacilities =
    selectedCategory === "All"
      ? facilities
      : facilities.filter(
          (facility) => facility.category === selectedCategory
        );

  return (
    <div className="space-y-4 px-4 py-6">
      <div className="border-b pb-2 border-gray-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">Facilities</h1>
          <p className="text-sm text-gray-500">
            Choose the module of facilities you want to use.
          </p>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center gap-2">
          <label htmlFor="category" className="text-sm text-gray-600">
            Category:
          </label>
          <select
            id="category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="border border-gray-300 rounded px-2 py-1 text-sm capitalize"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredFacilities.map((item) => (
          <Card
            key={item.id}
            className="px-4 py-8 cursor-pointer transition hover:shadow-md hover:bg-gray-50"
            onClick={() => navigate(`/facility/${item.id}`)}
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