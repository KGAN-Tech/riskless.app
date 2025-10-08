import { getUser } from "@/utils/use.token";
import { useState, useEffect } from "react";

const LOCAL_STORAGE_KEY = "fpeFormData";

const dateNow = new Date();

const initialFormData: any = {
  validation: {
    isCertifyTheData: false,
  },
  personId: "",
  screeningDate: dateNow.toISOString(),

  history: {
    social: {
      smoker: false,
      smokingYears: 0,
      alcohol: false,
      alcoholYears: 0,
      illicitDrug: false,
      sexuallyActive: false,
    },
    medical: {
      conditions: {
        cancer: {
          isDiagnosed: false,
          type: "",
          details: "",
        },
        allergies: {
          isDiagnosed: false,
          type: "",
          details: "",
        },
        diabetesMellitus: {
          isDiagnosed: false,
          type: "",
          details: "",
        },

        hypertension: {
          isDiagnosed: false,
          type: "",
          details: "",
        },

        heartDisease: {
          isDiagnosed: false,
          type: "",
          details: "",
        },

        stroke: {
          isDiagnosed: false,
          type: "",
          details: "",
        },
        bronchialAsthma: {
          isDiagnosed: false,
          type: "",
          details: "",
        },

        copd: {
          isDiagnosed: false,
          type: "",
          details: "",
        },

        tuberculosis: {
          isDiagnosed: false,
          type: "",
          details: "",
        },

        others: {
          isDiagnosed: false,
          type: "",
          details: "",
        },
      },
    },
    family: {
      conditions: {
        cancer: {
          isDiagnosed: false,
          type: "",
          details: "",
        },
        allergies: {
          isDiagnosed: false,
          type: "",
          details: "",
        },
        diabetesMellitus: {
          isDiagnosed: false,
          type: "",
          details: "",
        },

        hypertension: {
          isDiagnosed: false,
          type: "",
          details: "",
        },

        heartDisease: {
          isDiagnosed: false,
          type: "",
          details: "",
        },

        stroke: {
          isDiagnosed: false,
          type: "",
          details: "",
        },
        bronchialAsthma: {
          isDiagnosed: false,
          type: "",
          details: "",
        },

        copd: {
          isDiagnosed: false,
          type: "",
          details: "",
        },

        tuberculosis: {
          isDiagnosed: false,
          type: "",
          details: "",
        },

        others: {
          isDiagnosed: false,
          type: "",
          details: "",
        },
      },
    },
  },
  physicalExam: {
    temperature: {
      value: 36.5,
      status: "normal",
    },
    bloodPressure: {
      systolic: 120,
      diastolic: 80,
      category: "normal",
    },
    heartRate: {
      status: "normal",
      value: 60,
    },
    respiratoryRate: {
      status: "normal",
      value: 12,
    },
    visualAcuity: "20/20",
    height: {
      centimeter: 0,
      inches: 0,
    },
    weight: {
      kilograms: 0,
      pounds: 0,
    },
    bmi: 0,
    bloodType: "o_positive",
    generalSurvey: "awake_alert",
    generalSurveyDetails: "",
  },
  pediatricData: {
    length: 0,
    headCircumference: 0,
    skinfoldThickness: 0,
    waist: 0,
    hip: 0,
    limbs: 0,
    muac: 0,
  },
  reviewOfSystems: {
    chiefComplaint: "N/A",
    mental: { hasIssues: false, explain: "N/A" },
    respiratory: { hasIssues: false, explain: "N/A" },
    gi: { hasIssues: false, explain: "N/A" },
    urinary: { hasIssues: false, explain: "N/A" },
    genital: { hasIssues: false, explain: "N/A" },
    musculoskeletal: { hasIssues: false, explain: "N/A" },
    lastMenstrualPeriod: "",
    firstMenstrualPeriod: "",
    pregnancyCount: 0,
  },
};

const getInitialFormData = (): any => {
  if (typeof window !== "undefined") {
    const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (e) {
        console.error("Failed to parse saved FPE form data:", e);
      }
    }
  }
  return initialFormData;
};

export const useFPERegistrationForm = () => {
  const [formData, setFormData] = useState<any>(getInitialFormData);

  useEffect(() => {
    const user = getUser(); // ← move inside effect
    if (user) {
      setFormData((prev: any) => ({
        ...prev,
        personId: user.person.id,
      }));
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  return { formData, setFormData };
};
