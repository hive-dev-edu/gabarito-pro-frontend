import { Eye, EyeClosed, LockKeyhole, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { LoginService } from "./services/login.service";
import IconeCarregamento from "../../shared/components/IconeCarregamento";
import { useGoogleLogin } from "@react-oauth/google";

export default function Login() {
    const [senhaVisivel, setSenhaVisivel] = useState(false);

    const quotes = [
        {
            lines: [
                '"Ensinar não é transferir',
                "conhecimento, mas criar as",
                "possibilidades para sua",
                ' produção."',
            ],
            author: "Paulo Freire",
        },
        {
            lines: [
                '"Não há ensino sem pesquisa',
                'e pesquisa sem ensino."',
            ],
            author: "Paulo Freire",
        },
        {
            lines: [
                '"Educar é semear com sabedoria e', 
                'colher com paciência."'
            ],
            author: "Augusto Cury"
        }
    ];

    const [quoteIndex, setQuoteIndex] = useState(0);

    useEffect(() => {
        const intervalId = window.setInterval(() => {
            setQuoteIndex((prev) => (prev + 1) % quotes.length);
        }, 6500);

        return () => window.clearInterval(intervalId);
    }, [quotes.length]);

    const [email, setEmail] = useState("");
    const [errorEmail, setErrorEmail] = useState("");

    const [senha, setSenha] = useState("");
    const [errorSenha, setErrorSenha] = useState("");

    const [errorLogin, setErrorLogin] = useState(false);

    const [carregando, setCarregando] = useState(false);
    const [carregandoGoogle, setCarregandoGoogle] = useState(false);

    const navigate = useNavigate();
    const loginService = new LoginService();

    function validarFormulario() {
        setErrorEmail("");
        setErrorSenha("");

        // Email
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

        // Senha
        if (senha.trim() === "") {
            setErrorSenha("O campo Senha é obrigatório.");
            return false;
        }

        if (senha.length < 8) {
            setErrorSenha("A senha está incorreta.");
            return false;
        }

        return true;
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();
        setErrorLogin(false);
        setCarregando(true);

        if (!validarFormulario()) {
            setCarregando(false);
            return;
        }

        try {
            const respostaLogin = await loginService.login({
                email,
                password: senha,
            });

            // ❌ Login incorreto
            if (respostaLogin === false) {
                setErrorLogin(true);
                return; // NÃO limpa email e senha
            }
        } catch (error) {
            console.error(error);
            setErrorLogin(true);
            return;
        } finally {
            setCarregando(false);
        }

        // ✅ Login correto
        setEmail("");
        setSenha("");
        setErrorLogin(false);
        setCarregando(false);

        navigate("/dashboard");
    }

    const loginComGoogle = useGoogleLogin({
        flow: "auth-code",
        onSuccess: async (response) => {
            const verificacaoCode = response.code;

            try {
                await loginService.loginComGoogle({
                    code: verificacaoCode,
                });

                navigate("/dashboard");
            } finally {
                setCarregandoGoogle(false);
            }
        },
        onError: () => {
            console.error("Login com Google falhou");
            setCarregandoGoogle(false);
        },
    });

    function alterarVisibilidadeSenha() {
        setSenhaVisivel((prev) => !prev);
    }

    return (
        <main className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
            {/* Painel esquerdo (branding) */}
            <section className="hidden lg:flex relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-teal-700 via-teal-800 to-slate-900" />
                <div className="absolute inset-0 opacity-60 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-size-[22px_22px]" />
                <div className="relative z-10 w-full px-12 py-10 flex flex-col">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-2 shrink-0"
                        >
                            <img
                                src="/images/logo-gabarito-pro.png"
                                alt="Logo Gabarito Pro"
                                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full"
                            />
                            <span className="font-semibold text-lg text-white/90">
                                Gabarito.pro
                            </span>
                        </Link>
                    </div>

                    <div className="flex-1 flex flex-col justify-center">
                        <p className="text-white/60 text-xs tracking-[0.28em] uppercase mb-6">
                            Aprender junto é aprender melhor
                        </p>

                        <div key={quoteIndex} className="animate-fadeIn">
                            <blockquote className="text-white/90 text-4xl leading-tight italic max-w-xl">
                                {quotes[quoteIndex].lines.map((line) => (
                                    <span key={line} className="relative inline-block">
                                        <span className="relative z-10">{line}</span>
                                        <span className="absolute left-0 right-0 bottom-1 h-2.5 bg-amber-400/60" />
                                        <br />
                                    </span>
                                ))}
                            </blockquote>

                            <p className="text-white/60 mt-6 text-sm">
                                — {quotes[quoteIndex].author}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 mt-8">
                            {quotes.map((_, idx) => (
                                <span
                                    key={idx}
                                    className={
                                        idx === quoteIndex
                                            ? "w-6 h-1 rounded-full bg-amber-400"
                                            : "w-2 h-1 rounded-full bg-white/25"
                                    }
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Painel direito (formulário) */}
            <section className="bg-stone-50 flex items-center justify-center px-4 py-10">
                <form
                    onSubmit={handleLogin}
                    className="w-full max-w-md"
                >
                    <div className="text-center mb-8">
                        <p className="text-[11px] tracking-[0.28em] uppercase text-neutral-500">
                            Bem-vinda de volta
                        </p>
                        <h1 className="mt-3 text-4xl leading-tight text-neutral-900">
                            Entre na sua{" "}
                            <span className="italic text-teal-700">
                                sala dos professores
                            </span>
                            .
                        </h1>
                    </div>

                    {/* EMAIL */}
                    <label className="block text-sm text-neutral-700 mb-2" htmlFor="email">
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
                            placeholder="ana.ferreira@email.com.br"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoComplete="email"
                            className="w-full bg-transparent outline-none text-neutral-900 placeholder:text-neutral-400"
                        />
                    </div>

                    {errorEmail && (
                        <p className="text-red-500 text-sm mt-2">{errorEmail}</p>
                    )}

                    {/* SENHA */}
                    <div className="flex items-center justify-between mt-5 mb-2">
                        <label className="block text-sm text-neutral-700" htmlFor="senha">
                            Senha
                        </label>
                        <Link
                            to="/esqueceu-senha"
                            className="text-sm text-teal-700 hover:underline"
                        >
                            Esqueceu a senha?
                        </Link>
                    </div>

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
                            autoComplete="current-password"
                            className="w-full bg-transparent outline-none text-neutral-900 placeholder:text-neutral-400"
                        />

                        <button
                            type="button"
                            onClick={alterarVisibilidadeSenha}
                            className="text-neutral-400 hover:text-neutral-600"
                            aria-label={senhaVisivel ? "Ocultar senha" : "Mostrar senha"}
                        >
                            {senhaVisivel ? (
                                <Eye size={20} />
                            ) : (
                                <EyeClosed size={20} />
                            )}
                        </button>
                    </div>

                    {errorSenha && (
                        <p className="text-red-500 text-sm mt-2">{errorSenha}</p>
                    )}

                    {/* BOTÃO LOGIN */}
                    <button
                        type="submit"
                        className={`mt-6 w-full text-white text-base py-3.5 px-4
                            bg-linear-to-r from-[#218f84] via-[#2dd3c3] to-[#2fd3c2] rounded-full
                            hover:from-[#2fd3c2] hover:via-[#2dd3c3] hover:to-[#218f84]
                            transition-colors duration-300 ${carregando ? "cursor-not-allowed" : "cursor-pointer"}
                            flex justify-center items-center gap-3`}
                        disabled={carregando}
                    >
                        {carregando ? (
                            <>
                                <IconeCarregamento w={18} h={18} color={"white"} />
                                <p>Carregando</p>
                            </>
                        ) : (
                            "Fazer Login"
                        )}
                    </button>

                    {/* ERRO LOGIN */}
                    {errorLogin && (
                        <p className="text-red-500 text-sm mt-4 text-center">
                            Falha no login. Verifique seu email e senha.
                        </p>
                    )}

                    <div className="my-8">
                        <div className="relative border-b border-neutral-200">
                            <p className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-stone-50 px-2 text-xs text-neutral-400">
                                ou
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={() => {
                            setCarregandoGoogle(true);
                            loginComGoogle();
                        }}
                        disabled={carregandoGoogle}
                        className={`w-full text-neutral-900 text-base py-3.5 px-4
                            flex justify-center items-center gap-3 border border-neutral-200 rounded-full bg-white
                            hover:bg-teal-50 transition-all duration-300 ${carregandoGoogle ? "cursor-not-allowed" : "cursor-pointer"}`}
                    >
                        {carregandoGoogle ? (
                            <>
                                <IconeCarregamento w={18} h={18} color={"black"} />
                                <p>Carregando...</p>
                            </>
                        ) : (
                            <>
                                <FcGoogle className="w-6 h-6" />
                                Continuar com Google
                            </>
                        )}
                    </button>

                    <p className="text-sm mt-6 text-center text-neutral-500">
                        Novo por aqui?{" "}
                        <Link to="/cadastrar" className="text-teal-700 hover:underline">
                            Criar uma conta →
                        </Link>
                    </p>
                </form>
            </section>
        </main>
    );
}
