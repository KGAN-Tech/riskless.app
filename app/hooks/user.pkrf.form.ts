import { useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "pkrfFormData";

// ------------------ INTERFACES ------------------
export interface Password {
  value: string;
  type: "text" | "mpin6char";
}

export interface Address {
  houseNo: string;
  street: string;
  province: { value: string; code: string };
  city: { value: string; code: string };
  barangay: { value: string; code: string };
  zipCode: string;
  country: string;
  type: "current" | "permanent" | string;
}

export interface Legal {
  value: boolean;
  type: "privacy_policy" | "terms_and_condition" | string;
}

export interface Identification {
  value: string;
  type: string;
  issuer: string;
  description: string;
}

export interface Contact {
  value: string;
  type: "mobile_number" | "email" | string;
  provider: string;
}

export interface PKRFFormData {
  image: File | null;
  passwords: Password[];
  userName: string;
  role: "user";
  type: "patient_member" | "patient_dependent";
  firstName: string;
  lastName: string;
  middleName: string;
  extensionName: string;
  otherExtensionName: string;
  sex: string;
  birthDate: string;
  birthPlace: string;
  age: number;
  religion: string;
  civilStatus: "single" | "married" | "divorced" | "widowed" | string;
  addresses: Address[];
  legal: Legal[];
  identifications: Identification[];
  contacts: Contact[];
  facilityId: string;
  dependents: {
    firstName: string;
    middleName: string;
    lastName: string;
    extensionName: string;
    birthDate: string;
    age: number | undefined;
    sex: string;
    relationship: string;
    image: File | null;
  }[];
  // linkId?: string;
}

// ------------------ INITIAL DATA ------------------
const initialFormData: PKRFFormData = {
  image: null,
  passwords: [
    { value: "", type: "text" },
    { value: "", type: "mpin6char" },
  ],
  userName: "",
  role: "user",
  type: "patient_member",
  firstName: "",
  lastName: "",
  middleName: "",
  extensionName: "",
  otherExtensionName: "",
  sex: "",
  birthDate: "",
  birthPlace: "",
  age: 0,
  religion: "",
  civilStatus: "single",
  addresses: [
    {
      houseNo: "",
      street: "",
      province: { value: "", code: "unknown" },
      city: { value: "", code: "unknown" },
      barangay: { value: "", code: "unknown" },
      zipCode: "",
      country: "",
      type: "current",
    },
  ],
  legal: [
    { value: true, type: "privacy_policy" },
    { value: true, type: "terms_and_condition" },
  ],
  identifications: [
    {
      value: "",
      type: "philhealth_identification_number",
      issuer: "philhealth",
      description: "none",
    },
  ],
  contacts: [
    { value: "", type: "mobile_number", provider: "unknown" },
    { value: "", type: "email", provider: "gmail" },
  ],
  facilityId: "",
  dependents: [],
};

// ------------------ HELPERS ------------------
const getInitialFormData = (): PKRFFormData => {
  if (typeof window !== "undefined") {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData) as PKRFFormData;
      } catch (e) {
        console.error("Failed to parse saved PKRF form data:", e);
      }
    }
  }
  return initialFormData;
};

// ------------------ HOOK ------------------
export const usePKRFForm = () => {
  const [formData, setFormData] = useState<PKRFFormData>(getInitialFormData);
  console.log(formData);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  return { formData, setFormData };
};
