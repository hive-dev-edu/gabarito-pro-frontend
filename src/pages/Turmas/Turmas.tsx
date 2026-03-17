import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {ArrowLeft, ChevronLeft, ChevronRight, Plus, Search, Users, } from "lucide-react";

import TurmasService from "./services/turmas.service";
import type { CreateTurmaDTO, Turma } from "./types/turma.types";
import TurmaCard from "./components/TurmaCard";
import TurmaFormModal from "./components/TurmaFormModal";
import DeleteTurmaModal from "./components/DeleteTurmaModal";
import IconeCarregamento from "../../shared/components/IconeCarregamento";

import type { EducationLevel } from "../../shared/types/education.types";
import {
  EDUCATION_LEVEL_OPTIONS,
  getSchoolYearsByEducationLevel,
  parseGradeLevel,
} from "../../shared/constants/education";

export default function TurmasPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [educationLevelFilter, setEducationLevelFilter] = useState<
    EducationLevel | ""
  >("");
  const [schoolYearFilter, setSchoolYearFilter] = useState("");

  const [page, setPage] = useState(1);
  const limit = 10;

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [meta, setMeta] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);

  const [carregando, setCarregando] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [selectedTurma, setSelectedTurma] = useState<Turma | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  async function carregarTurmas(currentPage = 1) {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await TurmasService.getAll(currentPage, limit);
      setTurmas(resposta.data);
      setMeta(resposta.meta);
    } catch (error) {
      console.error(error);
      setErro("Erro ao carregar turmas. Tente novamente.");
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarTurmas(page);
  }, [page]);

  useEffect(() => {
    if (!sucesso) return;
    const timer = setTimeout(() => setSucesso(""), 3000);
    return () => clearTimeout(timer);
  }, [sucesso]);

  const schoolYearOptions = useMemo(() => {
    return getSchoolYearsByEducationLevel(educationLevelFilter);
  }, [educationLevelFilter]);

  const turmasFiltradas = useMemo(() => {
    return turmas.filter((turma) => {
      const parsed = parseGradeLevel(turma.gradeLevel);

      const matchesSearch =
        !search.trim() ||
        turma.name.toLowerCase().includes(search.toLowerCase().trim());

      const matchesEducationLevel =
        !educationLevelFilter ||
        parsed.educationLevel === educationLevelFilter;

      const matchesSchoolYear =
        !schoolYearFilter || parsed.schoolYear === schoolYearFilter;

      return matchesSearch && matchesEducationLevel && matchesSchoolYear;
    });
  }, [turmas, search, educationLevelFilter, schoolYearFilter]);

  function handleFiltrar() {
    setPage(1);
  }

  function handleLimparFiltros() {
    setSearch("");
    setEducationLevelFilter("");
    setSchoolYearFilter("");
    setPage(1);
  }

  function openCreateModal() {
    setFormMode("create");
    setSelectedTurma(null);
    setIsFormModalOpen(true);
  }

  function openEditModal(turma: Turma) {
    setFormMode("edit");
    setSelectedTurma(turma);
    setIsFormModalOpen(true);
  }

  function openDeleteModal(turma: Turma) {
    setSelectedTurma(turma);
    setIsDeleteModalOpen(true);
  }

  function closeFormModal() {
    if (submitting) return;
    setIsFormModalOpen(false);
    setSelectedTurma(null);
  }

  function closeDeleteModal() {
    if (deleteLoading) return;
    setIsDeleteModalOpen(false);
    setSelectedTurma(null);
  }

  async function handleSubmitTurma(data: CreateTurmaDTO) {
    try {
      setSubmitting(true);
      setErro("");

      if (formMode === "create") {
        await TurmasService.create(data);
        setSucesso("Turma criada com sucesso.");
      } else if (selectedTurma) {
        await TurmasService.update(selectedTurma.id, data);
        setSucesso("Turma atualizada com sucesso.");
      }

      setIsFormModalOpen(false);
      setSelectedTurma(null);
      await carregarTurmas(page);
    } catch (error) {
      console.error(error);
      setErro(
        formMode === "create"
          ? "Não foi possível criar a turma."
          : "Não foi possível atualizar a turma."
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteTurma() {
    if (!selectedTurma) return;

    try {
      setDeleteLoading(true);
      setErro("");

      await TurmasService.delete(selectedTurma.id);

      setSucesso("Turma excluída com sucesso.");
      setIsDeleteModalOpen(false);
      setSelectedTurma(null);

      const nextPage =
        turmas.length === 1 && page > 1 ? Math.max(1, page - 1) : page;
      setPage(nextPage);

      if (nextPage === page) {
        await carregarTurmas(nextPage);
      }
    } catch (error) {
      console.error(error);
      setErro("Não foi possível excluir a turma.");
    } finally {
      setDeleteLoading(false);
    }
  }

  return (
    <>
      <main>
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Voltar"
              >
                <ArrowLeft size={22} />
              </button>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Minhas Turmas
                </h1>
                <p className="text-gray-500 text-sm sm:text-base mt-0.5 sm:mt-1">
                  Crie, edite e organize suas turmas
                </p>
              </div>
            </div>

            <button
              onClick={openCreateModal}
              className="inline-flex items-center justify-center gap-2 bg-[#2EC5B6] hover:bg-[#27b3a6] text-white px-5 py-3 rounded-2xl font-semibold transition-colors duration-300 cursor-pointer"
            >
              <Plus size={20} />
              Nova Turma
            </button>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar turma
                </label>
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      handleFiltrar();
                    }}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]"
                    placeholder="Ex: Turma A"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nível de ensino
                </label>
                <select
                  value={educationLevelFilter}
                  onChange={(e) => {
                    const value = e.target.value as EducationLevel | "";
                    setEducationLevelFilter(value);
                    setSchoolYearFilter("");
                    setPage(1);
                  }}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6] bg-white"
                >
                  <option value="">Todos</option>
                  {EDUCATION_LEVEL_OPTIONS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ano / Série
                </label>
                <select
                  value={schoolYearFilter}
                  onChange={(e) => {
                    setSchoolYearFilter(e.target.value);
                    setPage(1);
                  }}
                  disabled={!educationLevelFilter}
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6] bg-white disabled:bg-gray-100 disabled:text-gray-400"
                >
                  <option value="">
                    {educationLevelFilter ? "Todos" : "Escolha primeiro o nível"}
                  </option>

                  {schoolYearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleLimparFiltros}
                  className="w-full p-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          </div>

          {sucesso && (
            <div className="bg-green-50 border border-green-300 text-green-700 p-4 rounded-2xl text-center mb-6">
              <p>{sucesso}</p>
            </div>
          )}

          {carregando ? (
            <div className="flex justify-center items-center py-20">
              <IconeCarregamento w={32} h={32} color="black" />
            </div>
          ) : erro ? (
            <div className="bg-red-50 border border-red-300 text-red-700 p-6 rounded-2xl text-center">
              <p>{erro}</p>
              <button
                onClick={() => carregarTurmas(page)}
                className="mt-3 text-sm underline cursor-pointer"
              >
                Tentar novamente
              </button>
            </div>
          ) : turmasFiltradas.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Users size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">Você ainda não possui turmas cadastradas.</p>
              <p className="text-sm mt-1">
                Clique em "Nova Turma" para criar sua primeira turma.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {turmasFiltradas.map((turma) => (
                  <TurmaCard
                    key={turma.id}
                    turma={turma}
                    onEdit={openEditModal}
                    onDelete={openDeleteModal}
                  />
                ))}
              </div>

              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="p-2 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <span className="text-sm text-gray-600">
                    Página <span className="font-semibold">{meta.page}</span> de{" "}
                    <span className="font-semibold">{meta.totalPages}</span>{" "}
                    <span className="text-gray-400">({meta.total} turmas)</span>
                  </span>

                  <button
                    onClick={() =>
                      setPage((p) => Math.min(meta.totalPages, p + 1))
                    }
                    disabled={page >= meta.totalPages}
                    className="p-2 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <TurmaFormModal
        isOpen={isFormModalOpen}
        mode={formMode}
        turma={selectedTurma}
        loading={submitting}
        onClose={closeFormModal}
        onSubmit={handleSubmitTurma}
      />

      <DeleteTurmaModal
        isOpen={isDeleteModalOpen}
        turma={selectedTurma}
        loading={deleteLoading}
        onClose={closeDeleteModal}
        onConfirm={handleDeleteTurma}
      />
    </>
  );
}