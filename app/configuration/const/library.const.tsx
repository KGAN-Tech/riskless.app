export const MEDICAL_HISTORY_LIBRARY = [
  {
    key: "cancer",
    label: "Cancer",
    details: {
      fields: [
        {
          key: "cancer_type",
          label: "Specify organ with cancer:",
          field: "cancerType",
          type: "text",
        },
      ],
      metadata: { type: "", unit: "" },
    },
  },
  {
    key: "allergies",
    label: "Allergies",
    details: {
      fields: [
        {
          key: "allergy_type",
          label: "Specify Allergy:",
          field: "allergyType",
          type: "text",
        },
      ],
      metadata: { type: "", unit: "" },
    },
  },
  {
    key: "diabetesMellitus",
    label: "Diabetes Mellitus",
    details: {
      fields: [
        {
          key: "hbp_systolic",
          label: "Systolic",
          field: "systolic",
          type: "number",
        },
        {
          key: "hbp_diastolic",
          label: "Diastolic",
          field: "diastolic",
          type: "number",
        },
      ],
      metadata: { type: "fraction", unit: "mmHg" },
    },
  },
  {
    key: "hypertension",
    label: "Hypertension",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "heartDisease",
    label: "Heart Disease",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "stroke",
    label: "Stroke",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "bronchialAsthma",
    label: "Bronchial Asthma",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "copd",
    label: "COPD",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "tuberculosis",
    label: "Tuberculosis",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "asthma",
    label: "Asthma",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "cerebrovascularDisease",
    label: "Cerebrovascular Disease",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "coronaryArteryDisease",
    label: "Coronary Artery Disease",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "emphysema",
    label: "Emphysema",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "epilepsy",
    label: "Epilepsy",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "hepatitis",
    label: "Hepatitis",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "hyperlipidemia",
    label: "Hyperlipidemia",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "pulmonaryTuberculosis",
    label: "Pulmonary Tuberculosis",
    details: {
      fields: [
        {
          key: "pt_category",
          label: "Specify Pulmonary Tuberculosis category:",
          field: "pulmonaryTuberculosisCategory",
          type: "text",
        },
      ],
      metadata: { type: "", unit: "" },
    },
  },
  {
    key: "extrapulmonaryTuberculosis",
    label: "Extrapulmonary Tuberculosis",
    details: {
      fields: [
        {
          key: "et_category",
          label: "Specify Extrapulmonary Tuberculosis category:",
          field: "extrapulmonaryTuberculosisCategory",
          type: "text",
        },
      ],
      metadata: { type: "", unit: "" },
    },
  },
  {
    key: "urinaryTractInfection",
    label: "Urinary Tract Infection",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "mentalIllness",
    label: "Mental Illness",
    details: { fields: [], metadata: { type: "", unit: "" } },
  },
  {
    key: "others",
    label: "Others",
    details: {
      fields: [
        {
          key: "others_category",
          label: "Others, please Specify:",
          field: "others",
          type: "text",
        },
      ],
      metadata: { type: "", unit: "" },
    },
  },
];
