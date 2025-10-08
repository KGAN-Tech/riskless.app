import { useMemo } from "react";

import {
  formatBirthInfo,
  getIdentificationValue,
} from "~/app/utils/person.helper";

import { PAGE, TAB } from "~/app/configuration/const.config";
import { MemberProfileCard } from "@/pages/private/patients/features/patient.profile.card";
import MainPatientHeader from "@/pages/private/patients/features/headers/main.patient.header";
import DefaultPatientPage from "./sub-pages/default.patient.page";
import EncounterPatientPage from "./sub-pages/encounter.patient.page";
import PersonalInfoPage from "./sub-pages/personal.info.page";
import { CreateNewEncounterSection } from "./components/sections/create.new.encounter.section";
import AllDocumentsWrapper from "./features/form-section/documents/all.documents.wrapper";

interface PatientRecordProps {
  activePage: string;
  selectedView: string;
  setSelectedView: (view: string) => void;
  handleSelectPage: (page: string) => void;
  member: any;
  memberLoading?: boolean;
  encounters: any[];
  encountersLoading?: boolean;
  selectedEncounter?: any;
  encounterLoading?: boolean;
  getUserData?: any;
  memberError?: any;
  encountersError?: any;
  encounterError?: any;
}

export default function PatientRecord({
  activePage,
  selectedView,
  setSelectedView,
  handleSelectPage,
  member,
  memberLoading,
  encounters,
  encountersLoading,
  selectedEncounter,
  encounterLoading,
  getUserData,
  memberError,
  encountersError,
  encounterError,
}: PatientRecordProps) {
  /** ---------------------------
   * Render Page Content
   ----------------------------*/
  const pageContent = useMemo(() => {
    if (memberLoading || encountersLoading || encounterLoading) {
      return <p>Loading...</p>;
    }

    if (memberError) return <p>Failed to load member.</p>;
    if (encountersError) return <p>Failed to load encounters.</p>;
    if (encounterError) return <p>Failed to load encounter.</p>;

    switch (activePage) {
      case "records":
        return (
          <DefaultPatientPage
            encounters={encounters}
            tabs={TAB.PATIENT_PORTAL.DEFAULT_TABS}
            views={PAGE.PATIENT_PORTAL.VIEWS}
            member={member}
            facilityId={getUserData?.user?.facilityId || ""}
            selectedView={selectedView}
            onSelectView={setSelectedView}
          />
        );

      case "encounter":
        return encounters.length > 0 ? (
          <EncounterPatientPage
            encounter={selectedEncounter || encounters[0]} // fallback
            member={member}
            facilityId={getUserData?.user?.facilityId || ""}
            views={PAGE.PATIENT_PORTAL.VIEWS}
            selectedView={selectedView}
            onSelectView={setSelectedView}
          />
        ) : (
          <>
            {selectedView === "Documents" ? (
              <div className="bg-white shadow rounded-lg p-6">
                <AllDocumentsWrapper
                  member={member}
                  encounter={selectedEncounter}
                />
              </div>
            ) : (
              <CreateNewEncounterSection />
            )}
          </>
        );

      case "personal_info":
        return (
          <PersonalInfoPage
            tabs={TAB.PATIENT_PORTAL.PERSONAL_INFO}
            views={PAGE.PATIENT_PORTAL.VIEWS}
            member={member}
            facilityId={getUserData?.user?.facilityId || ""}
            selectedView={selectedView}
            onSelectView={setSelectedView}
          />
        );

      default:
        return null;
    }
  }, [
    activePage,
    encounters,
    selectedEncounter,
    member,
    getUserData,
    selectedView,
    memberLoading,
    encountersLoading,
    encounterLoading,
    memberError,
    encountersError,
    encounterError,
  ]);

  return (
    <>
      <MainPatientHeader
        title="Patient Records"
        selectedUser={member}
        users={[]}
        pages={PAGE.PATIENT_PORTAL.MAIN}
        onSelectUser={() => {}}
        selectedPage={activePage}
        onSelectPage={handleSelectPage}
        onSelectView={setSelectedView}
        views={PAGE.PATIENT_PORTAL.VIEWS}
        selectedView={selectedView}
      />

      <div className="flex bg-gray-50 mt-2">
        <MemberProfileCard
          member={member}
          formatBirthInfo={formatBirthInfo}
          getIdentificationValue={getIdentificationValue}
        />
        {pageContent}
      </div>
    </>
  );
}
