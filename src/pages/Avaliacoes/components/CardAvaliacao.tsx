import { useEffect, useState } from "react";
import {
  CalendarDays,
  FileCheck2,
  FileText,
  GraduationCap,
  Layers,
  Trophy,
  Trash2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Avaliacao } from "../types/avaliacao.types";
import AvaliacoesService from "../services/avaliacoes.service";
import { httpClient } from "../../../utils/httpClient";

interface Props {
  avaliacao: Avaliacao;
  onPreview: (id: string) => void;
  onRequestDelete?: (id: string) => void;
  deleting?: boolean;
}

export default function CardAvaliacao({ avaliacao, onPreview, onRequestDelete, deleting = false }: Props) {
  console.debug("[DEBUG] CardAvaliacao props:", avaliacao);
  const navigate = useNavigate();
  const dataFormatada = avaliacao.date
    ? new Date(avaliacao.date).toLocaleDateString("pt-BR")
    : "Sem data";

  const [questionsCount, setQuestionsCount] = useState<number | undefined>(
    avaliacao.questions?.length ?? avaliacao.questionsCount
  );

  const [classNameState, setClassNameState] = useState<string | undefined>(
    avaliacao.className
  );

  const [totalScoreState, setTotalScoreState] = useState<number | undefined>(
    typeof avaliacao.totalScore === "number"
      ? Number(avaliacao.totalScore)
      : Number(avaliacao.totalScore ?? 0)
  );
  const [loadingDetails, setLoadingDetails] = useState<boolean>(false);
  useEffect(() => {
    let mounted = true;

    async function fetchDetailsIfNeeded() {
      const needsQuestions =
        typeof questionsCount !== "number" || questionsCount === 0;

      const needsClassName = !classNameState || !classNameState.trim();

      if (!needsQuestions && !needsClassName && totalScoreState !== undefined) {
        return;
      }

      try {
        setLoadingDetails(true);
        const full = await AvaliacoesService.getById(avaliacao.id);
        // eslint-disable-next-line no-console
        console.debug("[DEBUG] AvaliacoesService.getById result:", full);
        if (!mounted) return;
        setQuestionsCount(full.questions?.length ?? full.questionsCount ?? 0);
        if (full.className && String(full.className).trim()) {
          setClassNameState(full.className);
        }
        setTotalScoreState(Number(full.totalScore ?? 0));
      } catch (err) {
        // eslint-disable-next-line no-console
        console.debug("[DEBUG] erro ao buscar avaliação por id", err);
      } finally {
        if (mounted) setLoadingDetails(false);
      }
    }

    fetchDetailsIfNeeded();

    return () => {
      mounted = false;
    };
  }, [avaliacao.id]);

  useEffect(() => {
    let mounted = true;

    async function fetchClassNameIfNeeded() {
      if (classNameState && classNameState.trim()) return;

      if (avaliacao.className && avaliacao.className.trim()) {
        if (mounted) setClassNameState(avaliacao.className);
        return;
      }

      const classId = (avaliacao as any).classId ?? (avaliacao as any).class_id ?? null;
      if (!classId) return;

      try {
        setLoadingDetails(true);
        const resp = await httpClient.get(`/classes/${classId}`);
        // eslint-disable-next-line no-console
        console.debug("[DEBUG] GET /classes/:id response:", resp?.data, "for classId:", classId);
        if (!mounted) return;
        const name = resp?.data?.name ?? resp?.data?.title ?? resp?.data?.className ?? "";
        if (name && mounted) setClassNameState(name);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.debug("[DEBUG] erro ao buscar turma por id", err);
      } finally {
        if (mounted) setLoadingDetails(false);
      }
    }

    fetchClassNameIfNeeded();

    return () => {
      mounted = false;
    };
  }, [avaliacao.classId, avaliacao.id, classNameState]);


  return (
    <div className="cursor-pointer rounded-3xl border border-[#DDEDEA] bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md sm:p-5" onClick={() => onPreview(avaliacao.id)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1">
          <div className="mb-3 inline-flex items-center rounded-full border border-[#BDEAE4] bg-[#F4FFFD] px-3 py-1 text-xs font-semibold text-[#14877B]">
            Publicada
          </div>

          <h3 className="truncate text-lg font-bold text-slate-800 sm:text-xl">
            {avaliacao.title || "Avaliação sem título"}
          </h3>

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-600 sm:gap-3 sm:text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-2.5 py-1 sm:px-3 sm:py-1.5">
              <CalendarDays size={15} />
              {loadingDetails ? (
                <span className="h-4 w-16 rounded bg-slate-200 animate-pulse" />
              ) : (
                dataFormatada
              )}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-2.5 py-1 sm:px-3 sm:py-1.5">
              <GraduationCap size={15} />
              {loadingDetails ? (
                <span className="h-4 w-36 rounded bg-slate-200 animate-pulse" />
              ) : classNameState && classNameState.trim() ? (
                classNameState
              ) : (
                "Turma não informada"
              )}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-2.5 py-1 sm:px-3 sm:py-1.5">
              <FileText size={15} />
              {loadingDetails ? (
                <span className="h-4 w-20 rounded bg-slate-200 animate-pulse" />
              ) : (
                `${questionsCount ?? avaliacao.questions?.length ?? avaliacao.questionsCount ?? 0} questões`
              )}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF9EC] px-2.5 py-1 text-[#9A6A00] sm:px-3 sm:py-1.5">
              <Trophy size={15} />
              {loadingDetails ? (
                <span className="h-4 w-24 rounded bg-amber-200 animate-pulse" />
              ) : (
                `Total: ${Number(totalScoreState ?? avaliacao.totalScore ?? 0).toFixed(2)}`
              )}
            </span>
          </div>
        </div>

        <div className="flex w-full flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3 lg:w-auto lg:justify-end">

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/avaliacoes/${avaliacao.id}/versoes`);
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#D9E7E4] bg-white px-3 py-3 text-sm text-slate-600 transition hover:bg-[#F4FFFD] hover:text-[#14877B] sm:w-auto sm:px-4 sm:py-4 sm:whitespace-nowrap cursor-pointer"
            title="Gerenciar versões"
          >
            <Layers size={20} />
            Gerenciar Versões
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/correcoes?assessmentId=${avaliacao.id}`);
            }}
            className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-[#D9E7E4] bg-white px-3 py-3 text-sm text-slate-600 transition hover:bg-[#F4FFFD] hover:text-[#14877B] sm:w-auto sm:px-4 sm:py-4 sm:whitespace-nowrap cursor-pointer"
            title="Ver correções desta avaliação"
          >
            <FileCheck2 size={20} />
            Ver Correções
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/avaliacoes/${avaliacao.id}/correcoes`);
            }}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#D9E7E4] bg-white text-slate-600 transition hover:bg-[#F4FFFD] hover:text-[#14877B] sm:h-14 sm:w-14 cursor-pointer"
            title="Correções automáticas"
          >
            <FileCheck2 size={20} />
            <span className="sm:hidden">Correções automáticas</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onRequestDelete?.(avaliacao.id);
            }}
            disabled={deleting}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-[#F3DCD6] bg-white text-red-600 transition hover:bg-[#FFF5F4] disabled:opacity-60 sm:h-14 sm:w-14 cursor-pointer"
            title="Excluir avaliação"
          >
            <Trash2 size={18} className={deleting ? "animate-spin" : undefined} />
            <span className="sm:hidden">Excluir</span>
          </button>
        </div>
      </div>
    </div>
  );
}