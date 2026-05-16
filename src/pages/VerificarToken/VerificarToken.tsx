import { useNavigate, useSearchParams } from "react-router-dom";
import { VerificarTokenService } from "./services/verificarToken.service";
import { useEffect, useRef, useState } from "react";
import { Check, Clock, X } from "lucide-react";

export default function VerificarToken() {
    const [searchParams] = useSearchParams();
    const [carregando, setCarregando] = useState(false);
    const [tokenValido, setTokenValido] = useState<boolean | null>(null);
    
    const jaVerificou = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (jaVerificou.current) {
            return;
        }

        const token = searchParams.get("token");

        if (!token) {
            console.error("Token não fornecido na URL.");
            return;
        }

        jaVerificou.current = true;

        const verificar = async () => {
            setCarregando(true);
            try {
                const verificarTokenService = new VerificarTokenService();

                const tokenValido = await verificarTokenService.verificarToken(token);

                if (tokenValido) {
                    setTokenValido(true);

                    setTimeout(() => {
                        navigate("/login");
                    }, 3000);

                } else {
                    setTokenValido(false);

                    setTimeout(() => {
                        navigate("/cadastrar");
                    }, 3000);
                }
            } catch (error) {
                console.error("Erro ao verificar token:", error);
            } finally {
                setCarregando(false);
            }
        };

        verificar();
    }, [searchParams, navigate]);

    return (
        <main className="w-full min-h-screen flex justify-center items-center bg-stone-50">
            <div className="w-full max-w-md p-6 bg-white border border-gray-300 rounded-lg shadow-md flex flex-col items-center">
                {carregando ? (
                    <>
                        <Clock className="w-16 h-16 text-blue-500 mb-4" />
                        <p className="text-lg font-medium text-gray-700">
                            Verificando token...
                        </p>
                    </>
                ) : tokenValido === true ? (
                    <>
                        <Check className="w-16 h-16 text-green-500 mb-4" />
                        <p className="text-lg font-medium text-gray-700 text-center">
                                Token verificado.
                                <br />
                                Logo você será redirecionado.
                        </p>
                    </>
                ) : tokenValido === false ? (
                            <>
                                <X className="w-16 h-16 text-red-500 mb-4" />
                        <p className="text-lg font-medium text-gray-700 text-center">
                                    Token inválido ou expirado.
                                    <br />
                                Logo você será redirecionado.
                        </p>
                    </>
                ) : null}
            </div>
        </main>
    );
}
