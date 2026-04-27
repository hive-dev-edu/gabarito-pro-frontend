import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Copy,
  RefreshCcw,
  TriangleAlert,
  XCircle,
} from "lucide-react";

import CorrecoesService from "./services/correcoes.service";
import type { CorrecaoRequest, StatusCorrecao } from "./types/correcao.types";
import IconeCarregamento from "../../shared/components/IconeCarregamento";

type LocationState = {
  assessmentId?: string;
};

type LinhaQuestao = {
  position: number;
  marked?: string;
  correct?: string;
  isCorrect?: boolean;
  status?: string;
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function getFirstValue(record: UnknownRecord, keys: string[]): unknown {
  for (const k of keys) {
    if (k in record) return record[k];
  }
  return undefined;
}

function toUpperLetter(value: unknown): string | undefined {
  if (typeof value === "string") return value.trim().toUpperCase() || undefined;
  if (typeof value === "number") return String(value).toUpperCase();
  return undefined;
}

function badgeClasses(status: StatusCorrecao) {
  switch (status) {
    case "COMPLETED":
      return "border-emerald-200 bg-emerald-50 text-emerald-800";
    case "FAILED":
      return "border-red-200 bg-red-50 text-red-800";
    case "PROCESSING":
      return "border-blue-200 bg-blue-50 text-blue-800";
    default:
      return "border-amber-200 bg-amber-50 text-amber-800";
  }
}

function statusLabel(status: StatusCorrecao) {
  switch (status) {
    case "PENDING":
      return "Pendente";
    case "PROCESSING":
      return "Processando";
    case "COMPLETED":
      return "Concluída";
    case "FAILED":
      return "Falhou";
    default:
      return status;
  }
}

function statusQuestaoLabel(status?: string) {
  const s = String(status ?? "").toUpperCase();
  if (s === "BLANK") return "Em branco";
  if (s === "MULTIPLE_MARKS") return "Múltiplas marcações";
  if (s === "INVALID_ROW") return "Linha inválida";
  return status;
}

function normalizeLinhas(answersDetails: unknown): LinhaQuestao[] {
  const computed = isRecord(answersDetails)
    ? (answersDetails.computed ?? answersDetails.computedAnswers)
    : undefined;

  const raw = isRecord(answersDetails)
    ? (answersDetails.raw ?? answersDetails.rawAnswers)
    : undefined;

  const getRawStatus = (position: number): string | undefined => {
    if (!raw || !isRecord(raw)) return undefined;
    const entry = raw[String(position)];
    if (!isRecord(entry)) return undefined;
    const s = entry["status"];
    return typeof s === "string" ? s : undefined;
  };

  if (!computed) return [];

  const toLinha = (
    raw: unknown,
    fallbackPosition?: number,
    status?: string
  ): LinhaQuestao | null => {
    if (!raw && fallbackPosition === undefined) return null;

    const rec = isRecord(raw) ? raw : undefined;

    const positionCandidate = rec
      ? getFirstValue(rec, ["position", "questionPosition", "numero"])
      : undefined;

    const position = Number(positionCandidate ?? fallbackPosition);
    if (!Number.isFinite(position) || position <= 0) return null;

    const marked = rec
      ? toUpperLetter(
          getFirstValue(rec, ["marked", "markedAnswer", "answer", "given", "final"])
        )
      : undefined;

    const correct = rec
      ? toUpperLetter(
          getFirstValue(rec, [
            "correctLetter",
            "correct",
            "correctAnswer",
            "gabarito",
            "expected",
          ])
        )
      : undefined;

    const isCorrectRaw = rec ? rec["isCorrect"] : undefined;
    const isCorrect =
      typeof isCorrectRaw === "boolean"
        ? isCorrectRaw
        : marked && correct
        ? marked === correct
        : undefined;

    const computedStatus = status ?? (!marked ? "BLANK" : undefined);

    return { position, marked, correct, isCorrect, status: computedStatus };
  };

  if (Array.isArray(computed)) {
    return computed
      .map((c, i) => {
        const position = i + 1;
        return toLinha(c, position, getRawStatus(position));
      })
      .filter((x): x is LinhaQuestao => Boolean(x))
      .sort((a, b) => a.position - b.position);
  }

  if (isRecord(computed)) {
    return Object.entries(computed)
      .map(([key, value]) => {
        const pos = Number(key);
        if (!Number.isFinite(pos) || pos <= 0) return null;

        const status = getRawStatus(pos);

        if (isRecord(value)) return toLinha(value, pos, status);

        return toLinha({ position: pos, marked: value }, pos, status);
      })
      .filter((x): x is LinhaQuestao => Boolean(x))
      .sort((a, b) => a.position - b.position);
  }

  return [];
}

export default function PaginaCorrecaoDetalhe() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as LocationState;

  const [correcao, setCorrecao] = useState<CorrecaoRequest | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string>("");

  const [timedOut, setTimedOut] = useState(false);
  const [pollNonce, setPollNonce] = useState(0);

  const [studentName, setStudentName] = useState<string>("");
  const [savingName, setSavingName] = useState(false);

  const timeoutRef = useRef<number | undefined>(undefined);
  const intervalRef = useRef<number | undefined>(undefined);

  const backHref = state.assessmentId
    ? `/avaliacoes/${state.assessmentId}/correcoes`
    : "/avaliacoes";

  const pararTimers = useCallback(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = undefined;
    }
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
    }
  }, []);

  const buscar = useCallback(async () => {
    if (!id) return;

    try {
      setErro("");
      const data = await CorrecoesService.getById(id);
      setCorrecao(data);

      const result = data.result;
      if (result && isRecord(result)) {
        const atual = result["studentName"];
        if (typeof atual === "string") setStudentName(atual);
      }

      if (data.status === "COMPLETED" || data.status === "FAILED") {
        pararTimers();
      }
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao carregar correção.");
    } finally {
      setCarregando(false);
    }
  }, [id, pararTimers]);

  useEffect(() => {
    if (!id) return;

    let active = true;
    pararTimers();
    setTimedOut(false);
    setCarregando(true);

    const POLL_MS = 4000;
    const TIMEOUT_MS = 120000;

    let inFlight = false;

    const tick = async () => {
      if (!active || inFlight) return;
      inFlight = true;
      try {
        await buscar();
      } finally {
        inFlight = false;
      }
    };

    // define timers primeiro para evitar race com o primeiro fetch
    intervalRef.current = window.setInterval(tick, POLL_MS);
    timeoutRef.current = window.setTimeout(() => {
      if (!active) return;
      setTimedOut(true);
      pararTimers();
    }, TIMEOUT_MS);

    tick();

    return () => {
      active = false;
      pararTimers();
    };
  }, [id, pollNonce, buscar, pararTimers]);

  useEffect(() => {
    return () => {
      pararTimers();
    };
  }, [pararTimers]);

  const linhas = useMemo(() => {
    const result = correcao?.result;
    if (result && isRecord(result) && "answersDetails" in result) {
      return normalizeLinhas(result["answersDetails"]);
    }
    return [];
  }, [correcao?.result]);

  const status = correcao?.status;

  async function handleCopiarId() {
    if (!id) return;
    try {
      await navigator.clipboard.writeText(id);
    } catch {
      // sem alerta; é apenas conveniência
    }
  }

  async function handleSalvarNome() {
    if (!id) return;

    // backend aceita string vazia (para limpar), então não bloqueamos
    const nome = studentName.trim();

    const idsParaTentar: string[] = [];

    const result = correcao?.result;
    if (result && isRecord(result)) {
      const resultId = result["id"]; // correction_results.id (o ID correto para o PATCH)
      const correctionRequestId = result["correctionRequestId"]; // fallback

      if (typeof resultId === "string" && resultId) {
        idsParaTentar.push(resultId);
      }

      // fallback: se a rota estiver sendo acessada pelo requestId, tentamos também
      idsParaTentar.push(id);

      if (typeof correctionRequestId === "string" && correctionRequestId) {
        idsParaTentar.push(correctionRequestId);
      }
    } else {
      idsParaTentar.push(id);
    }

    // remove duplicados mantendo ordem
    const idsUnicos = Array.from(new Set(idsParaTentar));

    try {
      setSavingName(true);
      setErro("");

      let lastError: unknown = undefined;

      for (const tryId of idsUnicos) {
        try {
          await CorrecoesService.atualizarNomeAluno(tryId, nome);
          lastError = undefined;
          break;
        } catch (e) {
          lastError = e;
        }
      }

      if (lastError) throw lastError;

      await buscar();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao salvar nome do aluno.");
    } finally {
      setSavingName(false);
    }
  }

  return (
    <main>
      <div className="mx-auto max-w-5xl px-3 py-6 sm:px-4 sm:py-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate(backHref)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#D9E7E4] bg-white text-slate-600 transition hover:bg-[#F4FFFD] hover:text-[#14877B] cursor-pointer"
              title="Voltar"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                Resultado da Correção
              </h1>
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-slate-500">ID:</span>
                <span className="text-xs font-mono text-slate-700">{id}</span>
                <button
                  onClick={handleCopiarId}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs text-slate-700 hover:bg-slate-50 cursor-pointer"
                  title="Copiar ID"
                >
                  <Copy size={14} />
                  Copiar
                </button>
              </div>
            </div>
          </div>

          <button
            onClick={buscar}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition-colors duration-300 hover:bg-slate-50 cursor-pointer"
            disabled={carregando}
          >
            <RefreshCcw size={18} />
            Atualizar
          </button>
        </div>

        {erro && (
          <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {erro}
          </div>
        )}

        {timedOut && (
          <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <div className="flex items-start gap-2">
              <TriangleAlert size={18} className="mt-0.5" />
              <div>
                <div className="font-semibold">Processamento demorando mais que o esperado</div>
                <div className="mt-1">
                  Você pode recarregar esta tela depois. Se quiser, continue tentando agora.
                </div>
                <button
                  onClick={() => setPollNonce((n) => n + 1)}
                  className="mt-3 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2EC5B6] px-5 py-3 font-semibold text-white transition-colors duration-300 hover:bg-[#27b3a6] cursor-pointer"
                >
                  Continuar tentando
                </button>
              </div>
            </div>
          </div>
        )}

        {carregando && !correcao ? (
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6">
            <IconeCarregamento w={22} h={22} color="black" />
            <span className="text-slate-700">Carregando...</span>
          </div>
        ) : correcao ? (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${badgeClasses(
                      correcao.status
                    )}`}
                  >
                    {statusLabel(correcao.status)}
                  </span>

                  {status === "PENDING" && (
                    <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                      <IconeCarregamento w={16} h={16} color="black" />
                      Na fila, aguardando processamento...
                    </span>
                  )}

                  {status === "PROCESSING" && (
                    <span className="inline-flex items-center gap-2 text-sm text-slate-600">
                      <IconeCarregamento w={16} h={16} color="black" />
                      Processando imagem...
                    </span>
                  )}
                </div>

                {state.assessmentId && (
                  <button
                    onClick={() => navigate(`/avaliacoes/${state.assessmentId}/correcoes`)}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition-colors duration-300 hover:bg-slate-50 cursor-pointer"
                  >
                    Nova correção
                  </button>
                )}
              </div>

              {correcao.status === "FAILED" && (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">
                  <div className="font-semibold">Falha no processamento</div>
                  <div className="mt-1">
                    {correcao.errorMessage || "Ocorreu um erro ao processar a imagem."}
                  </div>
                  <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                    <button
                      onClick={() => navigate(backHref)}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2EC5B6] px-5 py-3 font-semibold text-white transition-colors duration-300 hover:bg-[#27b3a6] cursor-pointer"
                    >
                      Voltar para reenviar
                    </button>
                  </div>
                </div>
              )}

              {correcao.status === "COMPLETED" && correcao.result && (
                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">Pontuação</div>
                    <div className="mt-1 text-2xl font-bold text-slate-800">
                      {String(correcao.result.finalScore)}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">Acertos</div>
                    <div className="mt-1 text-2xl font-bold text-emerald-700">
                      {correcao.result.totalHits}
                    </div>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="text-xs text-slate-500">Erros</div>
                    <div className="mt-1 text-2xl font-bold text-red-700">
                      {correcao.result.totalMisses}
                    </div>
                  </div>
                </div>
              )}

              {correcao.status === "COMPLETED" && (
                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="mb-3 text-sm font-semibold text-slate-800">
                    Nome do aluno
                  </div>
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <input
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]"
                      placeholder="Ex: Maria Silva"
                    />
                    <button
                      onClick={handleSalvarNome}
                      disabled={savingName}
                      className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2EC5B6] px-5 py-3 font-semibold text-white transition-colors duration-300 hover:bg-[#27b3a6] disabled:opacity-60 cursor-pointer"
                    >
                      {savingName ? (
                        <>
                          <IconeCarregamento w={18} h={18} color="white" />
                          Salvando...
                        </>
                      ) : (
                        "Salvar"
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {correcao.status === "COMPLETED" && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-bold text-slate-800">Gabarito por questão</h2>

                {linhas.length === 0 ? (
                  <div className="mt-3 text-sm text-slate-600">
                    Nenhum detalhe por questão foi retornado pelo servidor.
                  </div>
                ) : (
                  <div className="mt-4 overflow-x-auto">
                    <table className="min-w-full text-sm">
                      <thead>
                        <tr className="text-left text-slate-600">
                          <th className="py-2 pr-4">Questão</th>
                          <th className="py-2 pr-4">Marcada</th>
                          <th className="py-2 pr-4">Correta</th>
                          <th className="py-2 pr-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {linhas.map((l) => (
                          <tr key={l.position} className="border-t border-slate-100">
                            <td className="py-3 pr-4 font-semibold text-slate-800">
                              {l.position}
                            </td>
                            <td className="py-3 pr-4 text-slate-700">
                              {l.marked ? (
                                l.marked
                              ) : l.status ? (
                                <span className="text-amber-700">
                                  {statusQuestaoLabel(l.status)}
                                </span>
                              ) : (
                                <span className="text-slate-500">Em branco</span>
                              )}
                            </td>
                            <td className="py-3 pr-4 text-slate-700">
                              {l.correct ?? "—"}
                            </td>
                            <td className="py-3 pr-4">
                              {!l.marked ? (
                                l.status ? (
                                  <span className="inline-flex items-center gap-2 text-amber-700">
                                    <TriangleAlert size={18} />
                                    {statusQuestaoLabel(l.status)}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-2 text-amber-700">
                                    <TriangleAlert size={18} />
                                    Em branco
                                  </span>
                                )
                              ) : l.isCorrect === true ? (
                                <span className="inline-flex items-center gap-2 text-emerald-700">
                                  <CheckCircle2 size={18} />
                                  Correta
                                </span>
                              ) : l.isCorrect === false ? (
                                <span className="inline-flex items-center gap-2 text-red-700">
                                  <XCircle size={18} />
                                  Errada
                                </span>
                              ) : (
                                <span className="text-slate-500">Indefinido</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-700">
            Nenhuma correção encontrada.
          </div>
        )}
      </div>
    </main>
  );
}
