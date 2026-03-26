import { useEffect, useState } from "react";
import { X, Layers } from "lucide-react";

interface Props {
  aberto: boolean;
  loading?: boolean;
  onCancel: () => void;
  onConfirm: (quantidade: number) => void;
}

export default function ModalGerarVersoes({
  aberto,
  loading = false,
  onCancel,
  onConfirm,
}: Props) {
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    if (aberto) setQuantidade(1);
  }, [aberto]);

  if (!aberto) return null;

  return (
    <div
      style={{ zIndex: 60 }}
      className="fixed inset-0 flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} />

      <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-[#E6FAF7] p-2 text-[#14877B]">
              <Layers size={18} />
            </div>
            <h3 className="text-lg font-semibold text-slate-800">
              Gerar versões
            </h3>
          </div>

          <button
            onClick={onCancel}
            className="rounded-full p-1 text-slate-500 hover:bg-slate-100 cursor-pointer"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-600">
          As versões existentes serão substituídas pelas novas.
        </div>

        <div className="mt-4">
          <label
            htmlFor="quantidade-versoes"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Quantidade de versões
          </label>
          <input
            id="quantidade-versoes"
            type="number"
            min={1}
            max={50}
            value={quantidade}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (!isNaN(val)) setQuantidade(Math.min(50, Math.max(1, val)));
            }}
            className="w-full rounded-2xl border border-slate-300 px-3 py-3 text-sm text-slate-800 outline-none focus:border-[#2EC5B6] focus:ring-1 focus:ring-[#2EC5B6]"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-60 cursor-pointer"
          >
            Cancelar
          </button>

          <button
            onClick={() => onConfirm(quantidade)}
            disabled={loading || quantidade < 1 || quantidade > 50}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#2EC5B6] px-4 py-2 text-sm font-semibold text-white hover:bg-[#27b3a6] disabled:opacity-60 cursor-pointer"
          >
            {loading ? (
              <svg
                className="h-4 w-4 animate-spin text-white"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
            ) : (
              "Gerar"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
