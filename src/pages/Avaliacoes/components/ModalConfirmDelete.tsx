import { X, Trash2 } from "lucide-react";

interface Props {
  aberto: boolean;
  titulo?: string;
  descricao?: string;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export default function ModalConfirmDelete({
  aberto,
  titulo = "Confirmar exclusão",
  descricao = "Tem certeza que deseja excluir este item? Essa ação não pode ser desfeita.",
  loading = false,
  onCancel,
  onConfirm,
}: Props) {
  if (!aberto) return null;

  return (
    <div style={{ zIndex: 60 }} className="fixed inset-0 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-50 p-2 text-red-600">
              <Trash2 size={18} />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-slate-800">{titulo}</h3>
              <p className="mt-1 text-sm text-slate-500">{descricao}</p>
            </div>
          </div>

          <button
            onClick={onCancel}
            className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-2xl bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60"
          >
            {loading ? (
              <svg className="h-4 w-4 animate-spin text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            ) : (
              "Excluir"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
