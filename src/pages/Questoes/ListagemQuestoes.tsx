import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { QuestoesService } from "./services/questoes.service";
import type {
    Questao,
    MetaPaginacao,
    Dificuldade,
    EducationLevelApi,
    VisibilidadeQuestoes,
} from "./types/questoes.types";
import IconeCarregamento from "../../shared/components/IconeCarregamento";
import ListaQuestoes from "../../shared/components/ListaQuestoes";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Plus,
    ArrowLeft,
} from "lucide-react";

const questoesService = new QuestoesService();

type PaginationItem = number | "ellipsis";

function buildPaginationItems(
    currentPage: number,
    totalPages: number,
): PaginationItem[] {
    if (totalPages <= 1) return [];

    const safeCurrent = Math.min(Math.max(1, currentPage), totalPages);

    if (totalPages <= 7) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const startPages = [1, 2, 3];
    const endPages = [totalPages - 2, totalPages - 1, totalPages];

    if (safeCurrent <= 3) {
        return [...startPages, "ellipsis", ...endPages];
    }

    if (safeCurrent >= totalPages - 2) {
        return [...startPages, "ellipsis", ...endPages];
    }

    return [
        1,
        "ellipsis",
        safeCurrent - 1,
        safeCurrent,
        safeCurrent + 1,
        "ellipsis",
        totalPages,
    ];
}

export default function ListagemQuestoes() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // ── Filtros ──
    const [visibilidade, setVisibilidade] = useState<VisibilidadeQuestoes | "">(
        (searchParams.get("visibilidade") as VisibilidadeQuestoes) ?? "",
    );
    const [subject, setSubject] = useState(searchParams.get("subject") ?? "");
    const [educationLevel, setEducationLevel] = useState<EducationLevelApi | "">(
        (searchParams.get("educationLevel") as EducationLevelApi) ?? "",
    );
    const [grade, setGrade] = useState(searchParams.get("grade") ?? "");
    const [difficulty, setDifficulty] = useState<Dificuldade | "">(
        (searchParams.get("difficulty") as Dificuldade) ?? "",
    );
    const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
    const limit = 10;

    // ── Estado ──
    const [questoes, setQuestoes] = useState<Questao[]>([]);
    const [meta, setMeta] = useState<MetaPaginacao | null>(null);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    const paginationItems = useMemo(() => {
        if (!meta) return [];
        return buildPaginationItems(page, meta.totalPages);
    }, [meta, page]);

    // ── Buscar questões ──
    useEffect(() => {
        async function carregarQuestoes() {
            setCarregando(true);
            setErro("");

            try {
                const resposta = await questoesService.listar({
                    visibilidade: visibilidade || undefined,
                    subject: subject || undefined,
                    educationLevel: educationLevel || undefined,
                    grade: grade || undefined,
                    difficulty: difficulty || undefined,
                    page,
                    limit,
                });

                setQuestoes(resposta.data);
                setMeta(resposta.meta);
            } catch (error) {
                console.error(error);
                setErro("Erro ao carregar questões. Tente novamente.");
            } finally {
                setCarregando(false);
            }
        }

        carregarQuestoes();
    }, [visibilidade, subject, educationLevel, grade, difficulty, page]);

    // ── Sincronizar filtros com URL ──
    useEffect(() => {
        const params = new URLSearchParams();
        if (visibilidade) params.set("visibilidade", visibilidade);
        if (subject) params.set("subject", subject);
        if (educationLevel) params.set("educationLevel", educationLevel);
        if (grade) params.set("grade", grade);
        if (difficulty) params.set("difficulty", difficulty);
        if (page > 1) params.set("page", String(page));
        setSearchParams(params, { replace: true });
    }, [visibilidade, subject, educationLevel, grade, difficulty, page, setSearchParams]);

    // ── Handlers de filtro ──
    function handleFiltrar() {
        setPage(1);
    }

    function handleLimparFiltros() {
        setVisibilidade("");
        setSubject("");
        setEducationLevel("");
        setGrade("");
        setDifficulty("");
        setPage(1);
    }

    // ── Render ──
    return (
        <main>
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Voltar"
                        >
                            <ArrowLeft size={22} />
                        </button>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                                Questões
                            </h1>
                            <p className="text-gray-500 text-sm sm:text-base mt-0.5 sm:mt-1">
                                Explore questões públicas ou crie as suas
                                próprias
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <Link
                            to="/questoes/criar"
                            className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-[#2EC5B6] text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors duration-300 self-stretch sm:self-auto"
                        >
                            <Plus size={20} />
                            Nova Questão
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    {/* Filtros (sidebar no desktop) */}
                    <aside className="md:col-span-3">
                        <div className="bg-white p-4 sm:px-4 sm:py-6 rounded-2xl shadow-sm md:sticky md:top-6">
                            <div className="flex flex-col gap-3">
                                <div>
                                    <label className="block text-md font-medium text-gray-700 mb-1">
                                        Visibilidade
                                    </label>
                                    {[
                                        { value: "" as const, label: "Todas as públicas" },
                                        { value: "incluir_minhas" as const, label: "Incluir minhas questões" },
                                        { value: "somente_minhas" as const, label: "Somente minhas questões" },
                                    ].map(({ value, label }) => (
                                        <label
                                            key={value || "todos"}
                                            className="flex items-center gap-2 cursor-pointer py-1"
                                        >
                                            <input
                                                type="radio"
                                                name="visibilidade"
                                                value={value}
                                                checked={visibilidade === value}
                                                onChange={() => {
                                                    setVisibilidade(value);
                                                    handleFiltrar();
                                                }}
                                                className="accent-[#2EC5B6]"
                                            />
                                            <span className="text-md text-gray-700">{label}</span>
                                        </label>
                                    ))}
                                </div>

                                <div>
                                    <label className="block text-md font-medium text-gray-700 mb-1">
                                        Matéria
                                    </label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => {
                                            setSubject(e.target.value);
                                            handleFiltrar();
                                        }}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#2EC5B6] text-md"
                                        placeholder="Ex: matematica"
                                    />
                                </div>

                                <div>
                                    <label className="block text-md font-medium text-gray-700 mb-1">
                                        Nível de ensino
                                    </label>
                                    <select
                                        value={educationLevel}
                                        onChange={(e) => {
                                            setEducationLevel(
                                                e.target.value as EducationLevelApi | "",
                                            );
                                            handleFiltrar();
                                        }}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#2EC5B6] bg-white text-md"
                                    >
                                        <option value="">Todos</option>
                                        <option value="ensino_fundamental">
                                            Ensino Fundamental
                                        </option>
                                        <option value="ensino_medio">Ensino Médio</option>
                                        <option value="ensino_tecnico">Ensino Técnico</option>
                                        <option value="ensino_superior">
                                            Ensino Superior
                                        </option>
                                        <option value="outro">Outro</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-md font-medium text-gray-700 mb-1">
                                        Série/Ano
                                    </label>
                                    <input
                                        type="text"
                                        value={grade}
                                        onChange={(e) => {
                                            setGrade(e.target.value);
                                            handleFiltrar();
                                        }}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#2EC5B6] text-md"
                                        placeholder="Ex: 9"
                                    />
                                </div>

                                <div>
                                    <label className="block text-md font-medium text-gray-700 mb-1">
                                        Dificuldade
                                    </label>
                                    <select
                                        value={difficulty}
                                        onChange={(e) => {
                                            setDifficulty(
                                                e.target.value as Dificuldade | "",
                                            );
                                            handleFiltrar();
                                        }}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#2EC5B6] bg-white text-md"
                                    >
                                        <option value="">Todas</option>
                                        <option value="easy">Fácil</option>
                                        <option value="medium">Médio</option>
                                        <option value="hard">Difícil</option>
                                    </select>
                                </div>

                                <button
                                    onClick={handleLimparFiltros}
                                    className="w-full p-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-50 transition-colors duration-300 cursor-pointer text-md"
                                >
                                    Limpar filtros
                                </button>
                            </div>
                        </div>
                    </aside>

                    {/* Conteúdo */}
                    <section className="md:col-span-9">
                        {carregando ? (
                            <div className="flex justify-center items-center py-20">
                                <IconeCarregamento w={32} h={32} color="black" />
                            </div>
                        ) : erro ? (
                            <div className="bg-red-50 border border-red-300 text-red-700 p-6 rounded-2xl text-center">
                                <p>{erro}</p>
                                <button
                                    onClick={() => setPage(page)}
                                    className="mt-3 text-sm underline cursor-pointer"
                                >
                                    Tentar novamente
                                </button>
                            </div>
                        ) : questoes.length === 0 ? (
                            <div className="text-center py-20 text-gray-400">
                                <Search
                                    size={48}
                                    className="mx-auto mb-4 opacity-50"
                                />
                                <p className="text-lg">
                                    Nenhuma questão encontrada.
                                </p>
                                <p className="text-sm mt-1">
                                    Tente alterar os filtros ou crie uma nova
                                    questão.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Lista */}
                                <ListaQuestoes
                                    variant="link"
                                    questoes={questoes}
                                    privacyBadgeMode="auto"
                                />

                                {/* Paginação */}
                                {meta && meta.totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-4 mt-8">
                                        <button
                                            onClick={() =>
                                                setPage((p) =>
                                                    Math.max(1, p - 1),
                                                )
                                            }
                                            disabled={page <= 1}
                                            className="p-2 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                        >
                                            <ChevronLeft size={20} />
                                        </button>

                                        <div className="flex flex-col items-center gap-2">
                                            <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                                {paginationItems.map((item, idx) =>
                                                    item === "ellipsis" ? (
                                                        <span
                                                            key={`ellipsis-${idx}`}
                                                            className="px-2 text-gray-400 select-none"
                                                            aria-hidden
                                                        >
                                                            ...
                                                        </span>
                                                    ) : (
                                                        <button
                                                            key={item}
                                                            onClick={() =>
                                                                setPage(item)
                                                            }
                                                            disabled={
                                                                item === page
                                                            }
                                                            aria-current={
                                                                item === page
                                                                    ? "page"
                                                                    : undefined
                                                            }
                                                            className={
                                                                item === page
                                                                    ? "min-w-9 h-9 px-3 rounded-xl border border-gray-900 bg-gray-900 text-white text-sm font-semibold cursor-default"
                                                                    : "min-w-9 h-9 px-3 rounded-xl border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                                                            }
                                                        >
                                                            {item}
                                                        </button>
                                                    ),
                                                )}
                                            </div>

                                            <span className="text-sm text-gray-600">
                                                Página{" "}
                                                <span className="font-semibold">
                                                    {meta.page}
                                                </span>{" "}
                                                de{" "}
                                                <span className="font-semibold">
                                                    {meta.totalPages}
                                                </span>{" "}
                                                <span className="text-gray-400">
                                                    ({meta.total} questões)
                                                </span>
                                            </span>
                                        </div>

                                        <button
                                            onClick={() =>
                                                setPage((p) =>
                                                    Math.min(
                                                        meta.totalPages,
                                                        p + 1,
                                                    ),
                                                )
                                            }
                                            disabled={page >= meta.totalPages}
                                            className="p-2 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                        >
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                )}
                            </>
                        )}
                    </section>
                </div>
            </div>
        </main>
    );
}
