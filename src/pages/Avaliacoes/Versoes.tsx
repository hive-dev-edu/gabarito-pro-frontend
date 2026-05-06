import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, FileDown, Layers, Plus, Trash2 } from "lucide-react";
import QRCode from "qrcode";
import VersoesService from "./services/versoes.service";
import AvaliacoesService from "./services/avaliacoes.service";
import ModalGerarVersoes from "./components/ModalGerarVersoes";
import ModalConfirmDelete from "./components/ModalConfirmDelete";
import ModalVisualizarVersao from "./components/ModalVisualizarVersao";
import ModalPdfProva from "./components/ModalPdfProva";
import IconeCarregamento from "../../shared/components/IconeCarregamento";
import { formatarData } from "./utils/formatadores";
import type { VersaoAvaliacao, DadosImpressaoVersao } from "./types/versao.types";
import { usePrintData } from "./hooks/usePrintData";
import ProvaPdfDocument from "./components/ProvaPdfDocument";

function sanitizeFilename(name: string) {
  return name
    .trim()
    .replace(/[\\/:*?"<>|]/g, "-")
    .replace(/\s+/g, " ")
    .slice(0, 120);
}

export default function PaginaVersoes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [versoes, setVersoes] = useState<VersaoAvaliacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [nomeAvaliacao, setNomeAvaliacao] = useState("");

  const {
    data: printData,
    loading: carregandoPrintData,
    error: erroPrintData,
    refetch: recarregarPrintData,
    reset: resetPrintData,
  } = usePrintData(id, { enabled: versoes.length > 0 });

  // Visualização de versão
  const [versaoSelecionada, setVersaoSelecionada] = useState<DadosImpressaoVersao | null>(null);
  const [visualizarAberto, setVisualizarAberto] = useState(false);
  const [versionNumberSelecionado, setVersionNumberSelecionado] = useState<number | null>(null);
  const [pdfAberto, setPdfAberto] = useState(false);
  const [qrCodes, setQrCodes] = useState<Record<string, string | undefined>>({});
  const [gerandoQrCodes, setGerandoQrCodes] = useState(false);

  const pdfFileName = (() => {
    const title = printData?.assessment?.title || nomeAvaliacao;
    const base = title ? sanitizeFilename(title) : `prova-${id ?? "avaliacao"}`;
    return `${base || "prova"}.pdf`;
  })();

  // Geração
  const [gerarAberto, setGerarAberto] = useState(false);
  const [gerando, setGerando] = useState(false);
  const [modoGerar, setModoGerar] = useState<"substituir" | "adicionar">("substituir");

  // Exclusão
  const [excluirAberto, setExcluirAberto] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  const carregarVersoes = useCallback(async () => {
    if (!id) return;
    try {
      setCarregando(true);
      setErro("");
      const lista = await VersoesService.listarPorAvaliacao(id);
      setVersoes(lista);
      resetPrintData(); // invalida cache ao recarregar
    } catch (error) {
      setErro(
        error instanceof Error ? error.message : "Erro ao carregar versões."
      );
      setVersoes([]);
    } finally {
      setCarregando(false);
    }
  }, [id, resetPrintData]);

  useEffect(() => {
    carregarVersoes();
    if (id) {
      AvaliacoesService.getById(id)
        .then((a) => setNomeAvaliacao(a.title))
        .catch(() => {});
    }
  }, [id, carregarVersoes]);

  useEffect(() => {
    if (!erroPrintData) return;
    if (erroPrintData.includes("sem versões geradas")) return;
    setErro(erroPrintData);
  }, [erroPrintData]);

  useEffect(() => {
    if (versoes.length > 0 && !printData && !carregandoPrintData && !erroPrintData) {
      recarregarPrintData();
    }
  }, [versoes.length, printData, carregandoPrintData, erroPrintData, recarregarPrintData]);

  useEffect(() => {
    if (!versionNumberSelecionado || !printData) {
      setVersaoSelecionada(null);
      return;
    }

    const versao =
      printData.versions.find((v) => v.versionNumber === versionNumberSelecionado) ?? null;
    setVersaoSelecionada(versao);
  }, [printData, versionNumberSelecionado]);

  useEffect(() => {
    // Capture o valor atual em uma variável local para type narrowing
    const currentPrintData = printData;
    
    if (!currentPrintData) {
      setQrCodes({});
      setGerandoQrCodes(false);
      return;
    }

    let cancelado = false;
    
    async function gerarQrCodes() {
      try {
        setGerandoQrCodes(true);
        // Use currentPrintData em vez de printData
        const urls = await Promise.all(
          currentPrintData!.versions.map((v) => QRCode.toDataURL(v.versionId))
        );
        if (cancelado) return;
        
        const mapa: Record<string, string> = {};
        currentPrintData!.versions.forEach((v, index) => {
          mapa[v.versionId] = urls[index];
        });
        setQrCodes(mapa);
      } catch (error) {
        if (!cancelado) {
          setErro(
            error instanceof Error
              ? error.message
              : "Erro ao gerar QR Codes das versoes."
          );
          setQrCodes({});
        }
      } finally {
        if (!cancelado) setGerandoQrCodes(false);
      }
    }

    gerarQrCodes();

    return () => {
      cancelado = true;
    };
  }, [printData]);

  async function handleVisualizarVersao(versionNumber: number) {
    setVisualizarAberto(true);
    setVersionNumberSelecionado(versionNumber);

    if (!printData || erroPrintData) {
      await recarregarPrintData();
    }
  }

  async function handleGerar(quantidade: number) {
    if (!id) return;
    try {
      setGerando(true);
      if (modoGerar === "substituir") {
        await VersoesService.gerar(id, quantidade);
      } else {
        await VersoesService.adicionar(id, quantidade);
      }
      setGerarAberto(false);
      await carregarVersoes();
      await recarregarPrintData();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao gerar versões.");
      setGerarAberto(false);
    } finally {
      setGerando(false);
    }
  }

  async function handleExcluirTodas() {
    if (!id) return;
    try {
      setExcluindo(true);
      await VersoesService.excluirTodas(id);
      setExcluirAberto(false);
      setVersoes([]);
      resetPrintData();
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao excluir versões.");
      setExcluirAberto(false);
    } finally {
      setExcluindo(false);
    }
  }

  return (
    <main>
      <div className="mx-auto max-w-5xl px-3 py-6 sm:px-4 sm:py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate("/avaliacoes")}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#D9E7E4] bg-white text-slate-600 transition hover:bg-[#F4FFFD] hover:text-[#14877B] cursor-pointer"
              title="Voltar"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                Versões da Avaliação
              </h1>
              {nomeAvaliacao && (
                <p className="mt-0.5 text-sm text-slate-500">{nomeAvaliacao}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            {versoes.length > 0 && (
              <button
                onClick={() => setExcluirAberto(true)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300 bg-white px-5 py-3 font-semibold text-red-600 transition-colors duration-300 hover:bg-red-50 cursor-pointer"
              >
                <Trash2 size={18} />
                Excluir Todas
              </button>
            )}

            {versoes.length > 0 && (
              <div className="flex flex-col gap-3 sm:flex-row">
                {printData ? (
                  <button
                    onClick={() => {
                      const element = document.getElementById("pdf-root-hidden");
                      if (!element || gerandoQrCodes) return;
                      
                      import("html2pdf.js").then((html2pdf) => {
                        html2pdf.default()
                          .from(element)
                          .set({
                            margin: 0,
                            pagebreak: { mode: ['css', 'legacy'] },
                            filename: pdfFileName,
                            html2canvas: { scale: 2, useCORS: true },
                            jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
                          })
                          .save();
                      });
                    }}
                    disabled={gerandoQrCodes}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition-colors duration-300 hover:bg-slate-50 disabled:opacity-60 cursor-pointer"
                  >
                    <FileDown size={18} />
                    {gerandoQrCodes ? "Preparando PDF..." : "Baixar PDF"}
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 opacity-60"
                  >
                    <FileDown size={18} />
                    Preparando PDF...
                  </button>
                )}

                <button
                  onClick={() => setPdfAberto(true)}
                  disabled={!printData || carregandoPrintData || gerandoQrCodes}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition-colors duration-300 hover:bg-slate-50 disabled:opacity-60 cursor-pointer"
                >
                  <Eye size={18} />
                  Visualizar PDF
                </button>
              </div>
            )}

            {versoes.length > 0 ? (
              <>
                <button
                  onClick={() => {
                    setModoGerar("substituir");
                    setGerarAberto(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-5 py-3 font-semibold text-slate-700 transition-colors duration-300 hover:bg-slate-50 cursor-pointer"
                >
                  <Layers size={20} />
                  Substituir Versões
                </button>
                <button
                  onClick={() => {
                    setModoGerar("adicionar");
                    setGerarAberto(true);
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2EC5B6] px-5 py-3 font-semibold text-white transition-colors duration-300 hover:bg-[#27b3a6] cursor-pointer"
                >
                  <Plus size={20} />
                  Adicionar Versões
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setModoGerar("substituir");
                  setGerarAberto(true);
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2EC5B6] px-5 py-3 font-semibold text-white transition-colors duration-300 hover:bg-[#27b3a6] cursor-pointer"
              >
                <Plus size={20} />
                Gerar Versões
              </button>
            )}
          </div>
        </div>

        {/* Banner de erro */}
        {erro && !carregando && (
          <div className="mb-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {erro}
            <button onClick={() => setErro("")} className="ml-2 underline cursor-pointer">
              Fechar
            </button>
          </div>
        )}

        {/* Conteúdo */}
        {carregando ? (
          <div className="flex items-center justify-center py-20">
            <IconeCarregamento w={8} h={8} color="black" />
          </div>
        ) : versoes.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <Layers size={48} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">Nenhuma versão gerada ainda.</p>
            <p className="mt-1 text-sm">
              Clique em "Gerar Versões" para criar versões embaralhadas desta avaliação.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="mb-4 rounded-2xl border border-[#DDEDEA] bg-white p-4 shadow-sm">
              <p className="text-sm text-slate-600">
                <span className="font-semibold text-slate-800">{versoes.length}</span>{" "}
                {versoes.length === 1 ? "versão gerada" : "versões geradas"}
              </p>
            </div>

            {versoes.map((versao) => (
              <div
                key={versao.id}
                className="flex items-center justify-between rounded-2xl border border-[#DDEDEA] bg-white p-4 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#E6FAF7] text-sm font-bold text-[#14877B]">
                    {versao.versionNumber}
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      Versão {versao.versionNumber}
                    </p>
                    <p className="text-sm text-slate-500">
                      Criada em {formatarData(versao.createdAt)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleVisualizarVersao(versao.versionNumber)}
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#D9E7E4] bg-white text-slate-600 transition hover:bg-[#F4FFFD] hover:text-[#14877B] cursor-pointer"
                  title="Visualizar versão"
                >
                  <Eye size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <ModalVisualizarVersao
        aberto={visualizarAberto}
        versao={versaoSelecionada}
        assessment={printData?.assessment}
        carregando={carregandoPrintData}
        onClose={() => {
          setVisualizarAberto(false);
          setVersionNumberSelecionado(null);
        }}
      />

      <ModalPdfProva
        aberto={pdfAberto}
        data={printData}
        qrCodes={qrCodes}
        carregando={carregandoPrintData || gerandoQrCodes}
        onClose={() => setPdfAberto(false)}
      />

      <ModalGerarVersoes
        aberto={gerarAberto}
        modo={modoGerar}
        loading={gerando}
        onCancel={() => setGerarAberto(false)}
        onConfirm={handleGerar}
      />

      <ModalConfirmDelete
        aberto={excluirAberto}
        titulo="Excluir todas as versões"
        descricao="Esta ação irá remover permanentemente todas as versões geradas. Essa operação não pode ser desfeita."
        loading={excluindo}
        onCancel={() => setExcluirAberto(false)}
        onConfirm={handleExcluirTodas}
      />

      {/* Hidden off-screen container for direct PDF download */}
      <div style={{ position: "absolute", top: "-9999px", left: "-9999px" }}>
        {printData && (
          <div id="pdf-root-hidden" className="flex flex-col bg-white w-[210mm]">
            <ProvaPdfDocument data={printData} qrCodes={qrCodes} />
          </div>
        )}
      </div>
    </main>
  );
}