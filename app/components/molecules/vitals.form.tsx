import React from "react";

export interface VitalsData {
  bloodPressure: { systolic: string; diastolic: string };
  heartRate: string;
  respiratoryRate: string;
  temperature: string;
}

interface VitalsFormProps {
  vitalsData?: {
    bloodPressure: { systolic: string; diastolic: string };
    heartRate: string;
    respiratoryRate: string;
    temperature: string;
    bloodType?: string;
    findings: {
      heent: string[];
      chestBreastLungs: string[];
      heart: string[];
      abdomen: string[];
      genitourinary: string[];
      dre: string[];
      extremities: string[],
      neurological: string[],
    };
    labImaging: {
      facilityType: 'within' | 'partner';
      date: string;
      fee: string;
      fbsMgDl: string;
      fbsMmol: string;
      rbsMgDl: string;
      rbsMmol: string;
    };
    chd: {
      highFatHighSalt?: 'yes' | 'no';
      fiberVeg?: 'yes' | 'no';
      fiberFruits?: 'yes' | 'no';
      physicalActivity?: 'yes' | 'no';
      diabetesDiagnosed?: 'yes' | 'no' | 'unknown';
    }
  };
  onVitalsChange: (data: VitalsData) => void;
  vitals: boolean;
  pertinentFindings: boolean;
  laborartoryImaging: boolean;
  chd: boolean;
}

export const VitalsForm: React.FC<VitalsFormProps> = ({ 
  vitalsData, 
  onVitalsChange,
  vitals = false,
  pertinentFindings = false,
  laborartoryImaging = false,
  chd = false,

}) => {
  const activeSection: "vitals" | "pertinent-findings" | "laboratory-imaging" | "chd" | null =
        vitals ? "vitals" :
        pertinentFindings ? "pertinent-findings" :
        laborartoryImaging ? "laboratory-imaging" :
        chd ? "chd" : null;

  const updateVitals = (path: string[], val: any) => {
      if (!onVitalsChange || !vitalsData) return;
      const clone = JSON.parse(JSON.stringify(vitalsData));
      let obj: any = clone;
      for (let i = 0; i < path.length - 1; i++) obj = obj[path[i]];
      obj[path[path.length - 1]] = val;
      onVitalsChange(clone);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-4">
      {/* Tab content */}
      {activeSection === "vitals" && vitalsData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Blood Pressure */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Blood Pressure:</label>
            <div className="flex items-center space-x-2">
              <input className="w-full px-3 py-2 border rounded" placeholder="Systolic" value={vitalsData.bloodPressure.systolic} onChange={(e) => updateVitals(["bloodPressure", "systolic"], e.target.value)} />
              <input className="w-full px-3 py-2 border rounded" placeholder="Diastolic" value={vitalsData.bloodPressure.diastolic} onChange={(e) => updateVitals(["bloodPressure", "diastolic"], e.target.value)} />
              <span className="text-sm text-gray-500">mmHg</span>
            </div>
          </div>
          {/* Heart Rate */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Heart Rate:</label>
            <div className="flex items-center space-x-2">
              <input className="w-full px-3 py-2 border rounded" placeholder="Heart Rate" value={vitalsData.heartRate} onChange={(e) => updateVitals(["heartRate"], e.target.value)} />
              <span className="text-sm text-gray-500">/min</span>
            </div>
          </div>
          {/* Respiratory Rate */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Respiratory Rate:</label>
            <div className="flex items-center space-x-2">
              <input className="w-full px-3 py-2 border rounded" placeholder="Respiratory Rate" value={vitalsData.respiratoryRate} onChange={(e) => updateVitals(["respiratoryRate"], e.target.value)} />
              <span className="text-sm text-gray-500">/min</span>
            </div>
          </div>
          {/* Temperature */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Temperature:</label>
            <div className="flex items-center space-x-2">
              <input className="w-full px-3 py-2 border rounded" placeholder="Temperature" value={vitalsData.temperature} onChange={(e) => updateVitals(["temperature"], e.target.value)} />
              <span className="text-sm text-gray-500">°C</span>
            </div>
          </div>
          {/* Other - Blood Type */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Blood Type (as available)</label>
            <input className="w-full px-3 py-2 border rounded" placeholder="O+" value={vitalsData.bloodType || ""} onChange={(e) => updateVitals(["bloodType"], e.target.value)} />
          </div>
        </div>
      )}
      {activeSection === "pertinent-findings" && vitalsData && (
        <div className="space-y-4">
          {[
            { key: 'heent', title: 'A. HEENT', items: ['Essentially normal','Abnormal pupillary reaction','Cervical lymphadenopathy','Dry mucous membrane','Icteric sclerae','Pale conjunctivae','Sunken eyeballs','Sunken fontanelle','Others'] },
            { key: 'chestBreastLungs', title: 'B. Chest/Breast/Lungs', items: ['Essentially normal','Asymmetrical chest expansion','Decreased breath sounds','Wheezes','Lumps over breast(s)','Crackles/rales','Retractions','Others'] },
            { key: 'heart', title: 'C. Heart', items: ['Essentially normal','Displaced apex beat','Heaves/thrills','Irregular rhythm','Muffled heart sounds','Murmurs','Pericardial bulge','Others'] },
            { key: 'abdomen', title: 'D. Abdomen', items: ['Essentially normal','Abdominal rigidity','Abdominal tenderness','Hyperactive bowel sounds','Palpable mass(es)','Tympanic/dull abdomen','Uterine contraction','Others'] },
            { key: 'genitourinary', title: 'E. Genitourinary', items: ['Essentially normal','Blood stained in exam finger','Cervical dilatation','Presence of abnormal discharge','Others'] },
            { key: 'dre', title: 'F. Digital Rectal Examination', items: ['Essentially normal','Enlarge Prostate','Mass','Hemorrhoids','Pus','Not Applicable','Others'] },
            { key: 'Extermities', title: 'G. Extermities', items: ['Essentially normal','Clubbing','Deformity','Varicosities','Edema','Cyanosis','Weak pulses','Others'] },
            { key: 'Neurological', title: 'H. Neurological', items: ['Essentially normal','Motor weakness','Abnormal reflexes','Gait abnormality','Altered mental status','Sensory deficit','Seizure activity','Others'] },
          ].map((section: any) => (
            <div key={section.key} className="border rounded-lg p-4">
              <div className="font-semibold text-gray-800 mb-2">{section.title}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-1">
                {section.items.map((label: string) => {
                  const checked = (vitalsData.findings as any)[section.key]?.includes(label);
                  return (
                    <label key={label} className="inline-flex items-center space-x-2 text-sm text-gray-700">
                      <input
                        type="checkbox"
                        className="form-checkbox h-4 w-4 text-blue-600"
                        checked={Boolean(checked)}
                        onChange={(e) => {
                          const current: string[] = (vitalsData.findings as any)[section.key] || [];
                          const next = e.target.checked
                            ? [...current, label]
                            : current.filter((x) => x !== label);
                            updateVitals(['findings', section.key], next as any);
                        }}
                      />
                      <span>{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeSection === "laboratory-imaging" && vitalsData &&(
        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <div className="font-semibold text-gray-800 mb-2">Facility Type</div>
            <div className="flex items-center space-x-6 text-sm">
              <label className="inline-flex items-center space-x-2">
                <input type="radio" className="form-radio text-blue-600" checked={vitalsData.labImaging.facilityType === 'within'} onChange={() => updateVitals(['labImaging','facilityType'],'within')} />
                <span>Within facility</span>
              </label>
              <label className="inline-flex items-center space-x-2">
                <input type="radio" className="form-radio text-blue-600" checked={vitalsData.labImaging.facilityType === 'partner'} onChange={() => updateVitals(['labImaging','facilityType'],'partner')} />
                <span>Partner facility</span>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Date of Laboratory imaging</label>
              <input type="date" className="w-full px-3 py-2 border rounded" value={vitalsData.labImaging.date} onChange={(e)=>updateVitals(['labImaging','date'], e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Laboratory/Imaging Fee</label>
              <input className="w-full px-3 py-2 border rounded" placeholder="Enter Amount" value={vitalsData.labImaging.fee} onChange={(e)=>updateVitals(['labImaging','fee'], e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Fasting Blood Sugar (FBS)</label>
              <input className="w-full px-3 py-2 border rounded" placeholder="70-100 mg/dL" value={vitalsData.labImaging.fbsMgDl} onChange={(e)=>updateVitals(['labImaging','fbsMgDl'], e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">FBS (mmol/L)</label>
              <input className="w-full px-3 py-2 border rounded" placeholder="3.9-5.5 mmol/L" value={vitalsData.labImaging.fbsMmol} onChange={(e)=>updateVitals(['labImaging','fbsMmol'], e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Random Blood Sugar (RBS)</label>
              <input className="w-full px-3 py-2 border rounded" placeholder="Less than 200 mg/dL" value={vitalsData.labImaging.rbsMgDl} onChange={(e)=>updateVitals(['labImaging','rbsMgDl'], e.target.value)} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">RBS (mmol/L)</label>
              <input className="w-full px-3 py-2 border rounded" placeholder="Less than 11.1 mmol/L" value={vitalsData.labImaging.rbsMmol} onChange={(e)=>updateVitals(['labImaging','rbsMmol'], e.target.value)} />
            </div>
          </div>
        </div>
      )}

      {activeSection === "chd" && vitalsData && (
        <div className="space-y-4">
          {[
            { key: 'highFatHighSalt', label: 'High Fat/High Salt Food Intake - Eats processed/fast foods (e.g. instant noodles, hamburgers, fries, fried chicken skin etc.) and inaw-inaw (e.g. isaw, adidas, etc.) weekly' },
            { key: 'fiberVeg', label: 'Dietary Fiber Intake - 3 servings vegetables daily' },
            { key: 'fiberFruits', label: 'Dietary Fiber Intake - 2-3 servings of fruits daily' },
            { key: 'physicalActivity', label: 'Physical Activities - Does at least 2.5 hours a week of moderate-intensity physical activity' },
          ].map((q:any) => (
            <div key={q.key} className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="text-sm font-medium text-gray-900 mb-2">{q.label}</div>
              <div className="flex items-center space-x-6 text-sm">
                <label className="inline-flex items-center space-x-2">
                  <input type="radio" className="form-radio text-blue-600" checked={(vitalsData.chd as any)[q.key] === 'yes'} onChange={() => updateVitals(['chd', q.key], 'yes')} />
                  <span>Yes</span>
                </label>
                <label className="inline-flex items-center space-x-2">
                  <input type="radio" className="form-radio text-blue-600" checked={(vitalsData.chd as any)[q.key] === 'no'} onChange={() => updateVitals(['chd', q.key], 'no')} />
                  <span>No</span>
                </label>
              </div>
            </div>
          ))}

          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-900 mb-2">Presence or absence of Diabetes - 1. Was patient diagnosed as having diabetes?</div>
            <div className="flex items-center space-x-6 text-sm">
              <label className="inline-flex items-center space-x-2">
                <input type="radio" className="form-radio text-blue-600" checked={vitalsData.chd.diabetesDiagnosed === 'yes'} onChange={() => updateVitals(['chd','diabetesDiagnosed'],'yes')} />
                <span>Yes</span>
              </label>
              <label className="inline-flex items-center space-x-2">
                <input type="radio" className="form-radio text-blue-600" checked={vitalsData.chd.diabetesDiagnosed === 'no'} onChange={() => updateVitals(['chd','diabetesDiagnosed'],'no')} />
                <span>No</span>
              </label>
              <label className="inline-flex items-center space-x-2">
                <input type="radio" className="form-radio text-blue-600" checked={vitalsData.chd.diabetesDiagnosed === 'unknown'} onChange={() => updateVitals(['chd','diabetesDiagnosed'],'unknown')} />
                <span>Do Not Know</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
