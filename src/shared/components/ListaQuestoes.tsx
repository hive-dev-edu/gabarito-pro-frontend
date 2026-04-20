import { Link } from "react-router-dom";
import { Plus } from "lucide-react";

import type {
    Questao,
    Dificuldade,
    EducationLevelApi,
} from "../../pages/Questoes/types/questoes.types";

const DIFICULDADE_LABEL: Record<Dificuldade, string> = {
    easy: "Fácil",
    medium: "Médio",
    hard: "Difícil",
};

const DIFICULDADE_COR: Record<Dificuldade, string> = {
    easy: "bg-green-100 text-green-700",
    medium: "bg-yellow-100 text-yellow-700",
    hard: "bg-red-100 text-red-700",
};

const EDUCATION_LEVEL_LABEL: Record<EducationLevelApi, string> = {
    ensino_fundamental: "Ensino Fundamental",
    ensino_medio: "Ensino Médio",
    ensino_tecnico: "Ensino Técnico",
    ensino_superior: "Ensino Superior",
    outro: "Outro",
};

type PrivacyBadgeMode = "auto" | "alwaysPrivate" | "hide";

function traduzirDificuldadeAvaliacao(dificuldade?: string) {
    if (dificuldade === "easy") return "Fácil";
    if (dificuldade === "medium") return "Média";
    if (dificuldade === "hard") return "Difícil";
    return "Não informada";
}

type Props =
    | {
          variant: "link";
          questoes: Questao[];
          to?: (questao: Questao) => string;
          privacyBadgeMode?: PrivacyBadgeMode;
      }
    | {
          variant: "select";
          questoes: Questao[];
          onAdd: (questao: Questao) => void;
          selectedIds?: ReadonlySet<string>;
      };

export default function ListaQuestoes(props: Props) {
    if (props.variant === "link") {
        const to = props.to ?? ((q: Questao) => `/questoes/${q.id}`);
        const privacyBadgeMode: PrivacyBadgeMode = props.privacyBadgeMode ?? "auto";

        return (
            <div className="space-y-4">
                {props.questoes.map((questao) => (
                    <Link
                        key={questao.id}
                        to={to(questao)}
                        className="block bg-white p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                                <p className="text-gray-800 font-medium line-clamp-2">
                                    {questao.statement}
                                </p>
                                <div className="flex flex-wrap items-center gap-2 mt-3">
                                    <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                                        {questao.subject}
                                    </span>
                                    <span className="text-xs bg-gray-100 text-gray-700 px-3 py-1 rounded-full">
                                        {questao.educationLevel
                                            ? EDUCATION_LEVEL_LABEL[questao.educationLevel]
                                            : "—"}
                                    </span>
                                    <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                                        {typeof questao.grade === "number" ? `${questao.grade}º` : "—"}
                                    </span>
                                    <span
                                        className={`text-xs px-3 py-1 rounded-full ${
                                            DIFICULDADE_COR[questao.difficulty]
                                        }`}
                                    >
                                        {DIFICULDADE_LABEL[questao.difficulty]}
                                    </span>
                                    <span className="text-xs text-gray-400">{questao.content}</span>
                                </div>
                            </div>

                            {privacyBadgeMode === "hide" ? null : (
                                <span
                                    className={`text-xs px-3 py-1 rounded-full shrink-0 ${
                                        privacyBadgeMode === "alwaysPrivate"
                                            ? "bg-orange-100 text-orange-700"
                                            : questao.isPublic === false
                                              ? "bg-orange-100 text-orange-700"
                                              : "bg-emerald-100 text-emerald-700"
                                    }`}
                                >
                                    {privacyBadgeMode === "alwaysPrivate"
                                        ? "Privada"
                                        : questao.isPublic === false
                                          ? "Privada"
                                          : "Pública"}
                                </span>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        );
    }

    const selectedIds = props.selectedIds;

    return (
        <div className="space-y-3">
            {props.questoes.map((questao) => {
                const jaSelecionada = selectedIds?.has(questao.id) ?? false;

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
                                    {questao.grade ? String(questao.grade) : "Ano não informado"}
                                </span>

                                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-600">
                                    {traduzirDificuldadeAvaliacao(questao.difficulty)}
                                </span>

                                <div>
                                    <button
                                        onClick={() => props.onAdd(questao)}
                                        disabled={jaSelecionada}
                                        className="inline-flex items-center gap-2 rounded-2xl bg-[#2EC5B6] px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-[#27b3a6] cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Plus size={14} />
                                        {jaSelecionada ? "Questão adicionada" : "Adicionar"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
