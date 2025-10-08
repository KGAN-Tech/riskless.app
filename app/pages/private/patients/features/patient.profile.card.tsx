import { Card } from "@/components/atoms/card";
import { ProfileImage } from "./profile-card/profile.image";
import { ProfileDetails } from "./profile-card/profile.details";
import { ProfileIdentifiers } from "./profile-card/profile.identifiers";
import { QRCodeSection } from "./profile-card/qrcode.section";
import { ShortcutActions } from "./profile-card/profile.shortcut";
import { QueueStatusSection } from "./profile-card/queue.status.section";

export const MemberProfileCard = ({ member, formatBirthInfo, getIdentificationValue }: any) => {
  const person = member?.person;

  return (
    <Card className="w-1/3  max-w-xs bg-white shadow-lg rounded-2xl flex flex-col items-center p-6">
      <ProfileImage src={person?.images[0]?.url || "/avatar.png"} />
      <ProfileDetails person={person} formatBirthInfo={formatBirthInfo} />
      <ProfileIdentifiers person={person} getIdentificationValue={getIdentificationValue} />
      <QRCodeSection value={person?.id} />
      <QueueStatusSection patientId={person?.id} />
      <ShortcutActions />
    </Card>
  );
};
