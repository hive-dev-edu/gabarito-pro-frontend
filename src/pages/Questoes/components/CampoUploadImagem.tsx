import { useState, useRef } from "react";
import { uploadImagem } from "../services/upload.service";
import IconeCarregamento from "../../../shared/components/IconeCarregamento";
import { ImagePlus, X, AlertCircle } from "lucide-react";

interface CampoUploadImagemProps {
    urlImagem?: string;
    onImagemAlterada: (url: string | undefined) => void;
    rotulo?: string;
    tamanhoPreview?: "pequeno" | "medio" | "grande";
    uploadFn?: (arquivo: File) => Promise<string>;
}

export default function CampoUploadImagem({
    urlImagem,
    onImagemAlterada,
    rotulo = "Imagem",
    tamanhoPreview = "medio",
    uploadFn = uploadImagem,
}: CampoUploadImagemProps) {
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    const tamanhos = {
        pequeno: "h-20 w-20",
        medio: "h-32 w-full max-w-xs",
        grande: "h-48 w-full max-w-md",
    };

    async function handleSelecionarArquivo(
        evento: React.ChangeEvent<HTMLInputElement>
    ) {
        const arquivo = evento.target.files?.[0];
        if (!arquivo) return;

        // Validação básica
        if (!arquivo.type.startsWith("image/")) {
            setErro("Selecione um arquivo de imagem válido.");
            return;
        }

        // Limite de 5MB
        const LIMITE_MB = 5;
        if (arquivo.size > LIMITE_MB * 1024 * 1024) {
            setErro(`A imagem deve ter no máximo ${LIMITE_MB}MB.`);
            return;
        }

        setCarregando(true);
        setErro(null);

        try {
            const url = await uploadFn(arquivo);
            onImagemAlterada(url);
        } catch (err) {
            if (err instanceof Error) {
                setErro(err.message);
            } else {
                setErro("Erro ao fazer upload da imagem.");
            }
        } finally {
            setCarregando(false);
            if (inputRef.current) {
                inputRef.current.value = "";
            }
        }
    }

    function handleRemoverImagem() {
        onImagemAlterada(undefined);
        setErro(null);
    }

    function handleClicarArea() {
        if (!carregando) {
            inputRef.current?.click();
        }
    }

    return (
        <div className="space-y-2">
            {rotulo && (
                <label className="block text-sm font-medium text-gray-700">
                    {rotulo}
                </label>
            )}

            <input
                ref={inputRef}
                type="file"
                accept="image/*"
                onChange={handleSelecionarArquivo}
                className="hidden"
            />

            {urlImagem ? (
                // Preview da imagem
                <div className="relative inline-block">
                    <img
                        src={urlImagem}
                        alt="Preview"
                        className={`${tamanhos[tamanhoPreview]} object-cover rounded-xl border border-gray-200`}
                    />
                    <button
                        type="button"
                        onClick={handleRemoverImagem}
                        disabled={carregando}
                        className="absolute -top-2 -right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-md cursor-pointer disabled:opacity-50"
                        title="Remover imagem"
                    >
                        <X size={14} />
                    </button>
                </div>
            ) : (
                // Área de upload
                <button
                    type="button"
                    onClick={handleClicarArea}
                    disabled={carregando}
                    className={`${tamanhos[tamanhoPreview]} flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl hover:border-[#2EC5B6] hover:bg-teal-50/50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                    {carregando ? (
                        <>
                            <IconeCarregamento w={24} h={24} color="black" />
                            <span className="mt-2 text-sm text-gray-500">
                                Enviando...
                            </span>
                        </>
                    ) : (
                        <>
                            <ImagePlus
                                size={24}
                                className="text-gray-400"
                            />
                            <span className="mt-2 text-sm text-gray-500">
                                Adicionar imagem
                            </span>
                        </>
                    )}
                </button>
            )}

            {/* Mensagem de erro */}
            {erro && (
                <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertCircle size={16} />
                    <span>{erro}</span>
                </div>
            )}
        </div>
    );
}
