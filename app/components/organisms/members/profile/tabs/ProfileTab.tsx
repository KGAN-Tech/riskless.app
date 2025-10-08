import { Card } from "@/components/atoms/card";

import PKRFnFPEModal from "@/components/templates/modal/pkrf-n-fpe.printable.modal";
import { fpeService } from "@/services/fpe.service";
import { pkrfService } from "~/app/services/link.service";
import EKASSnEPRESSModal from "@/components/templates/modal/ekas-n-epress.printable.modal";
import { useState } from "react";
import { Button } from "@/components/atoms/button";

import { Heart } from "lucide-react";

interface ProfileTabProps {
  member: any;
}

export function ProfileTab({ member }: ProfileTabProps) {
  const currentAddress = member.address?.find((a: any) => a.type === "current");
  const fullName = `${member.firstName} ${member.middleName || ""} ${
    member.lastName
  } ${member.suffix || ""}`.trim();
  const pkrfToken = new URLSearchParams(window.location.search).get("pkrf");

  const ekasRecords = member.ekasRecords || [];
  const epressRecords = member.epressRecords || [];
  const latestEkasRecord =
    ekasRecords.find((r: any) => r.isLatest) || ekasRecords[0];
  const latestEpressRecord =
    epressRecords.find((r: any) => r.isLatest) || epressRecords[0];

  const formatDate = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handlePKRF = async () => {
    try {
      const response = await pkrfService.exportPKRF(pkrfToken as string);
      if (response && response.data) {
        const fileName = `PKRF_${fullName.replace(
          /\s+/g,
          "_"
        )}_${formatDate()}.docx`;
        downloadBase64Docx(response.data, fileName);
      } else {
        console.error("Invalid response format");
      }
    } catch (error) {
      console.error("Error generating PKRF form:", error);
    }
  };

  const handleFPE = async () => {
    try {
      const response = await fpeService.exportFPE(member?.fpe?.id as string);
      if (response && response.data) {
        const fileName = `FPE_${fullName.replace(
          /\s+/g,
          "_"
        )}_${formatDate()}.docx`;
        downloadBase64Docx(response.data, fileName);
      } else {
        console.error("Invalid response format");
      }
    } catch (error) {
      console.error("Error generating FPE form:", error);
    }
  };
  function downloadBase64Docx(base64Data: string, filename: string) {
    if (!base64Data) {
      console.error("No data provided");
      return;
    }

    try {
      // Remove any data URL prefix if present
      const base64WithoutPrefix = base64Data.split(",")[1] || base64Data;

      const binaryString = atob(base64WithoutPrefix);
      const bytes = new Uint8Array(binaryString.length);

      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      const blob = new Blob([bytes], {
        type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error processing file data:", error);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Profile Card */}
      <Card className="p-6 rounded-2xl shadow-md bg-white">
        <div className="flex flex-col items-center gap-4">
          <img
            src={member.photo || "https://via.placeholder.com/128"}
            alt={fullName}
            className="h-32 w-32 rounded-full object-cover ring-2 ring-primary"
          />
          <div className="text-center">
            <h2 className="text-2xl font-semibold text-gray-800 uppercase">
              {fullName}
            </h2>
            <p className="text-sm text-gray-500">
              PIN: {member.philHealthIdNumber || "---"}
            </p>
          </div>
        </div>

        <div className="mt-8 space-y-6 text-sm text-gray-700">
          {/* Blood Type */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="h-4 w-4 text-red-500" />
              <span>Blood Type</span>
            </div>
            <span className="font-semibold">
              {member.fpe?.physicalExam?.bloodType
                ?.replace("_", " ")
                .toUpperCase() || "Not specified"}
            </span>
          </div>

          <div className=" bg-white  w-full space-y-4 border-t  py-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Download This
            </h2>
            {/* <div className="flex gap-3">
              <Button
                onClick={handlePKRF}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                PKRK Form
              </Button>
              <Button
                onClick={handleFPE}
                className="bg-green-600 text-white hover:bg-green-700"
              >
                FPE Form
              </Button>
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Testing</h2> */}
            <div className="flex flex-col gap-2">
              <div className="flex gap-3">
                <PKRFnFPEModal member={member} />
              </div>
              <div className="flex gap-3">
                <EKASSnEPRESSModal
                  ekasRecord={latestEkasRecord}
                  epressRecord={latestEpressRecord}
                />
              </div>
            </div>
          </div>

          {/* Allergies */}
          {/* <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span className="font-medium">Allergies</span>
            </div>
            {member.fpe?.history?.medical?.conditions?.allergies
              ?.isDiagnosed ? (
              <Badge className="bg-yellow-100 text-yellow-800 capitalize">
                {member.fpe.history.medical.conditions.allergies.type ||
                  "Allergy"}
              </Badge>
            ) : (
              <p className="text-gray-400">Not specified</p>
            )}
          </div> */}

          {/* Chronic Conditions */}
          {/* <div>
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="h-4 w-4 text-blue-500" />
              <span className="font-medium">Chronic Conditions</span>
            </div>
            {Object.entries(member.fpe?.history?.medical?.conditions || {})
              .filter(([_, v]: any) => v.isDiagnosed)
              .map(([k, _]: any, i) => (
                <Badge
                  key={i}
                  className="bg-blue-100 text-blue-800 capitalize mr-2 mb-1 inline-block"
                >
                  {k.replace(/([A-Z])/g, " $1")}
                </Badge>
              ))}
            {(!member.fpe?.history?.medical?.conditions ||
              Object.values(member.fpe.history.medical.conditions).every(
                (v: any) => !v.isDiagnosed
              )) && <p className="text-gray-400">Not specified</p>}
          </div> */}

          {/* Medical Flags */}
          {/* <div>
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-red-500" />
              <span className="font-medium">Medical Flags</span>
            </div>
            {member.flags?.length ? (
              <div className="space-y-2">
                {member.flags.map((flag: any, i: number) => (
                  <div
                    key={i}
                    className={`p-2 rounded-md font-medium ${
                      flag.type === "critical"
                        ? "bg-red-100 text-red-800"
                        : flag.type === "warning"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {flag.message}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">Not specified</p>
            )}
          </div> */}

          {/* Last Check-up */}
          {/* <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>Last Check-up</span>
            </div>
            <span className="font-semibold">
              {member.lastCheckup || "Not specified"}
            </span>
          </div> */}

          {/* Next Appointment */}
          {/* <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>Next Appointment</span>
            </div>
            <span className="font-semibold">
              {member.nextAppointment || "Not specified"}
            </span>
          </div> */}

          {/* Medical Notes */}
          {/* <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Medical Notes</span>
            </div>
            <p className="text-gray-600 whitespace-pre-wrap">
              {member.medicalNotes?.trim() || "Not specified"}
            </p>
          </div> */}
        </div>
      </Card>

      {/* Member Info */}
      <Card className="p-6 md:col-span-2">
        <h3 className="text-lg font-semibold mb-4">Member Information</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{member.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Mobile Number</p>
            <p className="font-medium">{member.mobileNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gender</p>
            <p className="font-medium">{member.gender}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date of Birth</p>
            <p className="font-medium">
              {new Date(member.birthDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Civil Status</p>
            <p className="font-medium">{member.civilStatus || "N/A"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Citizenship</p>
            <p className="font-medium">{member.citizenship || "N/A"}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Current Address</p>
            <p className="font-medium">
              {currentAddress
                ? `${currentAddress.barangay || ""}, ${
                    currentAddress.city || ""
                  }, ${currentAddress.province || ""}, ${
                    currentAddress.country || ""
                  }`
                : "Not specified"}
            </p>
          </div>
        </div>

        {/* Emergency Contact */}
        {member.emergencyContact && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-4">Emergency Contact</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Name</p>
                <p className="font-medium">{member.emergencyContact.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Relationship</p>
                <p className="font-medium">
                  {member.emergencyContact.relationship}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{member.emergencyContact.phone}</p>
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
