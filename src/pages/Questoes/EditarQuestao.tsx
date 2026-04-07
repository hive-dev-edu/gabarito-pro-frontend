import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { QuestoesService } from "./services/questoes.service";
import FormularioQuestao from "./components/FormularioQuestao";
import type {
    Questao,
    CriarQuestaoRequisicao,
} from "./types/questoes.types";
import IconeCarregamento from "../../shared/components/IconeCarregamento";
import { ArrowLeft } from "lucide-react";

const questoesService = new QuestoesService();

export default function EditarQuestao() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [questaoOriginal, setQuestaoOriginal] = useState<Questao | null>(
        null,
    );
    const [carregandoInicial, setCarregandoInicial] = useState(true);
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");
    const [erroInicial, setErroInicial] = useState("");

    // ── Carregar questão original ──
    useEffect(() => {
        if (!id) return;

        async function carregar() {
            setCarregandoInicial(true);
            setErroInicial("");
            try {
                const data = await questoesService.buscarPorId(id!);
                setQuestaoOriginal(data);
            } catch (error) {
                if (error instanceof Error) {
                    setErroInicial(error.message);
                } else {
                    setErroInicial("Erro ao carregar questão.");
                }
            } finally {
                setCarregandoInicial(false);
            }
        }

        carregar();
    }, [id]);

    // ── Submeter edição (payload novo, simples) ──
    async function handleEditar(dados: CriarQuestaoRequisicao) {
        if (!id || !questaoOriginal) return;

        setCarregando(true);
        setErro("");

        try {
            await questoesService.atualizar(id, dados);
            navigate(`/questoes/${id}`);
        } catch (error) {
            if (error instanceof Error) {
                setErro(error.message);
            } else {
                setErro("Erro ao atualizar questão.");
            }
        } finally {
            setCarregando(false);
        }
    }

    // ── Loading inicial ──
    if (carregandoInicial) {
        return (
            <main className="flex-1 flex items-center justify-center">
                <IconeCarregamento w={32} h={32} color="black" />
            </main>
        );
    }

    // ── Erro inicial ──
    if (erroInicial || !questaoOriginal) {
        return (
            <main className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-red-600 text-lg mb-4">
                        {erroInicial || "Questão não encontrada."}
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
                        onClick={() => navigate(-1)}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer shrink-0"
                        title="Voltar"
                    >
                        <ArrowLeft size={22} />
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        Editar Questão
                    </h1>
                </div>

                {erro && (
                    <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl mb-6">
                        <p>{erro}</p>
                    </div>
                )}

                <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-sm">
                    <FormularioQuestao
                        valoresIniciais={{
                            statement: questaoOriginal.statement,
                            imageUrl: questaoOriginal.imageUrl,
                            imageSource: questaoOriginal.imageSource,
                            content: questaoOriginal.content,
                            subject: questaoOriginal.subject,
                            educationLevel: questaoOriginal.educationLevel ?? "outro",
                            grade: questaoOriginal.grade,
                            questionType: questaoOriginal.questionType ?? "multiple_choice",
                            difficulty: questaoOriginal.difficulty,
                            isPublic: questaoOriginal.isPublic ?? false,
                            alternatives: questaoOriginal.alternatives.map(
                                (a) => ({
                                    text: a.text,
                                    isCorrect: a.isCorrect ?? false,
                                    imageUrl: a.imageUrl ?? a.image,
                                    imageSource: a.imageSource,
                                }),
                            ),
                        }}
                        onSubmit={handleEditar}
                        textoBotao="Salvar Alterações"
                        carregando={carregando}
                        bloquearTiposEmDesenvolvimento
                    />
                </div>
            </div>
        </main>
    );
}
