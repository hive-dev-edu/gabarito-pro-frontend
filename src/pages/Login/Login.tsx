import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { LoginService } from "./services/login.service";
import IconeCarregamento from "../../shared/components/IconeCarregamento";
import { useGoogleLogin } from "@react-oauth/google";

export default function Login() {
    const [senhaVisivel, setSenhaVisivel] = useState(false);

    const [email, setEmail] = useState("");
    const [errorEmail, setErrorEmail] = useState("");

    const [senha, setSenha] = useState("");
    const [errorSenha, setErrorSenha] = useState("");

    const [errorLogin, setErrorLogin] = useState(false);

    const [carregando, setCarregando] = useState(false);

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

            await loginService.loginComGoogle({
                code: verificacaoCode,
            });

            navigate("/dashboard");
        },
        onError: () => {
            console.error("Login com Google falhou");
        },
    });

    function alterarVisibilidadeSenha() {
        setSenhaVisivel((prev) => !prev);
    }

    return (
        <main className="w-full min-h-screen flex items-center justify-center bg-white">
            <form
                onSubmit={handleLogin}
                className="text-black w-full max-w-md px-4 py-4 flex flex-col justify-center items-center"
            >
                <div className="flex flex-col gap-4 justify-center items-center mb-8">
                    <img
                        src="/images/logo-gabarito-pro.png"
                        alt="Logo Gabarito.pro"
                        className="w-1/3 rounded-full"
                    />
                    <h1 className="font-semibold text-3xl">Gabarito.pro</h1>
                    <h2>Aprender junto é aprender melhor!</h2>
                </div>

                {/* EMAIL */}
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]
                        ${errorEmail ? "border-red-500 mb-2" : "border-gray-300 mb-4"}
                    `}
                />

                {errorEmail && (
                    <p className="w-full text-red-500 text-sm mb-2">
                        {errorEmail}
                    </p>
                )}

                {/* SENHA */}
                <div className="relative w-full">
                    <input
                        type={senhaVisivel ? "text" : "password"}
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]
                            ${errorSenha ? "border-red-500" : "border-gray-300"}
                        `}
                    />

                    {senhaVisivel ? (
                        <Eye
                            size={24}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                            onClick={alterarVisibilidadeSenha}
                        />
                    ) : (
                        <EyeClosed
                            size={24}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 cursor-pointer"
                            onClick={alterarVisibilidadeSenha}
                        />
                    )}
                </div>

                {errorSenha && (
                    <p className="w-full text-red-500 text-sm mt-2">
                        {errorSenha}
                    </p>
                )}

                <Link
                    to="/esqueceu-senha"
                    target="_blank"
                    className="w-full text-sm text-blue-700 my-4 hover:underline"
                >
                    Esqueceu a senha?
                </Link>

                {/* BOTÃO LOGIN */}
                <button
                    type="submit"
                    className={`w-full md:w-2/3 text-white text-lg py-4 px-4
                        bg-linear-to-r from-[#218f84] via-[#2dd3c3] to-[#2fd3c2] rounded-full hover:from-[#2fd3c2] hover:via-[#2dd3c3] hover:to-[#218f84]
                        transition-colors duration-300 ${carregando ? "cursor-not-allowed" : "cursor-pointer"} flex justify-center items-center gap-4`}
                    disabled={carregando}
                >
                    {carregando ? (
                        <>
                            <IconeCarregamento w={18} h={18} color={"white"} />{" "}
                            <p>Carregando</p>
                        </>
                    ) : (
                        "Fazer Login"
                    )}
                </button>

                {/* ERRO LOGIN */}
                {errorLogin && (
                    <p className="w-full text-red-500 text-sm mt-4 text-center">
                        Falha no login. Verifique seu email e senha.
                    </p>
                )}

                <div className="w-full my-8">
                    <div className="relative text-gray-300 border-b border-gray-300 w-full">
                        <p className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-1">
                            ou
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => loginComGoogle()}
                    className="w-full md:w-2/3 text-black text-lg py-4 px-4
        flex justify-evenly items-center border rounded-full
        hover:bg-teal-50 transition-all duration-300 cursor-pointer"
                >
                    <FcGoogle className="w-8 h-8" />
                    Login com Google
                </button>

                <p className="text-sm mt-4">
                    Não possui uma conta?{" "}
                    <Link
                        to="/cadastrar"
                        className="text-blue-700 hover:underline"
                    >
                        Criar uma conta
                    </Link>
                </p>
            </form>
        </main>
    );
}
