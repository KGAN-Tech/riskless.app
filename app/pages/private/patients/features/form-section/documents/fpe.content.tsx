import { Circle } from "lucide-react";

interface Props {
  encounter: any;
  scale: any;
}

function cmToInches(cm: number | undefined): string {
  if (cm == null || isNaN(cm)) return "N/A";
  const inches = cm * 0.393701;
  return `${inches.toFixed(2)}`; // round to 2 decimal places
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

function kgToLbs(kg: number | undefined): string {
  if (kg == null || isNaN(kg)) return "N/A";
  const lbs = kg * 2.20462;
  return `${lbs.toFixed(2)}`; // round to 2 decimal places
}

function calculateBMI(
  heightCm: number | undefined,
  weightKg: number | undefined
): string {
  if (
    heightCm == null ||
    weightKg == null ||
    isNaN(heightCm) ||
    isNaN(weightKg)
  ) {
    return "N/A";
  }

  const heightM = heightCm / 100;
  if (heightM <= 0) return "N/A";

  const bmi = weightKg / (heightM * heightM);
  return `${bmi.toFixed(1)}`; // one decimal place
}

function formatDateShort(isoDate: string | undefined): string {
  if (!isoDate) return "N/A";

  const date = new Date(isoDate);
  const mm = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
  const dd = String(date.getDate()).padStart(2, "0");
  const yy = String(date.getFullYear());

  return `${mm}/${dd}/${yy}`;
}

export default function FPEContent({ encounter, scale }: Props) {
  return (
    <div
      className="print-area transition-transform duration-300 ease-in-out p-5"
      style={{
        transform: `scale(${scale})`,
        transformOrigin: "center center",
        width: "1000px",
        height: "540px", //1450px
        margin: "0 auto",
      }}
    >
      {/* Form container with background image */}
      <div
        className="fpe-page page-1 relative h-[1450px] bg-white shadow-2xl rounded-lg overflow-hidden mx-auto text-base uppercase mb-[20px]"
        style={{
          backgroundImage: `url('/template/fpe/2024/Annex_G_FPE_Form-1.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* Walkin - Appointment */}
        <div className="flex mt-[139px] ml-[42px]">
          <span className="w-[13px]">
            <Circle
              className={`h-4 w-4 ${
                encounter?.type?.service == "physical"
                  ? "fill-black"
                  : "invisible"
              }`}
              strokeWidth={0}
            />
          </span>
          <span className="w-[13px] ml-[268px]">
            <Circle
              className={`h-4 w-4 ${
                encounter?.type?.service == "appointment"
                  ? "fill-black"
                  : "invisible"
              }`}
              strokeWidth={0}
            />
          </span>
        </div>

        {/* Health Screening Date */}
        <div className="flex mt-[48px] ml-[47px]">
          <span className="w-[460px]">
            {formatDateShort(encounter?.transactionDate)}
          </span>
        </div>

        {/* Case Number - PIN */}
        <div className="flex mt-[90px] ml-[47px]">
          <span className="w-[420px]">
            {encounter?.patient?.identifications?.find(
              (id: any) => id.type === "hci_case_number"
            )?.value || "N/A"}
          </span>
          <span className="w-[420px] ml-[22px]">
            {encounter?.patient?.identifications?.find(
              (id: any) => id.type === "philhealth_identification_number"
            )?.value || "N/A"}
          </span>
        </div>

        {/* Client Details */}
        <div className="flex mt-[90px] ml-[49px]">
          <span className="w-[198px]">
            {encounter?.patient?.lastName || "N/A"}
          </span>
          <span className="w-[198px] ml-[23px]">
            {encounter?.patient?.firstName || "N/A"}
          </span>
          <span className="w-[198px] ml-[23px]">
            {encounter?.patient?.middleName || "N/A"}
          </span>
          <span className="w-[198px] ml-[23px]">
            {encounter?.patient?.extName || "N/A"}
          </span>
        </div>
        <div className="flex mt-[42px] ml-[50px]">
          <span className="w-[198px]">
            {calculateAge(encounter?.patient?.birthDate) || "N/A"}
          </span>
          <span className="w-[198px] ml-[23px]">
            {formatDateShort(encounter?.patient?.birthDate || "N/A")}
          </span>
          <span className="w-[198px] ml-[23px]">
            {encounter?.patient?.sex || "N/A"}
          </span>
          <span className="w-[198px] ml-[23px]">
            {encounter?.patient?.User[0]?.type === "patient_member"
              ? "Member"
              : encounter?.patient?.User[0]?.type === "dependent"
              ? "Dependent"
              : encounter?.patient?.User[0]?.type === "patient"
              ? "Member"
              : "N/A"}
          </span>
        </div>

        {/* 1. Chief Complaint */}
        <div className="flex mt-[102px] ml-[105px] w-[787px] h-[42px]">
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

        {/* 2. Chief Complaint */}
        <div className="flex mt-[72px] ml-[103px]">
          <span className="w-[13px]">
            <Circle
              className={`h-5 w-5 ${
                encounter?.interview?.reviews?.general === null ||
                encounter?.interview?.reviews?.general?.hasIssues === false
                  ? "invisible"
                  : ""
              }`}
              fill="black"
              strokeWidth={0}
            />
          </span>
          <span className="w-[13px] ml-[111px]">
            <Circle
              className={`h-5 w-5 ${
                encounter?.interview?.reviews?.general === null ||
                encounter?.interview?.reviews?.general?.hasIssues === false
                  ? ""
                  : "invisible"
              }`}
              fill="black"
              strokeWidth={0}
            />
          </span>
        </div>
        <div className="flex mt-[23px] ml-[105px]">
          <span className="w-[787px]">
            {encounter?.interview?.reviews?.general === null
              ? "N/A"
              : encounter?.interview?.reviews?.general?.hasIssues
              ? encounter?.interview?.reviews?.general?.explain
              : ""}
          </span>
        </div>

        {/* 3. Chief Complaint */}
        <div className="flex mt-[70px] ml-[106px]">
          <span className="w-[13px]">
            <Circle
              className={`h-5 w-5 ${
                encounter?.interview?.reviews?.respiratory === null ||
                encounter?.interview?.reviews?.respiratory?.hasIssues === false
                  ? "invisible"
                  : ""
              }`}
              fill="black"
              strokeWidth={0}
            />
          </span>
          <span className="w-[13px] ml-[108px]">
            <Circle
              className={`h-5 w-5 ${
                encounter?.interview?.reviews?.respiratory === null ||
                encounter?.interview?.reviews?.respiratory?.hasIssues === false
                  ? ""
                  : "invisible"
              }`}
              fill="black"
              strokeWidth={0}
            />
          </span>
        </div>
        <div className={`flex mt-[24px] ml-[105px]`}>
          <span className="w-[198px]">
            {encounter?.interview?.reviews?.respiratory === null
              ? "N/A"
              : encounter?.interview?.reviews?.respiratory?.hasIssues
              ? encounter?.interview?.reviews?.respiratory?.explain
              : ""}
          </span>
        </div>

        {/* 4. Chief Complaint */}
        <div className="flex mt-[70px] ml-[107px]">
          <span className="w-[13px]">
            <Circle
              className={`h-5 w-5 ${
                encounter?.interview?.reviews?.gi === null ||
                encounter?.interview?.reviews?.gi?.hasIssues === false
                  ? "invisible"
                  : ""
              }`}
              fill="black"
              strokeWidth={0}
            />
          </span>
          <span className="w-[13px] ml-[107px]">
            <Circle
              className={`h-5 w-5 ${
                encounter?.interview?.reviews?.gi === null ||
                encounter?.interview?.reviews?.gi?.hasIssues === false
                  ? ""
                  : "invisible"
              }`}
              fill="black"
              strokeWidth={0}
            />
          </span>
        </div>
        <div className="flex mt-[23px] ml-[105px]">
          <span className="w-[787px]">
            {encounter?.interview?.reviews?.gi === null
              ? "N/A"
              : encounter?.interview?.reviews?.gi?.hasIssues
              ? encounter?.interview?.reviews?.gi?.explain
              : ""}
          </span>
        </div>

        {/* 5. Chief Complaint */}
        <div className="flex mt-[72px] ml-[112px]">
          <span className="w-[13px]">
            <Circle
              className={`h-5 w-5 ${
                encounter?.interview?.reviews?.endocrine === null ||
                encounter?.interview?.reviews?.endocrine?.hasIssues === false
                  ? "invisible"
                  : ""
              }`}
              fill="black"
              strokeWidth={0}
            />
          </span>
          <span className="w-[13px] ml-[111px]">
            <Circle
              className={`h-5 w-5 ${
                encounter?.interview?.reviews?.endocrine === null ||
                encounter?.interview?.reviews?.endocrine?.hasIssues === false
                  ? ""
                  : "invisible"
              }`}
              fill="black"
              strokeWidth={0}
            />
          </span>
        </div>
        <div className="flex mt-[23px] ml-[105px]">
          <span className="w-[787px]">
            {encounter?.interview?.reviews?.endocrine === null
              ? "N/A"
              : encounter?.interview?.reviews?.endocrine?.hasIssues
              ? encounter?.interview?.reviews?.endocrine?.explain
              : ""}
          </span>
        </div>

        {/* 6. Chief Complaint */}
        <div className="flex mt-[107px] ml-[111px]">
          <span className="w-[13px]">
            <Circle
              className={`h-5 w-5 ${
                encounter?.interview?.reviews?.genital === null ||
                encounter?.interview?.reviews?.genital?.hasIssues === false
                  ? "invisible"
                  : ""
              }`}
              fill="black"
              strokeWidth={0}
            />
          </span>
          <span className="w-[13px] ml-[100px]">
            <Circle
              className={`h-5 w-5 ${
                encounter?.interview?.reviews?.genital === null ||
                encounter?.interview?.reviews?.genital?.hasIssues === false
                  ? ""
                  : "invisible"
              }`}
              fill="black"
              strokeWidth={0}
            />
          </span>
        </div>
        <div className="flex mt-[23px] ml-[105px]">
          <span className="w-[787px]">
            {encounter?.interview?.reviews?.genital === null
              ? "N/A"
              : encounter?.interview?.reviews?.genital?.hasIssues
              ? encounter?.interview?.reviews?.genital?.explain
              : ""}
          </span>
        </div>
      </div>
      <div
        className="fpe-page page-2 relative h-[1450px] bg-white shadow-2xl rounded-lg overflow-hidden mx-auto text-base uppercase"
        style={{
          backgroundImage: `url('/template/fpe/2024/Annex_G_FPE_Form-2.png')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* 7. Chief Complaint */}
        <div className="flex mt-[127px] ml-[111px]">
          <span className="w-[315px]">
            {formatDateShort(
              encounter?.interview?.history?.menstrual?.lastMensPeriod
            ) || "N/A"}
          </span>
          <span className="w-[315px] ml-[160px]">
            {formatDateShort(
              encounter?.interview?.history?.menstrual?.firstMensPeriod
            ) || "N/A"}
          </span>
        </div>
        <div className="flex mt-[1px] ml-[300px]">
          <span className="w-[155px]">
            {encounter?.interview?.history?.pregnancy?.pregnancyCount || "N/A"}
          </span>
        </div>

        {/* 8. Chief Complaint */}
        <div className="flex mt-[64px] ml-[112px]">
          <span className="w-[13px]">
            <Circle
              className={`h-5 w-5 ${
                encounter?.interview?.reviews?.musculoskeletal === null ||
                encounter?.interview?.reviews?.musculoskeletal?.hasIssues ===
                  false
                  ? "invisible"
                  : ""
              }`}
              fill="black"
              strokeWidth={0}
            />
          </span>
          <span className="w-[13px] ml-[100px]">
            <Circle
              className={`h-5 w-5 ${
                encounter?.interview?.reviews?.musculoskeletal === null ||
                encounter?.interview?.reviews?.musculoskeletal?.hasIssues ===
                  false
                  ? ""
                  : "invisible"
              }`}
              fill="black"
              strokeWidth={0}
            />
          </span>
        </div>
        <div className="flex mt-[23px] ml-[105px]">
          <span className="w-[787px]">
            {encounter?.interview?.reviews?.musculoskeletal === null
              ? "N/A"
              : encounter?.interview?.reviews?.musculoskeletal?.hasIssues
              ? encounter?.interview?.reviews?.musculoskeletal?.explain
              : ""}
          </span>
        </div>

        {/* PERSONAL / SOCIAL HISTORY */}
        {/* SMOKING */}
        <div className="flex mt-[136px] ml-[104px]">
          <span className="w-[13px]">
            <Circle
              className={`h-3 w-3 ${
                encounter?.interview?.history?.social?.isSmoker
                  ? "fill-black"
                  : "invisible"
              }`}
              strokeWidth={0}
            />
          </span>
          <span className="w-[13px] ml-[111px]">
            <Circle
              className={`h-3 w-3 ${
                encounter?.interview?.history?.social?.isSmoker
                  ? "invisible"
                  : "fill-black"
              }`}
              strokeWidth={0}
            />
          </span>
          <span className="w-[50px] ml-[210px] mt-[-7px]">
            {encounter?.interview?.history?.social?.cigarettePkgNo != null
              ? encounter?.interview?.history?.social?.cigarettePkgNo
              : "N/A"}
          </span>
        </div>

        {/* DRINKING */}
        <div className="flex mt-[27px] ml-[104px]">
          <span className="w-[13px]">
            <Circle
              className={`h-3 w-3 ${
                encounter?.interview?.history?.social?.isDrinker
                  ? "fill-black"
                  : "invisible"
              }`}
              strokeWidth={0}
            />
          </span>
          <span className="w-[13px] ml-[111px]">
            <Circle
              className={`h-3 w-3 ${
                encounter?.interview?.history?.social?.isDrinker
                  ? "invisible"
                  : "fill-black"
              }`}
              strokeWidth={0}
            />
          </span>
          <span className="w-[50px] ml-[210px] mt-[-7px]">
            {encounter?.interview?.history?.social?.bottlesNo != null
              ? encounter?.interview?.history?.social?.bottlesNo
              : "N/A"}
          </span>
        </div>

        {/* PAST MEDICAL HISTORY */}
        <div className="flex mt-[54px] ml-[41px]">
          <span className="w-[13px]">
            <Circle className="h-3 w-3" fill="black" strokeWidth={0} />
          </span>
          <span className="w-[13px] ml-[288px]">
            <Circle className="h-3 w-3" fill="black" strokeWidth={0} />
          </span>
          <span className="w-[13px] ml-[288px]">
            <Circle className="h-3 w-3" fill="black" strokeWidth={0} />
          </span>
        </div>
        <div className="flex mt-[12px] ml-[41px]">
          <span className="w-[13px]">
            <Circle className="h-3 w-3" fill="black" strokeWidth={0} />
          </span>
          <span className="w-[13px] ml-[288px]">
            <Circle className="h-3 w-3" fill="black" strokeWidth={0} />
          </span>
          <span className="w-[13px] ml-[288px]">
            <Circle className="h-3 w-3" fill="black" strokeWidth={0} />
          </span>
        </div>
        <div className="flex mt-[12px] ml-[41px]">
          <span className="w-[13px]">
            <Circle className="h-3 w-3" fill="black" strokeWidth={0} />
          </span>
          <span className="w-[13px] ml-[288px]">
            <Circle className="h-3 w-3" fill="black" strokeWidth={0} />
          </span>
          <span className="w-[13px] ml-[288px]">
            <Circle className="h-3 w-3" fill="black" strokeWidth={0} />
          </span>
        </div>
        <div className="flex mt-[11px] ml-[41px]">
          <span className="w-[13px]">
            <Circle className="h-3 w-3" fill="black" strokeWidth={0} />
          </span>
          <span className="w-[13px] ml-[288px]">
            <Circle className="h-3 w-3" fill="black" strokeWidth={0} />
          </span>
          <span className="w-[13px] ml-[288px]">
            <Circle className="h-3 w-3" fill="black" strokeWidth={0} />
          </span>
        </div>

        <div className="flex mt-[113px] ml-[193px]">
          {/* BLOOD PRESSURE */}
          <span className="w-[75px]">
            {encounter?.vital?.measurement?.bloodPressure?.diastolic != null
              ? encounter?.vital?.measurement?.bloodPressure?.diastolic
              : "N/A"}
          </span>
          <span className="w-[75px] ml-[42px]">
            {encounter?.vital?.measurement?.bloodPressure?.systolic != null
              ? encounter?.vital?.measurement?.bloodPressure?.systolic
              : "N/A"}
          </span>

          {/* HEIGHT  */}
          <span className="w-[75px] ml-[250px]">
            {encounter?.vital?.measurement?.height?.value != null
              ? encounter?.vital?.measurement?.height.value
              : "N/A"}
          </span>
          <span className="w-[80px] ml-[67px]">
            {cmToInches(encounter?.vital?.measurement?.weight?.value)}
          </span>
        </div>

        <div className="flex mt-[14px] ml-[193px]">
          {/* HEART RATE */}
          <span className="w-[75px]">
            {encounter?.vital?.measurement?.heartRate.value != null
              ? encounter?.vital?.measurement?.heartRate.value
              : "N/A"}
          </span>

          {/* WEIGHT  */}
          <span className="w-[75px] ml-[368px]">
            {encounter?.vital?.measurement?.weight?.value != null
              ? encounter?.vital?.measurement?.weight.value
              : "N/A"}
          </span>
          <span className="w-[80px] ml-[67px]">
            {kgToLbs(encounter?.vital?.measurement?.weight?.value)}
          </span>
        </div>

        {/* RESPIRATORY RATE */}
        <div className="flex mt-[15px] ml-[193px]">
          <span className="w-[193px]">
            {encounter?.vital?.measurement?.respiratoryRate?.value != null
              ? encounter?.vital?.measurement?.respiratoryRate?.value
              : "N/A"}
          </span>
          <span className="w-[218px] ml-[250px]">
            {calculateBMI(
              encounter?.vital?.measurement?.height?.value,
              encounter?.vital?.measurement?.weight?.value
            )}
          </span>
        </div>

        {/* VISUAL */}
        <div className="flex mt-[15px] ml-[193px]">
          <span className="w-[80px]">
            {encounter?.vital?.vision?.left != null
              ? encounter?.vital?.vision?.left
              : "N/A"}
          </span>
          <span className="w-[80px] ml-[35px]">
            {encounter?.vital?.vision?.right != null
              ? encounter?.vital?.vision?.right
              : "N/A"}
          </span>
          <span className="w-[220px] ml-[247px]">
            {encounter?.vital?.temperature?.value != null
              ? encounter?.vital?.temperature?.value
              : "N/A"}
          </span>
        </div>

        {/* PEDIATRIC */}
        <div className="flex mt-[90px] ml-[50px]">
          <span className="w-[210px]">
            {encounter?.vital?.measurement?.length != null
              ? encounter?.vital?.measurement?.length
              : "N/A"}
          </span>
          <span className="w-[210px] ml-[65px]">
            {encounter?.vital?.measurement?.headCirc != null
              ? encounter?.vital?.measurement?.headCirc
              : "N/A"}
          </span>
          <span className="w-[220px] ml-[90px]">
            {encounter?.vital?.measurement?.skinfoldThickness != null
              ? encounter?.vital?.measurement?.skinfoldThickness
              : "N/A"}
          </span>
        </div>
        <div className="flex mt-[65px] ml-[50px]">
          <span className="w-[210px]">
            {encounter?.vital?.measurement?.waist != null
              ? encounter?.vital?.measurement?.waist
              : "N/A"}
          </span>
          <span className="w-[210px] ml-[65px]">
            {encounter?.vital?.measurement?.hip != null
              ? encounter?.vital?.measurement?.hip
              : "N/A"}
          </span>
          <span className="w-[220px] ml-[90px]">
            {encounter?.vital?.measurement?.limbs != null
              ? encounter?.vital?.measurement?.limbs
              : "N/A"}
          </span>
        </div>
        <div className="flex mt-[55px] ml-[50px]">
          <span className="w-[210px]">
            {encounter?.vital?.measurement?.midUpperArmCirc != null
              ? encounter?.vital?.measurement?.midUpperArmCirc
              : "N/A"}
          </span>
        </div>

        <div className="flex mt-[69px] ml-[42px]">
          <span className="w-[13px]">
            <Circle
              className={`h-4 w-4 ${
                encounter?.vital?.blood?.type === "a_positive"
                  ? "fill-black"
                  : "invisible"
              }`}
              strokeWidth={1}
            />
          </span>
          <span className="w-[13px] ml-[97px]">
            <Circle
              className={`h-4 w-4 ${
                encounter?.vital?.blood?.type === "b_positive"
                  ? "fill-black"
                  : "invisible"
              }`}
              strokeWidth={1}
            />
          </span>
          <span className="w-[13px] ml-[97px]">
            <Circle
              className={`h-4 w-4 ${
                encounter?.vital?.blood?.type === "ab_positive"
                  ? "fill-black"
                  : "invisible"
              }`}
              strokeWidth={1}
            />
          </span>
          <span className="w-[13px] ml-[97px]">
            <Circle
              className={`h-4 w-4 ${
                encounter?.vital?.blood?.type === "o_positive"
                  ? "fill-black"
                  : "invisible"
              }`}
              strokeWidth={0}
            />
          </span>
          <span className="w-[13px] ml-[97px]">
            <Circle
              className={`h-4 w-4 ${
                encounter?.vital?.blood?.type === "a_negative"
                  ? "fill-black"
                  : "invisible"
              }`}
              strokeWidth={1}
            />
          </span>
          <span className="w-[13px] ml-[97px]">
            <Circle
              className={`h-4 w-4 ${
                encounter?.vital?.blood?.type === "b_negative"
                  ? "fill-black"
                  : "invisible"
              }`}
              strokeWidth={1}
            />
          </span>
          <span className="w-[13px] ml-[97px]">
            <Circle
              className={`h-4 w-4 ${
                encounter?.vital?.blood?.type === "ab_negative"
                  ? "fill-black"
                  : "invisible"
              }`}
              strokeWidth={1}
            />
          </span>
          <span className="w-[13px] ml-[97px]">
            <Circle
              className={`h-4 w-4 ${
                encounter?.vital?.blood?.type === "o_negative"
                  ? "fill-black"
                  : "invisible"
              }`}
              strokeWidth={1}
            />
          </span>
        </div>

        {/* PEDIATRIC */}
        <div className="flex mt-[29px] ml-[103px]">
          <span className="w-[13px] ml-[97px]">
            <Circle
              className={`h-4 w-4 ${
                encounter?.generalSurvey?.code === "ALERT"
                  ? "fill-black"
                  : "invisible"
              }`}
              strokeWidth={1}
            />
          </span>
          <span className="w-[13px] ml-[161px]">
            <Circle
              className={`h-4 w-4 ${
                encounter?.generalSurvey?.code === "ALTERED"
                  ? "fill-black"
                  : "invisible"
              }`}
              strokeWidth={1}
            />
          </span>
          <span className="w-[380px] ml-[150px] mt-[-4px]">
            {encounter?.generalSurvey?.value != null
              ? encounter?.generalSurvey?.value
              : "N/A"}
          </span>
        </div>
      </div>
    </div>
  );
}
