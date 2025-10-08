import { Square } from "lucide-react";

interface Props {
  scale: any;
  member: any;
}

function formatDateShort(isoDate: string | undefined): string {
  if (!isoDate) return "N/A";

  const date = new Date(isoDate);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yy = String(date.getFullYear()).slice(-2);

  return `${mm}/${dd}/${yy}`;
}

export default function PKRFContent({ scale, member }: Props) {
  return (
    <div
      className="print-area transition-transform duration-300 ease-in-out p-5"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        width: "530px",
        height: "550px",
        margin: "0 auto",
      }}
    >
      {/* Form container with background image */}
      <div
        className="relative h-[1450px] bg-white shadow-2xl rounded-lg overflow-hidden mx-auto text-xs uppercase text-center"
        style={{
          backgroundImage: `url('/template/pkrf/PKRF-Solo.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* MEMBER TYPE */}
        <div className="flex mt-[174px] ml-[28px]">
          <div
            className={`w-[25px] ${
              member?.type === "patient_member" || member?.type === "patient"
                ? ""
                : "invisible"
            }`}
          >
            <Square className="h-7 w-7" fill="black" strokeWidth={0} />
          </div>
          <div
            className={`w-[25px] ml-[228px] ${
              member?.type === "patient_dependent" ? "" : "invisible"
            }`}
          >
            <Square className="h-7 w-7" fill="black" strokeWidth={0} />
          </div>
        </div>

        {/* PIN / DATE */}
        <div className="flex mt-[13px] ml-[65px]">
          <span className="w-[195px]">
            {member?.person?.identifications?.find(
              (id: any) => id.type === "philhealth_identification_number"
            )?.value || "N/A"}
          </span>
          <span className="w-[142px] ml-[68px]">
            {formatDateShort(member?.person?.createdAt) || "N/A"}
          </span>
        </div>

        {/* FULL NAME */}
        <div className="flex mt-[21px] ml-[105px]">
          <span className="w-[370px]">
            {`${member?.person?.lastName || "N/A"},
            ${member?.person?.firstName || "N/A"} 
            ${member?.person?.middleName || "N/A"}`}
          </span>
        </div>

        {/* FULL ADDRESS */}
        <div className="flex mt-[24px] ml-[95px]">
          <span className="w-[370px]">
            {`${member?.person?.addresses[0]?.barangay?.value || "N/A"}, 
            ${member?.person?.addresses[0]?.city?.value || "N/A"},
            ${member?.person?.addresses[0]?.province?.value || "N/A"}`}
          </span>
        </div>

        {/* DOB / CONTACT */}
        <div className="flex mt-[37px] ml-[125px]">
          <span className="w-[145px]">
            {formatDateShort(member?.person?.birthDate || "N/A")}
          </span>
          <span className="w-[100px] ml-[105px]">
            {member?.person?.contacts?.find(
              (c: any) => c?.type === "mobile_number"
            )?.value || "N/A"}
          </span>
        </div>

        {/* REGISTER */}
        <div className="flex mt-[17px] ml-[27px]">
          <span className="w-[253px]">
            <Square className="h-7 w-8" fill="black" strokeWidth={0} />
          </span>
        </div>
        <div className="flex mt-[5px] ml-[28px]">
          <span className="w-[253px]">
            <Square
              className="h-7 w-7 invisible"
              fill="black"
              strokeWidth={0}
            />
          </span>
        </div>

        {/* FULL NAME */}
        <div className="flex mt-[28px] ml-[105px]">
          <span className="w-[370px]">
            {`${member?.person?.lastName || "N/A"},
            ${member?.person?.firstName || "N/A"} 
            ${member?.person?.middleName || "N/A"}`}
          </span>
        </div>

        {/* 1st Choice KPP */}
        <div className="flex mt-[30px] ml-[138px]">
          <span className="w-[330px]">{member?.facility?.name || "N/A"}</span>
        </div>

        {/* FULL ADDRESS */}
        <div className="flex mt-[19px] ml-[98px]">
          <span className="w-[370px]">
            {`${member?.facility?.addresses[0]?.barangay?.value || "N/A"}, 
            ${member?.facility?.addresses[0]?.city?.value || "N/A"},
            ${member?.facility?.addresses[0]?.province?.value || "N/A"}`}
          </span>
        </div>

        {/* 2nd Choice KPP */}
        <div className="flex mt-[32px] ml-[138px]">
          <span className="w-[330px]">{member?.facility?.name || "N/A"}</span>
        </div>

        {/* FULL ADDRESS */}
        <div className="flex mt-[21px] ml-[98px]">
          <span className="w-[370px]">
            {`${member?.facility?.addresses[0]?.barangay?.value || "N/A"}, 
            ${member?.facility?.addresses[0]?.city?.value || "N/A"},
            ${member?.facility?.addresses[0]?.province?.value || "N/A"}`}
          </span>
        </div>

        {/* TRANSFER */}
        <div className="flex mt-[38px] ml-[26px] invisible">
          <span className="w-[253px]">
            <Square className="h-7 w-7" fill="black" strokeWidth={0} />
          </span>
        </div>

        {/* PREVIOUS KPP */}
        <div className="flex mt-[11px] ml-[122px] invisible">
          <span className="w-[345px]">{member?.facility?.name || "N/A"}</span>
        </div>

        {/* 1st CHOICE KPP */}
        <div className="flex mt-[24px] ml-[134px] invisible">
          <span className="w-[334px]">{member?.facility?.name || "N/A"}</span>
        </div>

        {/* FULL ADDRESS */}
        <div className="flex mt-[17px] ml-[98px] invisible">
          <span className="w-[370px]">
            {`${member?.facility?.addresses[0]?.barangay?.value || "N/A"}, 
            ${member?.facility?.addresses[0]?.city?.value || "N/A"},
            ${member?.facility?.addresses[0]?.province?.value || "N/A"}`}
          </span>
        </div>

        {/* 2nd Choice KPP */}
        <div className="flex mt-[46px] ml-[143px] invisible">
          <span className="w-[330px]">
            <span className="w-[334px]">{member?.facility?.name || "N/A"}</span>
          </span>
        </div>

        {/* FULL ADDRESS */}
        <div className="flex mt-[20px] ml-[90px] invisible">
          <span className="w-[380px]">
            {`${member?.facility?.addresses[0]?.barangay?.value || "N/A"}, 
            ${member?.facility?.addresses[0]?.city?.value || "N/A"},
            ${member?.facility?.addresses[0]?.province?.value || "N/A"}`}
          </span>
        </div>

        {/* SIGNATURE */}
        <div className="flex mt-[218px] ml-[42px] text-left">
          <span className="w-[400px]">
            {`${member?.person?.firstName || "N/A"} 
            ${member?.person?.middleName || "N/A"}
            ${member?.person?.lastName || "N/A"}`}
          </span>
        </div>

        {/* ------------------ BENEFICIARY'S COPY ---------------- */}
        {/* REGISTRATION NO. / DATE */}
        <div className="flex mt-[105px] ml-[135px]">
          <span className="w-[130px]">
            {member?.person?.identifications?.find(
              (id: any) => id.type === "hci_case_number"
            )?.value || "N/A"}
          </span>
          <span className="w-[80px] ml-[125px]">
            {formatDateShort(member?.person?.createdAt) || "N/A"}
          </span>
        </div>

        {/* FULL NAME */}
        <div className="flex mt-[23px] ml-[97px]">
          <span className="w-[370px]">
            {`${member?.person?.lastName || "N/A"},
            ${member?.person?.firstName || "N/A"} 
            ${member?.person?.middleName || "N/A"}`}
          </span>
        </div>

        {/* PIN / DOB */}
        <div className="flex mt-[26px] ml-[65px]">
          <span className="w-[195px]">
            {member?.person?.identifications?.find(
              (id: any) => id.type === "philhealth_identification_number"
            )?.value || "N/A"}
          </span>
          <span className="w-[110px] ml-[100px]">
            {formatDateShort(member?.person?.birthDate || "N/A")}
          </span>
        </div>

        {/* KPP */}
        <div className="flex mt-[21px] ml-[65px]">
          <span className="w-[400px]">{member?.facility?.name || "N/A"}</span>
        </div>

        {/* FULL ADDRESS */}
        <div className="flex mt-[14px] ml-[95px]">
          <span className="w-[370px]">
            {`${member?.facility?.addresses[0]?.barangay?.value || "N/A"}, 
            ${member?.facility?.addresses[0]?.city?.value || "N/A"},
            ${member?.facility?.addresses[0]?.province?.value || "N/A"}`}
          </span>
        </div>

        {/* AUTHORIZED PERSON */}
        <div className="flex mt-[25px] ml-[45px] text-left">
          <span className="w-[400px]">
            {member?.facility?.authorizedPerson?.name || "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
