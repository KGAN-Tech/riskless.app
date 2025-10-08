import { Check, Square, X } from "lucide-react";
import { useState } from "react";

interface Props {
  encounters: any;
}

function calculateAge(birthdate: string | undefined): string {
  if (!birthdate) return "N/A";

  const birth = new Date(birthdate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  const dayDiff = today.getDate() - birth.getDate();

  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age >= 0 ? age.toString() : "N/A";
}

function formatDateShort(isoDate: string | undefined): string {
  if (!isoDate) return "N/A";
  
  const date = new Date(isoDate);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yy = String(date.getFullYear());
  
  return `${mm}/${dd}/${yy}`;
}

export default function EKASContent({ encounters }: Props) {
  const [scale, setScale] = useState(1);
  const availments = Array.isArray(encounters[0]?.availments) ? encounters[0].availments : [];

  // Fixed service list
  const services = [
    "cbc",
    "lipid_profile",
    "fbs",
    "oral_glucose_tolerance_test",
    "hba1c",
    "creatinine",
    "chest_xray",
    "sputum_microscopy",
    "ecg",
    "urinalysis",
    "pap_smear",
    "fecalysis",
    "fecal_occult_blood_test"
  ];

  return (
    <div
      className="print-area transition-transform duration-300 ease-in-out p-5"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        width: "1000px",
        height: "540px",
        margin: "0 auto",
      }}
    >
      <div
        className="relative h-[1450px] bg-white shadow-2xl rounded-lg overflow-hidden mx-auto text-base uppercase mb-[20px]"
        style={{
          backgroundImage: `url('/template/e-kas/E-Kas-Solo.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* HCI NAME / REGISTRATION NUMBER */}
        <div className="flex mt-[185px] ml-[40px]">
          <span className="w-[350px]">
            {encounters[0]?.facility?.name || "N/A"}
          </span>
          <span className="w-[155px] ml-[20px]">
            {encounters[0]?.patient?.identifications?.find(
              (id: any) => id.type === "hci_case_number"
            )?.value || "N/A"}
          </span>
          <span className="w-[172px] ml-[20px]">
            {encounters[0]?.facility?.accreditationNumber || "N/A"}
          </span>
          <span className="w-[140px] ml-[20px]">
            {encounters[0]?.facility?.transactionNumber || "N/A"}
          </span>
        </div>
        
        {/* PIN / MEMBERSHIP CATEGORY */}
        <div className="flex mt-[45px] ml-[40px]">
          <span className="w-[390px]">
            {encounters[0]?.patient?.identifications?.find(
              (id: any) => id.type === "philhealth_identification_number"
            )?.value || "N/A"}
          </span>
          <span className="w-[470px] ml-[20px]">
            {encounters[0]?.patient?.membership_category || "N/A"}
          </span>
        </div>

        {/* PATIENT NAME / AGE / CONTACT NO. */}
        <div className="flex mt-[37px] ml-[40px]">
          <span className="w-[410px]">
            {encounters[0]?.patient?.firstName} {encounters[0]?.patient?.middleName} {encounters[0]?.patient?.lastName}
          </span>
          <span className="w-[145px] ml-[20px]">
            {calculateAge(encounters[0]?.patient?.birthDate)}
          </span>
          <span className="w-[285px] ml-[20px]">
            {encounters[0]?.patient?.contacts?.find(
              (c: any) => c?.type === "mobile_number"
            )?.value || "N/A"}  
          </span>
        </div>

        <div className="flex mt-[25px] ml-[175px]">
          <span className={`w-[25px] ${encounters[0]?.patient?.User[0]?.type === "patient_member" || encounters[0]?.patient?.User[0]?.type === "patient" ? "" : "invisible"}`}>
            <Square className="h-8 w-8" fill="black" strokeWidth={0} />
          </span>
          <span className={`w-[25px] ml-[93px] ${encounters[0]?.patient?.User[0]?.type === "patient_dependent" ? "" : "invisible"}`}>
            <Square className="h-8 w-8" fill="black" strokeWidth={0} />
          </span>
          <span className="w-[100px] ml-[152px] mt-[10px]">
            {encounters[0]?.type?.service == "physical" ? "WALK-IN" : "ONLINE"}
          </span>
        </div>

        {/* Fixed service blocks */}
        <div className="mt-[86px] ml-[570px]">
          {services.map((service) => {
            const availment = availments.find((a: any) => a.service === service);

            return (
              <div key={service} className={`flex h-[44px] mb-[3px]`}>
                <span className="w-[105px] flex justify-center items-center">
                  {availment ? (
                    <Check className={`h-8 w-8`} />
                  ) : (
                    <X className={`h-8 w-8`} />
                  )}
                </span>
                <span className="ml-[15px] w-[102px] flex justify-center items-center">
                  {availment ? formatDateShort(availment.datePerformed) : "N/A"}
                </span>
                <span className="ml-[25px] w-[100px] flex justify-center items-center">
                  {availment?.performedById == null ? "N/A" : "Dr. Dolittle"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}