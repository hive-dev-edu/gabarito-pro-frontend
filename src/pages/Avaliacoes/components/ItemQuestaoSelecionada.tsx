import { Trash2 } from "lucide-react";
import type { Questao } from "../../Questoes/types/questoes.types";

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

interface Props {
  questao: QuestaoSelecionadaLocal;
  atualizarPeso: (id: string, peso: number) => void;
  remover: (id: string) => void;
}

function traduzirDificuldade(dificuldade?: string) {
  if (dificuldade === "easy") return "Fácil";
  if (dificuldade === "medium") return "Média";
  if (dificuldade === "hard") return "Difícil";
  return "Não informada";
}

function getStatement(questao: QuestaoSelecionadaLocal) {
  return questao.statement || questao.question?.statement || "";
}

function getSubject(questao: QuestaoSelecionadaLocal) {
  return questao.subject || questao.question?.subject || "";
}

function getDifficulty(questao: QuestaoSelecionadaLocal) {
  return questao.difficulty || questao.question?.difficulty || "";
}

export default function ItemQuestaoSelecionada({
  questao,
  atualizarPeso,
  remover,
}: Props) {
  return (
    <div className="rounded-2xl border border-[#DDEDEA] bg-white p-2 transition-all hover:border-[#B8EEE8] hover:shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-1 gap-3">
          <div className="mt-0.5">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#F0FDFA] text-xs font-bold text-[#0F766E]">
              {questao.position}
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <h4 className="line-clamp-2 text-xs font-semibold leading-5 text-slate-800 sm:text-sm">
              {getStatement(questao) || "Enunciado não disponível"}
            </h4>

            <div className="mt-2 flex flex-wrap gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {getSubject(questao) || "Sem matéria"}
              </span>

              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                {traduzirDificuldade(getDifficulty(questao))}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => remover(questao.questionId)}
          className="shrink-0 rounded-2xl p-1 text-red-500 transition-colors hover:bg-red-50"
          title="Remover questão"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <span className="text-xs font-medium text-slate-600">Peso da questão</span>

        <input
          type="number"
          min={0.5}
          step={0.5}
          value={questao.weight}
          onChange={(e) =>
            atualizarPeso(questao.questionId, Number(e.target.value))
          }
          className="w-20 rounded-2xl border border-slate-300 px-2 py-1 text-xs font-medium text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]"
        />
      </div>
    </div>
  );
}