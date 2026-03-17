import { useState } from "react";
import IconeCarregamento from "../../shared/components/IconeCarregamento";
import { RedefinirSenhaService } from "./services/redefinirSenha.service";
import { Eye, EyeClosed } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import ModalRedefinirSenha from "./components/ModalRedefinirSenha";

export default function RedefinirSenha() {
    const [searchParams] = useSearchParams();

    const [novaSenha, setNovaSenha] = useState("");
    const [errorNovaSenha, setErrorNovaSenha] = useState("");
    const [errorRedefinirSenha, setErrorRedefinirSenha] = useState("");

    const [senhaVisivel, setSenhaVisivel] = useState(false);

    const [modalAberto, setModalAberto] = useState(false);
    const [message, setMessage] = useState("");
    const [carregando, setCarregando] = useState(false);

    const navigate = useNavigate();

    const redefinirSenhaService = new RedefinirSenhaService();

    function alterarVisibilidadeSenha() {
        setSenhaVisivel(!senhaVisivel);
    }
    
    function validarFormulario() {
        setErrorNovaSenha("");

        if (novaSenha.trim() === "") {
            setErrorNovaSenha("O campo Senha é obrigatório.");
            return false;
        }

        if (novaSenha.length < 8) {
            setErrorNovaSenha("A senha deve conter pelo menos 8 caracteres.");
            return false;
        }

        return true;
    }

    async function handleRedefinirSenha(e: React.FormEvent) {
        e.preventDefault();

        setErrorRedefinirSenha("");

        setCarregando(true);

        const token = searchParams.get("token");

        if (!token) {
            setErrorRedefinirSenha("Token inválido ou expirado.");
            return;
        }

        if (!validarFormulario()) return;

        try {
            const resposta = await redefinirSenhaService.redefinirSenha({
                token,
                newPassword: novaSenha,
            });

            if (!resposta.success) {
                setErrorRedefinirSenha(resposta.message);
                return;
            }

            setMessage(resposta.message);
            setModalAberto(true);
            setNovaSenha("");
        } finally {
            setCarregando(false);
        }
    }

    return (
        <main className="relative w-full min-h-screen flex justify-center items-center">
            <form
                onSubmit={handleRedefinirSenha}
                className="min-h-screen md:min-h-auto text-black w-full max-w-md px-4 py-4 flex flex-col justify-center items-center shadow-2xl rounded-xl bg-white"
            >
                <div className="w-full rounded-md p-4 m-4 flex flex-col gap-4 justify-center items-center text-center text-gray-700 bg-gray-100">
                    <img src="/images/logo-gabarito-pro.png" alt="Logo" className="w-24 rounded-full" />
                    <p>Digite sua nova senha para redefini-la.</p>
                </div>

                <div className="relative w-full">
                    <input
                        type={senhaVisivel ? "text" : "password"}
                        placeholder="Senha"
                        value={novaSenha}
                        onChange={(e) => setNovaSenha(e.target.value)}
                        className={`w-full p-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]
                            ${errorNovaSenha ? "border-red-500" : "border-gray-300"}
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

                {errorNovaSenha && (
                    <p className="text-red-500 text-sm mt-2">{errorNovaSenha}</p>
                )}

                {errorRedefinirSenha && (
                    <p className="text-red-500 text-sm text-center mt-2">
                        {errorRedefinirSenha}
                    </p>
                )}

                <button
                    type="submit"
                    className="w-1/2 p-4 border rounded-xl mt-4 cursor-pointer hover:shadow-2xl transition-shadow duration-300 flex items-center justify-center gap-2"
                    disabled={carregando}
                >
                    {carregando ? (
                        <>
                            <IconeCarregamento w={1} h={1} color="black" />
                            <p>Redefinindo...</p>
                        </>
                    ) : (
                        "Redefinir Senha"
                    )}
                </button>
            </form>

            {modalAberto && (
                <ModalRedefinirSenha
                    message={message}
                    onClose={() => setModalAberto(false)}
                    navigateToLogin={() => navigate("/login")}
                />
            )}
        </main>
    );
}
