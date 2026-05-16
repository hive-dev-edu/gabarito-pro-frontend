import { useState } from "react";
import { EsqueceuSenhaService } from "./services/esqueceuSenha.service";
import ModalEsqueceuSenha from "./components/ModalEsqueceuSenha";
import IconeCarregamento from "../../shared/components/IconeCarregamento";

export default function EsqueceuSenha() {
    const [email, setEmail] = useState("");
    const [errorEmail, setErrorEmail] = useState("");

    const [modalAberto, setModalAberto] = useState(false);
    const [message, setMessage] = useState("");

    const [jaClicado, setJaClicado] = useState(false);

    const [carregando, setCarregando] = useState(false);

    const esqueceuSenhaService = new EsqueceuSenhaService();

    function validarFormulario() {
        setErrorEmail("");

        //Validação pro campo Email

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

        setErrorEmail("");

        return true;
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setCarregando(true);

        if (!validarFormulario()) {
            setCarregando(false);
            return;
        } 
        
        
        try {
            const resposta = await esqueceuSenhaService.enviarEmailRecuperacao(email);
            setJaClicado(true);
            setModalAberto(true);
            setMessage(resposta.message);

        } catch (error) {
            console.error("Erro ao enviar email de recuperação: ", error);
            setJaClicado(true);
            return;
        } finally { 
            setCarregando(false);
        }
        
    }

    return (
        <main className="relative w-full min-h-screen flex justify-center items-center bg-[#FAF8F5]">
            <form
                onSubmit={handleSubmit}
                className="min-h-screen md:min-h-auto text-black w-full max-w-md px-4 py-4 flex flex-col justify-center items-center shadow-2xl rounded-xl bg-white"
            >
                <div className="w-full rounded-md p-4 m-4 flex flex-col gap-4 justify-center items-center text-center text-gray-700 bg-gray-100">
                    <img
                        src="/images/logo-gabarito-pro.png"
                        alt="Logo Gabarito Pro"
                        className="w-24 rounded-full"
                    />
                    <h1 className="font-semibold text-2xl">Gabarito.pro</h1>
                    <p>
                        Digite seu email para recuperar a senha <br></br> será
                        enviado um link para redefinição.
                    </p>
                </div>

                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full ${errorEmail ? "border-red-500 mb-2" : "border-gray-300 mb-4"} p-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]`}
                />

                {errorEmail && (
                    <p className="w-full text-red-500 text-sm mb-2">
                        {errorEmail}
                    </p>
                )}

                <button
                    type="submit"
                    className={`w-1/2 p-4 border border-gray-300 rounded-xl ${carregando ? "cursor-not-allowed" : "cursor-pointer"} hover:shadow-2xl transition-shadow duration-300 flex justify-center items-center gap-4`}
                    disabled={carregando}
                >
                    {carregando ? <><IconeCarregamento w={18} h={18} color="black"/> <p>Carregando</p></> : jaClicado ? "Reenviar Email" : "Enviar Email"}
                    
                </button>
            </form>

            {modalAberto && (
                <ModalEsqueceuSenha
                    message={message}
                    onClose={() => setModalAberto(false)}
                />
            )}
        </main>
    );
}
