import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Save,
  Search,
  SendHorizonal,
} from "lucide-react";

import AvaliacoesService from "./services/avaliacoes.service";
import TurmasService from "../Turmas/services/turmas.service";
import { QuestoesService } from "../Questoes/services/questoes.service";

import type { CreateAvaliacaoDTO } from "./types/avaliacao.types";
import type { Turma } from "../Turmas/types/turma.types";
import type { Questao, Dificuldade } from "../Questoes/types/questoes.types";

import IconeCarregamento from "../../shared/components/IconeCarregamento";
import ListaQuestoesSelecionadas from "./components/ListaQuestoesSelecionadas";

interface QuestaoSelecionadaLocal {
  questionId: string;
  weight: number;
  position: number;
  statement?: string;
  content?: string;
  subject?: string;
  schoolYear?: string;
  difficulty?: string;
  alternatives?: Array<{ id: string; text: string }>;
  question?: Questao;
}

function traduzirDificuldade(dificuldade?: string) {
  if (dificuldade === "easy") return "Fácil";
  if (dificuldade === "medium") return "Média";
  if (dificuldade === "hard") return "Difícil";
  return "Não informada";
}

export default function CriarAvaliacaoPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const avaliacaoId = searchParams.get("id");

  const questoesService = new QuestoesService();

  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [classId, setClassId] = useState("");

  const [subject, setSubject] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [difficulty, setDifficulty] = useState<Dificuldade | "">("");
  const [myQuestions, setMyQuestions] = useState(false);
  const [searchQuestao, setSearchQuestao] = useState("");

  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [questoesSelecionadas, setQuestoesSelecionadas] = useState<
    QuestaoSelecionadaLocal[]
  >([]);

  const [pageQuestoes, setPageQuestoes] = useState(1);
  const limitQuestoes = 5;

  const [metaQuestoes, setMetaQuestoes] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);

  const [carregandoInicial, setCarregandoInicial] = useState(true);
  const [carregandoQuestoes, setCarregandoQuestoes] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const [erro, setErro] = useState("");

  async function carregarTurmas() {
    const resposta = await TurmasService.getAll(1, 100);
    const lista = Array.isArray((resposta as any)?.data)
      ? (resposta as any).data
      : Array.isArray((resposta as any)?.items)
        ? (resposta as any).items
        : [];

    setTurmas(lista);
  }

  async function carregarQuestoes(currentPage = 1) {
    setCarregandoQuestoes(true);
    setErro("");

    try {
      const resposta = await questoesService.listar({
        subject: subject || undefined,
        schoolYear: schoolYear || undefined,
        difficulty: difficulty || undefined,
        myQuestions: myQuestions ? "true" : "false",
        page: currentPage,
        limit: limitQuestoes,
      });

      const lista = Array.isArray(resposta?.data) ? resposta.data : [];

      setQuestoes(lista);
      setMetaQuestoes({
        total: resposta?.meta?.total ?? 0,
        page: resposta?.meta?.page ?? currentPage,
        limit: resposta?.meta?.limit ?? limitQuestoes,
        totalPages: resposta?.meta?.totalPages ?? 1,
      });
    } catch (error) {
      console.error("Erro ao carregar questões:", error);
      setErro(
        error instanceof Error ? error.message : "Erro ao carregar questões."
      );
      setQuestoes([]);
      setMetaQuestoes(null);
    } finally {
      setCarregandoQuestoes(false);
    }
  }

  async function carregarRascunho(id: string) {
    try {
      const avaliacao = await AvaliacoesService.getById(id);

      setTitulo(avaliacao?.title ?? "");
      setData(avaliacao?.date ? avaliacao.date.slice(0, 10) : "");
      setClassId(avaliacao?.classId ?? "");

      const selecionadas = Array.isArray(avaliacao?.questions)
        ? avaliacao.questions.map((item: any) => ({
          questionId: item.questionId,
          weight: Number(item.weight ?? 1),
          position: Number(item.position ?? 0),
          statement: item.statement ?? item.question?.statement ?? "",
          content: item.content ?? item.question?.content ?? "",
          subject: item.subject ?? item.question?.subject ?? "",
          schoolYear: item.schoolYear ?? item.question?.schoolYear ?? "",
          difficulty: item.difficulty ?? item.question?.difficulty ?? "",
          alternatives:
            item.alternatives ?? item.question?.alternatives ?? [],
          question: item.question
            ? item.question
            : {
              id: item.questionId,
              statement: item.statement ?? "",
              content: item.content ?? "",
              subject: item.subject ?? "",
              schoolYear: item.schoolYear ?? "",
              difficulty: item.difficulty ?? "",
              alternatives: item.alternatives ?? [],
            },
        }))
        : [];

      setQuestoesSelecionadas(
        [...selecionadas].sort((a, b) => a.position - b.position)
      );
    } catch (error) {
      console.error("Erro ao carregar rascunho:", error);
      setErro(
        error instanceof Error ? error.message : "Erro ao carregar rascunho."
      );
    }
  }

  useEffect(() => {
    async function carregarInicial() {
      setCarregandoInicial(true);
      setErro("");

      try {
        await Promise.all([carregarTurmas(), carregarQuestoes(1)]);

        if (avaliacaoId) {
          await carregarRascunho(avaliacaoId);
        }
      } catch (error) {
        console.error("Erro inicial:", error);
        setErro(
          error instanceof Error
            ? error.message
            : "Erro ao carregar dados da página."
        );
      } finally {
        setCarregandoInicial(false);
      }
    }

    carregarInicial();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avaliacaoId]);

  useEffect(() => {
    carregarQuestoes(pageQuestoes);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageQuestoes]);

  const questoesDisponiveisFiltradas = useMemo(() => {
    return questoes.filter((questao) => {
      if (!searchQuestao.trim()) return true;

      const termo = searchQuestao.toLowerCase().trim();

      return (
        (questao.statement || "").toLowerCase().includes(termo) ||
        (questao.subject || "").toLowerCase().includes(termo) ||
        (questao.content || "").toLowerCase().includes(termo)
      );
    });
  }, [questoes, searchQuestao]);

  const totalScore = useMemo(() => {
    return questoesSelecionadas.reduce(
      (acc, questao) => acc + Number(questao.weight || 0),
      0
    );
  }, [questoesSelecionadas]);

  function adicionarQuestao(questao: Questao) {
    setQuestoesSelecionadas((prev) => {
      if (prev.some((item) => item.questionId === questao.id)) return prev;

      return [
        ...prev,
        {
          questionId: questao.id,
          weight: 1,
          position: prev.length + 1,
          statement: questao.statement,
          content: questao.content,
          subject: questao.subject,
          schoolYear: questao.schoolYear,
          difficulty: questao.difficulty,
          alternatives: questao.alternatives ?? [],
          question: questao,
        },
      ];
    });
  }

  function removerQuestao(questionId: string) {
    setQuestoesSelecionadas((prev) =>
      prev
        .filter((item) => item.questionId !== questionId)
        .map((item, index) => ({
          ...item,
          position: index + 1,
        }))
    );
  }

  function atualizarPeso(questionId: string, peso: number) {
    setQuestoesSelecionadas((prev) =>
      prev.map((item) =>
        item.questionId === questionId
          ? {
            ...item,
            weight: Number.isFinite(peso) && peso > 0 ? peso : 1,
          }
          : item
      )
    );
  }

  function handleAplicarFiltros() {
    setPageQuestoes(1);
    carregarQuestoes(1);
  }

  function handleLimparFiltros() {
    setSubject("");
    setSchoolYear("");
    setDifficulty("");
    setMyQuestions(false);
    setSearchQuestao("");
    setPageQuestoes(1);

    setTimeout(() => {
      carregarQuestoes(1);
    }, 0);
  }

  async function salvar(status: "DRAFT" | "PUBLISHED") {
    try {
      setSalvando(true);
      setErro("");

      if (!titulo.trim()) {
        setErro("Informe o título da avaliação.");
        return;
      }

      if (!data) {
        setErro("Informe a data da avaliação.");
        return;
      }

      if (!classId) {
        setErro("Selecione a turma da avaliação.");
        return;
      }

      if (questoesSelecionadas.length === 0) {
        setErro("Selecione pelo menos uma questão.");
        return;
      }

      const payload: CreateAvaliacaoDTO = {
        title: titulo.trim(),
        date: `${data}T12:00:00`,
        totalScore: Number(totalScore.toFixed(2)),
        status,
        classId,
        questions: [...questoesSelecionadas]
          .sort((a, b) => a.position - b.position)
          .map((item, index) => ({
            questionId: item.questionId,
            weight: Number(item.weight),
            position: index + 1,
          })),
      };

      if (avaliacaoId) {
        await AvaliacoesService.update(avaliacaoId, payload);
      } else {
        await AvaliacoesService.create(payload);
      }

      navigate(status === "DRAFT" ? "/avaliacoes/rascunhos" : "/avaliacoes");
    } catch (error) {
      console.error("Erro ao salvar avaliação:", error);
      setErro(
        error instanceof Error ? error.message : "Erro ao salvar avaliação."
      );
    } finally {
      setSalvando(false);
    }
  }

  return (
    <main>
      <div className="mx-auto max-w-5xl px-3 py-6 sm:px-4 sm:py-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate("/avaliacoes")}
              className="shrink-0 rounded-2xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              title="Voltar"
            >
              <ArrowLeft size={22} />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                Criar Avaliação
              </h1>
              <p className="mt-0.5 text-sm text-slate-500 sm:mt-1 sm:text-base">
                Monte a prova com layout organizado e revisão de pesos
              </p>
            </div>
          </div>
        </div>

        {erro && (
          <div className="mb-5 rounded-3xl border border-red-300 bg-red-50 p-4 text-center text-red-700">
            <p>{erro}</p>
          </div>
        )}

        {carregandoInicial ? (
          <div className="flex items-center justify-center py-20">
            <IconeCarregamento w={32} h={32} color="black" />
          </div>
        ) : (
          <>
            <div className="mb-5 rounded-3xl border border-[#DDEDEA] bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-base font-semibold text-slate-800 sm:text-lg">
                  Dados da avaliação
                </h2>

                <button
                  onClick={() => navigate("/avaliacoes/rascunhos")}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition-colors duration-300 hover:bg-slate-50"
                >
                  <Bookmark size={16} />
                  Rascunhos
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Título
                  </label>
                  <input
                    type="text"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]"
                    placeholder="Ex: Prova Bimestral de História"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Data
                  </label>
                  <input
                    type="date"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Turma
                  </label>
                  <select
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]"
                  >
                    <option value="">Selecione uma turma</option>
                    {turmas.map((turma) => (
                      <option key={turma.id} value={turma.id}>
                        {turma.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="mb-5 rounded-3xl border border-[#DDEDEA] bg-white p-4 shadow-sm sm:p-5">
              <div className="mb-4 flex items-center gap-2">
                <Filter size={16} className="text-slate-500" />
                <h2 className="text-base font-semibold text-slate-800 sm:text-lg">
                  Filtrar questões
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Matéria
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]"
                    placeholder="Ex: História"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Ano escolar
                  </label>
                  <input
                    type="text"
                    value={schoolYear}
                    onChange={(e) => setSchoolYear(e.target.value)}
                    className="w-full rounded-2xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]"
                    placeholder="Ex: 8º ano"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Dificuldade
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) =>
                      setDifficulty(e.target.value as Dificuldade | "")
                    }
                    className="w-full rounded-2xl border border-slate-300 px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]"
                  >
                    <option value="">Todas</option>
                    <option value="easy">Fácil</option>
                    <option value="medium">Média</option>
                    <option value="hard">Difícil</option>
                  </select>
                </div>

                <div className="xl:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Buscar questão
                  </label>
                  <div className="relative">
                    <Search
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />
                    <input
                      type="text"
                      value={searchQuestao}
                      onChange={(e) => setSearchQuestao(e.target.value)}
                      className="w-full rounded-2xl border border-slate-300 py-2.5 pl-9 pr-3 focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]"
                      placeholder="Buscar por enunciado ou matéria"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <label className="inline-flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={myQuestions}
                    onChange={(e) => setMyQuestions(e.target.checked)}
                    className="rounded"
                  />
                  Somente minhas questões
                </label>

                <div className="flex gap-2">
                  <button
                    onClick={handleLimparFiltros}
                    className="rounded-2xl border border-slate-300 px-4 py-2.5 text-sm text-slate-600 transition-colors duration-300 hover:bg-slate-50"
                  >
                    Limpar filtros
                  </button>

                  <button
                    onClick={handleAplicarFiltros}
                    className="rounded-2xl bg-[#2EC5B6] px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#27b3a6]"
                  >
                    Aplicar filtros
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-[#DDEDEA] bg-white p-4 shadow-sm sm:p-5">
                <h2 className="mb-4 text-base font-semibold text-slate-800 sm:text-lg">
                  Questões disponíveis
                </h2>

                {carregandoQuestoes ? (
                  <div className="flex items-center justify-center py-14">
                    <IconeCarregamento w={28} h={28} color="black" />
                  </div>
                ) : questoesDisponiveisFiltradas.length === 0 ? (
                  <div className="py-14 text-center text-slate-400">
                    <p className="text-base">Nenhuma questão encontrada.</p>
                    <p className="mt-1 text-sm">
                      Tente alterar os filtros para buscar outras questões.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3">
                      {questoesDisponiveisFiltradas.map((questao) => {
                        const jaSelecionada = questoesSelecionadas.some(
                          (item) => item.questionId === questao.id
                        );

                        return (
                          <div
                            key={questao.id}
                            className="rounded-3xl border border-[#DDEDEA] bg-[#FCFEFF] p-4"
                          >
                            <div className="flex flex-col gap-3">
                              <div>
                                <p className="line-clamp-2 text-sm font-semibold text-slate-800">
                                  {questao.statement}
                                </p>

                                {questao.content ? (
                                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                                    {questao.content}
                                  </p>
                                ) : null}
                              </div>

                              <div className="flex flex-wrap gap-2 text-[11px]">
                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                                  {questao.subject || "Sem matéria"}
                                </span>

                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                                  {questao.schoolYear || "Ano não informado"}
                                </span>

                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                                  {traduzirDificuldade(questao.difficulty)}
                                </span>
                                <div>
                                  <button
                                    onClick={() => adicionarQuestao(questao)}
                                    disabled={jaSelecionada}
                                    className="inline-flex items-center gap-2 rounded-2xl bg-[#2EC5B6] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#27b3a6] disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    <Plus size={14} />
                                    {jaSelecionada
                                      ? "Questão adicionada"
                                      : "Adicionar"}
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {metaQuestoes && metaQuestoes.totalPages > 1 && (
                      <div className="mt-6 flex items-center justify-center gap-3">
                        <button
                          onClick={() =>
                            setPageQuestoes((p) => Math.max(1, p - 1))
                          }
                          disabled={pageQuestoes <= 1}
                          className="rounded-2xl border border-slate-300 p-2 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ChevronLeft size={18} />
                        </button>

                        <span className="text-sm text-slate-600">
                          Página{" "}
                          <span className="font-semibold">
                            {metaQuestoes.page}
                          </span>{" "}
                          de{" "}
                          <span className="font-semibold">
                            {metaQuestoes.totalPages}
                          </span>
                        </span>

                        <button
                          onClick={() =>
                            setPageQuestoes((p) =>
                              Math.min(metaQuestoes.totalPages, p + 1)
                            )
                          }
                          disabled={pageQuestoes >= metaQuestoes.totalPages}
                          className="rounded-2xl border border-slate-300 p-2 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                        >
                          <ChevronRight size={18} />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              <div className="rounded-3xl border border-[#DDEDEA] bg-white p-4 shadow-sm sm:p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-base font-semibold text-slate-800 sm:text-lg">
                        Questões selecionadas
                      </h2>
                      <div className="ml-2 flex items-center gap-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                        <svg className="h-3 w-3 text-slate-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6h4M10 12h4M10 18h4" stroke="#64748b" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        <span>Arraste para reordenar</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-500">Revise os pesos antes de salvar</p>
                  </div>

                    <div className="rounded-2xl border border-[#B8EEE8] bg-[#F7FFFD] px-3 py-1.5 text-right">
                    <p className="text-[10px] text-slate-500">Pontuação</p>
                    <strong className="text-base text-slate-800">
                      {totalScore.toFixed(2)}
                    </strong>
                    </div>
                </div>

                {questoesSelecionadas.length === 0 ? (
                  <div className="py-14 text-center text-slate-400">
                    <p className="text-base">Nenhuma questão selecionada.</p>
                    <p className="mt-1 text-sm">
                      Adicione questões para montar a avaliação.
                    </p>
                  </div>
                ) : (
                  <ListaQuestoesSelecionadas
                    questoes={questoesSelecionadas}
                    atualizarPeso={atualizarPeso}
                    remover={removerQuestao}
                    onReorder={(novaOrdem) => setQuestoesSelecionadas(novaOrdem)}
                  />
                )}
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-[#DDEDEA] bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
                <div>
                  <p className="text-sm text-slate-500">Resumo final</p>
                  <p className="text-base font-semibold text-slate-800">
                    {questoesSelecionadas.length} questão(ões) • pontuação total{" "}
                    {totalScore.toFixed(2)}
                  </p>
                </div>

                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                  <button
                    onClick={() => salvar("DRAFT")}
                    disabled={salvando}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition-colors duration-300 hover:bg-slate-50 disabled:opacity-60"
                  >
                    <Save size={16} />
                    Salvar rascunho
                  </button>

                  <button
                    onClick={() => salvar("PUBLISHED")}
                    disabled={salvando}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2EC5B6] px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-300 hover:bg-[#27b3a6] disabled:opacity-60"
                  >
                    <SendHorizonal size={16} />
                    Publicar avaliação
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}