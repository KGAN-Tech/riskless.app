export const ProfileDetails = ({ person, formatBirthInfo }: any) => (
  <>
    <h2 className="mt-4 font-bold text-lg text-center uppercase text-gray-800">
      {person?.lastName}, {person?.firstName} {person?.middleName}{" "}
      {person?.extensionName}
    </h2>
    <p className="text-sm text-gray-600 text-center uppercase">
      {person?.sex} | {formatBirthInfo(person?.birthDate).ageText} |{" "}
      {formatBirthInfo(person?.birthDate).birthDateText}
    </p>
  </>
);
