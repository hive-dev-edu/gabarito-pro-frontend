import { AlertTriangle, X } from "lucide-react";
import type { Turma } from "../types/turma.types";

interface DeleteTurmaModalProps {
  isOpen: boolean;
  turma: Turma | null;
  loading?: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

export default function DeleteTurmaModal({
  isOpen,
  turma,
  loading = false,
  onClose,
  onConfirm,
}: DeleteTurmaModalProps) {
  if (!isOpen || !turma) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4 py-6">
      <div className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-red-600">
              <AlertTriangle size={22} />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Excluir turma
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Esta ação não poderá ser desfeita.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-slate-700">
          Tem certeza que deseja excluir a turma{" "}
          <span className="font-semibold text-slate-900">{turma.name}</span>?
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            onClick={onClose}
            disabled={loading}
            className="rounded-2xl border border-slate-300 px-5 py-3 font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-70"
          >
            Cancelar
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-2xl bg-red-500 px-5 py-3 font-semibold text-white transition hover:bg-red-600 disabled:opacity-70"
          >
            {loading ? "Excluindo..." : "Excluir turma"}
          </button>
        </div>
      </div>
    </div>
  );
}