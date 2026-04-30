import type { EducationLevel } from "../types/education.types";

export const FUNDAMENTAL_YEARS = [
  "1º ano",
  "2º ano",
  "3º ano",
  "4º ano",
  "5º ano",
  "6º ano",
  "7º ano",
  "8º ano",
  "9º ano",
] as const;

export const HIGH_SCHOOL_YEARS = [
  "1º ano",
  "2º ano",
  "3º ano",
] as const;

export const EDUCATION_LEVEL_OPTIONS: EducationLevel[] = [
  "Ensino Fundamental",
  "Ensino Médio",
];

export function getGradesByEducationLevel(
  educationLevel: EducationLevel | ""
) {
  if (educationLevel === "Ensino Fundamental") return FUNDAMENTAL_YEARS;
  if (educationLevel === "Ensino Médio") return HIGH_SCHOOL_YEARS;
  return [];
}

export function buildGradeLevel(
  grade: string,
  educationLevel: EducationLevel | ""
) {
  if (!grade || !educationLevel) return "";
  return `${grade} - ${educationLevel}`;
}

export function parseGradeLevel(value?: string | null): {
  educationLevel: EducationLevel | "";
  grade: string;
} {
  if (!value) {
    return {
      educationLevel: "",
      grade: "",
    };
  }

  if (value.includes("Ensino Fundamental")) {
    return {
      educationLevel: "Ensino Fundamental",
      grade: value.replace(" - Ensino Fundamental", "").trim(),
    };
  }

  if (value.includes("Ensino Médio")) {
    return {
      educationLevel: "Ensino Médio",
      grade: value.replace(" - Ensino Médio", "").trim(),
    };
  }

  return {
    educationLevel: "",
    grade: "",
  };
}