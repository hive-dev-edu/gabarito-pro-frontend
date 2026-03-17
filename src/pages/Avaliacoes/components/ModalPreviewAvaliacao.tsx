import { FilePenLine, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Avaliacao, QuestaoAvaliacao } from "../types/avaliacao.types";
import IconeCarregamento from "../../../shared/components/IconeCarregamento";

interface Props {
  avaliacao: Avaliacao | null;
  aberto: boolean;
  carregando?: boolean;
  onClose: () => void;
}

function traduzirDificuldade(dificuldade?: string) {
  if (dificuldade === "easy") return "Fácil";
  if (dificuldade === "medium") return "Média";
  if (dificuldade === "hard") return "Difícil";
  return "Não informada";
}

function getStatement(q: QuestaoAvaliacao) {
  return q.statement || q.question?.statement || "";
}

function getSubject(q: QuestaoAvaliacao) {
  return q.subject || q.question?.subject || "";
}

function getDifficulty(q: QuestaoAvaliacao) {
  return q.difficulty || q.question?.difficulty || "";
}

function getAlternatives(q: QuestaoAvaliacao) {
  if (Array.isArray(q.alternatives) && q.alternatives.length > 0) {
    return q.alternatives;
  }

  if (Array.isArray(q.question?.alternatives) && q.question.alternatives.length > 0) {
    return q.question.alternatives;
  }

  return [];
}

function getAlternativeLetter(index: number) {
  return String.fromCharCode(65 + index);
}

export default function ModalPreviewAvaliacao({
  avaliacao,
  aberto,
  carregando = false,
  onClose,
}: Props) {
  const navigate = useNavigate();

  if (!aberto) return null;

  const dataFormatada = avaliacao?.date
    ? new Date(avaliacao.date).toLocaleDateString("pt-BR")
    : "Sem data";

  const questoesOrdenadas = Array.isArray(avaliacao?.questions)
    ? [...avaliacao.questions].sort((a, b) => {
        const posA = Number(a.position ?? 0);
        const posB = Number(b.position ?? 0);
        return posA - posB;
      })
    : [];

  function handleEditar() {
    if (!avaliacao?.id) return;
    onClose();
    navigate(`/avaliacoes/criar?id=${avaliacao.id}`);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-[#F8FAFC] shadow-2xl">
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {avaliacao?.title || "Prévia da Avaliação"}
            </h2>
            <p className="text-sm text-slate-500">Data: {dataFormatada}</p>
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-5 sm:p-6">
          {carregando ? (
            <div className="flex items-center justify-center py-20">
              <IconeCarregamento w={28} h={28} color="black" />
            </div>
          ) : !avaliacao ? (
            <p className="py-8 text-center text-sm text-slate-400">
              Não foi possível carregar os detalhes da avaliação.
            </p>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-[#DDEDEA] bg-white p-4">
                  <span className="mb-1 block text-xs text-slate-500">Título</span>
                  <strong className="text-sm text-slate-800">
                    {avaliacao.title}
                  </strong>
                </div>

                <div className="rounded-2xl border border-[#DDEDEA] bg-white p-4">
                  <span className="mb-1 block text-xs text-slate-500">
                    Pontuação total
                  </span>
                  <strong className="text-sm text-slate-800">
                    {Number(avaliacao.totalScore ?? 0).toFixed(2)}
                  </strong>
                </div>

                <div className="rounded-2xl border border-[#DDEDEA] bg-white p-4">
                  <span className="mb-1 block text-xs text-slate-500">
                    Questões
                  </span>
                  <strong className="text-sm text-slate-800">
                    {questoesOrdenadas.length}
                  </strong>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-300 bg-white p-5 shadow-sm sm:p-6">
                <h3 className="mb-5 text-xl font-semibold text-slate-800">
                  Folha de prova
                </h3>

                <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="border-b border-slate-400 pb-2 text-sm text-slate-800 sm:text-base">
                    <span className="block text-xs text-slate-500">Professor</span>
                    <strong className="text-sm">{"-"}</strong>
                  </div>
                  <div className="border-b border-slate-400 pb-2 text-sm text-slate-800 sm:text-base">
                    <span className="block text-xs text-slate-500">Aluno</span>
                    <strong className="text-sm">-</strong>
                  </div>
                  <div className="border-b border-slate-400 pb-2 text-sm text-slate-800 sm:text-base">
                    <span className="block text-xs text-slate-500">Data</span>
                    <strong className="text-sm">{dataFormatada}</strong>
                  </div>
                </div>

                {questoesOrdenadas.length > 0 ? (
                  <div className="space-y-4">
                    {questoesOrdenadas.map((q, index) => {
                      const alternativas = getAlternatives(q);

                      return (
                        <div
                          key={`${q.questionId}-${index}`}
                          className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-5 sm:px-5"
                        >
                          <div className="mb-3 flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-base font-medium leading-7 text-slate-900">
                                {q.position ?? index + 1}.{" "}
                                {getStatement(q) || "Enunciado não disponível"}
                              </p>

                              {(getSubject(q) || getDifficulty(q)) && (
                                <div className="mt-3 flex flex-wrap gap-2">
                                  {getSubject(q) ? (
                                    <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs text-slate-600">
                                      {getSubject(q)}
                                    </span>
                                  ) : null}

                                  {getDifficulty(q) ? (
                                    <span className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs text-slate-600">
                                      {traduzirDificuldade(getDifficulty(q))}
                                    </span>
                                  ) : null}
                                </div>
                              )}
                            </div>

                            <span className="shrink-0 rounded-xl border border-slate-400 bg-white px-3 py-1.5 text-sm text-slate-900">
                              peso {Number(q.weight ?? 0).toFixed(2)}
                            </span>
                          </div>

                          {alternativas.length > 0 && (
                            <div className="mt-4 space-y-2">
                              {alternativas.map((alternativa, altIndex) => (
                                <div
                                  key={alternativa.id}
                                  className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5"
                                >
                                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 text-xs font-semibold text-slate-700">
                                    {getAlternativeLetter(altIndex)}
                                  </span>

                                  <p className="text-sm leading-6 text-slate-700">
                                    {alternativa.text}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="py-10 text-center text-slate-400">
                    <p className="text-sm">
                      Nenhuma questão encontrada para esta avaliação.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 bg-white px-5 py-4 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Fechar
          </button>

          <button
            onClick={handleEditar}
            disabled={!avaliacao?.id}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2EC5B6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#27b3a6] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FilePenLine size={16} />
            Editar avaliação
          </button>
        </div>
      </div>
    </div>
  );
}