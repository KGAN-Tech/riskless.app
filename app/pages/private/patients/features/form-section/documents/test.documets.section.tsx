import { useState, useEffect } from "react";
import { Printer, Download, FileText, ZoomIn, ZoomOut, X, Square, Circle } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/atoms/dialog";
import { Button } from "@/components/atoms/button";

interface ProfileTabProps {
  encounters: any;
}

interface Encounter {
  transactionNo: string;
  createdAt: string;
  patientName: string;
  doctorName: string;
  diagnosis: string;
  [key: string]: any; // fallback for extra fields
}


export default function AllDocumentsSection({ encounters }: ProfileTabProps) {
  const [isOpenPKRF, setIsOpenPKRF] = useState(false);
  const [isOpenFPE, setIsOpenFPE] = useState(false);
  const [isOpenEKAS, setisOpenEKAS] = useState(false);
  const [isOpenEPRESS, setisOpenEPRESS] = useState(false);
  const [isOpenMC, setIsOpenMC] = useState(false);
  const [scale, setScale] = useState(1);

  const adjustScale = (delta: number) => setScale(prev => Math.max(0.3, Math.min(1.5, prev + delta)));

  const handlePrint = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };
  
  console.log(encounters[0])

  useEffect(() => {
    const calculateScale = () => {
      const width = window.innerWidth;
      if (width < 640) setScale(0.4);
      else if (width < 768) setScale(0.6);
      else if (width < 1024) setScale(0.7);
      else if (width < 1280) setScale(0.8);
      else setScale(1);
    };
    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  const renderHeader = (title: string) => (
    <DialogHeader className="p-3 sm:p-6 pb-4 border-b border-white/30 bg-white/20 flex-shrink-0">
      <div className="flex justify-between items-center">
        <DialogTitle className="text-lg sm:text-xl font-semibold text-gray-800">{title}</DialogTitle>
        <DialogClose asChild>
          <Button variant="ghost" size="sm" className="rounded-full w-8 h-8 p-0">
            <X className="w-4 h-4" />
          </Button>
        </DialogClose>
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <Button onClick={() => adjustScale(-0.1)} variant="outline" size="sm" className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm">
          <ZoomOut className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
        <Button onClick={() => adjustScale(0.1)} variant="outline" size="sm" className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm">
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


        <Button onClick={() => console.log("Download not implemented")} variant="outline" size="sm" className="gap-2 bg-white/80 hover:bg-white/90 text-xs sm:text-sm">
          <Download className="w-3 h-3 sm:w-4 sm:h-4" />
        </Button>
      </div>
      <div className="text-xs text-gray-600 mt-2">Scale: {Math.round(scale * 100)}%</div>
    </DialogHeader>
  );

  const renderDocumentPage = (
    src: string,
    children?: React.ReactNode
  ) => (
    <div
      className="relative w-full h-full bg-white shadow-2xl rounded-lg overflow-hidden mx-auto mb-5"
      style={{
        backgroundImage: `url('${src}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Overlay content goes here */}
      <div className="absolute inset-0 pointer-events-none">
        {children}
      </div>
    </div>
  );

  function formatDateShort(isoDate: string | undefined): string {
    if (!isoDate) return "N/A";
  
    const date = new Date(isoDate);
    const mm = String(date.getMonth() + 1).padStart(2, "0"); // months are 0-indexed
    const dd = String(date.getDate()).padStart(2, "0");
    const yy = String(date.getFullYear()).slice(-2);
  
    return `${mm}/${dd}/${yy}`;
  }
  
  
  return (
    <div className="grid grid-cols-3 p-4 sm:p-8 gap-4">
      {/* PKRF Modal */}
      <Dialog open={isOpenPKRF} onOpenChange={setIsOpenPKRF}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-2 bg-blue-500">
            <FileText className="w-4 h-4" /> PKRF Form
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0 bg-white/10 backdrop-blur-lg border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 backdrop-blur-md" />
          <div className="relative z-10 h-full flex flex-col">
            {renderHeader("PKRF Form")}
            <div className="overflow-x-auto overflow-y-auto p-5 h-[540px]">
              <div className="print-area transition-transform duration-300 ease-in-out text-[12px]"
                   style={{ transform: `scale(${scale})`, transformOrigin: "top center", width: "800px", height: "1150px", margin: "0 auto" }}>
                  {renderDocumentPage('/template/pkrf/Annex_A_PKRF_2024-1.png', (
                      <>
                        {/*To be filled out by the beneficiary*/}
                        <div className="flex mt-[196px] ml-[78px]">
                          <p className="w-[172px]"><Square className="h-5 w-5" fill="black" strokeWidth={0} /></p>
                          <p className="w-[170px]"><Square className="h-5 w-5" fill="black" strokeWidth={0} /></p>
                          <p className="w-[173px]"><Square className="h-5 w-5" fill="black" strokeWidth={0} /></p>
                          <p className="w-[100]"><Square className="h-5 w-5" fill="black" strokeWidth={0} /></p>
                        </div>

                        {/* PIN - DATE*/}
                        <div className="flex mt-[4px] ml-[110px]">
                          <p className="w-[167px]">{"N/A"}</p>
                          <p className="w-[100px] ml-[10px]">{formatDateShort(encounters[0]?.transactionDate)}</p>
                          <p className="w-[167px] ml-[60px]">{"N/A"}</p>
                          <p className="w-[120px] ml-[15px]">{formatDateShort(encounters[0]?.transactionDate)}</p>
                        </div>
                    
                        {/* NAME */}
                        <div className="flex mt-[5px] ml-[138px]">
                          <p className="w-[250px]">{encounters[0]?.patient?.lastName}, {encounters[0]?.patient?.firstName} {encounters[0]?.patient?.middleName}</p>
                          <p className="w-[250px] ml-[90px]">{encounters[0]?.patient?.lastName}, {encounters[0]?.patient?.firstName} {encounters[0]?.patient?.middleName}</p>
                        </div>
                    
                        {/* ADDRESS */}
                        <div className="flex mt-[7px] ml-[130px]">
                          <p className="w-[245px]">{"N/A, N/A, N/A"}</p>
                          <p className="w-[265px] ml-[95px]">{"N/A, N/A, N/A"}</p>
                        </div>
                    
                        {/* DOB - CONTACT */}
                        <div className="flex mt-[17px] ml-[150px]">
                          <p className="w-[120px]">{"N/A"}</p>
                          <p className="w-[75px] ml-[50px]">{"N/A"}</p>
                          <p className="w-[120px] ml-[95px]">{"N/A"}</p>
                          <p className="w-[75px] ml-[50px]">{"N/A"}</p>
                        </div>

                        {/*REGISTER CHECKBOX*/}
                        <div className="flex mt-[10px] ml-[78px]">
                          <p className="w-[342px]"><Square className="h-5 w-5" fill="black" strokeWidth={0} /></p>
                          <p className="w-[172px]"><Square className="h-5 w-5" fill="black" strokeWidth={0} /></p>
                        </div>

                        <div className="flex mt-[2px] ml-[78px]">
                          <p className="w-[342px]"><Square className="h-5 w-5" fill="black" strokeWidth={0} /></p>
                          <p className="w-[172px]"><Square className="h-5 w-5" fill="black" strokeWidth={0} /></p>
                        </div>

                        {/* Full Name */}
                        <div className="flex mt-[13px] ml-[140px]">
                          <p className="w-[240px]">NA, NA NA</p>
                          <p className="w-[172px] ml-[100px]">NA, NA NA</p>
                        </div>

                        {/* 1st choice KPP */}
                        <div className="flex mt-[12px] ml-[160px]">
                          <p className="w-[240px]">NA</p>
                          <p className="w-[220px] ml-[100px]">NA</p>
                        </div>

                        {/* ADDRESS */}
                        <div className="flex mt-[5px] ml-[130px]">
                          <p className="w-[245px]">{"N/A, N/A, N/A"}</p>
                          <p className="w-[265px] ml-[95px]">{"N/A, N/A, N/A"}</p>
                        </div>

                        {/* 2nd choice KPP */}
                        <div className="flex mt-[12px] ml-[160px]">
                          <p className="w-[240px]">NA</p>
                          <p className="w-[220px] ml-[100px]">NA</p>
                        </div>

                        {/* ADDRESS */}
                        <div className="flex mt-[5px] ml-[130px]">
                          <p className="w-[245px]">{"N/A, N/A, N/A"}</p>
                          <p className="w-[265px] ml-[95px]">{"N/A, N/A, N/A"}</p>
                        </div>

                        {/* Transfer */}
                        <div className="flex mt-[26px] ml-[76px]">
                          <p className="w-[343px]"><Square className="h-5 w-5" fill="black" strokeWidth={0} /></p>
                          <p className="w-[172px]"><Square className="h-5 w-5" fill="black" strokeWidth={0} /></p>
                        </div>

                        {/* Previous KPP */}
                        <div className="flex ml-[160px]">
                          <p className="w-[240px]">NA</p>
                          <p className="w-[220px] ml-[100px]">NA</p>
                        </div>

                        {/* 1st choice KPP */}
                        <div className="flex mt-[6px] ml-[160px]">
                          <p className="w-[240px]">NA</p>
                          <p className="w-[220px] ml-[100px]">NA</p>
                        </div>

                        {/* ADDRESS */}
                        <div className="flex mt-[6px] ml-[130px]">
                          <p className="w-[245px]">{"N/A, N/A, N/A"}</p>
                          <p className="w-[265px] ml-[95px]">{"N/A, N/A, N/A"}</p>
                        </div>

                        {/* 2nd choice KPP */}
                        <div className="flex mt-[22px] ml-[160px]">
                          <p className="w-[240px]">NA</p>
                          <p className="w-[220px] ml-[100px]">NA</p>
                        </div>

                        {/* ADDRESS */}
                        <div className="flex mt-[6px] ml-[130px]">
                          <p className="w-[245px]">{"N/A, N/A, N/A"}</p>
                          <p className="w-[265px] ml-[95px]">{"N/A, N/A, N/A"}</p>
                        </div>

                        {/* NAME */}
                        <div className="flex mt-[140px] ml-[100px]">
                          <p className="w-[250px]">{encounters[0]?.patient?.lastName}, {encounters[0]?.patient?.firstName} {encounters[0]?.patient?.middleName}</p>
                          <p className="w-[250px] ml-[90px]">{encounters[0]?.patient?.lastName}, {encounters[0]?.patient?.firstName} {encounters[0]?.patient?.middleName}</p>
                        </div>

                        {/* Registration Number */}
                        <div className="flex mt-[68px] ml-[155px] text-[8px]">
                          <p className="w-[85px]">{encounters[0]?.transactionNo}</p>
                          <p className="w-[250px] ml-[90px]">{formatDateShort(encounters[0]?.transactionDate)}</p>
                          <p className="w-[85px] ml-[35px]">{encounters[0]?.transactionNo}</p>
                          <p className="w-[250px] ml-[90px]">{formatDateShort(encounters[0]?.transactionDate)}</p>
                        </div>

                        {/* Full Name */}
                        <div className="flex mt-[10px] ml-[140px] text-[10px]">
                          <p className="w-[240px]">NA, NA NA</p>
                          <p className="w-[172px] ml-[100px]">NA, NA NA</p>
                        </div>

                        {/* PIN - DATE*/}
                        <div className="flex mt-[13px] ml-[110px] text-[10px]">
                          <p className="w-[130px]">{"N/A"}</p>
                          <p className="w-[60px] ml-[74px]">{formatDateShort(encounters[0]?.transactionDate)}</p>
                          <p className="w-[125px] ml-[80px]">{"N/A"}</p>
                          <p className="w-[75px] ml-[70px]">{formatDateShort(encounters[0]?.transactionDate)}</p>
                        </div>

                        {/* KPP */}
                        <div className="flex mt-[7px] ml-[110px]">
                          <p className="w-[240px]">{encounters[0]?.facility?.name}</p>
                          <p className="w-[220px] ml-[100px]">{encounters[0]?.facility?.name}</p>
                        </div>

                        {/* ADDRESS */}
                        <div className="flex mt-[2px] ml-[130px]">
                          <p className="w-[245px]">{"N/A, N/A, N/A"}</p>
                          <p className="w-[265px] ml-[95px]">{"N/A, N/A, N/A"}</p>
                        </div>
                      </>                    
                  ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* FPE Modal */}
      <Dialog open={isOpenFPE} onOpenChange={setIsOpenFPE}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-2 bg-blue-500">
            <FileText className="w-4 h-4" /> FPE Form
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0 bg-white/10 backdrop-blur-lg border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 backdrop-blur-md" />
          <div className="relative z-10 h-full flex flex-col">
            {renderHeader("FPE Form")}
            <div className="overflow-x-auto overflow-y-auto p-5 h-[550px]">
              <div className="print-area transition-transform duration-300 ease-in-out"
                   style={{ transform: `scale(${scale})`, transformOrigin: "top center", width: "800px", height: "1150px", margin: "0 auto" }}>
                {renderDocumentPage('/template/fpe/2024/Annex_G_FPE_Form-1.png', (
                  <>
                    {/* Walkin - Appointment */}
                    <div className="flex mt-[110px] ml-[50px]">
                      <span className="w-[224px]"><Circle className="h-3 w-3" fill="black" strokeWidth={0} /></span>
                      <span className="w-[343px]"><Circle className="h-3 w-3" fill="black" strokeWidth={0} /></span>
                    </div>

                    {/* Health Screening Date */}
                    <div className="flex mt-[36px] ml-[60px]">
                      <span className="w-[220px]">{formatDateShort(encounters[0]?.interview?.createdAt)}</span>
                    </div>

                    {/* Case Number - PIN */}
                    <div className="flex mt-[68px] ml-[60px]">
                      <span className="w-[250px]">{encounters[0]?.transactionNo}</span>
                      <span className="w-[250px] ml-[100px]">N/A</span>
                    </div>

                    {/* Client Details */}
                    <div className="flex mt-[65px] ml-[60px]">
                      <span className="w-[162px]">{encounters[0]?.patient?.lastName}</span>
                      <span className="w-[162px] ml-[13px]">{encounters[0]?.patient?.firstName}</span> 
                      <span className="w-[162px] ml-[13px]">{encounters[0]?.patient?.middleName}</span>
                      <span className="w-[162px] ml-[13px]">N/A</span>
                    </div>
                    <div className="flex mt-[30px] ml-[60px]">
                      <span className="w-[162px]">N/A</span>
                      <span className="w-[162px] ml-[13px]">N/A</span> 
                      <span className="w-[162px] ml-[13px]">N/A</span>
                      <span className="w-[162px] ml-[13px]">N/A</span>
                    </div>

                    {/* 1. Chief Complaint */}
                    <div className="flex mt-[75px] ml-[100px]">
                      <span className="w-[620px]">N/A</span>
                    </div>

                    {/* 2. Chief Complaint */}
                    <div className="flex mt-[75px] ml-[101px]">
                      <span className="w-[98px]"><Circle className="h-3 w-3" fill="black" strokeWidth={0} /></span>
                      <span className="w-[100px]"><Circle className="h-3 w-3" fill="black" strokeWidth={0} /></span>
                    </div>
                    <div className="flex mt-[18px] ml-[100px]">
                      <span className="w-[620px]">N/A</span>
                    </div>

                    {/* 3. Chief Complaint */}
                    <div className="flex mt-[55px] ml-[105px]">
                      <span className="w-[95px]"><Circle className="h-3 w-3" fill="black" strokeWidth={0} /></span>
                      <span className="w-[100px]"><Circle className="h-3 w-3" fill="black" strokeWidth={0} /></span>
                    </div>
                    <div className="flex mt-[18px] ml-[100px]">
                      <span className="w-[620px]">N/A</span>
                    </div>

                  </>
                ))}
                {renderDocumentPage('/template/fpe/2024/Annex_G_FPE_Form-2.png')}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* EKAS Modal */}
      <Dialog open={isOpenEKAS} onOpenChange={setisOpenEKAS}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-2 bg-blue-500">
            <FileText className="w-4 h-4" /> EKAS Form
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0 bg-white/10 backdrop-blur-lg border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 backdrop-blur-md" />
          <div className="relative z-10 h-full flex flex-col">
            {renderHeader("EKAS")}
            <div className="overflow-x-auto overflow-y-auto p-5 h-[500px]">
              <div className="print-area transition-transform duration-300 ease-in-out"
                   style={{ transform: `scale(${scale})`, transformOrigin: "top center", width: "800px", height: "1350px", margin: "0 auto" }}>
                {renderDocumentPage('/template/e-kas/E-Kas-Solo.jpg')}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* EPRESS Modal */}
      <Dialog open={isOpenEPRESS} onOpenChange={setisOpenEPRESS}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-2 bg-blue-500">
            <FileText className="w-4 h-4" /> EPRESS Form
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0 bg-white/10 backdrop-blur-lg border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 backdrop-blur-md" />
          <div className="relative z-10 h-full flex flex-col">
            {renderHeader("EPRESS")}
            <div className="overflow-x-auto overflow-y-auto p-5 h-[500px]">
              <div className="print-area transition-transform duration-300 ease-in-out"
                   style={{ transform: `scale(${scale})`, transformOrigin: "top center", width: "800px", height: "1350px", margin: "0 auto" }}>
                {renderDocumentPage('/template/e-press/E-Press-Solo.jpg')}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Medical Certificate Modal */}
      <Dialog open={isOpenMC} onOpenChange={setIsOpenMC}>
        <DialogTrigger asChild>
          <Button size="lg" className="gap-2 bg-blue-500">
            <FileText className="w-4 h-4" /> Medical Certificate
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0 bg-white/10 backdrop-blur-lg border border-white/20">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-100/30 to-purple-100/30 backdrop-blur-md" />
          <div className="relative z-10 h-full flex flex-col">
            {renderHeader("Medical Certificate")}
            <div className="overflow-x-auto overflow-y-auto p-5 h-[500px]">
              <div className="print-area transition-transform duration-300 ease-in-out"
                   style={{ transform: `scale(${scale})`, transformOrigin: "top center", width: "800px", height: "1350px", margin: "0 auto" }}>
                {renderDocumentPage('/template/medical-certificate/FTCC-Medical-Certificate.jpg')}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}