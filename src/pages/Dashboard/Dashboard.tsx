import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardService, type Usuario } from "./services/dashboard.service";
import type { Questao, Dificuldade } from "../Questoes/types/questoes.types";
import IconeCarregamento from "../../shared/components/IconeCarregamento";
import { PenLine, Search, ArrowRight } from "lucide-react";

const dashboardService = new DashboardService();

const DIFICULDADE_LABEL: Record<Dificuldade, string> = {
    easy: "Fácil",
    medium: "Médio",
    hard: "Difícil",
};

const DIFICULDADE_COR: Record<Dificuldade, string> = {
    easy: "bg-emerald-50 text-emerald-600",
    medium: "bg-amber-50 text-amber-600",
    hard: "bg-rose-50 text-rose-600",
};

export default function Dashboard() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [questoesRecentes, setQuestoesRecentes] = useState<Questao[]>([]);
    const [carregando, setCarregando] = useState(true);
    const [carregandoQuestoes, setCarregandoQuestoes] = useState(true);

    useEffect(() => {
        async function carregar() {
            try {
                const dados = await dashboardService.obterUsuarioLogado();
                setUsuario(dados);
            } catch {
                navigate("/login", { replace: true });
            } finally {
                setCarregando(false);
            }
        }

        carregar();
    }, [navigate]);

    useEffect(() => {
        async function carregarQuestoes() {
            try {
                const resposta =
                    await dashboardService.obterQuestoesRecentes();
                setQuestoesRecentes(resposta.data);
            } catch {
                // silencia — seção opcional
            } finally {
                setCarregandoQuestoes(false);
            }
        }

        carregarQuestoes();
    }, []);

    if (carregando) {
        return (
            <main className="flex-1 flex items-center justify-center">
                <IconeCarregamento w={32} h={32} color="black" />
            </main>
        );
    }

    return (
        <main className="flex-1">
            <div className="max-w-5xl mx-auto px-3 sm:px-4 py-8 sm:py-14">
                {/* ── Boas-vindas ── */}
                <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-8 sm:mb-10">
                    Olá, {usuario?.name?.split(" ")[0]}! {" "}
                    <span className="block sm:inline text-gray-500 text-lg sm:text-2xl font-medium mt-1 sm:mt-0">
                        Pronto para montar sua próxima prova?
                    </span>
                </h1>

                {/* ── Ações rápidas ── */}
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-12 sm:mb-14">
                    <Link
                        to="/questoes/criar"
                        className="inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-[#2EC5B6] text-white font-semibold rounded-xl shadow-sm hover:shadow-md hover:bg-teal-600 transition-all duration-200"
                    >
                        <PenLine size={18} />
                        Nova Questão
                    </Link>

                    <Link
                        to="/questoes"
                        className="inline-flex items-center justify-center gap-2.5 px-6 py-3 bg-white text-gray-700 font-semibold rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 hover:bg-gray-50 transition-all duration-200"
                    >
                        <Search size={18} />
                        Banco de Questões
                    </Link>
                </div>

                {/* ── Feed de questões recentes ── */}
                <section>
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">
                        Últimas questões da comunidade
                    </h2>

                    {carregandoQuestoes ? (
                        <div className="flex justify-center py-16">
                            <IconeCarregamento w={28} h={28} color="black" />
                        </div>
                    ) : questoesRecentes.length === 0 ? (
                        <p className="text-gray-400 text-sm py-10 text-center">
                            Nenhuma questão publicada ainda.
                        </p>
                    ) : (
                        <>
                            <div className="space-y-3">
                                {questoesRecentes.map((q) => (
                                    <Link
                                        key={q.id}
                                        to={`/questoes/${q.id}`}
                                        className="block bg-white px-4 py-3.5 sm:px-5 sm:py-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200"
                                    >
                                        <p className="text-gray-800 text-sm font-medium line-clamp-1 mb-2">
                                            {q.statement}
                                        </p>

                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-500 font-medium">
                                                {q.subject}
                                            </span>
                                            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-violet-50 text-violet-500 font-medium">
                                                {q.schoolYear}
                                            </span>
                                            <span
                                                className={`text-[11px] px-2.5 py-0.5 rounded-full font-medium ${DIFICULDADE_COR[q.difficulty]}`}
                                            >
                                                {DIFICULDADE_LABEL[q.difficulty]}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Rodapé do feed */}
                            <div className="mt-6 text-center">
                                <Link
                                    to="/questoes"
                                    className="inline-flex items-center gap-1.5 text-sm font-medium text-[#2EC5B6] hover:text-teal-700 transition-colors"
                                >
                                    Ver todas as questões
                                    <ArrowRight size={16} />
                                </Link>
                            </div>
                        </>
                    )}
                </section>
            </div>
        </main>
    );
}
