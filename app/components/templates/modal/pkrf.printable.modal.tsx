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

interface EncounterProps {
  encounters: any;
}

export default function PKRFPrintableModal ({encounters}: EncounterProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [scale, setScale] = useState(1);

    const pkrfDataWithPerson = {

    }
    // PKRF data with person information
    // const pkrfDataWithPerson = {
    //     ...encounters[0]?.patient,
    //     person: {
    //         firstName: encounters?.firstName,
    //         middleName: encounters?.middleName,
    //         lastName: encounters?.lastName,
    //         suffix: encounters?.suffix,
    //         philHealthIdNumber: encounters?.philHealthIdNumber,s
    //         birthDate: encounters?.birthDate,
    //         mobileNumber: encounters?.mobileNumber,
    //         address: encounters?.address,
    //         clientType: encounters?.clientType,
    //     }
    // };
    
    const formattedPKRF = formatPKRFData(pkrfDataWithPerson);

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
        </div>
    );
}