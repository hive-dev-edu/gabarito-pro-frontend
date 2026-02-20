import { useEffect, useState } from "react";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { QuestoesService } from "./services/questoes.service";
import type {
    Questao,
    MetaPaginacao,
    Dificuldade,
} from "./types/questoes.types";
import IconeCarregamento from "../../shared/components/IconeCarregamento";
import {
    Search,
    ChevronLeft,
    ChevronRight,
    Plus,
    ArrowLeft,
} from "lucide-react";

const questoesService = new QuestoesService();

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

export default function ListagemQuestoes() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    // ── Filtros ──
    const [subject, setSubject] = useState(searchParams.get("subject") ?? "");
    const [schoolYear, setSchoolYear] = useState(
        searchParams.get("schoolYear") ?? "",
    );
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

    // ── Buscar questões ──
    useEffect(() => {
        async function carregarQuestoes() {
            setCarregando(true);
            setErro("");

            try {
                const resposta = await questoesService.listar({
                    subject: subject || undefined,
                    schoolYear: schoolYear || undefined,
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
    }, [subject, schoolYear, difficulty, page]);

    // ── Sincronizar filtros com URL ──
    useEffect(() => {
        const params = new URLSearchParams();
        if (subject) params.set("subject", subject);
        if (schoolYear) params.set("schoolYear", schoolYear);
        if (difficulty) params.set("difficulty", difficulty);
        if (page > 1) params.set("page", String(page));
        setSearchParams(params, { replace: true });
    }, [subject, schoolYear, difficulty, page, setSearchParams]);

    // ── Handlers de filtro ──
    function handleFiltrar() {
        setPage(1);
    }

    function handleLimparFiltros() {
        setSubject("");
        setSchoolYear("");
        setDifficulty("");
        setPage(1);
    }

    // ── Render ──
    return (
        <main>
            <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
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

                    <Link
                        to="/questoes/criar"
                        className="flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 sm:py-3 bg-[#2EC5B6] text-white font-semibold rounded-xl hover:bg-teal-600 transition-colors duration-300 self-stretch sm:self-auto"
                    >
                        <Plus size={20} />
                        Nova Questão
                    </Link>
                </div>

                {/* Filtros */}
                <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Matéria
                            </label>
                            <input
                                type="text"
                                value={subject}
                                onChange={(e) => {
                                    setSubject(e.target.value);
                                    handleFiltrar();
                                }}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]"
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
                                onChange={(e) => {
                                    setSchoolYear(e.target.value);
                                    handleFiltrar();
                                }}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]"
                                placeholder="Ex: 9"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
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
                                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6] bg-white"
                            >
                                <option value="">Todas</option>
                                <option value="easy">Fácil</option>
                                <option value="medium">Médio</option>
                                <option value="hard">Difícil</option>
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button
                                onClick={handleLimparFiltros}
                                className="w-full p-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
                            >
                                Limpar filtros
                            </button>
                        </div>
                    </div>
                </div>

                {/* Conteúdo */}
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
                        <Search size={48} className="mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Nenhuma questão encontrada.</p>
                        <p className="text-sm mt-1">
                            Tente alterar os filtros ou crie uma nova questão.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Lista */}
                        <div className="space-y-4">
                            {questoes.map((questao) => (
                                <Link
                                    key={questao.id}
                                    to={`/questoes/${questao.id}`}
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
                                                <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                                                    {questao.schoolYear}° ano
                                                </span>
                                                <span
                                                    className={`text-xs px-3 py-1 rounded-full ${
                                                        DIFICULDADE_COR[
                                                            questao.difficulty
                                                        ]
                                                    }`}
                                                >
                                                    {
                                                        DIFICULDADE_LABEL[
                                                            questao.difficulty
                                                        ]
                                                    }
                                                </span>
                                                <span className="text-xs text-gray-400">
                                                    {questao.content}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Paginação */}
                        {meta && meta.totalPages > 1 && (
                            <div className="flex items-center justify-center gap-4 mt-8">
                                <button
                                    onClick={() =>
                                        setPage((p) => Math.max(1, p - 1))
                                    }
                                    disabled={page <= 1}
                                    className="p-2 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                                >
                                    <ChevronLeft size={20} />
                                </button>

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

                                <button
                                    onClick={() =>
                                        setPage((p) =>
                                            Math.min(meta.totalPages, p + 1),
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
            </div>
        </main>
    );
}
