import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardService, type Usuario } from "./services/dashboard.service";
import IconeCarregamento from "../../shared/components/IconeCarregamento";
import { BookOpen, PlusCircle } from "lucide-react";

const dashboardService = new DashboardService();

export default function Dashboard() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [carregando, setCarregando] = useState(true);

    useEffect(() => {
        async function carregar() {
            try {
                const dados = await dashboardService.obterUsuarioLogado();
                setUsuario(dados);
            } catch {
                // Se falhou (401 etc.), o interceptor já removeu o token
                navigate("/login", { replace: true });
            } finally {
                setCarregando(false);
            }
        }

        carregar();
    }, [navigate]);

    if (carregando) {
        return (
            <main className="flex-1 flex items-center justify-center">
                <IconeCarregamento w={32} h={32} color="black" />
            </main>
        );
    }

    return (
        <main className="flex-1">
            <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
                {/* Saudação */}
                <div className="mb-8 sm:mb-10">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                        Olá, {usuario?.name?.split(" ")[0]}! 👋
                    </h1>
                    <p className="text-gray-500 mt-1 text-sm sm:text-base">
                        Bem-vindo ao Gabarito Pro. O que deseja fazer hoje?
                    </p>
                </div>

                {/* Cards de ação */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {/* Questões */}
                    <Link
                        to="/questoes"
                        className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 group"
                    >
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-200 transition-colors">
                            <BookOpen size={24} className="text-blue-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-1">
                            Explorar Questões
                        </h2>
                        <p className="text-sm text-gray-500">
                            Navegue por questões públicas com filtros por
                            matéria, ano e dificuldade.
                        </p>
                    </Link>

                    {/* Criar questão */}
                    <Link
                        to="/questoes/criar"
                        className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 group"
                    >
                        <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4 group-hover:bg-teal-200 transition-colors">
                            <PlusCircle size={24} className="text-teal-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-1">
                            Criar Questão
                        </h2>
                        <p className="text-sm text-gray-500">
                            Crie uma nova questão com 5 alternativas e
                            compartilhe com a comunidade.
                        </p>
                    </Link>
                </div>
            </div>
        </main>
    );
}
