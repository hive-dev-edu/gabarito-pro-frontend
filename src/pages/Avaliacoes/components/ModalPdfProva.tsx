import { X, Download } from "lucide-react";
import type { PrintDataResponse } from "../types/versao.types";
import ProvaPdfDocument from "./ProvaPdfDocument";
import IconeCarregamento from "../../../shared/components/IconeCarregamento";
import html2pdf from "html2pdf.js";

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

  const handleDownload = () => {
    const element = document.getElementById("pdf-root");
    if (!element) return;

    html2pdf()
      .from(element)
      .set({
        margin: 0,
        // @ts-expect-error - pagebreak is a valid option in html2pdf.js but missing in types
        pagebreak: { mode: ['css', 'legacy'] },
        filename: data?.assessment.title ? `${data.assessment.title}.pdf` : "prova.pdf",
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
      })
      .toPdf()
      .get("pdf")
      .then((pdf: any) => {
        const totalPages = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          pdf.setPage(i);
          pdf.setFontSize(9);
          pdf.setTextColor(0, 0, 0);
          pdf.text(`Página ${i} de ${totalPages}`, 105, 292, { align: "center" });
        }
      })
      // @ts-expect-error - O html2pdf retorna seu próprio worker "chainable" após o then, mas o TS acha que é uma Promise padrão
      .save();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="max-h-[92vh] w-full max-w-5xl flex flex-col overflow-hidden rounded-[28px] bg-[#F8FAFC] shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-200 bg-white/95 px-5 py-4 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Preview PDF</h2>
            <p className="text-sm text-slate-500">
              {data?.assessment.title ?? (carregando ? "Carregando..." : "—")}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {data && !carregando && (
              <button
                onClick={handleDownload}
                className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 cursor-pointer"
              >
                <Download size={18} />
                Baixar PDF
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-2xl p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700 cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="h-[72vh] flex-1 overflow-y-auto bg-slate-200/50 p-6 relative">
          {carregando ? (
            <div className="flex h-full items-center justify-center">
              <IconeCarregamento w={28} h={28} color="black" />
            </div>
          ) : data ? (
            <div className="flex justify-center shadow-lg bg-white mx-auto" style={{ width: "210mm" }}>
              <ProvaPdfDocument data={data} qrCodes={qrCodes} />
            </div>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">
              Dados não disponíveis para gerar o PDF.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
