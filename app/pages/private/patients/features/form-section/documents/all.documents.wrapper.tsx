import { DocumentModal } from "./document.modal";
import PKRFContent from "./pkrf.content";
import FPEContent from "./fpe.content";
import EKASContent from "./ekas.content";
import MedicalCertificateContent from "./medical.certificate.document";
import EPRESSContent from "./epress.content";
import { useEffect, useState } from "react";
import PMRFContent from "./pmrf.content";

interface Encounters {
  member?: any;
  encounter: any;
}

export default function AllDocumentsWrapper({ member, encounter }: Encounters) {
  console.log(member);
  const [scale, setScale] = useState(1);

  // Responsive scale
  useEffect(() => {
    const calculateScale = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 640) setScale(0.4);
      else if (screenWidth < 768) setScale(0.6);
      else if (screenWidth < 1024) setScale(0.7);
      else if (screenWidth < 1280) setScale(0.8);
      else setScale(1);
    };

    calculateScale();
    window.addEventListener("resize", calculateScale);
    return () => window.removeEventListener("resize", calculateScale);
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4 p-6">
      <DocumentModal
        title="PKRF"
        printStyles={{
          position: { left: "50%", top: "18%" },
          scale: "0.70",
        }}
        scale={scale}
        setScale={setScale}
      >
        <PKRFContent member={member} scale={scale} />
      </DocumentModal>

      {encounter && (
        <DocumentModal
          title="FPE"
          printStyles={{
            scale: "1",
            isMultiPage: true,
          }}
          scale={scale}
          setScale={setScale}
        >
          <FPEContent encounter={encounter} scale={scale} />
        </DocumentModal>
      )}

      {encounter?.availments?.length > 0 && (
        <DocumentModal
          title="EKAS"
          printStyles={{
            position: { left: "7%", top: "10%" },
            transform: "translate(-60%, -40%)",
            scale: "0.49",
          }}
          scale={scale}
          setScale={setScale}
        >
          <EKASContent encounters={encounter} />
        </DocumentModal>
      )}

      {encounter?.prescirptions?.length > 0 && (
        <DocumentModal
          title="EPRESS"
          printStyles={{
            position: { left: "7%", top: "10%" },
            transform: "translate(-60%, -40%)",
            scale: "0.49",
          }}
          scale={scale}
          setScale={setScale}
        >
          <EPRESSContent encounter={encounter} />
        </DocumentModal>
      )}

      <DocumentModal
        title="Medical Certificate"
        printStyles={{
          position: { left: "7%", top: "17%" },
          transform: "translate(-50%, -50%)",
          scale: "0.60",
        }}
        scale={scale}
        setScale={setScale}
      >
        <MedicalCertificateContent encounter={encounter} />
      </DocumentModal>

      <DocumentModal
        title="PMRF"
        printStyles={{
          position: { left: "7%", top: "17%" },
          transform: "translate(-50%, -50%)",
          scale: "0.60",
        }}
        scale={scale}
        setScale={setScale}
      >
        <PMRFContent member={member} scale={scale} />
      </DocumentModal>
    </div>
  );
}
