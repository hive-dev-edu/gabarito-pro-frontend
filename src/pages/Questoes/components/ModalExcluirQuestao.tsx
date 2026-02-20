interface ModalExcluirQuestaoProps {
    onConfirmar: () => void;
    onCancelar: () => void;
    carregando?: boolean;
}

export default function ModalExcluirQuestao({
    onConfirmar,
    onCancelar,
    carregando = false,
}: ModalExcluirQuestaoProps) {
    return (
        <main
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fadeIn"
            onClick={onCancelar}
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-white max-w-md w-full p-8 rounded-2xl text-center animate-scaleIn"
            >
                <h2 className="text-2xl font-semibold text-gray-800">
                    Excluir Questão
                </h2>

                <p className="my-4 text-gray-600">
                    Tem certeza que deseja excluir esta questão? Essa ação não
                    pode ser desfeita.
                </p>

                <div className="flex gap-4">
                    <button
                        onClick={onCancelar}
                        disabled={carregando}
                        className="w-full py-3 border border-gray-300 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors duration-300 disabled:opacity-50"
                    >
                        Cancelar
                    </button>

                    <button
                        onClick={onConfirmar}
                        disabled={carregando}
                        className="w-full py-3 bg-red-500 text-white rounded-xl cursor-pointer hover:bg-red-600 transition-colors duration-300 disabled:opacity-50"
                    >
                        {carregando ? "Excluindo..." : "Excluir"}
                    </button>
                </div>
            </div>
        </main>
    );
}
