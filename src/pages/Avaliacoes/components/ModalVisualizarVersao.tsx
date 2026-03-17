import { X } from "lucide-react";
import type { DadosImpressaoVersao, AssessmentImpressao } from "../types/versao.types";
import IconeCarregamento from "../../../shared/components/IconeCarregamento";

interface Props {
  versao: DadosImpressaoVersao | null;
  assessment?: AssessmentImpressao;
  aberto: boolean;
  carregando?: boolean;
  onClose: () => void;
}

export default function ModalVisualizarVersao({
  versao,
  assessment,
  aberto,
  carregando = false,
  onClose,
}: Props) {
  if (!aberto) return null;

  const dataFormatada = assessment?.date
    ? new Date(assessment.date).toLocaleDateString("pt-BR")
    : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[28px] bg-[#F8FAFC] shadow-2xl">
        {/* Header sticky */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 backdrop-blur">
          <div>
            <h2 className="text-xl font-bold text-slate-800">
              {versao ? `Versão ${versao.versionNumber}` : "Visualizar Versão"}
            </h2>
            <p className="text-sm text-slate-500">
              {assessment?.title ?? (carregando ? "Carregando..." : "—")}
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-5 sm:p-6">
          {carregando ? (
            <div className="flex items-center justify-center py-20">
              <IconeCarregamento w={28} h={28} color="black" />
            </div>
          ) : !versao ? (
            <p className="py-8 text-center text-sm text-slate-400">
              Não foi possível carregar os dados desta versão.
            </p>
          ) : (
            <div className="rounded-3xl border border-slate-300 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="mb-5 text-xl font-semibold text-slate-800">
                Folha de prova — Versão {versao.versionNumber}
              </h3>

              <div className="mb-7 grid grid-cols-1 gap-4 md:grid-cols-2">
                {assessment?.className && (
                  <div className="border-b border-slate-400 pb-2">
                    <span className="block text-xs text-slate-500">Turma</span>
                    <strong className="text-sm text-slate-800">{assessment.className}</strong>
                  </div>
                )}
                <div className="border-b border-slate-400 pb-2">
                  <span className="block text-xs text-slate-500">Data</span>
                  <strong className="text-sm text-slate-800">{dataFormatada}</strong>
                </div>
                {assessment?.totalScore !== undefined && (
                  <div className="border-b border-slate-400 pb-2">
                    <span className="block text-xs text-slate-500">Pontuação total</span>
                    <strong className="text-sm text-slate-800">
                      {Number(assessment.totalScore).toFixed(2)}
                    </strong>
                  </div>
                )}
                <div className="border-b border-slate-400 pb-2">
                  <span className="block text-xs text-slate-500">Aluno</span>
                  <strong className="text-sm text-slate-800">—</strong>
                </div>
              </div>

              {versao.questions.length > 0 ? (
                <div className="space-y-4">
                  {versao.questions.map((q, index) => (
                    <div
                      key={index}
                      className="rounded-3xl border border-slate-300 bg-slate-50 px-4 py-5 sm:px-5"
                    >
                      <p className="text-base font-medium leading-7 text-slate-900">
                        {q.position}. {q.statement || "Enunciado não disponível"}
                      </p>

                      {q.alternatives.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {q.alternatives.map((alt, altIndex) => (
                            <div
                              key={altIndex}
                              className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5"
                            >
                              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-slate-300 text-xs font-semibold text-slate-700">
                                {alt.letter}
                              </span>
                              <p className="text-sm leading-6 text-slate-700">{alt.text}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-10 text-center text-slate-400">
                  <p className="text-sm">Nenhuma questão encontrada para esta versão.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end border-t border-slate-200 bg-white px-5 py-4">
          <button
            onClick={onClose}
            className="rounded-2xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
}
