import { ClinicMap } from "@/components/molecules/shared/clinic-map";
import { clinicService } from "@/services/clinic.service";
import { useEffect, useState } from "react";
import type {
  Clinic,
  ClinicStat,
  ClinicDescription,
} from "@/types/clinic.types";

export default function MapsPage() {
    const [clinics, setClinics] = useState<Clinic[]>([]);
    const [stats, setStats] = useState<ClinicStat[]>([]);
    const [description, setDescription] = useState<ClinicDescription | null>(
        null
    );
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState({
        type: "",
        city: "",
        service: "",
    });
    const [showRadius, setShowRadius] = useState(false);
    const [radiusKm, setRadiusKm] = useState(5);

    useEffect(() => {
        const loadData = async () => {
        try {
            setLoading(true);
            const [clinicsData, statsData, descriptionData] = await Promise.all([
            clinicService._getMockClinics(),
            clinicService._getMockClinicStats(),
            clinicService._getMockClinicDescription(),
            ]);
            setClinics(clinicsData);
            setStats(statsData);
            setDescription(descriptionData);
        } catch (err) {
            setError("Failed to load clinics data. Please try again later.");
            console.error("Error loading clinics:", err);
        } finally {
            setLoading(false);
        }
        };

        loadData();
    }, []);

        const filteredClinics = clinics.filter(clinic => {
        const matchesType = !filters.type || clinic.type === filters.type;
        const matchesCity = !filters.city || clinic.location.city === filters.city;
        const matchesService = !filters.service || clinic.services.some(service => service.name === filters.service);
        
        return matchesType && matchesCity && matchesService;
    });
    
    return (
        <>

        {/* Map Section */}
        <div className="mb-16">
          {/* Map Controls */}
          <div className="flex items-center gap-4 mt-6 mb-4">
            <button
              className={`px-4 py-2 rounded-md border transition-colors ${showRadius ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'}`}
              onClick={() => setShowRadius(r => !r)}
            >
              {showRadius ? 'Hide Pin Radius' : 'Show Pin Radius'}
            </button>
            <div className="flex items-center gap-2">
              <label htmlFor="radius-km" className="text-sm text-gray-700">Radius (km):</label>
              <input
                id="radius-km"
                type="number"
                min={1}
                max={100}
                value={radiusKm}
                onChange={e => setRadiusKm(Number(e.target.value))}
                className="w-20 px-2 py-1 border rounded-md text-sm"
                disabled={!showRadius}
              />
            </div>
          </div>
          <div className="mt-8">
            <ClinicMap clinics={filteredClinics} height="600px" showRadius={showRadius} radiusKm={radiusKm} />
          </div>
        </div>
        </>
    );
}