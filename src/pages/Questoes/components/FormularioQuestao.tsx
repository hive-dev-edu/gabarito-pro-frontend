import { useState } from "react";
import type {
    AlternativaFormulario,
    CriarQuestaoRequisicao,
    Dificuldade,
    EducationLevelApi,
    QuestionType,
} from "../types/questoes.types";
import IconeCarregamento from "../../../shared/components/IconeCarregamento";
import CampoUploadImagem from "./CampoUploadImagem";
import { Lock, Globe } from "lucide-react";
import { useNavigate } from "react-router-dom";

// ── Props ──

interface FormularioQuestaoProps {
    valoresIniciais?: Partial<
        Pick<
            CriarQuestaoRequisicao,
            | "statement"
            | "imageUrl"
            | "imageSource"
            | "content"
            | "subject"
            | "educationLevel"
            | "grade"
            | "questionType"
            | "difficulty"
            | "isPublic"
            | "alternatives"
        >
    >;
    onSubmit: (dados: CriarQuestaoRequisicao) => Promise<void>;
    textoBotao: string;
    carregando: boolean;
    bloquearTiposEmDesenvolvimento?: boolean;
}

// ── Constantes ──

const ALTERNATIVA_VAZIA: AlternativaFormulario = { text: "", isCorrect: false };

const alternativasPadrao = (): AlternativaFormulario[] =>
    Array.from({ length: 5 }, () => ({ ...ALTERNATIVA_VAZIA }));

const LETRAS = ["A", "B", "C", "D", "E"];
const VF = ["V", "F"];

const EDUCATION_LEVEL_OPTIONS: Array<{ value: EducationLevelApi; label: string }> = [
    { value: "ensino_fundamental", label: "Ensino Fundamental" },
    { value: "ensino_medio", label: "Ensino Médio" },
    { value: "ensino_tecnico", label: "Ensino Técnico" },
    { value: "ensino_superior", label: "Ensino Superior" },
    { value: "outro", label: "Outro" },
];

const QUESTION_TYPE_OPTIONS: Array<{ value: QuestionType; label: string }> = [
    { value: "multiple_choice", label: "Múltipla escolha" },
    { value: "true_false", label: "Verdadeiro/Falso" },
    { value: "essay", label: "Dissertativa" },
];

const MENSAGEM_RECURSO_EM_DESENVOLVIMENTO = "Recurso em desenvolvimento";

function getRequiredAlternativesCount(questionType: QuestionType) {
    if (questionType === "essay") return 0;
    if (questionType === "true_false") return 2;
    return 5;
}

function normalizarAlternativas(
    prev: AlternativaFormulario[],
    requiredAlternativesCount: number,
) {
    if (requiredAlternativesCount === 0) return prev;

    const next = prev.slice(0, requiredAlternativesCount);
    while (next.length < requiredAlternativesCount) {
        next.push({ ...ALTERNATIVA_VAZIA });
    }

    const firstCorrect = next.findIndex((a) => a.isCorrect);
    if (firstCorrect === -1) {
        return next;
    }

    return next.map((alt, i) => ({ ...alt, isCorrect: i === firstCorrect }));
}

// ── Componente ──

export default function FormularioQuestao({
    valoresIniciais,
    onSubmit,
    textoBotao,
    carregando,
    bloquearTiposEmDesenvolvimento = false,
}: FormularioQuestaoProps) {
    const questionTypeInicial: QuestionType =
        valoresIniciais?.questionType ?? "multiple_choice";
    const requiredAlternativesCountInicial = getRequiredAlternativesCount(
        questionTypeInicial,
    );

    const [statement, setStatement] = useState(
        valoresIniciais?.statement ?? "",
    );
    const [imageUrl, setImageUrl] = useState<string | undefined>(
        valoresIniciais?.imageUrl,
    );
    const [imageSource, setImageSource] = useState<string>(
        valoresIniciais?.imageSource ?? "",
    );
    const [content, setContent] = useState(valoresIniciais?.content ?? "");
    const [subject, setSubject] = useState(valoresIniciais?.subject ?? "");
    const [educationLevel, setEducationLevel] = useState<EducationLevelApi>(
        valoresIniciais?.educationLevel ?? "outro",
    );
    const [grade, setGrade] = useState<string>(
        valoresIniciais?.grade !== undefined && valoresIniciais?.grade !== null
            ? String(valoresIniciais.grade)
            : "",
    );
    const [questionType, setQuestionType] = useState<QuestionType>(
        questionTypeInicial,
    );
    const [difficulty, setDifficulty] = useState<Dificuldade>(
        valoresIniciais?.difficulty ?? "easy",
    );
    const [isPublic, setIsPublic] = useState(
        valoresIniciais?.isPublic ?? false,
    );
    const [alternatives, setAlternatives] = useState<AlternativaFormulario[]>(
        () =>
            normalizarAlternativas(
                valoresIniciais?.alternatives ?? alternativasPadrao(),
                requiredAlternativesCountInicial,
            ),
    );

    const navigate = useNavigate()
    
    const [erros, setErros] = useState<string[]>([]);

    const requiredAlternativesCount = getRequiredAlternativesCount(questionType);

    function handleChangeQuestionType(nextType: QuestionType) {
        setQuestionType(nextType);
        setAlternatives((prev) =>
            normalizarAlternativas(prev, getRequiredAlternativesCount(nextType)),
        );
        setErros([]);
    }

    // múltipla escolha: sempre 5 alternativas (A–E)

    // ── Alternar texto da alternativa ──
    function handleAlternativaTexto(index: number, text: string) {
        setAlternatives((prev) =>
            prev.map((alt, i) => (i === index ? { ...alt, text } : alt)),
        );
    }

    // ── Alternar imagem da alternativa ──
    function handleAlternativaImagem(index: number, imageUrl: string | undefined) {
        setAlternatives((prev) =>
            prev.map((alt, i) => {
                if (i !== index) return alt;
                return {
                    ...alt,
                    imageUrl,
                    imageSource: imageUrl ? alt.imageSource : undefined,
                };
            }),
        );
    }

    function handleAlternativaFonte(index: number, imageSource: string) {
        setAlternatives((prev) =>
            prev.map((alt, i) =>
                i === index ? { ...alt, imageSource } : alt,
            ),
        );
    }

    function handleImagemEnunciadoAlterada(url: string | undefined) {
        setImageUrl(url);
        if (!url) {
            setImageSource("");
        }
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

        if (!educationLevel)
            novosErros.push("O nível de educação é obrigatório.");

        const gradeNumber = Number(grade);
        if (!Number.isInteger(gradeNumber) || gradeNumber <= 0) {
            novosErros.push("A série/ano (grade) deve ser um número inteiro maior que 0.");
        }

        if (!questionType) {
            novosErros.push("O tipo de questão é obrigatório.");
        }

        if (imageUrl && !imageSource.trim()) {
            novosErros.push("A fonte da imagem do enunciado é obrigatória quando houver imagem.");
        }

        if (requiredAlternativesCount > 0) {
            if (alternatives.length !== requiredAlternativesCount) {
                novosErros.push(
                    `A questão deve conter exatamente ${requiredAlternativesCount} alternativas.`,
                );
            }

            const alternativasVazias = alternatives.filter((a) => !a.text.trim());
            if (alternativasVazias.length > 0) {
                novosErros.push("Todas as alternativas devem ter texto.");
            }

            const corretas = alternatives.filter((a) => a.isCorrect);
            if (corretas.length !== 1) {
                novosErros.push(
                    "Exatamente 1 alternativa deve ser marcada como correta.",
                );
            }
        }

        setErros(novosErros);
        return novosErros.length === 0;
    }

    // ── Submit ──
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (
            bloquearTiposEmDesenvolvimento &&
            (questionType === "true_false" || questionType === "essay")
        ) {
            setErros([MENSAGEM_RECURSO_EM_DESENVOLVIMENTO]);
            return;
        }

        if (!validar()) return;

        await onSubmit({
            statement,
            imageUrl,
            imageSource: imageUrl ? imageSource.trim() : undefined,
            content,
            subject,
            educationLevel,
            grade: Number(grade),
            questionType,
            difficulty,
            isPublic,
            alternatives: requiredAlternativesCount === 0 ? undefined : alternatives,
        });
    }

    // ── Render ──
    return (
        <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">
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
                <div className="mt-3">
                    <CampoUploadImagem
                        urlImagem={imageUrl}
                        onImagemAlterada={handleImagemEnunciadoAlterada}
                        rotulo="Imagem do enunciado (opcional)"
                        tamanhoPreview="grande"
                    />
                </div>

                {imageUrl && (
                    <div className="mt-3">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fonte da imagem do enunciado
                        </label>
                        <input
                            type="text"
                            value={imageSource}
                            onChange={(e) => setImageSource(e.target.value)}
                            className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6] text-sm sm:text-base"
                            placeholder="Ex: Acervo interno"
                            required
                        />
                        <p className="mt-1.5 text-xs text-gray-500">
                            Obrigatório quando houver imagem no enunciado.
                        </p>
                    </div>
                )}
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
                        Nível de educação
                    </label>
                    <select
                        value={educationLevel}
                        onChange={(e) =>
                            setEducationLevel(e.target.value as EducationLevelApi)
                        }
                        className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6] bg-white text-sm sm:text-base"
                    >
                        {EDUCATION_LEVEL_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Série/Ano (grade)
                    </label>
                    <input
                        type="number"
                        inputMode="numeric"
                        value={grade}
                        onChange={(e) => setGrade(e.target.value)}
                        className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6] text-sm sm:text-base"
                        placeholder="Ex: 6"
                        min={1}
                        step={1}
                    />
                </div>
            </div>

            {/* Tipo + Dificuldade */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de questão
                    </label>
                    <select
                        value={questionType}
                        onChange={(e) =>
                            handleChangeQuestionType(
                                e.target.value as QuestionType,
                            )
                        }
                        className="w-full p-3 sm:p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6] bg-white text-sm sm:text-base"
                    >
                        {QUESTION_TYPE_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
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
            {requiredAlternativesCount === 0 ? (
                <div className="text-sm text-gray-500">
                    Questões dissertativas não exigem alternativas.
                </div>
            ) : (
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                        Alternativas{" "}
                        <span className="text-gray-400 font-normal">
                            (selecione a correta)
                        </span>
                    </label>

                    <div className="space-y-4">
                        {alternatives.map((alt, index) => {
                            const label =
                                questionType === "true_false"
                                    ? VF[index] ?? String(index + 1)
                                    : LETRAS[index] ?? String(index + 1);

                            const placeholder =
                                questionType === "true_false"
                                    ? index === 0
                                        ? "Verdadeiro"
                                        : "Falso"
                                    : `Alternativa ${label}`;

                            return (
                                <div
                                    key={index}
                                    className="p-3 sm:p-4 border border-gray-200 rounded-xl space-y-3"
                                >
                                    <div className="flex items-center gap-2 sm:gap-3">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                handleAlternativaCorreta(index)
                                            }
                                            className={`shrink-0 w-9 h-9 sm:w-10 sm:h-10 rounded-full items-center justify-center font-semibold text-xs sm:text-sm transition-colors duration-200 cursor-pointer ${
                                                alt.isCorrect
                                                    ? "bg-[#2EC5B6] text-white"
                                                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                            }`}
                                        >
                                            {label}
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
                                            placeholder={placeholder}
                                        />
                                    </div>

                                    <CampoUploadImagem
                                        urlImagem={alt.imageUrl ?? alt.image}
                                        onImagemAlterada={(url) =>
                                            handleAlternativaImagem(index, url)
                                        }
                                        rotulo=""
                                        tamanhoPreview="pequeno"
                                    />

                                    {(alt.imageUrl ?? alt.image) && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                                Fonte da imagem da alternativa
                                            </label>
                                            <input
                                                type="text"
                                                value={alt.imageSource ?? ""}
                                                onChange={(e) =>
                                                    handleAlternativaFonte(
                                                        index,
                                                        e.target.value,
                                                    )
                                                }
                                                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6] text-sm sm:text-base"
                                                placeholder="Ex: Acervo interno"
                                            />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Erros globais */}
            {erros.length > 0 && (
                <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl">
                    {erros.length === 1 &&
                    erros[0] === MENSAGEM_RECURSO_EM_DESENVOLVIMENTO ? (
                        <p className="text-sm">
                            {MENSAGEM_RECURSO_EM_DESENVOLVIMENTO}
                        </p>
                    ) : (
                        erros.map((erro, i) => (
                            <p key={i} className="text-sm">
                                • {erro}
                            </p>
                        ))
                    )}
                </div>
            )}

            <span className="w-full flex gap-4">

                {/* Botão Cancelar */}
                <button onClick={() => navigate(-1)} className="w-1/4 py-3.5 sm:py-4 border border-gray-200 text-gray-500 font-semibold rounded-xl cursor-pointer hover:bg-slate-200 transition-colors duration-300 flex items-center justify-center text-sm sm:text-base">
                    Cancelar
                </button>

                {/* Botão submit */}
                <button
                    type="submit"
                    disabled={carregando}
                    className="w-3/4 py-3.5 sm:py-4 bg-[#2EC5B6] text-white font-semibold rounded-xl cursor-pointer hover:bg-teal-600 transition-colors duration-300 disabled:opacity-50 flex items-center justify-center text-sm sm:text-base"
                >
                    {carregando ? (
                        <>
                            <IconeCarregamento /> Salvando...
                        </>
                    ) : (
                        textoBotao
                    )}
                </button>
            </span>
        </form>
    );
}
