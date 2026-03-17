import { Pencil, Trash2, GraduationCap, Calendar } from "lucide-react";
import type { Turma } from "../types/turma.types";
import { parseGradeLevel } from "../../../shared/constants/education";

interface TurmaCardProps {
    turma: Turma;
    onEdit: (turma: Turma) => void;
    onDelete: (turma: Turma) => void;
}

export default function TurmaCard({ turma, onEdit, onDelete }: TurmaCardProps) {
    const parsed = parseGradeLevel(turma.gradeLevel);

    const educationBadgeClass =
        parsed.educationLevel === "Ensino Médio"
            ? "bg-green-100 text-green-700"
            : "bg-yellow-100 text-yellow-700";

    const createdDate = new Date(turma.createdAt).toLocaleDateString("pt-BR");

    return (
        <div className="relative bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">

            {/* Ações */}
            <div className="absolute top-4 right-4 flex items-center gap-2">
                <button
                    onClick={() => onEdit(turma)}
                    className="p-2 text-gray-500 hover:text-[#2EC5B6] hover:bg-gray-100 rounded-lg transition-colors"
                    title="Editar turma"
                >
                    <Pencil size={18} />
                </button>

                <button
                    onClick={() => onDelete(turma)}
                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Excluir turma"
                >
                    <Trash2 size={18} />
                </button>
            </div>

            {/* Conteúdo */}
            <div className="flex items-start gap-4">
                <div className="bg-[#2EC5B6]/15 p-3 rounded-xl">
                    <GraduationCap size={22} className="text-[#2EC5B6]" />
                </div>

                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {turma.name}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                        Gerencie alunos, avaliações e organização da turma.
                    </p>

                    <div className="flex flex-wrap items-center gap-2 mt-3">

                        {/* Ano */}
                        <span className="bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 rounded-full">
                            {parsed.schoolYear}
                        </span>

                        {/* Escolaridade */}
                        <span
                            className={`${educationBadgeClass} text-xs font-medium px-3 py-1 rounded-full`}
                        >
                            {parsed.educationLevel}
                        </span>

                        {/* Data */}
                        <span className="flex items-center gap-1 text-gray-500 text-xs bg-gray-100 px-3 py-1 rounded-full">
                            <Calendar size={14} />
                            {createdDate}
                        </span>

                    </div>
                </div>
            </div>
        </div >
    );
}