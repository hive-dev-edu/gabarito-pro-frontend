import { useState } from "react";
import type {
    AlternativaFormulario,
    Dificuldade,
} from "../types/questoes.types";
import IconeCarregamento from "../../../shared/components/IconeCarregamento";
import { Lock, Globe } from "lucide-react";

// ── Props ──

interface FormularioQuestaoProps {
    valoresIniciais?: {
        statement: string;
        content: string;
        subject: string;
        schoolYear: string;
        difficulty: Dificuldade;
        isPublic: boolean;
        alternatives: AlternativaFormulario[];
    };
    onSubmit: (dados: {
        statement: string;
        content: string;
        subject: string;
        schoolYear: string;
        difficulty: Dificuldade;
        isPublic: boolean;
        alternatives: AlternativaFormulario[];
    }) => Promise<void>;
    textoBotao: string;
    carregando: boolean;
}

// ── Constantes ──

const ALTERNATIVA_VAZIA: AlternativaFormulario = { text: "", isCorrect: false };

const alternativasPadrao = (): AlternativaFormulario[] =>
    Array.from({ length: 5 }, () => ({ ...ALTERNATIVA_VAZIA }));

const LETRAS = ["A", "B", "C", "D", "E"];

// ── Componente ──

export default function FormularioQuestao({
    valoresIniciais,
    onSubmit,
    textoBotao,
    carregando,
}: FormularioQuestaoProps) {
    const [statement, setStatement] = useState(
        valoresIniciais?.statement ?? "",
    );
    const [content, setContent] = useState(valoresIniciais?.content ?? "");
    const [subject, setSubject] = useState(valoresIniciais?.subject ?? "");
    const [schoolYear, setSchoolYear] = useState(
        valoresIniciais?.schoolYear ?? "",
    );
    const [difficulty, setDifficulty] = useState<Dificuldade>(
        valoresIniciais?.difficulty ?? "easy",
    );
    const [isPublic, setIsPublic] = useState(
        valoresIniciais?.isPublic ?? false,
    );
    const [alternatives, setAlternatives] = useState<AlternativaFormulario[]>(
        valoresIniciais?.alternatives ?? alternativasPadrao(),
    );

    const [erros, setErros] = useState<string[]>([]);

    // ── Alternar texto da alternativa ──
    function handleAlternativaTexto(index: number, text: string) {
        setAlternatives((prev) =>
            prev.map((alt, i) => (i === index ? { ...alt, text } : alt)),
        );
    }

    // ── Alternar correta ──
    function handleAlternativaCorreta(index: number) {
        setAlternatives((prev) =>
            prev.map((alt, i) => ({ ...alt, isCorrect: i === index })),
        );
    }

    // ── Validação ──
    function validar(): boolean {
        const novosErros: string[] = [];

        if (!statement.trim()) novosErros.push("O enunciado é obrigatório.");
        if (!content.trim()) novosErros.push("O conteúdo é obrigatório.");
        if (!subject.trim()) novosErros.push("A matéria é obrigatória.");
        if (!schoolYear.trim()) novosErros.push("O ano escolar é obrigatório.");

        const alternativasVazias = alternatives.filter((a) => !a.text.trim());
        if (alternativasVazias.length > 0) {
            novosErros.push("Todas as 5 alternativas devem ter texto.");
        }

        const corretas = alternatives.filter((a) => a.isCorrect);
        if (corretas.length !== 1) {
            novosErros.push(
                "Exatamente 1 alternativa deve ser marcada como correta.",
            );
        }

        setErros(novosErros);
        return novosErros.length === 0;
    }

    // ── Submit ──
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!validar()) return;

        await onSubmit({
            statement,
            content,
            subject,
            schoolYear,
            difficulty,
            isPublic,
            alternatives,
        });
    }

    // ── Render ──
    return (
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
            {/* Erros globais */}
            {erros.length > 0 && (
                <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl">
                    {erros.map((erro, i) => (
                        <p key={i} className="text-sm">
                            • {erro}
                        </p>
                    ))}
                </div>
            )}

            {/* Enunciado */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Enunciado
                </label>
                <textarea
                    value={statement}
                    onChange={(e) => setStatement(e.target.value)}
                    rows={4}
                    className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6] resize-none text-sm sm:text-base"
                    placeholder="Digite o enunciado da questão..."
                />
            </div>

            {/* Conteúdo / Tema */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Conteúdo / Tema
                </label>
                <input
                    type="text"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6] text-sm sm:text-base"
                    placeholder="Ex: Geografia do Brasil"
                />
            </div>

            {/* Matéria + Ano + Dificuldade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Matéria
                    </label>
                    <input
                        type="text"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value)}
                        className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6] text-sm sm:text-base"
                        placeholder="Ex: matematica"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ano Escolar
                    </label>
                    <input
                        type="text"
                        value={schoolYear}
                        onChange={(e) => setSchoolYear(e.target.value)}
                        className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6] text-sm sm:text-base"
                        placeholder="Ex: 9"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Dificuldade
                    </label>
                    <select
                        value={difficulty}
                        onChange={(e) =>
                            setDifficulty(e.target.value as Dificuldade)
                        }
                        className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6] bg-white text-sm sm:text-base"
                    >
                        <option value="easy">Fácil</option>
                        <option value="medium">Médio</option>
                        <option value="hard">Difícil</option>
                    </select>
                </div>
            </div>

            {/* Visibilidade */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visibilidade
                </label>
                <div className="inline-flex rounded-xl border border-gray-300 overflow-hidden">
                    <button
                        type="button"
                        onClick={() => setIsPublic(false)}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                            !isPublic
                                ? "bg-gray-200 text-gray-900 border-r border-gray-300"
                                : "bg-white text-gray-500 border-r border-gray-300 hover:bg-gray-50"
                        }`}
                    >
                        <Lock size={16} />
                        Privada
                    </button>
                    <button
                        type="button"
                        onClick={() => setIsPublic(true)}
                        className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors duration-200 cursor-pointer ${
                            isPublic
                                ? "bg-[#2EC5B6] text-white"
                                : "bg-white text-gray-500 hover:bg-gray-50"
                        }`}
                    >
                        <Globe size={16} />
                        Pública
                    </button>
                </div>
                <p className="mt-1.5 text-sm text-gray-500">
                    Questões públicas podem ser encontradas e usadas por outros
                    professores da comunidade.
                </p>
            </div>

            {/* Alternativas */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                    Alternativas{" "}
                    <span className="text-gray-400 font-normal">
                        (selecione a correta)
                    </span>
                </label>

                <div className="space-y-2.5 sm:space-y-3">
                    {alternatives.map((alt, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-2 sm:gap-3"
                        >
                            <button
                                type="button"
                                onClick={() => handleAlternativaCorreta(index)}
                                className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full items-center justify-center font-semibold text-xs sm:text-sm transition-colors duration-200 cursor-pointer ${
                                    alt.isCorrect
                                        ? "bg-[#2EC5B6] text-white"
                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                }`}
                            >
                                {LETRAS[index]}
                            </button>

                            <input
                                type="text"
                                value={alt.text}
                                onChange={(e) =>
                                    handleAlternativaTexto(
                                        index,
                                        e.target.value,
                                    )
                                }
                                className="flex-1 min-w-0 p-2.5 sm:p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6] text-sm sm:text-base"
                                placeholder={`Alternativa ${LETRAS[index]}`}
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Botão submit */}
            <button
                type="submit"
                disabled={carregando}
                className="w-full py-3.5 sm:py-4 bg-[#2EC5B6] text-white font-semibold rounded-xl cursor-pointer hover:bg-teal-600 transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
                {carregando ? (
                    <>
                        <IconeCarregamento /> Salvando...
                    </>
                ) : (
                    textoBotao
                )}
            </button>
        </form>
    );
}
