import { useState, useEffect } from "react";
import {
  Printer,
  Download,
  FileText,
  Edit3,
  ZoomIn,
  ZoomOut,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";
import { Circle, Square } from "lucide-react";
import { formatPKRFData, formatFPEData } from "@/utils/document.helpers";

interface ProfileTabProps {
  member: any;
}

export default function PKRFnFPEModal({ member }: ProfileTabProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenFPE, setIsOpenFPE] = useState(false);
  const [scale, setScale] = useState(1);
  
  // PKRF data with person information
  const pkrfDataWithPerson = {
    ...member?.pkrf,
    person: {
      firstName: member?.firstName,
      middleName: member?.middleName,
      lastName: member?.lastName,
      suffix: member?.suffix,
      philHealthIdNumber: member?.philHealthIdNumber,
      birthDate: member?.birthDate,
      mobileNumber: member?.mobileNumber,
      address: member?.address,
      clientType: member?.clientType,
    }
  };
  
  // FPE data with person information
  const fpeDataWithPerson = {
    ...member?.fpe,
    person: {
      firstName: member?.firstName,
      middleName: member?.middleName,
      lastName: member?.lastName,
      suffix: member?.suffix,
      philHealthIdNumber: member?.philHealthIdNumber,
      birthDate: member?.birthDate,
      mobileNumber: member?.mobileNumber,
      address: member?.address,
      age: member?.age,
      gender: member?.gender,
      clientType: member?.clientType,
    }
  };
  
  const formattedPKRF = formatPKRFData(pkrfDataWithPerson);
  const formattedFPE = formatFPEData(fpeDataWithPerson);

  // Helper function to convert formatted review data back to boolean for ReviewCircleRow
  const getReviewValue = (formattedData: Record<string, string>, field: string): boolean | undefined => {
    const value = formattedData[field];
    if (value === "●") return true;
    if (value === "◯") return false;
    return undefined;
  };

  const getReviewExplanation = (formattedData: Record<string, string>, field: string): string => {
    return formattedData[field] || "";
  };

  // Calculate responsive scale based on screen size
  useEffect(() => {
    const calculateScale = () => {
      const screenWidth = window.innerWidth;

      if (screenWidth < 640) {
        // Mobile
        setScale(0.4);
      } else if (screenWidth < 768) {
        // Small tablet
        setScale(0.6);
      } else if (screenWidth < 1024) {
        // Tablet
        setScale(0.7);
      } else if (screenWidth < 1280) {
        // Small desktop
        setScale(0.8);
      } else {
        // Large desktop
        setScale(1);
      }
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleDownload = () => {
    // const content = {}
    // const blob = new Blob([content], { type: "text/plain" });
    // const url = URL.createObjectURL(blob);
    // const a = document.createElement("a");
    // a.href = url;
    // a.download = "form-data.txt";
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);
    // URL.revokeObjectURL(url);
  };

  const adjustScale = (delta: number) => {
    setScale((prev) => Math.max(0.3, Math.min(1.5, prev + delta)));
  };

  interface ReviewCircleRowProps {
    value?: boolean;
    explanation?: string;
    className?: string;
    trueWidth?: string;
    falseWidth?: string;
  }

  const ReviewCircleRow = ({ value, explanation, className = "ml-[100px] mt-[59px]", trueWidth = "w-[99px]", falseWidth = "w-[223px]" }: ReviewCircleRowProps) => (
    <div className={className}>
      <div className="flex">
        <div className={trueWidth}>
          {value === true && (
            <Circle className="h-3 w-3" fill="black" strokeWidth={0} />
          )}
        </div>
        <div className={falseWidth}>
          {value === false && (
            <Circle className="h-3 w-3" fill="black" strokeWidth={0} />
          )}
        </div>
      </div>
      {explanation && (
        <div className="mt-[20px] ml-[5px]">
          <p 
            className="text-xs w-[625px] h-[15px] overflow-hidden"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
            }}
          >{explanation}</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex p-4 sm:p-8 gap-4">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-2">
            <FileText className="w-4 h-4" />
            PKRF Form
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0 bg-white/10 backdrop-blur-lg border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 backdrop-blur-md" />
          <div className="relative z-10 h-full flex flex-col">
            <DialogHeader className="p-3 sm:p-6 pb-4 border-b border-white/30 bg-white/20 flex-shrink-0">
              <div className="flex justify-between items-center">
                <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                  FPE Printable Form
                </DialogTitle>
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full w-8 h-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </DialogClose>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  onClick={() => adjustScale(-0.1)}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm"
                >
                  <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  onClick={() => adjustScale(0.1)}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm"
                >
                  <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm"
                >
                  <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
              <div className="text-xs text-gray-600 mt-2">
                Scale: {Math.round(scale * 100)}%
              </div>
            </DialogHeader>

            <div className=" overflow-x-auto overflow-y-auto p-5 h-[1000px] pb-92">
              {/* Scalable form container */}
              <div
                className="print-area transition-transform duration-300 ease-in-out"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top center",
                  width: "800px",
                  height: "1150px",
                  margin: "0 auto",
                }}
              >
                {/* Form container with background image */}
                <div
                  className="relative w-[800px] h-[1100px] bg-white shadow-2xl rounded-lg overflow-hidden mx-auto mb-5 text-[10px]"
                  style={{
                    backgroundImage: `url('/template/pkrf/Annex_A_PKRF_2024-1.png?height=1000&width=800')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {/* Member Type */}
                  <div className="flex mt-[174px] ml-[81px]">
                    <div className="w-[172px]">
                      {formattedPKRF['clientType'] === "member" && (
                        <Square className="h-3 w-3" fill="black" strokeWidth={0} />
                      )}
                    </div>
                    <div className="w-[100px]">
                      {formattedPKRF['clientType'] === "dependent" &&  (
                        <Square className="h-3 w-3" fill="black" strokeWidth={0} />
                      )}
                    </div>
                  </div>
                  {/* PIN & Date Type */}
                  <div className="flex mt-[8px] ml-[100px]">
                    <p className="w-[180px]">
                      {formattedPKRF['pin'] || "N/A"}
                    </p>
                    <p>
                      {formattedPKRF['date'] || "N/A"}
                    </p>
                  </div>
                  {/* FULL NAME */}
                  <div className="flex mt-[9px] ml-[145px]">
                    <p>
                      <span>
                        {formattedPKRF['person.fullName'] || 'N/A'}
                      </span>
                    </p>
                  </div>
                  {/* ADDRESS */}
                  <div
                    className="flex mt-[10px] ml-[130px]">
                    <p>
                      <span>  
                        {formattedPKRF['person.address.full'] || 'N/A'}
                      </span>
                    </p>
                  </div>
                  {/* Date of Birth - Contact No. */}
                  <div className="flex mt-[21px] ml-[150px]">
                    <p className="w-[165px]">
                      <span>
                        {formattedPKRF['birth1'] || 'N/A'}
                      </span>
                    </p>
                    <p>
                      <span>
                        {formattedPKRF['contact'] || 'N/A'}
                      </span>
                    </p>
                  </div>
                  {/* Register to KPP */}
                  <div className="flex mt-[12px] ml-[81px]">
                    <Square className="h-3 w-3" fill="black" strokeWidth={0} />
                  </div>
                  {/* FULL NAME */}
                  <div className="flex mt-[38px] ml-[145px]">
                    <p>{formattedPKRF['person.fullName'] || '_'}</p>
                  </div>
                  {/* KPP Name */}
                  <div className="flex mt-[14px] ml-[170px]">
                    <p>FTCC Health Tech Clinic</p>
                  </div>
                  {/* ADDRESS */}
                  <div className="flex mt-[9px] ml-[134px]">
                    <p>Wack Wack Greenhills, Mandaluyong, Manila</p>
                  </div>
                  {/* PRINTED NAME */}
                  <div className="flex mt-[370px] ml-[90px]">
                    <p className="text-center w-[143px]">{formattedPKRF['person.fullName'] || '_'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={isOpenFPE} onOpenChange={setIsOpenFPE}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-2">
            <FileText className="w-4 h-4" />
            FPE Form
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0 bg-white/10 backdrop-blur-lg border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 backdrop-blur-md" />
          <div className="relative z-10 h-full flex flex-col">
            <DialogHeader className="p-3 sm:p-6 pb-4 border-b border-white/30 bg-white/20 flex-shrink-0">
              <div className="flex justify-between items-center">
                <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-800">
                  PKRF Printable Form
                </DialogTitle>
                <DialogClose asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="rounded-full w-8 h-8 p-0"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </DialogClose>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  onClick={() => adjustScale(-0.1)}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm"
                >
                  <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  onClick={() => adjustScale(0.1)}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm"
                >
                  <ZoomIn className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  onClick={handlePrint}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm"
                >
                  <Printer className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
                <Button
                  onClick={handleDownload}
                  variant="outline"
                  size="sm"
                  className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm"
                >
                  <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                </Button>
              </div>
              <div className="text-xs text-gray-600 mt-2">
                Scale: {Math.round(scale * 100)}%
              </div>
            </DialogHeader>

            <div className=" overflow-x-auto overflow-y-auto p-5 h-[1000px] pb-92">
              {/* Scalable form container */}
              <div
                className="print-area transition-transform duration-300 ease-in-out"
                style={{
                  transform: `scale(${scale})`,
                  transformOrigin: "top center",
                  width: "800px",
                  height: "2350px",
                  margin: "0 auto",
                }}
              >
                {/* Form container with background image */}
                <div
                  className="relative w-[800px] h-[1150px] bg-white shadow-2xl rounded-lg overflow-hidden mx-auto mb-5"
                  style={{
                    backgroundImage: `url('/template/fpe/2024/Annex_G_FPE_Form-1.png?height=1150&width=800')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {/* Visit Types */}
                  <div className="flex mt-[110px] ml-[50px]">
                    <div className="w-[223px]">
                      {formattedFPE['visitType.walkIn'] === "☑" && (
                        <Circle className="h-3 w-3" fill="black" strokeWidth={0} />
                      )}
                    </div>
                    <div className="w-[223px]">
                      {formattedFPE['visitType.appointment'] === "☑" && (
                        <Circle className="h-3 w-3" fill="black" strokeWidth={0} />
                      )}
                    </div>
                  </div>

                  {/* Health Screeening Date */}
                  <div className="flex mt-[33px] ml-[65px]">
                    <p className="text-md">
                      {formattedFPE['screeningDate'] || "N/A"}
                    </p>
                  </div>

                  {/* Individual Health Profile */}
                  <div className="flex mt-[64px] ml-[65px]">
                    <p className="text-md w-[350px]">
                      {formattedFPE['caseNumber'] || "N/A"}
                    </p>
                    <p className="text-md">
                      {formattedFPE['person.philHealthIdNumber'] || "N/A"}
                    </p>
                  </div>

                  {/* Client Details 1st row*/}
                  <div className="flex mt-[65px] ml-[65px]">
                    <p className="w-[170px] text-md">
                      {formattedFPE['person.lastName'] || "N/A"}
                    </p>
                    <p className="w-[175px] text-md">
                      {formattedFPE['person.firstName'] || "N/A"}
                    </p>
                    <p className="w-[180px] text-md">
                      {formattedFPE['person.middleName'] || "N/A"}
                    </p>
                    <p className="w-[170px] text-md">
                      {formattedFPE['person.suffix'] || "N/A"}
                    </p>
                  </div>

                  {/* Client Details 2nd row*/}
                  <div className="flex mt-[27px] ml-[65px]">
                    <p className="w-[170px] text-md">
                      {formattedFPE['person.age'] || "N/A"}
                    </p>
                    <p className="w-[175px] text-md">
                      {formattedFPE['person.birthDate'] || "N/A"}
                    </p>
                    <p className="w-[180px] text-md">
                      {formattedFPE['person.gender'] || "N/A"}
                    </p>
                    <p className="w-[170px] text-md">
                      {formattedFPE['person.clientType'] || "N/A"}
                    </p>
                  </div>

                  {/* Chief Complaint */}
                  <div className="flex mt-[73px] ml-[105px]">
                    <p
                      className="w-[620px] h-[35px] text-sm overflow-hidden"
                      style={{
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        lineHeight: "1.2em",
                      }}
                    >
                      {formattedFPE['reviews.chiefComplaint'] || ""}
                    </p>
                  </div>
                  {/* Review 2 */}
                  <ReviewCircleRow
                    value={getReviewValue(formattedFPE, 'reviews.mental.positive')}
                    explanation={getReviewExplanation(formattedFPE, 'reviews.mental.explain')}
                  />
                  {/* Review 3 */}
                  <ReviewCircleRow
                    value={getReviewValue(formattedFPE, 'reviews.respiratory.positive')}
                    explanation={getReviewExplanation(formattedFPE, 'reviews.respiratory.explain')}
                    className="ml-[104px] mt-[58px]"
                    trueWidth="w-[95px]"
                  />
                  {/* Review 4 */}
                  <ReviewCircleRow
                    value={getReviewValue(formattedFPE, 'reviews.gi.positive')}
                    explanation={getReviewExplanation(formattedFPE, 'reviews.gi.explain')}
                    className="ml-[104px] mt-[59px]"
                    trueWidth="w-[95px]"
                  />
                  {/* Review 5 */}
                  <ReviewCircleRow
                    value={getReviewValue(formattedFPE, 'reviews.urinary.positive')}
                    explanation={getReviewExplanation(formattedFPE, 'reviews.urinary.explain')}
                    className="ml-[108px] mt-[58px]"
                    trueWidth="w-[90px]"
                  />
                  {/* Review 6 */}
                  <ReviewCircleRow
                    value={getReviewValue(formattedFPE, 'reviews.genital.positive')}
                    explanation={getReviewExplanation(formattedFPE, 'reviews.genital.explain')}
                    className="ml-[105px] mt-[87px]"
                    trueWidth="w-[90px]"
                  />
                </div>

                {/* Form container with background image */}
                <div
                  className="relative w-[800px] h-[1150px] bg-white shadow-2xl rounded-lg overflow-hidden mx-auto mb-5"
                  style={{
                    backgroundImage: `url('/template/fpe/2024/Annex_G_FPE_Form-2.png?height=1150&width=800')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {/* Review 7 */}
                  <div className="flex mt-[95px] ml-[120px]">
                    <p className="w-[400px] text-md">
                      {formattedFPE['reviews.lastMenstrualPeriod'] || "N/A"}
                    </p>
                    <p className="w-[160px] text-md">
                      {formattedFPE['reviews.firstMenstrualPeriod'] || "N/A"}
                    </p>
                  </div>                  
                  <div className="flex -mt-[6px] ml-[270px]">
                    <p className="w-[175px] text-md">
                      {formattedFPE['reviews.pregnancyCount'] || "N/A"}
                    </p>
                  </div>
                    
                  {/* Review 8 */}
                  <ReviewCircleRow
                    value={getReviewValue(formattedFPE, 'reviews.musculoskeletal.positive')}
                    explanation={getReviewExplanation(formattedFPE, 'reviews.musculoskeletal.explain')}
                    className="ml-[106px] mt-[51px]"
                    trueWidth="w-[90px]"
                  />
                  {/* PERSONAL / SOCIAL HISTORY - SMOKE*/}
                  <div className="flex mt-[105px] ml-[99px]">
                    <div className="w-[95px]">
                      {formattedFPE['history.social.smoking.positive'] === "●" && (
                        <Circle className="h-3 w-3" fill="black" strokeWidth={0} />
                      )}
                    </div>
                    <div className="w-[190px]">
                      {formattedFPE['history.social.smoking.negative'] === "●" && (
                        <Circle className="h-3 w-3" fill="black" strokeWidth={0} />
                      )}
                    </div>
                    <p className="w-[35px] text-md -mt-[9px]">     
                      {formattedFPE['history.social.smokingYears'] || ""}
                    </p>
                  </div>
                  {/* ALCOHOL */}
                  <div className="flex mt-[17px] ml-[99px]">
                    <div className="w-[95px]">
                      {formattedFPE['history.social.alcohol.positive'] === "●" && (
                        <Circle className="h-3 w-3" fill="black" strokeWidth={0} />
                      )}
                    </div>
                    <div className="w-[190px]">
                      {formattedFPE['history.social.alcohol.negative'] === "●" && (
                        <Circle className="h-3 w-3" fill="black" strokeWidth={0} />
                      )}
                    </div>
                    <p className="w-[35px] text-md -mt-[9px]">     
                      {formattedFPE['history.social.alcoholYears'] || ""}
                    </p>
                  </div>
                  {/* PAST MEDICAL HISTORY - Cancer, HeartDisease, Tuberculosis */}
                  <div className="flex mt-[41px] ml-[49px]">
                    <p className={`w-[238px] ${formattedFPE['medicalHistory.cancer'] === "☑" ? "" : "invisible"}`}>
                      <Circle className="h-3 w-3" fill="black" strokeWidth={0}/>
                    </p>
                    <p className={`w-[238px] ${formattedFPE['medicalHistory.heartDisease'] === "☑" ? "" : "invisible"}`}>
                      <Circle className="h-3 w-3" fill="black" strokeWidth={0}/>
                    </p>
                    <p className={`${formattedFPE['medicalHistory.tuberculosis'] === "☑" ? "" : "invisible"}`}>
                      <Circle className="h-3 w-3" fill="black" strokeWidth={0}/>
                    </p>
                  </div>
                  {/* PAST MEDICAL HISTORY - Allergies, Stroke, Others */}
                  <div className="flex mt-[6px] ml-[49px]">
                    <p className={`w-[238px] ${formattedFPE['medicalHistory.allergies'] === "☑" ? "" : "invisible"}`}>
                      <Circle className="h-3 w-3" fill="black" strokeWidth={0}/>
                    </p>
                    <p className={`w-[238px] ${formattedFPE['medicalHistory.stroke'] === "☑" ? "" : "invisible"}`}>
                      <Circle className="h-3 w-3" fill="black" strokeWidth={0}/>
                    </p>
                    <p className={`${formattedFPE['medicalHistory.others'] === "☑" ? "" : "invisible"}`}>
                      <Circle className="h-3 w-3" fill="black" strokeWidth={0}/>
                    </p>
                  </div>
                  {/* PAST MEDICAL HISTORY - Diabetes Mellitus, Bronchial Asthma, SPECIFY */}
                  <div className={`flex ml-[49px] mt-[4px]`}>
                    <p className={`w-[238px] ${formattedFPE['medicalHistory.diabetesMellitus'] === "☑" ? "" : "invisible"}`}>
                      <Circle className="h-3 w-3" fill="black" strokeWidth={0}/>
                    </p>
                    <p className={`w-[380px] ${formattedFPE['medicalHistory.bronchialAsthma'] === "☑" ? "" : "invisible"}`}>
                      <Circle className="h-3 w-3" fill="black" strokeWidth={0}/>
                    </p>
                    <p className="text-md -mt-[6px]">
                      {formattedFPE['medicalHistory.others.details'] || "N/A"}
                    </p>
                  </div>
                  {/* PAST MEDICAL HISTORY - Hypertersion, COPD, None */}
                  <div className={`flex ml-[49px]`}>
                    <p className={`w-[238px] ${formattedFPE['medicalHistory.hypertension'] === "☑" ? "" : "invisible"}`}>
                      <Circle className="h-3 w-3" fill="black" strokeWidth={0}/>
                    </p>
                    <p className={`w-[238px] ${formattedFPE['medicalHistory.copd'] === "☑" ? "" : "invisible"}`}>
                      <Circle className="h-3 w-3" fill="black" strokeWidth={0}/>
                    </p>
                    <p className={`${formattedFPE['medicalHistory.none'] === "☑" ? "" : "invisible"}`}>
                      <Circle className="h-3 w-3" fill="black" strokeWidth={0}/>
                    </p>
                  </div>
                  {/* PERTITNENT PHYSICAL EXAM - BLOOD PRESURE,  HEIGHT */}
                  <div className={`flex mt-[85px] ml-[180px]`}>
                    <p className="w-[100px]">
                      {formattedFPE['physicalExam.bp.systolic'] || "N/A"}
                    </p>
                    <p className="w-[253px]">
                      {formattedFPE['physicalExam.bp.diastolic'] || "N/A"}
                    </p>
                    <p className="w-[113px]">
                      {formattedFPE['physicalExam.height.centimeter'] || "N/A"}
                    </p>
                    <p className="w-[20px]">
                      {formattedFPE['physicalExam.height.inches'] || "N/A"}
                    </p>
                  </div>
                  {/* HEART RATE - WEIGHT*/}
                  <div className={`flex mt-[5px] ml-[180px]`}>
                    <p className="w-[353px]">
                      {formattedFPE['physicalExam.heartRate'] || "N/A"}
                    </p>
                    <p className="w-[113px]">
                      {formattedFPE['physicalExam.weight.kilograms'] || "N/A"}
                    </p>
                    <p className="w-[98px]">
                      {formattedFPE['physicalExam.weight.pounds'] || "N/A"}
                    </p>
                  </div>
                  {/* RESPIRATORY RATE - BMI */}
                  <div className={`flex mt-[5px] ml-[180px]`}>
                    <p className="w-[354px]">
                      {formattedFPE['physicalExam.respiratoryRate'] || "N/A"}
                    </p>
                    <p className="w-[100px]">
                      {formattedFPE['physicalExam.bmi'] || "N/A"}
                    </p>
                  </div>
                  {/* VISUAL ACUITY - TEMPERATURE*/}
                  <div className={`flex mt-[5px] ml-[180px]`}>
                    <p className="w-[90px]">
                      {formattedFPE['physicalExam.visualAcuity.left'] || "N/A"}
                    </p>
                    <p className="w-[265px]">
                      {formattedFPE['physicalExam.visualAcuity.right'] || "N/A"}
                    </p>
                    <p className="w-[90px]">
                      {formattedFPE['physicalExam.temperature'] || "N/A"}
                    </p>
                  </div>
                  {/* PEDIATRIC CLIENT - LENGTH, HEAD CIRCUMFERENCE, SKINFOLD THICKNESS */}
                  <div className={`flex mt-[61px] ml-[90px]`}>
                    <p className="w-[220px]">
                      {formattedFPE['pediatricData.length'] || "N/A"}
                    </p>
                    <p className="w-[230px]">
                      {formattedFPE['pediatricData.headCircumference'] || "N/A"}
                    </p>
                    <p className="w-[90px]">
                      {formattedFPE['pediatricData.skinfoldThickness'] || "N/A"}
                    </p>
                  </div>
                  {/* PEDIATRIC CLIENT - WAIST, HIP, LIMBS */}
                  <div className={`flex mt-[45px] ml-[90px]`}>
                    <p className="w-[220px]">
                      {formattedFPE['pediatricData.waist'] || "N/A"}
                    </p>
                    <p className="w-[230px]">
                      {formattedFPE['pediatricData.hip'] || "N/A"}
                    </p>
                    <p className="w-[90px]">
                      {formattedFPE['pediatricData.limbs'] || "N/A"}
                    </p>
                  </div>
                  {/* PEDIATRIC CLIENT - MUAC */}
                  <div className={`flex mt-[36px] ml-[90px]`}>
                    <p className="w-[90px]">
                      {formattedFPE['pediatricData.muac'] || "N/A"}
                    </p>
                  </div>
                  {/* BLOOD TYPE */}
                  <div className={`flex mt-[50px] ml-[51px]`}>
                    <p className={`${formattedFPE['physicalExam.bloodType.aPositive'] === "●" ? "" : "invisible"}`}>
                      <Circle className="h-3 w-3" fill="black" strokeWidth={0}/>
                    </p>
                    <p className={`ml-[75px] ${formattedFPE['physicalExam.bloodType.aNegative'] === "●" ? "" : "invisible"}`}>
                      <Circle className="h-3 w-3" fill="black" strokeWidth={0}/>
                    </p>
                    <p className={`ml-[75px] ${formattedFPE['physicalExam.bloodType.bPositive'] === "●" ? "" : "invisible"}`}>
                      <Circle className="h-3 w-3" fill="black" strokeWidth={0}/>
                    </p>
                    <p className={`ml-[76px] ${formattedFPE['physicalExam.bloodType.bNegative'] === "●" ? "" : "invisible"}`}>
                      <Circle className="h-3 w-3" fill="black" strokeWidth={0}/>
                    </p>
                    <p className={`ml-[75px] ${formattedFPE['physicalExam.bloodType.abPositive'] === "●" ? "" : "invisible"}`}>
                      <Circle className="h-3 w-3" fill="black" strokeWidth={0}/>
                    </p>
                    <p className={`ml-[75px] ${formattedFPE['physicalExam.bloodType.abNegative'] === "●" ? "" : "invisible"}`}>
                      <Circle className="h-3 w-3" fill="black" strokeWidth={0}/>
                    </p>
                    <p className={`ml-[76px] ${formattedFPE['physicalExam.bloodType.oPositive'] === "●" ? "" : "invisible"}`}>
                      <Circle className="h-3 w-3" fill="black" strokeWidth={0}/>
                    </p>
                    <p className={`ml-[75px] ${formattedFPE['physicalExam.bloodType.oNegative'] === "●" ? "" : "invisible"}`}>
                      <Circle className="h-3 w-3" fill="black" strokeWidth={0}/>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
