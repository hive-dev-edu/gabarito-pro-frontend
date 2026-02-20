import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { QuestoesService } from "./services/questoes.service";
import type { Questao, Dificuldade } from "./types/questoes.types";
import IconeCarregamento from "../../shared/components/IconeCarregamento";
import ModalExcluirQuestao from "./components/ModalExcluirQuestao";
import { ArrowLeft, Pencil, Trash2 } from "lucide-react";

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

const LETRAS = ["A", "B", "C", "D", "E"];

export default function DetalheQuestao() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [questao, setQuestao] = useState<Questao | null>(null);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState("");

    const [modalExcluir, setModalExcluir] = useState(false);
    const [excluindo, setExcluindo] = useState(false);

    // ── Obter userId do token (payload JWT) ──
    function obterUserIdDoToken(): string | null {
        const token = localStorage.getItem("accessToken");
        if (!token) return null;
        try {
            const payload = JSON.parse(atob(token.split(".")[1]));
            return payload.sub ?? payload.id ?? null;
        } catch {
            return null;
        }
    }

    const userId = obterUserIdDoToken();
    const ehAutor = !!questao?.authorId && userId === questao.authorId;

    // ── Carregar questão ──
    useEffect(() => {
        if (!id) return;

        async function carregar() {
            setCarregando(true);
            setErro("");
            try {
                const data = await questoesService.buscarPorId(id!);
                setQuestao(data);
            } catch (error) {
                if (error instanceof Error) {
                    setErro(error.message);
                } else {
                    setErro("Erro ao carregar questão.");
                }
            } finally {
                setCarregando(false);
            }
        }

        carregar();
    }, [id]);

    // ── Excluir ──
    async function handleExcluir() {
        if (!id) return;
        setExcluindo(true);
        try {
            await questoesService.excluir(id);
            navigate("/questoes");
        } catch (error) {
            console.error(error);
            alert("Erro ao excluir questão.");
        } finally {
            setExcluindo(false);
            setModalExcluir(false);
        }
    }

    // ── Loading / Erro ──
    if (carregando) {
        return (
            <main className="flex-1 flex items-center justify-center">
                <IconeCarregamento w={32} h={32} color="black" />
            </main>
        );
    }

    if (erro || !questao) {
        return (
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg mb-4">
                        {erro || "Questão não encontrada."}
                    </p>
                    <Link to="/questoes" className="text-[#2EC5B6] underline">
                        Voltar para listagem
                    </Link>
                </div>
            </main>
        );
    }

    // ── Render ──
    return (
        <main>
            <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
                {/* Header */}
                <div className="flex items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Voltar"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        Detalhes da Questão
                    </h1>
                </div>

                {/* Card */}
                <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-sm">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4 mb-6">
                        <div className="flex flex-wrap gap-2">
                            <span className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                                {questao.subject}
                            </span>
                            <span className="text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                                {questao.schoolYear}° ano
                            </span>
                            <span
                                className={`text-xs px-3 py-1 rounded-full ${
                                    DIFICULDADE_COR[questao.difficulty]
                                }`}
                            >
                                {DIFICULDADE_LABEL[questao.difficulty]}
                            </span>
                            {questao.isPublic !== undefined && (
                                <span
                                    className={`text-xs px-3 py-1 rounded-full ${
                                        questao.isPublic
                                            ? "bg-teal-100 text-teal-700"
                                            : "bg-gray-100 text-gray-600"
                                    }`}
                                >
                                    {questao.isPublic ? "Pública" : "Privada"}
                                </span>
                            )}
                        </div>

                        {/* Ações de autor */}
                        {ehAutor && (
                            <div className="flex items-center gap-2 shrink-0">
                                <Link
                                    to={`/questoes/${questao.id}/editar`}
                                    className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
                                    title="Editar"
                                >
                                    <Pencil size={18} />
                                </Link>
                                <button
                                    onClick={() => setModalExcluir(true)}
                                    className="p-2 rounded-xl text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                                    title="Excluir"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Conteúdo / Tema */}
                    <p className="text-sm text-gray-400 mb-2">
                        {questao.content}
                    </p>

                    {/* Enunciado */}
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-6">
                        {questao.statement}
                    </h2>

                    {/* Alternativas */}
                    <div className="space-y-2.5 sm:space-y-3">
                        {questao.alternatives.map((alt, index) => (
                            <div
                                key={alt.id}
                                className={`flex items-start sm:items-center gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl border transition-colors ${
                                    alt.isCorrect
                                        ? "border-[#2EC5B6] bg-teal-50"
                                        : "border-gray-200 bg-white"
                                }`}
                            >
                                <span
                                    className={`shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-semibold ${
                                        alt.isCorrect
                                            ? "bg-[#2EC5B6] text-white"
                                            : "bg-gray-100 text-gray-500"
                                    }`}
                                >
                                    {LETRAS[index]}
                                </span>
                                <span className="text-sm sm:text-base text-gray-700">
                                    {alt.text}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Data */}
                    <p className="text-xs text-gray-400 mt-6">
                        Criada em{" "}
                        {new Date(questao.createdAt).toLocaleDateString(
                            "pt-BR",
                        )}
                    </p>
                </div>
            </div>

            {/* Modal exclusão */}
            {modalExcluir && (
                <ModalExcluirQuestao
                    onConfirmar={handleExcluir}
                    onCancelar={() => setModalExcluir(false)}
                    carregando={excluindo}
                />
            )}
        </main>
    );
}
