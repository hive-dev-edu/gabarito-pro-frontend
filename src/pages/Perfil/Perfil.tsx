import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PerfilService, type Usuario } from "./services/perfil.service";
import IconeCarregamento from "../../shared/components/IconeCarregamento";
import { Eye, EyeClosed, ArrowLeft, Check } from "lucide-react";

const perfilService = new PerfilService();

export default function Perfil() {
    const navigate = useNavigate();

    const [usuario, setUsuario] = useState<Usuario | null>(null);
    const [carregando, setCarregando] = useState(true);

    // ── Troca de senha ──
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");

    const [senhaAtualVisivel, setSenhaAtualVisivel] = useState(false);
    const [novaSenhaVisivel, setNovaSenhaVisivel] = useState(false);
    const [confirmarVisivel, setConfirmarVisivel] = useState(false);

    const [erroSenha, setErroSenha] = useState("");
    const [sucessoSenha, setSucessoSenha] = useState("");
    const [salvandoSenha, setSalvandoSenha] = useState(false);

    // ── Carregar dados do usuário ──
    useEffect(() => {
        async function carregar() {
            try {
                const dados = await perfilService.obterUsuarioLogado();
                setUsuario(dados);
            } catch {
                navigate("/login", { replace: true });
            } finally {
                setCarregando(false);
            }
        }

        carregar();
    }, [navigate]);

    // ── Validar e trocar senha ──
    async function handleTrocarSenha(e: React.FormEvent) {
        e.preventDefault();
        setErroSenha("");
        setSucessoSenha("");

        if (!senhaAtual.trim()) {
            setErroSenha("Informe a senha atual.");
            return;
        }

        if (!novaSenha.trim()) {
            setErroSenha("Informe a nova senha.");
            return;
        }

        if (novaSenha.length < 8) {
            setErroSenha("A nova senha deve ter pelo menos 8 caracteres.");
            return;
        }

        if (novaSenha !== confirmarNovaSenha) {
            setErroSenha("As senhas não coincidem.");
            return;
        }

        setSalvandoSenha(true);

        try {
            await perfilService.trocarSenha({
                oldPassword: senhaAtual,
                newPassword: novaSenha,
            });

            setSucessoSenha("Senha alterada com sucesso!");
            setSenhaAtual("");
            setNovaSenha("");
            setConfirmarNovaSenha("");
        } catch (error) {
            if (error instanceof Error) {
                setErroSenha(error.message);
            } else {
                setErroSenha("Erro ao trocar senha.");
            }
        } finally {
            setSalvandoSenha(false);
        }
    }

    // ── Loading ──
    if (carregando) {
        return (
            <main className="flex-1 flex items-center justify-center">
                <IconeCarregamento w={32} h={32} color="black" />
            </main>
        );
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
                        Meu Perfil
                    </h1>
                </div>

                {/* Dados do usuário */}
                <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-sm mb-6 sm:mb-8">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 sm:mb-5">
                        Informações pessoais
                    </h2>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">
                                Nome
                            </label>
                            <p className="text-gray-800 font-medium text-lg">
                                {usuario?.name}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">
                                Email
                            </label>
                            <p className="text-gray-800 font-medium text-lg">
                                {usuario?.email}
                            </p>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">
                                Perfil
                            </label>
                            <p className="text-gray-800 font-medium text-lg">
                                {usuario?.role === "student"
                                    ? "Estudante"
                                    : "Responsável"}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Trocar senha */}
                <div className="bg-white p-4 sm:p-8 rounded-2xl shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4 sm:mb-5">
                        Alterar senha
                    </h2>

                    {/* Mensagens */}
                    {erroSenha && (
                        <div className="bg-red-50 border border-red-300 text-red-700 p-4 rounded-xl mb-5">
                            <p className="text-sm">{erroSenha}</p>
                        </div>
                    )}

                    {sucessoSenha && (
                        <div className="bg-green-50 border border-green-300 text-green-700 p-4 rounded-xl mb-5 flex items-center gap-2">
                            <Check size={16} />
                            <p className="text-sm">{sucessoSenha}</p>
                        </div>
                    )}

                    <form
                        onSubmit={handleTrocarSenha}
                        className="space-y-4 max-w-md"
                    >
                        {/* Senha atual */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Senha atual
                            </label>
                            <div className="relative">
                                <input
                                    type={
                                        senhaAtualVisivel ? "text" : "password"
                                    }
                                    value={senhaAtual}
                                    onChange={(e) =>
                                        setSenhaAtual(e.target.value)
                                    }
                                    className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]"
                                    placeholder="Digite sua senha atual"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setSenhaAtualVisivel((v) => !v)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                                >
                                    {senhaAtualVisivel ? (
                                        <Eye size={20} />
                                    ) : (
                                        <EyeClosed size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Nova senha */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nova senha
                            </label>
                            <div className="relative">
                                <input
                                    type={
                                        novaSenhaVisivel ? "text" : "password"
                                    }
                                    value={novaSenha}
                                    onChange={(e) =>
                                        setNovaSenha(e.target.value)
                                    }
                                    className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]"
                                    placeholder="Mínimo 8 caracteres"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setNovaSenhaVisivel((v) => !v)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                                >
                                    {novaSenhaVisivel ? (
                                        <Eye size={20} />
                                    ) : (
                                        <EyeClosed size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Confirmar nova senha */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirmar nova senha
                            </label>
                            <div className="relative">
                                <input
                                    type={
                                        confirmarVisivel ? "text" : "password"
                                    }
                                    value={confirmarNovaSenha}
                                    onChange={(e) =>
                                        setConfirmarNovaSenha(e.target.value)
                                    }
                                    className="w-full p-4 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]"
                                    placeholder="Repita a nova senha"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setConfirmarVisivel((v) => !v)
                                    }
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                                >
                                    {confirmarVisivel ? (
                                        <Eye size={20} />
                                    ) : (
                                        <EyeClosed size={20} />
                                    )}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={salvandoSenha}
                            className="w-full py-4 bg-[#2EC5B6] text-white font-semibold rounded-xl cursor-pointer hover:bg-teal-600 transition-colors duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {salvandoSenha ? (
                                <>
                                    <IconeCarregamento /> Salvando...
                                </>
                            ) : (
                                "Alterar Senha"
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}
