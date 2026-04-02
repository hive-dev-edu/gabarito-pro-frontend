import { useMemo, useState } from "react";
import IconeCarregamento from "../../../shared/components/IconeCarregamento";
import { X } from "lucide-react";
import type { CreateTurmaDTO, Turma } from "../types/turma.types";
import type { EducationLevel } from "../../../shared/types/education.types";
import {
  EDUCATION_LEVEL_OPTIONS,
  getGradesByEducationLevel,
  buildGradeLevel,
  parseGradeLevel,
} from "../../../shared/constants/education";

interface TurmaFormModalProps {
  isOpen: boolean;
  mode: "create" | "edit";
  turma: Turma | null;
  loading?: boolean;
  submitError?: string;
  onClose: () => void;
  onSubmit: (data: CreateTurmaDTO) => Promise<void>;
}

export default function TurmaFormModal({
  isOpen,
  mode,
  turma,
  loading = false,
  submitError,
  onClose,
  onSubmit,
}: TurmaFormModalProps) {
  const initialForm = useMemo(() => {
    if (mode === "edit" && turma) {
      const parsed = parseGradeLevel(turma.gradeLevel);
      return {
        name: turma.name ?? "",
        educationLevel: parsed.educationLevel,
        grade: parsed.grade ?? "",
      };
    }

    return {
      name: "",
      educationLevel: "" as EducationLevel | "",
      grade: "",
    };
  }, [mode, turma]);

  const [name, setName] = useState(initialForm.name);
  const [educationLevel, setEducationLevel] = useState<EducationLevel | "">(
    initialForm.educationLevel
  );
  const [grade, setGrade] = useState(initialForm.grade);

  const [errors, setErrors] = useState({
    name: "",
    educationLevel: "",
    grade: "",
  });

  const gradeOptions = useMemo(() => {
    return getGradesByEducationLevel(educationLevel);
  }, [educationLevel]);

  if (!isOpen) return null;

  function validate() {
    const newErrors = {
      name: "",
      educationLevel: "",
      grade: "",
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

    if (!grade) {
      newErrors.grade = "Selecione o ano/série.";
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
      gradeLevel: buildGradeLevel(grade, educationLevel),
    });
  }

  function handleChangeEducationLevel(value: EducationLevel | "") {
    setEducationLevel(value);
    setGrade("");
    setErrors((prev) => ({
      ...prev,
      educationLevel: "",
      grade: "",
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
                    value={grade}
                    onChange={(e) => {
                      setGrade(e.target.value);
                      if (errors.grade) {
                        setErrors((prev) => ({ ...prev, grade: "" }));
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

                    {gradeOptions.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                  {errors.grade && (
                    <p className="mt-2 text-sm text-red-500">
                      {errors.grade}
                    </p>
                  )}
                </div>
              </div>

              {submitError && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                  <p className="text-sm text-red-700" role="alert">{submitError}</p>
                </div>
              )}
            </div>

            <span className="flex justify-between items-center w-full gap-4">

              <button
                onClick={onClose}
                className="w-1/4 mt-8 border border-gray-200 hover:bg-slate-200 text-gray-500 py-3 rounded-xl font-semibold transition-colors duration-300 flex items-center justify-center gap-2 cursor-pointer"
                type="button"
              >
                Cancelar
              </button>

              <button
                type="submit"
                disabled={loading}
                className="w-3/4 mt-8 bg-[#2EC5B6] hover:bg-[#27b3a6] text-white py-3 rounded-xl font-semibold transition-colors duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
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
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}