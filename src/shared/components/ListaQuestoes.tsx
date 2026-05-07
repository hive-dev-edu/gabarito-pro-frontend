import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";

import type {
    Questao,
    Dificuldade,
    EducationLevelApi,
    Alternativa,
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

const LETRAS = ["A", "B", "C", "D", "E"]; // usado no Detalhe da Questão

function obterImagemEnunciado(questao: Questao): string | undefined {
    return (
        questao.imageUrl ??
        (questao as Questao & { statementImage?: string }).statementImage
    );
}

function obterImagemAlternativa(alt: Alternativa): string | undefined {
    return alt.imageUrl ?? alt.image;
}

function obterRotuloAlternativa(index: number): string {
    return LETRAS[index] ?? String(index + 1);
}

function QuestaoCompleta({ questao }: { questao: Questao }) {
    const imagemEnunciado = obterImagemEnunciado(questao);

    const [alternativaSelecionadaId, setAlternativaSelecionadaId] =
        useState<string | null>(null);

    const alternativasComKey = useMemo(() => {
        return (questao.alternatives ?? []).map((alt, index) => {
            const key = alt.id ?? `${questao.id}-${index}`;
            return { alt, index, key };
        });
    }, [questao.alternatives, questao.id]);

    return (
        <div>
            {/* Conteúdo / Tema */}
            {questao.content ? (
                <p className="text-sm text-gray-400 mb-2 whitespace-pre-wrap wrap-break-word">
                    {questao.content}
                </p>
            ) : null}

            {/* Enunciado */}
            <h2 className="text-md text-gray-800 mb-4 whitespace-pre-wrap wrap-break-word">
                {questao.statement}
            </h2>

            {/* Imagem do enunciado */}
            {imagemEnunciado ? (
                <div className="mb-6">
                    <img
                        src={imagemEnunciado}
                        alt="Imagem do enunciado"
                        className="max-w-4/5 lg:max-w-2/5 h-auto rounded-xl border border-gray-200"
                    />
                </div>
            ) : null}

            {/* Alternativas */}
            {alternativasComKey.length ? (
                <div className="space-y-2">
                    {alternativasComKey.map(({ alt, index, key }) => {
                        const imagemAlternativa = obterImagemAlternativa(alt);
                        const rotulo = obterRotuloAlternativa(index);

                        const jaRespondeu = alternativaSelecionadaId !== null;
                        const estaSelecionada = alternativaSelecionadaId === key;
                        const ehCorreta = alt.isCorrect === true;

                        const destaqueAlternativa = !jaRespondeu
                            ? "border-gray-200 bg-white hover:bg-gray-50"
                            : ehCorreta
                              ? "border-green-300 bg-green-50"
                              : estaSelecionada
                                ? "border-red-300 bg-red-50"
                                : "border-gray-200 bg-white";

                        const destaqueRotulo = !jaRespondeu
                            ? "bg-gray-100 text-gray-500"
                            : ehCorreta
                              ? "bg-green-100 text-green-700"
                              : estaSelecionada
                                ? "bg-red-100 text-red-700"
                                : "bg-gray-100 text-gray-500";

                        return (
                            <div
                                key={key}
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();

                                    if (alternativaSelecionadaId !== null) return;

                                    setAlternativaSelecionadaId(key);
                                }}
                                onKeyDown={(e) => {
                                    if (e.key !== "Enter" && e.key !== " ") return;
                                    e.preventDefault();
                                    e.stopPropagation();

                                    if (alternativaSelecionadaId !== null) return;
                                    setAlternativaSelecionadaId(key);
                                }}
                                className={`w-full text-left p-2 rounded-xl border transition-colors ${
                                    jaRespondeu ? "cursor-default" : "cursor-pointer"
                                } ${destaqueAlternativa}`}
                                role="button"
                                tabIndex={0}
                                aria-pressed={estaSelecionada}
                                aria-disabled={jaRespondeu}
                            >
                                <div className="flex items-start sm:items-center gap-2.5 sm:gap-3">
                                    <span
                                        className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${destaqueRotulo}`}
                                    >
                                        {rotulo}
                                    </span>
                                    <span className="text-sm sm:text-base text-gray-700">
                                        {alt.text}
                                    </span>
                                </div>

                                {imagemAlternativa ? (
                                    <div className="mt-3 ml-10">
                                        <img
                                            src={imagemAlternativa}
                                            alt={`Imagem da alternativa ${rotulo}`}
                                            className="max-w-3/5 lg:max-w-1/5 h-auto rounded-lg border border-gray-200"
                                        />
                                        {alt.imageSource ? (
                                            <p className="text-xs text-gray-500 mt-1.5">
                                                Fonte: {alt.imageSource}
                                            </p>
                                        ) : null}
                                    </div>
                                ) : null}
                            </div>
                        );
                    })}
                </div>
            ) : null}
        </div>
    );
}

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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {props.questoes.map((questao) => (
                    <Link
                        key={questao.id}
                        to={to(questao)}
                        className="block bg-white p-4 sm:p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-wrap items-center gap-2 mt-1 mb-4 flex-1 min-w-0">
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

                        <QuestaoCompleta questao={questao} />
                    </Link>
                ))}
            </div>
        );
    }

    const selectedIds = props.selectedIds;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {props.questoes.map((questao) => {
                const jaSelecionada = selectedIds?.has(questao.id) ?? false;

                return (
                    <div
                        key={questao.id}
                        className="rounded-3xl border border-[#DDEDEA] bg-[#FCFEFF] p-4"
                    >
                        <div className="flex flex-col gap-3">
                            <QuestaoCompleta questao={questao} />

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
