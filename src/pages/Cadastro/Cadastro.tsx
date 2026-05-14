import { Eye, EyeClosed, LockKeyhole, Mail, User } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CadastroService } from "./services/cadastro.service";
import IconeCarregamento from "../../shared/components/IconeCarregamento";
import ModalCadastro from "./components/ModalCadastro";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

export default function Cadastro() {
    const [senhaVisivel, setSenhaVisivel] = useState(false);

    const [nome, setNome] = useState("");
    const [errorNome, setErrorNome] = useState("");

    const [email, setEmail] = useState("");
    const [errorEmail, setErrorEmail] = useState("");

    const [senha, setSenha] = useState("");
    const [errorSenha, setErrorSenha] = useState("");

    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [errorConfirmarSenha, setErrorConfirmarSenha] = useState("");

    const [carregando, setCarregando] = useState(false);
    const [modalAberto, setModalAberto] = useState(false);

    const cadastroService = new CadastroService();
    const navigate = useNavigate();

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        if (!validarFormulario()) return;

        const formularioCadastro = {
            name: nome,
            email: email,
            password: senha,
        };

        try {
            setCarregando(true);

            await cadastroService.cadastrarUsuario(formularioCadastro);

            // ✅ IMPORTANTE: não limpar o email aqui
            setModalAberto(true);
        } catch (error) {
            console.error(error);

            if (
                error instanceof Error &&
                error.message === "Esse email já está associado a uma conta."
            ) {
                setErrorEmail(error.message);
            } else {
                alert("Erro ao realizar cadastro. Tente novamente.");
            }
        } finally {
            setCarregando(false);
        }
    }

    const loginComGoogle = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async (response) => {
            const verificacaoCode = response.code;

            await cadastroService.cadastrarComGoogle({
                code: verificacaoCode,
            });

            navigate("/dashboard");
        },
        onError: () => {
            console.error("Login com Google falhou");
        },
    });

    function alterarVisibilidadeSenha() {
        setSenhaVisivel(!senhaVisivel);
    }

    function validarFormulario() {
        setErrorNome("");
        setErrorEmail("");
        setErrorSenha("");
        setErrorConfirmarSenha("");

        if (nome.trim() === "") {
            setErrorNome("O campo Nome é obrigatório.");
            return false;
        }

        const nomeRegex = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/;
        if (!nomeRegex.test(nome)) {
            setErrorNome("O campo Nome deve conter apenas letras e espaços.");
            return false;
        }

        if (nome.length < 2) {
            setErrorNome("O nome deve conter pelo menos 2 caracteres.");
            return false;
        }

        if (email.trim() === "") {
            setErrorEmail("O campo Email é obrigatório.");
            return false;
        }

        const emailRegex =
            /^(?!\.)(?!.*\.\.)([A-Za-z0-9_'+.-]*)[A-Za-z0-9_+-]@([A-Za-z0-9][A-Za-z0-9-]*\.)+[A-Za-z]{2,}$/;

        if (!emailRegex.test(email)) {
            setErrorEmail("Por favor, insira um email válido.");
            return false;
        }

        if (senha.trim() === "") {
            setErrorSenha("O campo Senha é obrigatório.");
            return false;
        }

        if (senha.length < 8) {
            setErrorSenha("A senha deve conter pelo menos 8 caracteres.");
            return false;
        }

        if (confirmarSenha.trim() === "") {
            setErrorConfirmarSenha("O campo Confirmar Senha é obrigatório.");
            return false;
        }

        if (senha !== confirmarSenha) {
            setErrorConfirmarSenha("As senhas não coincidem.");
            return false;
        }

        return true;
    }

    return (
        <main className="min-h-screen w-full bg-stone-50 relative flex items-center justify-center px-4 py-10">
            <div className="absolute inset-0 opacity-50 bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-size-[32px_32px]" />

            <div className="relative z-10 w-full flex flex-col items-center">
                <div className="flex items-center gap-3 mb-6">
                <Link
                    to="/dashboard"
                    className="flex items-center gap-2 shrink-0"
                >
                    <img
                        src="/images/logo-gabarito-pro.png"
                        alt="Logo Gabarito Pro"
                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full"
                    />
                    <span className="font-semibold text-lg text-gray-800">
                        Gabarito.pro
                    </span>
                </Link>
                </div>

                <div className="w-full max-w-lg bg-white border border-neutral-200 rounded-2xl shadow-xl px-6 sm:px-10 py-8">
                    <form onSubmit={handleLogin} className="text-neutral-900">
                        <div className="text-center mb-7">
                            <p className="text-[11px] tracking-[0.28em] uppercase text-neutral-500">
                                Criar conta
                            </p>
                            <h1 className="mt-3 text-3xl leading-tight">
                                Bem-vindo(a) ao{" "}
                                <span className="italic text-teal-700">
                                    corpo docente
                                </span>
                                .
                            </h1>
                        </div>

                        {/* NOME */}
                        <label
                            className="block text-sm text-neutral-700 mb-2"
                            htmlFor="nome"
                        >
                            Nome completo
                        </label>
                        <div
                            className={`w-full flex items-center gap-3 rounded-xl border bg-white px-4 py-3.5 transition
                                focus-within:ring-1 focus-within:ring-teal-400
                                ${errorNome ? "border-red-500" : "border-neutral-200"}`}
                        >
                            <User className="w-4.5 h-4.5 text-neutral-400" />
                            <input
                                id="nome"
                                name="nome"
                                type="text"
                                placeholder="Como gostaria de ser chamado(a)?"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                autoComplete="name"
                                className="w-full bg-transparent outline-none text-neutral-900 placeholder:text-neutral-400"
                                required
                            />
                        </div>
                        {errorNome && (
                            <p className="text-red-500 text-sm mt-2">
                                {errorNome}
                            </p>
                        )}

                        {/* EMAIL */}
                        <label
                            className="block text-sm text-neutral-700 mb-2 mt-5"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <div
                            className={`w-full flex items-center gap-3 rounded-xl border bg-white px-4 py-3.5 transition
                                focus-within:ring-1 focus-within:ring-teal-400
                                ${errorEmail ? "border-red-500" : "border-neutral-200"}`}
                        >
                            <Mail className="w-4.5 h-4.5 text-neutral-400" />
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="voce@email.com.br"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                className="w-full bg-transparent outline-none text-neutral-900 placeholder:text-neutral-400"
                                required
                            />
                        </div>
                        {errorEmail && (
                            <p className="text-red-500 text-sm mt-2">
                                {errorEmail}
                            </p>
                        )}

                        {/* SENHA */}
                        <label
                            className="block text-sm text-neutral-700 mb-2 mt-5"
                            htmlFor="senha"
                        >
                            Senha
                        </label>
                        <div
                            className={`w-full flex items-center gap-3 rounded-xl border bg-white px-4 py-3.5 transition
                                focus-within:ring-1 focus-within:ring-teal-400
                                ${errorSenha ? "border-red-500" : "border-neutral-200"}`}
                        >
                            <LockKeyhole className="w-4.5 h-4.5 text-neutral-400" />
                            <input
                                id="senha"
                                name="senha"
                                type={senhaVisivel ? "text" : "password"}
                                placeholder="••••••••"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                autoComplete="new-password"
                                className="w-full bg-transparent outline-none text-neutral-900 placeholder:text-neutral-400"
                            />
                            <button
                                type="button"
                                onClick={alterarVisibilidadeSenha}
                                className="text-neutral-400 hover:text-neutral-600"
                                aria-label={
                                    senhaVisivel ? "Ocultar senha" : "Mostrar senha"
                                }
                            >
                                {senhaVisivel ? (
                                    <Eye size={20} />
                                ) : (
                                    <EyeClosed size={20} />
                                )}
                            </button>
                        </div>
                        {errorSenha && (
                            <p className="text-red-500 text-sm mt-2">
                                {errorSenha}
                            </p>
                        )}

                        {/* CONFIRMAR SENHA */}
                        <label
                            className="block text-sm text-neutral-700 mb-2 mt-5"
                            htmlFor="confirmarSenha"
                        >
                            Confirmar senha
                        </label>
                        <div
                            className={`w-full flex items-center gap-3 rounded-xl border bg-white px-4 py-3.5 transition
                                focus-within:ring-1 focus-within:ring-teal-400
                                ${errorConfirmarSenha ? "border-red-500" : "border-neutral-200"}`}
                        >
                            <LockKeyhole className="w-4.5 h-4.5 text-neutral-400" />
                            <input
                                id="confirmarSenha"
                                name="confirmarSenha"
                                type="password"
                                placeholder="••••••••"
                                value={confirmarSenha}
                                onChange={(e) => setConfirmarSenha(e.target.value)}
                                autoComplete="new-password"
                                className="w-full bg-transparent outline-none text-neutral-900 placeholder:text-neutral-400"
                            />
                        </div>
                        {errorConfirmarSenha && (
                            <p className="text-red-500 text-sm mt-2">
                                {errorConfirmarSenha}
                            </p>
                        )}

                        {/* BOTÃO CRIAR CONTA */}
                        <button
                            type="submit"
                            className={`mt-7 w-full text-white text-base py-3.5 px-4
                                bg-linear-to-r from-[#218f84] via-[#2dd3c3] to-[#2fd3c2] rounded-full
                                hover:from-[#2fd3c2] hover:via-[#2dd3c3] hover:to-[#218f84]
                                transition-colors duration-300 ${carregando ? "cursor-not-allowed" : "cursor-pointer"}
                                flex justify-center items-center gap-3`}
                            disabled={carregando}
                        >
                            {carregando ? (
                                <>
                                    <IconeCarregamento
                                        w={18}
                                        h={18}
                                        color={"white"}
                                    />
                                    <p>Carregando</p>
                                </>
                            ) : (
                                "Criar Conta"
                            )}
                        </button>

                        <div className="my-8">
                            <div className="relative border-b border-neutral-200">
                                <p className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-xs text-neutral-400">
                                    ou
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => loginComGoogle()}
                            disabled={carregando}
                            className="w-full text-neutral-900 text-base py-3.5 px-4
                                flex justify-center items-center gap-3 border border-neutral-200 rounded-full bg-white
                                hover:bg-teal-50 transition-all duration-300 cursor-pointer disabled:opacity-60"
                        >
                            <FcGoogle size={20} />
                            Criar conta com Google
                        </button>

                        <p className="text-sm mt-6 text-center text-neutral-500">
                            Já tem conta?{" "}
                            <Link
                                to="/login"
                                className="text-teal-700 hover:underline"
                            >
                                Fazer login
                            </Link>
                        </p>
                    </form>
                </div>

                {modalAberto && (
                    <ModalCadastro
                        message="Verifique seu email para validar sua conta!"
                        email={email}
                        onClose={() => setModalAberto(false)}
                    />
                )}
            </div>
        </main>
    );
}
