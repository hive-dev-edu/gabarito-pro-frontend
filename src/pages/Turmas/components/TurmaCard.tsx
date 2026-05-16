import { BookOpen, GraduationCap, Pencil, Trash2 } from "lucide-react";
import type { Turma } from "../types/turma.types";
import { parseGradeLevel } from "../../../shared/constants/education";

interface TurmaCardProps {
    turma: Turma;
    onEdit: (turma: Turma) => void;
    onDelete: (turma: Turma) => void;
    onViewAssessments: (turma: Turma) => void;
}

export default function TurmaCard({ turma, onEdit, onDelete, onViewAssessments }: TurmaCardProps) {
    const parsed = parseGradeLevel(turma.gradeLevel);

    const ACCENTS = [
        {
            bar: "bg-emerald-400",
            iconBg: "bg-emerald-50",
            iconText: "text-emerald-600",
        },
        {
            bar: "bg-indigo-500",
            iconBg: "bg-indigo-50",
            iconText: "text-indigo-600",
        },
        {
            bar: "bg-amber-400",
            iconBg: "bg-amber-50",
            iconText: "text-amber-600",
        },
        {
            bar: "bg-red-500",
            iconBg: "bg-red-50",
            iconText: "text-red-600",
        },
    ] as const;

    const accentIndex = (() => {
        const key = turma.id ?? turma.name ?? "";
        let hash = 0;
        for (let i = 0; i < key.length; i++) hash = (hash + key.charCodeAt(i)) % 997;
        return hash % ACCENTS.length;
    })();

    const accent = ACCENTS[accentIndex];

    const since = (() => {
        if (!turma.createdAt) return "";
        const date = new Date(turma.createdAt);
        if (Number.isNaN(date.getTime())) return "";
        const formatted = new Intl.DateTimeFormat("pt-BR", {
            day: "2-digit",
            month: "2-digit",
        }).format(date);
        return formatted.replace("/", "-");
    })();

    const educationLabel = (() => {
        if (!parsed.educationLevel) return "";
        if (parsed.educationLevel === "Ensino Médio") return "Médio";

        const match = /^\s*(\d{1,2})/.exec(parsed.grade ?? "");
        const gradeNumber = match ? Number(match[1]) : NaN;

        if (Number.isFinite(gradeNumber)) {
            return gradeNumber >= 6 ? "Fundamental II" : "Fundamental I";
        }
        return "Fundamental";
    })();

    return (
        <article className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
            <div className={`h-1.5 w-full ${accent.bar}`} />

            <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${accent.iconBg}`}>
                        <GraduationCap size={22} className={accent.iconText} />
                    </div>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => onViewAssessments(turma)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors cursor-pointer"
                            title="Ver avaliações"
                            type="button"
                        >
                            <BookOpen size={18} />
                        </button>

                        <button
                            onClick={() => onEdit(turma)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-colors cursor-pointer"
                            title="Editar"
                            type="button"
                        >
                            <Pencil size={18} />
                        </button>

                        <button
                            onClick={() => onDelete(turma)}
                            className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-gray-200 text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Excluir"
                            type="button"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>

                <h3 className="mt-4 text-[15px] font-semibold leading-snug text-gray-900">
                    {turma.name}
                </h3>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                    {!!educationLabel && (
                        <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
                            {educationLabel}
                        </span>
                    )}

                    {!!parsed.grade && (
                        <span className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
                            {parsed.grade}
                        </span>
                    )}
                </div>

                <div className="mt-4 border-t border-dashed border-gray-200" />

                {!!since && (
                    <div className="mt-4 flex items-center justify-end text-sm text-gray-500">
                        desde <span className="ml-1 tabular-nums">{since}</span>
                    </div>
                )}
            </div>
        </article>
    );
}