import { Eye, EyeClosed } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CadastroService } from "./services/cadastro.service";
import IconeCarregamento from "../../shared/components/IconeCarregamento";
import ModalCadastro from "./components/ModalCadastro";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";

export default function Cadastro() {
    const [senhaVisivel, setSenhaVisivel] = useState(false);
    const [confirmarSenhaVisivel, setConfirmarSenhaVisivel] = useState(false);

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

    function alterarVisibilidadeConfirmarSenha() {
        setConfirmarSenhaVisivel(!confirmarSenhaVisivel);
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
        <main className="w-full min-h-screen flex items-center justify-center bg-white">
            <form
                onSubmit={handleLogin}
                className="text-black w-full max-w-md px-4 py-4 flex flex-col justify-center items-center"
            >
                <div className="flex flex-col gap-4 justify-center items-center mb-8">
                    <img
                        src="/images/logo-gabarito-pro.png"
                        alt="Logo Gabarito Pro"
                        className="w-1/3 rounded-full"
                    />
                    <h1 className="font-semibold text-3xl">Gabarito.pro</h1>
                    <h2>Adicionar slogan aqui</h2>
                </div>

                <input
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    className={`w-full ${errorNome ? "border-red-500 mb-2" : "border-gray-300 mb-4"} p-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]`}
                    required
                />

                <div className="w-full">
                    {errorNome && (
                        <p className="text-red-500 text-sm mb-2">{errorNome}</p>
                    )}
                </div>

                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full ${errorEmail ? "border-red-500 mb-2" : "border-gray-300 mb-4"} p-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]`}
                    required
                />

                <div className="w-full">
                    {errorEmail && (
                        <p className="text-red-500 text-sm mb-2">
                            {errorEmail}
                        </p>
                    )}
                </div>

                <div
                    className={`relative w-full ${errorSenha ? "mb-2" : "mb-4"}`}
                >
                    <input
                        type={senhaVisivel ? "text" : "password"}
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6] ${errorSenha ? "border-red-500" : "border-gray-300"}`}
                    />

                    {senhaVisivel ? (
                        <Eye
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer bg-white"
                            size={24}
                            onClick={alterarVisibilidadeSenha}
                        />
                    ) : (
                        <EyeClosed
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer bg-white"
                            size={24}
                            onClick={alterarVisibilidadeSenha}
                        />
                    )}
                </div>

                <div className="w-full">
                    {errorSenha && (
                        <p className="text-red-500 text-sm mb-2">
                            {errorSenha}
                        </p>
                    )}
                </div>

                <div
                    className={`relative w-full ${errorConfirmarSenha ? "mb-2" : "mb-4"}`}
                >
                    <input
                        type={confirmarSenhaVisivel ? "text" : "password"}
                        placeholder="Confirmar Senha"
                        className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6] ${errorConfirmarSenha ? "border-red-500" : "border-gray-300"}`}
                        value={confirmarSenha}
                        onChange={(e) => setConfirmarSenha(e.target.value)}
                    />

                    {confirmarSenhaVisivel ? (
                        <Eye
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer bg-white"
                            size={24}
                            onClick={alterarVisibilidadeConfirmarSenha}
                        />
                    ) : (
                        <EyeClosed
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 cursor-pointer bg-white"
                            size={24}
                            onClick={alterarVisibilidadeConfirmarSenha}
                        />
                    )}
                </div>
                {errorConfirmarSenha && (
                    <p className="text-red-500 text-sm mb-2">
                        {errorConfirmarSenha}
                    </p>
                )}

                <div className="w-full flex justify-center">
                    <button
                        type="submit"
                        className={`w-full md:w-2/3 text-white text-lg py-4 px-4 bg-linear-to-r from-[#218f84] via-[#2dd3c3] to-[#2fd3c2] rounded-full hover:from-[#2fd3c2] hover:via-[#2dd3c3] hover:to-[#218f84] transition-colors duration-300 ${carregando ? "cursor-not-allowed" : "cursor-pointer"} flex justify-center items-center gap-4`}
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
                </div>

                <div className="w-full my-8">
                    <div className="relative text-gray-300 border-b border-gray-300 w-full">
                        <p className="absolute left-1/2 transform -translate-x-1/2 top-1/2 -translate-y-1/2 bg-white px-1">
                            ou
                        </p>
                    </div>
                </div>

                <div className="w-full flex justify-center">
                    <button
                        type="button"
                        onClick={() => loginComGoogle()}
                        disabled={carregando}
                        className="w-full md:w-2/3 text-black text-lg py-4 px-4
            flex justify-evenly items-center border rounded-full
            hover:bg-teal-50 transition-all duration-300
            cursor-pointer disabled:opacity-60"
                    >
                        <FcGoogle size={24} />
                        Criar Conta com Google
                    </button>
                </div>

                <p className="text-sm mt-4">
                    Já possui uma conta?{" "}
                    <Link to="/login" className="text-blue-700 hover:underline">
                        Fazer login
                    </Link>
                </p>
            </form>

            {modalAberto && (
                <ModalCadastro
                    message="Verifique seu email para validar sua conta!"
                    email={email}
                    onClose={() => setModalAberto(false)}
                />
            )}
        </main>
    );
}
