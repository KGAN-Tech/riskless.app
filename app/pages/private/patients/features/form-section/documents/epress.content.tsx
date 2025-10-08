import { Square } from "lucide-react";
import { useState } from "react";

interface Props {
  encounter: any;
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

export default function EPRESSContent({ encounter }: Props) {
  const [scale, setScale] = useState(1);

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
        className="relative h-[1450px] bg-white shadow-2xl rounded-lg overflow-hidden mx-auto text-lg uppercase mb-[20px]"
        style={{
          backgroundImage: `url('/template/e-press/E-Press-Solo.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* HCI NAME / REGISTRATION NUMBER */}
        <div className="flex mt-[185px] ml-[40px]">
          <span className="w-[350px]">
            {encounter?.facility?.name || "N/A"}
          </span>
          <span className="w-[155px] ml-[20px]">
            {encounter?.patient?.identifications?.find(
              (id: any) => id.type === "hci_case_number"
            )?.value || "N/A"}
          </span>
          <span className="w-[172px] ml-[20px]">
            {encounter?.facility?.accreditationNumber || "N/A"}
          </span>
          <span className="w-[140px] ml-[20px]">
            {encounter?.facility?.transactionNumber || "N/A"}
          </span>
        </div>

        {/* PIN / MEMBERSHIP CATEGORY */}
        <div className="flex mt-[19px] ml-[42px]">
          <span className="w-[310px] mt-[20px]">
            {encounter?.patient?.identifications?.find(
              (id: any) => id.type === "philhealth_identification_number"
            )?.value || "N/A"}
          </span>
          <span className="w-[265px] mt-[20px] ml-[20px]">
            {encounter?.patient?.membership_category || "N/A"}
          </span>
          <div className="flex flex-col ml-[170px]">
            <div
              className={`w-[21px] ${
                encounter?.patient?.User[0]?.type === "patient_member" ||
                encounter?.patient?.User[0]?.type === "patient"
                  ? ""
                  : "invisible"
              }`}
            >
              <Square className="h-6 w-6" fill="black" strokeWidth={0} />
            </div>
            <div
              className={`w-[21px] mt-[5px] ${
                encounter?.patient?.User[0]?.type === "patient_dependent"
                  ? ""
                  : "invisible"
              }`}
            >
              <Square className="h-6 w-6" fill="black" strokeWidth={0} />
            </div>
          </div>
        </div>

        {/* PATIENT NAME / AGE / CONTACT NO. */}
        <div className="flex mt-[30px] ml-[42px]">
          <span className="w-[410px]">
            {encounter?.patient?.firstName} {encounter?.patient?.middleName}{" "}
            {encounter?.patient?.lastName}
          </span>
          <span className="w-[145px] ml-[20px]">
            {calculateAge(encounter?.patient?.birthDate)}
          </span>
          <span className="w-[285px] ml-[20px]">
            {encounter?.patient?.contacts?.find(
              (c: any) => c?.type === "mobile_number"
            )?.value || "N/A"}
          </span>
        </div>

        {/* MEDICINES */}
        <div className="flex flex-col mt-[150px] ml-[60px] h-[435px]">
          {encounter.prescriptions.map((prescription: any) => (
            <div key={prescription.id}>
              {prescription.medicine.name} | {prescription.quantity}
            </div>
          ))}
        </div>

        {/* NEXT DISPENSE DATE / PHYSICIAN */}
        <div className="flex flex-row mt-[12px] ml-[185px] text-base">
          <div className="mt-[45px]">
            <span className="w-[200px]">TEST DATE</span>
          </div>
          <div className="flex flex-col">
            <span className="w-[175px] ml-[467px]">
              {encounter?.prescription?.prescribedBy.firstName || "N/A"}{" "}
              {encounter?.prescription?.prescribedBy.middleName || "N/A"}{" "}
              {encounter?.prescription?.prescribedBy.lastName || "N/A"}
            </span>
            <span className="w-[160px] ml-[482px] mt-[-2px]">TEST LIC NO.</span>
            <span className="w-[187px] ml-[457px] mt-[-3px]">TEST PTR NO.</span>
            <span className="w-[187px] ml-[457px] mt-[-3px]">TEST S2 NO.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
