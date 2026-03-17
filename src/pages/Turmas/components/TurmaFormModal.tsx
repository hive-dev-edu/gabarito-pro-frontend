import { useEffect, useMemo, useState } from "react";
import IconeCarregamento from "../../../shared/components/IconeCarregamento";
import { X } from "lucide-react";
import type { CreateTurmaDTO, Turma } from "../types/turma.types";
import type { EducationLevel } from "../../../shared/types/education.types";
import {
  EDUCATION_LEVEL_OPTIONS,
  getSchoolYearsByEducationLevel,
  buildGradeLevel,
  parseGradeLevel,
} from "../../../shared/constants/education";

interface TurmaFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  turma: Turma | null;
  loading?: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTurmaDTO) => Promise<void>;
}

export default function TurmaFormModal({
  isOpen,
  mode,
  turma,
  loading = false,
  onClose,
  onSubmit,
}: TurmaFormModalProps) {
  const [name, setName] = useState("");
  const [educationLevel, setEducationLevel] = useState<EducationLevel | "">("");
  const [schoolYear, setSchoolYear] = useState("");

  const [errors, setErrors] = useState({
    name: "",
    educationLevel: "",
    schoolYear: "",
  });

  const schoolYearOptions = useMemo(() => {
    return getSchoolYearsByEducationLevel(educationLevel);
  }, [educationLevel]);

  useEffect(() => {
    if (mode === "edit" && turma) {
      const parsed = parseGradeLevel(turma.gradeLevel);

      setName(turma.name ?? "");
      setEducationLevel(parsed.educationLevel);
      setSchoolYear(parsed.schoolYear ?? "");
    } else {
      setName("");
      setEducationLevel("");
      setSchoolYear("");
    }

    setErrors({
      name: "",
      educationLevel: "",
      schoolYear: "",
    });
  }, [mode, turma, isOpen]);

  if (!isOpen) return null;

  function validate() {
    const newErrors = {
      name: "",
      educationLevel: "",
      schoolYear: "",
    };

    let isValid = true;

    if (!name.trim()) {
      newErrors.name = "O nome da turma é obrigatório.";
      isValid = false;
    }

    if (!educationLevel) {
      newErrors.educationLevel = "Selecione o nível de ensino.";
      isValid = false;
    }

    if (!schoolYear) {
      newErrors.schoolYear = "Selecione o ano/série.";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!validate()) return;

    await onSubmit({
      name: name.trim(),
      gradeLevel: buildGradeLevel(schoolYear, educationLevel),
    });
  }

  function handleChangeEducationLevel(value: EducationLevel | "") {
    setEducationLevel(value);
    setSchoolYear("");
    setErrors((prev) => ({
      ...prev,
      educationLevel: "",
      schoolYear: "",
    }));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6">
      <div className="w-full max-w-3xl max-h-[95vh] overflow-y-auto rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
              {mode === "create" ? "Nova Turma" : "Editar Turma"}
            </h2>
            <p className="text-gray-500 text-sm sm:text-base mt-0.5 sm:mt-1">
              Preencha os dados da turma para continuar
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
            type="button"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6">
          <div className="bg-white rounded-2xl">
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome da turma
                </label>
                <input
                  type="text"
                  placeholder="Digite o nome da turma..."
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) {
                      setErrors((prev) => ({ ...prev, name: "" }));
                    }
                  }}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nível de ensino
                  </label>
                  <select
                    value={educationLevel}
                    onChange={(e) =>
                      handleChangeEducationLevel(
                        e.target.value as EducationLevel | ""
                      )
                    }
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6] bg-white"
                  >
                    <option value="">Selecione</option>
                    {EDUCATION_LEVEL_OPTIONS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  {errors.educationLevel && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.educationLevel}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ano / Série
                  </label>
                  <select
                    value={schoolYear}
                    onChange={(e) => {
                      setSchoolYear(e.target.value);
                      if (errors.schoolYear) {
                        setErrors((prev) => ({ ...prev, schoolYear: "" }));
                      }
                    }}
                    disabled={!educationLevel}
                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6] bg-white disabled:bg-gray-100 disabled:text-gray-400"
                  >
                    <option value="">
                      {educationLevel
                        ? "Selecione"
                        : "Escolha primeiro o nível"}
                    </option>

                    {schoolYearOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.schoolYear && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.schoolYear}
                    </p>
                  )}
                </div>
              </div>

              <div className="rounded-xl border border-[#2EC5B6]/20 bg-[#2EC5B6]/5 p-4">
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-gray-800">
                    Valor salvo:
                  </span>{" "}
                  {schoolYear && educationLevel
                    ? buildGradeLevel(schoolYear, educationLevel)
                    : "Selecione o nível de ensino e o ano/série."}
                </p>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-8 bg-[#2EC5B6] hover:bg-[#27b3a6] text-white py-3 rounded-xl font-semibold transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <IconeCarregamento w={1} h={1} />
                  {mode === "create" ? "Criando turma..." : "Salvando alterações..."}
                </>
              ) : mode === "create" ? (
                "Criar Turma"
              ) : (
                "Salvar Alterações"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}