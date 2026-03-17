import { CalendarDays, FilePenLine, Pencil, Trash, Trophy } from "lucide-react";
import type { Avaliacao } from "../types/avaliacao.types";

interface Props {
  avaliacao: Avaliacao;
  onEditar: (id: string) => void;
  onRequestDelete?: (id: string) => void;
  deleting?: boolean;
}

export default function CardRascunho({
  avaliacao,
  onEditar,
  onRequestDelete,
  deleting = false,
}: Props) {
  const dataFormatada = avaliacao.date
    ? new Date(avaliacao.date).toLocaleDateString("pt-BR")
    : "Sem data";

  const quantidadeQuestoes = Array.isArray(avaliacao.questions)
    ? avaliacao.questions.length
    : 0;

  return (
    <div className="rounded-3xl border border-[#DDEDEA] bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 inline-flex items-center rounded-full border border-[#F3DFAE] bg-[#FFF8E8] px-3 py-1 text-xs font-semibold text-[#A36A00]">
            Rascunho
          </div>

          <h3 className="truncate text-lg font-bold text-slate-800">
            {avaliacao.title || "Rascunho sem título"}
          </h3>

          <div className="mt-4 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5">
              <CalendarDays size={15} />
              {dataFormatada}
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1.5">
              <FilePenLine size={15} />
              {quantidadeQuestoes} questão(ões)
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-[#FFF9EC] px-3 py-1.5 text-[#9A6A00]">
              <Trophy size={15} />
              Total: {Number(avaliacao.totalScore ?? 0).toFixed(2)}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 gap-2">
          <button
            onClick={() => onEditar(avaliacao.id)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#D9E7E4] bg-white text-slate-600 transition hover:bg-[#F4FFFD] hover:text-[#14877B]"
            title="Continuar editando"
          >
            <Pencil size={17} />
          </button>

          <button
            onClick={() => onRequestDelete?.(avaliacao.id)}
            disabled={deleting}
            className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-[#F6D5D5] bg-white text-red-500 transition hover:bg-red-50 hover:text-red-600 disabled:opacity-60"
            title="Excluir rascunho"
          >
            <Trash size={17} className={deleting ? "animate-spin" : undefined} />
          </button>
        </div>
      </div>
    </div>
  );
}