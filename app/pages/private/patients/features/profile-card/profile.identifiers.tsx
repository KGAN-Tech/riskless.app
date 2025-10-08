export const ProfileIdentifiers = ({ person, getIdentificationValue }: any) => (
  <div className="mt-2 space-y-1 text-center">
    <p className="text-xs text-blue-600">
      CASE NO:{" "}
      {getIdentificationValue(
        person?.identifications || [],
        "hci_case_number",
        "----"
      )}
    </p>
    <p className="text-xs text-blue-600">
      PIN:{" "}
      {getIdentificationValue(
        person?.identifications || [],
        "philhealth_identification_number",
        "----"
      )}
    </p>
  </div>
);
