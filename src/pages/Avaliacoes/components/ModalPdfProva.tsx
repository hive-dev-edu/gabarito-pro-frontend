import { X } from "lucide-react";
import { PDFViewer } from "@react-pdf/renderer";
import type { PrintDataResponse } from "../types/versao.types";
import ProvaPdfDocument from "./ProvaPdfDocument";
import IconeCarregamento from "../../../shared/components/IconeCarregamento";

interface Props {
  aberto: boolean;
  data: PrintDataResponse | null;
  qrCodes: Record<string, string | undefined>;
  carregando?: boolean;
  onClose: () => void;
}

export default function ModalPdfProva({
  aberto,
  data,
  qrCodes,
  carregando = false,
  onClose,
}: Props) {
  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[28px] bg-[#F8FAFC] shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Preview PDF</h2>
            <p className="text-sm text-slate-500">
              {data?.assessment.title ?? (carregando ? "Carregando..." : "—")}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="h-[72vh] bg-white">
          {carregando ? (
            <div className="flex h-full items-center justify-center">
              <IconeCarregamento w={28} h={28} color="black" />
            </div>
          ) : data ? (
            <PDFViewer width="100%" height="100%" showToolbar>
              <ProvaPdfDocument data={data} qrCodes={qrCodes} />
            </PDFViewer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Dados nao disponiveis para gerar o PDF.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
