import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { QuestoesService } from "./services/questoes.service";
import FormularioQuestao from "./components/FormularioQuestao";
import type {
    AlternativaFormulario,
    Dificuldade,
} from "./types/questoes.types";
import { ArrowLeft } from "lucide-react";

const questoesService = new QuestoesService();

export default function CriarQuestao() {
    const navigate = useNavigate();
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    async function handleCriar(dados: {
        statement: string;
        content: string;
        subject: string;
        schoolYear: string;
        difficulty: Dificuldade;
        isPublic: boolean;
        alternatives: AlternativaFormulario[];
    }) {
        setCarregando(true);
        setErro("");

        try {
            const questao = await questoesService.criar(dados);
            navigate(`/questoes/${questao.id}`);
        } catch (error) {
            if (error instanceof Error) {
                setErro(error.message);
            } else {
                setErro("Erro ao criar questão.");
            }
        } finally {
            setCarregando(false);
        }
    }

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
                        Nova Questão
                    </h1>
                </div>

                {erro && (
                    <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl mb-6">
                        <p>{erro}</p>
                    </div>
                )}

                <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-sm">
                    <FormularioQuestao
                        onSubmit={handleCriar}
                        textoBotao="Criar Questão"
                        carregando={carregando}
                    />
                </div>
            </div>
        </main>
    );
}
