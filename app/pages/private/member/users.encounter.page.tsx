import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ChevronRight, User, Activity, FileText, Heart, Calendar, Pill, Syringe,  Ruler, Wind, Eye, PlusCircle, ChevronDown, HeartPulse,  } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/card";
import { Badge } from "@/components/atoms/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/atoms/tabs";
import { Button } from "@/components/atoms/button";
import AOS from "aos";
import "aos/dist/aos.css";
import { Headerbackbutton } from "~/app/components/organisms/backbutton.header";
import { encounterService } from "@/services/encounter.service"; // adjust path if needed
import { getUserFromLocalStorage } from "~/app/utils/auth.helper";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/atoms/collapsible";

// --- Utilities --------------------------------------------------------------
const niceLabel = (str: string) => str.replace(/([A-Z])/g, " $1").replace(/_/g, " ").trim();

const calculateAge = (dobString?: string) => {
  if (!dobString) return '-';
  const dob = new Date(dobString);
  if (Number.isNaN(dob.getTime())) return '-';
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return age;
};

const getImageUrl = (url?: string) => {
  if (!url) return '';
  if (/^https?:\/\//i.test(url)) return url;
  try {
    return `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
  } catch {
    return url;
  }
};


// --- UI Sections ------------------------------------------------------------
const PatientHeader = ({ encounter }: { encounter: any }) => {
  const ls = getUserFromLocalStorage();
  const patient = encounter?.patient || ls?.user?.person;
  const patientImageUrl = patient?.images?.[0]?.url
    ? getImageUrl(patient.images[0].url)
    : (ls?.user?.person?.images?.[0]?.url ? getImageUrl(ls.user.person.images[0].url) : "");
  return (
    <div className="bg-gradient-to-r from-blue-600 to-blue-500 text-white p-4 sm:p-6 rounded-2xl shadow-md mb-6" data-aos="fade-down">
      <div className="flex items-center gap-4 sm:gap-6">
        <div className="w-10 h-10 sm:w-20 sm:h-20 bg-white/15 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden">
          {patientImageUrl ? (
            <img
              src={patientImageUrl}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-white/20">
              <span className="text-sm sm:text-base font-semibold text-white">
                {`${patient?.firstName?.[0] || ''}${patient?.lastName?.[0] || ''}`.toUpperCase() || 'P'}
              </span>
            </div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-3xl font-semibold tracking-wide text-white uppercase truncate"> 
            {patient?.firstName}    {patient?.middleName} {patient?.lastName}
          </h1>
          <p className="text-blue-100 text-xs sm:text-sm truncate mt-1">
            ID: {encounter?.patientId || patient?.id}
          </p>
          <p className="text-blue-100 text-xs sm:text-sm truncate mt-0.5">
            Age: {calculateAge(patient?.birthDate)} • {patient?.sex || patient?.gender}
          </p>
          <p className="text-blue-100 text-xs sm:text-sm mt-1">Last Visit: {(encounter?.createdAt)}</p>
        </div>
      </div>
    </div>
  );
};

const InterviewSection = ({ encounter }: { encounter: any }) => (
  <div className="space-y-3">
    {/* Essential Information Row */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
      {/* Chief Complaint & Social History Combined */}
      <Card className="p-4 border-l-4 border-l-blue-500 bg-gray-50 shadow-md">
        <div className="space-y-3">
          <div>
            <h3 className="flex items-center gap-2 text-blue-700 mb-3">
              <FileText className="w-5 h-5" />
              Chief Complaint
            </h3>
            <div className="flex flex-wrap gap-2">
              {encounter?.interview?.reviews?.chiefComplaint?.map((complaint: string, index: number) => (
                <Badge key={index} className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1 text-xs">
                  {complaint}
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-3">
            <h3 className="text-gray-800 mb-3">Social History</h3>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-white p-2 rounded border">
                <span className="text-gray-600">Alcohol:</span>{" "}
                <span className="text-gray-900">{encounter?.interview?.social?.isDrinker ? `${encounter?.interview?.bottlesNo}/wk` : "Non-drinker"}</span>
              </div>
              <div className="bg-white p-2 rounded border">
                <span className="text-gray-600">Smoking:</span>{" "}
                <span className="text-gray-900">{encounter?.interview?.social?.isSmoker ? `${encounter?.interview?.social?.cigarettePkgNo} pks/wk` : "Non-smoker"}</span>
              </div>
              <div className="bg-white p-2 rounded border">
                <span className="text-gray-600">Drugs:</span> <span className="text-gray-900">{encounter?.interview?.social?.isIllicitDrugUser ? "Yes" : "No"}</span>
              </div>
              <div className="bg-white p-2 rounded border">
                <span className="text-gray-600">Sexual:</span> <span className="text-gray-900">{encounter?.interview?.social?.isSexuallyActive ? "Active" : "Inactive"}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Review of Systems Compact */}
      <Card className="p-4 border-l-4 border-l-blue-500 bg-gray-50 shadow-md">
        <h3 className="text-blue-700 mb-3">Review of Systems</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {[
            { label: "Gastrointestinal", value: encounter?.interview?.reviews?.gi?.explain },
            { label: "Genital", value: encounter?.interview?.reviews?.genital?.explain },
            { label: "General", value: encounter?.interview?.reviews?.general?.explain },
            { label: "Endocrine", value: encounter?.interview?.reviews?.endocrine?.explain },
            { label: "MSK", value: encounter?.interview?.reviews?.musculoskeletal?.explain },
            { label: "Respiratory", value: encounter?.interview?.reviews?.respiratory?.explain },
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-white rounded border border-gray-200">
              <div className="text-gray-800 mb-1">{item.label}</div>
              <div className="text-gray-600 text-xs">{item.value || "No concerns"}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>

    {/* Collapsible History Sections */}
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3">
      {/* Family History - Collapsible */}
      <Collapsible>
        <Card className="p-4 border-l-4 border-l-blue-500 bg-white">
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <h3 className="flex items-center gap-2 text-blue-700">
              <User className="w-5 h-5" />
              Family History
            </h3>
            <ChevronDown className="w-4 h-4 text-blue-600" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="space-y-2">
              {encounter?.interview?.history?.family?.map((disease: any, index: number) => (
                <div key={disease.diseaseCode || index} className="p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="text-gray-900 mb-1">{disease.description}</div>
                  <div className="text-gray-600 text-sm">{disease.details || "No details"}</div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Medical History - Collapsible */}
      <Collapsible>
        <Card className="p-4 border-l-4 border-l-blue-500 bg-white">
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <h3 className="flex items-center gap-2 text-blue-700">
              <FileText className="w-5 h-5" />
              Medical History
            </h3>
            <ChevronDown className="w-4 h-4 text-blue-600" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="space-y-2">
              {encounter?.interview?.history?.medical?.map((disease: any) => (
                <div key={disease.diseaseCode} className="p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="text-gray-900 mb-1">{disease.description}</div>
                  <div className="text-gray-600 text-sm">{disease.details || "No details"}</div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Immunization - Collapsible */}
      <Collapsible>
        <Card className="p-4 border-l-4 border-l-blue-500 bg-white">
          <CollapsibleTrigger className="flex items-center justify-between w-full">
            <h3 className="flex items-center gap-2 text-blue-700">
              <Syringe className="w-5 h-5" />
              Immunizations
            </h3>
            <ChevronDown className="w-4 h-4 text-blue-600" />
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <div className="space-y-2">
              {encounter?.interview?.immunization?.map((vaccine: any, index: number) => (
                <div key={index} className="p-3 bg-gray-50 rounded border border-gray-200">
                  <div className="text-gray-900 mb-1">{vaccine.name}</div>
                  <div className="text-gray-600 text-sm">{vaccine.description}</div>
                </div>
              ))}
            </div>
          </CollapsibleContent>
        </Card>
      </Collapsible>
    </div>

    {/* Women's Health - Compact Row */}
    {encounter?.patient?.sex === 'female' && (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {/* Pregnancy History */}
        <Card className="p-3  border-l-4 border-l-blue-500 bg-white">
          <h3 className="flex items-center gap-2 text-gray-800 mb-2">
            <Heart className="w-4 h-4" />
            Pregnancy History
          </h3>
          <div className="grid grid-cols-3 gap-2 text-xs text-center">
            <div>
              <div className="text-gray-500">Pregnancy Count</div>
              <div>{encounter?.interview?.history?.pregnancy?.pregnancyCount}</div>
            </div>
            <div>
              <div className="text-gray-500">delivery Count</div>
              <div>{encounter?.interview?.history?.pregnancy?.deliveryCount}</div>
            </div>
            <div>
              <div className="text-gray-500">abortion Count</div>
              <div>{encounter?.interview?.history?.pregnancy?.abortionCount}</div>
            </div>
            <div>
              <div className="text-gray-500">live Children Count</div>
              <div>{encounter?.interview?.history?.pregnancy?.liveChildrenCount}</div>
            </div>
            <div>
              <div className="text-gray-500">fullTerm Count</div>
              <div>{encounter?.interview?.history?.pregnancy?.fullTermCount}</div>
            </div>
            <div>
              <div className="text-gray-500">prematureCount</div>
              <div>{encounter?.interview?.history?.pregnancy?.prematureCount}</div>
            </div>
          </div>
        </Card>

        {/* Menstrual History */}
        <Card className="p-3  border-l-4 border-l-blue-500 bg-white">
          <h3 className="flex items-center gap-2 text-gray-800 mb-2">
            <Calendar className="w-4 h-4" />
            Menstrual History
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-600">LMP:</span>{" "}
              {encounter?.interview?.history?.menstrual?.lastMensPeriod ? 
                new Date(encounter.interview.history.menstrual.lastMensPeriod).toLocaleDateString() : '-'}
            </div>
            <div>
              <span className="text-gray-600">Cycle:</span> {encounter?.interview?.history?.menstrual?.mensInterval}d
            </div>
            <div>
              <span className="text-gray-600">Duration:</span> {encounter?.interview?.history?.menstrual?.durationPeriod}d
            </div>
            <div>
              <span className="text-gray-600">Menarche:</span> {encounter?.interview?.history?.menstrual?.menarchePeriod}y
            </div>
          </div>
        </Card>

            {/* NCD*/}
            {/* NCD Risk Assessment - Collapsible */}
  <Collapsible>
    <Card className="p-4 border-l-4 border-l-blue-500 bg-white shadow-md">
      <CollapsibleTrigger className="flex items-center justify-between w-full">
        <h3 className="flex items-center gap-2 text-blue-700">
          <Activity className="w-5 h-5" />
          NCD Risk Assessment
        </h3>
        <ChevronDown className="w-4 h-4 text-blue-600" />
      </CollapsibleTrigger>

      <CollapsibleContent className="mt-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            { label: "Eats processed/fast foods (e.g. instant noodles, hamburgers, fries, fried chicken skin etc.) and ihaw-ihaw (e.g. isaw, adidas, etc.) weekly?", value: encounter?.ncd?.Qid1_Yn ? "Yes" : "No" },
            { label: "3 servings  of vegetables daily?", value: encounter?.ncd?.Qid2_Yn ? "Yes" : "No" },
            { label: "2-3 servings of fruits daily?", value: encounter?.ncd?.Qid3_Yn ? "Yes" : "No" },
            { label: "Does at least 2.5 hours a week of moderate-intensity physical activity?", value: encounter?.ncd?.Qid4_Yn ? "Yes" : "No" },
            { label: "Was patient diagnosed as having diabetes?", value: encounter?.ncd?.Qid5_Yn ? "Yes" : "No" },
            { label: "Does patient have symptoms of Polyphagia?", value: encounter?.ncd?.Qid6_Yn ? "Yes" : "No" },
            { label: "Does patient have symptoms of POLYDIPSIA?", value: encounter?.ncd?.Qid7_Yn ? "Yes" : "No" },
            { label: "Does patient have symptoms of POLYURIA?", value: encounter?.ncd?.Qid8_Yn ? "Yes" : "No" },
            { label: "Have you had any pain or discomfort or any pressure or heaviness in your chest??", value: encounter?.ncd?.Qid9_Yn ? "Yes" : "No" },
            { label: "Do you get the pain in the center of the chest or left arm?", value: encounter?.ncd?.Qid10_Yn ? "Yes" : "No" },
            { label: "Do you get it when you walk uphill or hurry?", value: encounter?.ncd?.Qid11_Yn ? "Yes" : "No" },
            { label: "Do you slowdown if you get the pain while walking?", value: encounter?.ncd?.Qid12_Yn ? "Yes" : "No" },  
            { label: "Does the pain go away if you stand still or if you take a tablet under the tongue?", value: encounter?.ncd?.Qid13_Yn ? "Yes" : "No" },
            { label: "Does the pain away in less than 10 minutes??", value: encounter?.ncd?.Qid14_Yn ? "Yes" : "No" },
            { label: "Have you ever had a severe chest pain across the front of your chest lasting for half an hour or more??", value: encounter?.ncd?.Qid15_Yn ? "Yes" : "No" },
            { label: "Have you ever had any of the following: difficulty in talking, weakness of arm and/or leg on one side of the body or numbness on one side of the body??", value: encounter?.interview?.ncd?.Qid16_Yn ? "Yes" : "No" },
            { label: "Risk level percentage (A: <10%, B: 10% to <20%, C: 20% to <30%, D: 30% to <40%, E: =>40% )", value: encounter?.ncd?.Qid17_Abdc || "No assessment available" },
            { label: "Was patient diagnosed as having diabities?\n(If Yes, (if with diabetes) choose with/without medication)", value: encounter?.interview?.ncd?.Qid18_Yn ? "Yes" : "No" },
                
            { 
              label: "Raised Blood Glucose(mg/dL)", 
              value: encounter?.ncd?.Qid19_Fbsdate && encounter?.ncd?.Qid19_Fbsmg 
                ? `${encounter?.ncd?.Qid19_Fbsmg} mg/dL - ${new Date(encounter?.ncd?.Qid19_Fbsdate).toLocaleDateString()}`
                : "No data available"
            },
            { 
              label: "Raised Blood Glucose(mmol )", 
              value: encounter?.ncd?.Qid19_Fbsdate && encounter?.ncd?.Qid19_Fbsmmol 
                ? `${encounter?.ncd?.Qid19_Fbsmmol} mmol/L - ${new Date(encounter?.ncd?.Qid19_Fbsdate).toLocaleDateString()}`
                : "No data available"
            },
            { 
              label: "Raised Blood Lipids", 
              value: encounter?.ncd?.Qid20_Choledate && encounter?.ncd?.Qid20_Choleval 
                ? `${encounter.ncd.Qid20_Choleval} mg/dL - ${new Date(encounter.ncd.Qid20_Choledate).toLocaleDateString()}`
                : "No data available"
            },
            { 
              label: "Presence of Urine Ketones", 
              value: encounter?.ncd?.Qid21_Ketondate && encounter?.ncd?.Qid21_Ketonval 
                ? `${encounter.ncd.Qid21_Ketonval} - ${new Date(encounter.ncd.Qid21_Ketondate).toLocaleDateString()}`
                : "No data available"
            },
            { 
              label: "Presence of Urine Protein", 
              value:
                (encounter?.interview?.ncd?.Qid22_Yn !== undefined && encounter?.interview?.ncd?.Qid22_Yn !== null)
                  ? (
                      encounter?.ncd?.Qid22_Proteindate && encounter?.ncd?.Qid22_Proteinval
                        ? `${encounter?.interview?.ncd?.Qid22_Yn ? "Yes" : "No"} • ${encounter.ncd.Qid22_Proteinval} - ${new Date(encounter.ncd.Qid22_Proteindate).toLocaleDateString()}`
                        : `${encounter?.interview?.ncd?.Qid22_Yn ? "Yes" : "No"}`
                    )
                  : (
                      encounter?.ncd?.Qid22_Proteindate && encounter?.ncd?.Qid22_Proteinval
                        ? `${encounter.ncd.Qid22_Proteinval} - ${new Date(encounter.ncd.Qid22_Proteindate).toLocaleDateString()}`
                        : "No data available"
                    )
            },
            { label: "Angina or Heart Attack", value: encounter?.interview?.ncd?.Qid23_Yn ? "Yes" : "No" },
            { label: "Stroke and TIA", value: encounter?.interview?.ncd?.Qid24_Yn ? "Yes" : "No" },
            
          ].map((item, idx) => (
            <div key={idx} className="p-3 bg-white rounded border border-gray-200 shadow-sm">
              <div className="text-gray-800 font-semibold text-sm mb-1">{item.label}</div>
              {(() => {
                const value = item.value as any;
                if (value === "Yes" || value === "No") {
                  return (
                    <span className={`${value === "Yes" ? "text-green-700" : "text-red-700"} font-semibold text-sm`}>
                      {value}
                    </span>
                  );
                }
                if (typeof value === "string" && value.includes(" - ")) {
                  const [main, dateText] = value.split(" - ");
                  return (
                    <div>
                      <div className="text-gray-900 font-semibold">{main}</div>
                      <div className="text-xs text-gray-500">{dateText}</div>
                    </div>
                  );
                }
                if (!value || value === "No data available") {
                  return <div className="text-xs text-gray-400">No data available</div>;
                }
                return <div className="text-gray-900">{value}</div>;
              })()}
            </div>
          ))}
        </div>
      </CollapsibleContent>
    </Card>
  </Collapsible>




      </div>
    )}
  </div>
);


const VitalsSection = ({ encounter }: { encounter: any }) => (
  <div className="p-4 border-l-4 border-l-blue-500 bg-gray-50 rounded-xl shadow-md">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
      <h2 className="text-lg font-semibold text-blue-700">Primary Vitals</h2>
      <div className="text-xs text-gray-600 bg-white px-2 py-1 rounded">{encounter?.date || 'Today'}</div>
    </div>

    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {/* Basic Measurements */}
      <div className="space-y-2 min-w-0 col-span-2 md:col-span-1">
        <h3 className="flex items-center gap-2 text-sm font-medium text-blue-700 pb-1">
          <Ruler className="w-4 h-4" />
          Basic Measurements
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-white rounded-lg min-w-0 border-2 border-gray-200 text-center shadow-sm">
            <p className="text-xs text-gray-600 mb-0.5">Height</p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {encounter?.vital?.measurement?.height?.value || '-'}
              <span className="text-xs font-normal text-gray-500 ml-0.5">
                {encounter?.vital?.measurement?.height?.unit || ''}
              </span>
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg min-w-0 border-2 border-gray-200 text-center shadow-sm">
            <p className="text-xs text-gray-600 mb-0.5">Weight</p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {encounter?.vital?.measurement?.weight?.value || '-'}
              <span className="text-xs font-normal text-gray-500 ml-0.5">
                {encounter?.vital?.measurement?.weight?.unit || ''}
              </span>
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg min-w-0 col-span-2 border-2 border-gray-200 text-center shadow-sm">
            <p className="text-xs text-gray-600 mb-0.5">BMI</p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {encounter?.vital?.measurement?.bmi?.value || '-'}
              <span className="text-xs font-normal text-gray-500 ml-0.5">
                {encounter?.vital?.measurement?.bmi?.status || ''}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Body Measurements */}
      <div className="space-y-2 min-w-0 col-span-2 md:col-span-1">
        <h3 className="flex items-center gap-2 text-sm font-medium text-blue-700 pb-1">
          <Ruler className="w-4 h-4" />
          Body Measurements
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-white rounded-lg min-w-0 border-2 border-gray-200 text-center shadow-sm">
            <p className="text-xs text-gray-600 mb-0.5">Head Circ.</p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {encounter?.vital?.measurement?.headCirc || '-'}
              <span className="text-xs font-normal text-gray-500 ml-0.5">cm</span>
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg min-w-0 border-2 border-gray-200 text-center shadow-sm">
            <p className="text-xs text-gray-600 mb-0.5">Hip</p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {encounter?.vital?.measurement?.hip || '-'}
              <span className="text-xs font-normal text-gray-500 ml-0.5">cm</span>
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg min-w-0 border-2 border-gray-200 text-center shadow-sm">
            <p className="text-xs text-gray-600 mb-0.5">Waist</p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {encounter?.vital?.measurement?.waist || '-'}
              <span className="text-xs font-normal text-gray-500 ml-0.5">cm</span>
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg min-w-0 border-2 border-gray-200 text-center shadow-sm">
            <p className="text-xs text-gray-600 mb-0.5">Arm Circ.</p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {encounter?.vital?.measurement?.midUpperArmCirc || '-'}
              <span className="text-xs font-normal text-gray-500 ml-0.5">cm</span>
            </p>
          </div>
        </div>
      </div>

      {/* Cardiovascular */}
      <div className="space-y-2 min-w-0 col-span-2 md:col-span-1">
        <h3 className="flex items-center gap-2 text-sm font-medium text-blue-700 pb-1">
          <HeartPulse className="w-4 h-4" />
          Cardiovascular
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-white rounded-lg min-w-0 col-span-2 border-2 border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-0.5 gap-1">
              <p className="text-xs text-gray-600 truncate">Blood Pressure</p>
              <span className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${encounter?.vital?.measurement?.bloodPressure?.category === "elevated" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"}`}>
                {encounter?.vital?.bloodPressure?.category || '-'}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {encounter?.vital?.measurement?.bloodPressure?.systolic || '-'}/
              {encounter?.vital?.measurement?.bloodPressure?.diastolic || '-'}
              <span className="text-xs font-normal text-gray-500 ml-0.5">mmHg</span>
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg min-w-0 border-2 border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-0.5 gap-1">
              <p className="text-xs text-gray-600 truncate">Heart Rate</p>
              <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded flex-shrink-0">
                {encounter?.vital?.measurement?.heartRate?.status || '-'}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {encounter?.vital?.measurement?.heartRate?.value || '-'}
              <span className="text-xs font-normal text-gray-500 ml-0.5">bpm</span>
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg min-w-0 border-2 border-gray-200 shadow-sm">
            <p className="text-xs text-gray-600 mb-0.5">Blood Type</p>
            <p className="text-sm font-semibold text-gray-900">{encounter?.vital?.blood?.type || '-'}</p>
          </div>
        </div>
      </div>

      {/* Respiratory */}
      <div className="space-y-2 min-w-0 col-span-2 md:col-span-1">
        <h3 className="flex items-center gap-2 text-sm font-medium text-blue-700 pb-1">
          <Wind className="w-4 h-4" />
          Respiratory
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-white rounded-lg min-w-0 border-2 border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-0.5 gap-1">
              <p className="text-xs text-gray-600 truncate">Resp. Rate</p>
              <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded flex-shrink-0">
                {encounter?.vital?.measurement?.respiratoryRate?.status || '-'}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {encounter?.vital?.measurement?.respiratoryRate?.value || '-'}
              <span className="text-xs font-normal text-gray-500 ml-0.5">/min</span>
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg min-w-0 border-2 border-gray-200 shadow-sm">
            <p className="text-xs text-gray-600 mb-0.5">Temperature</p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {encounter?.vital?.measurement?.temperature?.value || '-'}
              <span className="text-xs font-normal text-gray-500 ml-0.5">
                {encounter?.vital?.measurement?.temperature?.unit || ''}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Vision */}
      <div className="space-y-2 min-w-0 col-span-2 md:col-span-1">
        <h3 className="flex items-center gap-2 text-sm font-medium text-blue-700 pb-1">
          <Eye className="w-4 h-4" />
          Vision
        </h3>
        <div className="grid grid-cols-1 gap-2">
          <div className="p-3 bg-white rounded-lg min-w-0 border-2 border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-0.5 gap-1">
              <p className="text-xs text-gray-600 truncate">Vision</p>
              <span className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${encounter?.vital?.vision?.status === "normal" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {encounter?.vital?.vision?.status || '-'}
              </span>
            </div>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {encounter?.vital?.vision?.left || '-'}/{encounter?.vital?.vision?.right || '-'}
            </p>
            <p className="text-xs text-gray-500 mt-0.5 break-words">Remarks: {encounter?.vital?.vision?.remarks || 'None'}</p>
          </div>
        </div>
      </div>

      {/* Additional Measurements */}
      <div className="space-y-2 min-w-0 col-span-2 md:col-span-1">
        <h3 className="flex items-center gap-2 text-sm font-medium text-blue-700 pb-1">
          <PlusCircle className="w-4 h-4" />
          Additional
        </h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-3 bg-white rounded-lg min-w-0 border-2 border-gray-200 shadow-sm">
            <p className="text-xs text-gray-600 mb-0.5">Limbs</p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {encounter?.vital?.measurement?.limbs || '-'}
              <span className="text-xs font-normal text-gray-500 ml-0.5">cm</span>
            </p>
          </div>
          <div className="p-3 bg-white rounded-lg min-w-0 border-2 border-gray-200 shadow-sm">
            <p className="text-xs text-gray-600 mb-0.5">Skin Fold</p>
            <p className="text-sm font-semibold text-gray-900 truncate">
              {encounter?.vital?.measurement?.skinfoldThickness || '-'}
              <span className="text-xs font-normal text-gray-500 ml-0.5">cm</span>
            </p>
          </div>
        </div>
      </div>

      {/* Additional Notes */}
      <div className="space-y-2 min-w-0 col-span-2 md:col-span-2">
        <h3 className="flex items-center gap-2 text-sm font-medium text-blue-700 pb-1">
          <FileText className="w-4 h-4" />
          Additional Notes
        </h3>
        <div className="grid grid-cols-1 gap-2">
          <div className="p-3 bg-white rounded-lg min-w-0 border-2 border-gray-200 shadow-sm">
            <div className="flex justify-between items-start mb-0.5 gap-1">
              <p className="text-xs text-gray-600 truncate">{encounter?.vital?.misc?.[0]?.type || 'Note'}</p>
              <span className={`text-xs px-1.5 py-0.5 rounded flex-shrink-0 ${encounter?.vital?.misc?.[0]?.status === "validated" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {encounter?.vital?.misc?.[0]?.status || '-'}
              </span>
            </div>
            <p className="text-gray-800 text-xs break-words">{encounter?.vital?.misc?.[0]?.description || '-'}</p>
            <p className="text-xs text-gray-500 mt-1 break-words">Remarks: {encounter?.vital?.misc?.[0]?.remarks || 'None'}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);
const ConsultationSection = ({ encounter }: { encounter: any }) => (
  <div className="space-y-3">
    {/* Primary Information Row */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
      {/* Diagnosis & Medications Combined */}
      <Card className="p-4 border-l-4 border-l-blue-500 bg-gray-50 shadow-md">
        <div className="space-y-3">
          <div>
            <h3 className="flex items-center gap-2 text-blue-700 mb-3">
              <FileText className="w-5 h-5" />
              Diagnosis
            </h3>
            <div className="space-y-2">
              {encounter?.consultation?.diagnostic?.map((diagnosis: any, index: number) => (
                <div key={`${diagnosis.description}-${index}`} className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-gray-900 text-sm mb-1">{diagnosis.description}</div>
                  <div className="text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded">ICD: {diagnosis.code}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="flex items-center gap-2 text-blue-700 mb-3">
              <Pill className="w-5 h-5" />
              Prescription
            </h3>
            <div className="space-y-2">
              {(() => {
                const prescriptions = (encounter as any)?.prescriptions || [];
                const first = prescriptions[0];
                return (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-gray-500">Dispensed By</div>
                        <div className="text-gray-800">
                          {first?.dispensedBy?.firstName ? `${first.dispensedBy.firstName} ${first.dispensedBy?.lastName || ''}`.trim() : '-'}
                        </div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-gray-500">Dispensed At</div>
                        <div className="text-gray-800">
                          {first?.dispensedAt ? new Date(first.dispensedAt).toLocaleDateString() : '-'}
                        </div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-gray-500">Prescribed By</div>
                        <div className="text-gray-800">
                          {first?.prescribedBy?.firstName ? `${first.prescribedBy.firstName} ${first.prescribedBy?.lastName || ''}`.trim() : '-'}
                        </div>
                      </div>
                      <div className="p-2 bg-gray-50 rounded">
                        <div className="text-gray-500">Prescribed At</div>
                        <div className="text-gray-800">
                          {first?.prescribedAt ? new Date(first.prescribedAt).toLocaleDateString() : '-'}
                        </div>
                      </div>
                    </div>

                    <div className="border-t pt-2">
                      <div className="text-gray-800 text-sm mb-2">Medicines</div>
                      <div className="space-y-1 max-h-40 overflow-y-auto">
                        {prescriptions.length ? (
                          prescriptions.map((p: any, idx: number) => (
                            <div key={p.id || idx} className="flex justify-between items-center text-xs p-2 bg-white rounded border border-gray-200 shadow-sm">
                              <div className="text-gray-800 truncate max-w-[70%]">{p?.medicine?.name || '-'}</div>
                              <div className="text-gray-600">Qty: {p?.quantity ?? '-'}</div>
                            </div>
                          ))
                        ) : (
                          <div className="text-gray-400 text-xs">No medicines found</div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>
        </div>
      </Card>

      {/* Management & Lab Tests Combined */}
      <Card className="p-4 border-l-4 border-l-blue-500 bg-gray-50 shadow-md">
        <div className="space-y-3">
          <div>
            <h3 className="flex items-center gap-2 text-blue-700 mb-3">
              <Calendar className="w-5 h-5" />
              Management Plan
            </h3>
            <div className="space-y-2">
              {encounter?.consultation?.management?.length ? (
                encounter.consultation.management.map((plan: any, index: number) => (
                  <div key={`${plan.code}-${index}`} className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="text-gray-900 text-sm">{plan.description}</div>
                    <div className="text-gray-600 text-xs bg-gray-100 px-2 py-1 rounded mt-1">Code: {plan.code}</div>
                  </div>
                ))
              ) : (
                <p className="text-gray-400 text-xs">No management plan available</p>
              )}
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="flex items-center gap-2 text-blue-700 mb-3">
              <Activity className="w-5 h-5" />
              Lab Requests
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {encounter?.availments?.map((item: any) => (
                <div key={item.id} className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-gray-900 text-sm">{item.service.replace(/_/g, " ")}</div>
                  {item.description && <div className="text-gray-600 text-xs mt-1">{item.description}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Medical Advice */}
      <Card className="p-4 border-l-4 border-l-blue-500 bg-gray-50 shadow-md">
        <h3 className="flex items-center gap-2 text-blue-700 mb-3">
          <Heart className="w-5 h-5" />
          Medical Advice
        </h3>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {encounter?.consultation?.advice?.length > 0 ? (
            encounter.consultation.advice.map((advice: any, index: number) => (
              <div key={index} className="p-3 bg-white rounded-lg border border-gray-200 shadow-sm border-l-4 border-l-blue-400">
                <div className="text-gray-800 text-sm">{advice.remarks.value}</div>
                {advice.remarks.type && (
                  <div className="text-gray-600 text-xs mt-1 capitalize">
                    Type: {advice.remarks.type}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-400 text-xs">No medical advice available</div>
          )}
        </div>
      </Card>
    </div>

    {/* ICD Details - Collapsible */}
    {encounter?.consultation?.icd?.length > 0 && (
  
        <Card className="p-4 border-l-4 border-l-blue-500 bg-white shadow-md">
       
            <h3 className="flex items-center gap-2 text-blue-700">
              <FileText className="w-5 h-5" />
              ICD Details
            </h3>

   
    
            <div className="space-y-3">
              {encounter.consultation.icd.map((item: any, index: number) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg border border-gray-200 shadow-sm">
                  <div className="text-gray-900 mb-2">{item.description}</div>
                  {item.remarks?.length > 0 && (
                    <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm bg-white p-3 rounded border border-gray-200">
                      {item.remarks.map((remark: any, rIndex: number) => (
                        <li key={rIndex}>{remark.value}</li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

        </Card>
  
    )}
  </div>
);



export function MedicalRecord() {
  const [activeTab, setActiveTab] = useState("interview");
  const getUserdata = getUserFromLocalStorage();
  const personId = getUserdata?.user?.person?.id;
  const [encounter, setEncounter] = useState({});
  console.log(encounter);
  const params = useParams();
  const encounterId = (params as any)?.encounterId as string | undefined;

  useEffect(() => {
    const fetchEncounter = async () => {
      try {
        if (encounterId) {
          const res = await encounterService.get(encounterId, {
            fields:
              [
                "patient",
                "facility",
                "interview",
                "vital",
                "consultation",
                "availments",
                "prescriptions.medicine",
                "prescriptions.dispensedBy",
                "prescriptions.prescribedBy",
                "prescriptions.facility",
              ].join(","),
          });
          setEncounter((res as any)?.data ?? res);
          return;
        }
        if (!personId) return;
        const res = await encounterService.getAll({
          patientId: personId,
          page: 1,
          limit: 10,
          sort: "transactionDate",
          order: "desc",
        });
        setEncounter(res.data?.[0] ?? res?.data ?? {});
      } catch (error) {
        console.error("Error fetching encounter:", error);
      }
    };

    fetchEncounter();
  }, [encounterId, personId]);

  useEffect(() => {
    AOS.init({ duration: 600, easing: "ease-in-out", once: true, offset: 50 });
  }, []);

  return (
    <div className="min-h-screen bg-white w-full overflow-x-hidden">
      {/* Full-width container with proper overflow handling */}
      <div className="w-full max-w-full px-4 sm:px-6 pb-24">
        <Headerbackbutton title="Encounter Medical Record" />
        <PatientHeader encounter={encounter} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6" data-aos="fade-up">
            <TabsTrigger value="interview" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <User className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Interview</span>
            </TabsTrigger>
            <TabsTrigger value="vitals" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <Activity className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Vitals</span>
            </TabsTrigger>
            <TabsTrigger value="consultation" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
              <FileText className="w-3 h-3 sm:w-4 sm:h-4" />
              <span>Consultation</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="interview">
            <InterviewSection encounter={encounter} />
          </TabsContent>

          <TabsContent value="vitals">
            <VitalsSection encounter={encounter} />
          </TabsContent>

          <TabsContent value="consultation">
            <ConsultationSection encounter={encounter} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
