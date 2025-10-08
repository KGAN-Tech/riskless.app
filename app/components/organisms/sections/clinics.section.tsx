import { useState, useEffect } from 'react';
import { Hospital } from 'lucide-react';
import { SectionHeader } from '@/components/molecules/shared/section-header';
import { ClinicCard } from '@/components/molecules/shared/clinic-card';
import { clinicService } from '@/services/clinic.service';
import type { Clinic } from '@/types/clinic.types';

export const ClinicsSection = () => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [loadingClinics, setLoadingClinics] = useState(true);

  useEffect(() => {
    (async () => {
      const data: Clinic[] = await clinicService._getMockClinics();
      setClinics(data.slice(0, 3));
      setLoadingClinics(false);
    })();
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <SectionHeader
        variant="icon"
        icon={<Hospital className="w-6 h-6 mr-2 text-blue-600" />}
        title="Our Clinics"
        subtitle="Accessible Healthcare Near You"
        description="Discover our network of clinics dedicated to serving your community."
        rightContent={
          <a href="/clinics" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300">View All Clinics</a>
        }
      />
      {loadingClinics ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
          {clinics.map((clinic, index) => (
            <ClinicCard key={clinic.id} clinic={clinic} index={index} />
          ))}
        </div>
      )}
    </section>
  );
};