import { useState } from "react";

interface Props {
  encounter: any;
}

function formatDateShort(isoDate: string | undefined): string {
  if (!isoDate) return "N/A";

  const date = new Date(isoDate);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const yy = String(date.getFullYear());

  return `${mm}/${dd}/${yy}`;
}

function calculateAge(birthdate: string | undefined): string {
  if (!birthdate) return "N/A";

  const birth = new Date(birthdate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  const dayDiff = today.getDate() - birth.getDate();

  // If birthday hasn't occurred yet this year, subtract 1
  if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
    age--;
  }

  return age >= 0 ? age.toString() : "N/A";
}

export default function MedicalCertificateContent({ encounter }: Props) {
  const [scale, setScale] = useState(1);

  return (
    <div
      className="print-area transition-transform duration-300 ease-in-out p-5"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        width: "900px",
        height: "540px",
        margin: "0 auto",
      }}
    >
      <div
        className="relative h-[1450px] bg-white shadow-2xl rounded-lg overflow-hidden mx-auto text-base uppercase mb-[20px] text-xl"
        style={{
          backgroundImage: `url('/template/medical-certificate/FTCC-Medical-Certificate.jpg')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* HCI NAME / REGISTRATION NUMBER */}
        <div className="flex mt-[337px] ml-[625px]">
          <span className="w-[195px] flex justify-center">
            {formatDateShort(encounter?.consultation?.createdAt) || "N/A"}
          </span>
        </div>

        {/* FULL NAME */}
        <div className="flex mt-[29px] ml-[290px]">
          <span className="w-[538px] flex justify-center">
            {encounter?.patient?.firstName +
              " " +
              encounter?.patient?.middleName +
              " " +
              encounter?.patient?.lastName || "N/A"}
          </span>
        </div>

        {/* AGE / SEX / ADDRESS */}
        <div className="flex mt-[31px] ml-[142px]">
          <span className="w-[118px] flex justify-center">
            {calculateAge(encounter?.patient?.birthDate || "N/A")} /{" "}
            {encounter?.patient?.sex || "N/A"}
          </span>
          <span className="ml-[115px] w-[455px] flex justify-center">
            {`${encounter?.patient?.addresse?.barangay?.value}, ${encounter?.patient?.addresse?.city?.value}, ${encounter?.patient?.addresse?.province?.value}` ||
              "N/A"}
          </span>
        </div>

        {/* ADDRESS LINE 2 */}
        <div className="flex mt-[35px] ml-[42px] h-[24.5px]"></div>

        <div className="flex mt-[33px] ml-[354px]">
          {encounter?.interview?.reviews?.chiefComplaint?.length > 0 ? (
            encounter.interview.reviews.chiefComplaint.map(
              (item: string, index: number) => (
                <div>
                  <span key={index} className="mb-1">
                    {item},
                  </span>
                </div>
              )
            )
          ) : (
            <span>N/A</span>
          )}
        </div>

        <div className="flex mt-[35px] ml-[145px] h-[130px]">
          {encounter?.consultation?.icd?.length > 0 ? (
            encounter.consultation.icd.map((item: any, index: number) => (
              <div key={index}>
                <span className="mb-1">
                  {item.description /* or item.code, or combine them */}
                </span>
              </div>
            ))
          ) : (
            <span>N/A</span>
          )}
        </div>

        <div className="flex mt-[40px] ml-[275px]">
          <span>{encounter?.consultation?.advice[0]?.remarks?.value}</span>
        </div>
      </div>
    </div>
  );
}
