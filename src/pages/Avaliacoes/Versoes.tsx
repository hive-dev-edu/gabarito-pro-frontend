import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Eye, Layers, Plus, Trash2 } from "lucide-react";
import VersoesService from "./services/versoes.service";
import AvaliacoesService from "./services/avaliacoes.service";
import ModalGerarVersoes from "./components/ModalGerarVersoes";
import ModalConfirmDelete from "./components/ModalConfirmDelete";
import ModalVisualizarVersao from "./components/ModalVisualizarVersao";
import IconeCarregamento from "../../shared/components/IconeCarregamento";
import { formatarData } from "./utils/formatadores";
import type { VersaoAvaliacao, DadosImpressaoVersao, PrintDataResponse } from "./types/versao.types";

export default function PaginaVersoes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [versoes, setVersoes] = useState<VersaoAvaliacao[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [nomeAvaliacao, setNomeAvaliacao] = useState("");

  // Cache do print-data (buscado uma vez, na primeira visualização)
  const [printData, setPrintData] = useState<PrintDataResponse | null>(null);

  // Visualização de versão
  const [versaoSelecionada, setVersaoSelecionada] = useState<DadosImpressaoVersao | null>(null);
  const [visualizarAberto, setVisualizarAberto] = useState(false);
  const [carregandoVersao, setCarregandoVersao] = useState(false);

  // Geração
  const [gerarAberto, setGerarAberto] = useState(false);
  const [gerando, setGerando] = useState(false);

  // Exclusão
  const [excluirAberto, setExcluirAberto] = useState(false);
  const [excluindo, setExcluindo] = useState(false);

  async function carregarVersoes() {
    if (!id) return;
    try {
      setCarregando(true);
      setErro("");
      const lista = await VersoesService.listarPorAvaliacao(id);
      setVersoes(lista);
      setPrintData(null); // invalida cache ao recarregar
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar versões.");
      setVersoes([]);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarVersoes();
    if (id) {
      AvaliacoesService.getById(id)
        .then((a) => setNomeAvaliacao(a.title))
        .catch(() => {});
    }
  }, [id]);

  async function handleVisualizarVersao(versionNumber: number) {
    setVisualizarAberto(true);
    setVersaoSelecionada(null);

    const cached = printData;
    if (cached) {
      setVersaoSelecionada(cached.versions.find((v) => v.versionNumber === versionNumber) ?? null);
      return;
    }

    if (!id) return;
    try {
      setCarregandoVersao(true);
      const dados = await VersoesService.obterDadosImpressao(id);
      setPrintData(dados);
      setVersaoSelecionada(dados.versions.find((v) => v.versionNumber === versionNumber) ?? null);
    } catch (error) {
      setErro(error instanceof Error ? error.message : "Erro ao carregar dados da versão.");
      setVisualizarAberto(false);
    } finally {
      setCarregandoVersao(false);
    }
  }

  async function handleGerar(quantidade: number) {
    if (!id) return;
    try {
      setGerando(true);
      await VersoesService.gerar(id, quantidade);
      setGerarAberto(false);
      await carregarVersoes();
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
      setPrintData(null);
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
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#D9E7E4] bg-white text-slate-600 transition hover:bg-[#F4FFFD] hover:text-[#14877B]"
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
                className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-300 bg-white px-5 py-3 font-semibold text-red-600 transition-colors duration-300 hover:bg-red-50"
              >
                <Trash2 size={18} />
                Excluir Todas
              </button>
            )}

            <button
              onClick={() => setGerarAberto(true)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2EC5B6] px-5 py-3 font-semibold text-white transition-colors duration-300 hover:bg-[#27b3a6]"
            >
              <Plus size={20} />
              Gerar Versões
            </button>
          </div>
        </div>

        {/* Banner de erro */}
        {erro && !carregando && (
          <div className="mb-6 rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-700">
            {erro}
            <button onClick={() => setErro("")} className="ml-2 underline">
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
                  className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#D9E7E4] bg-white text-slate-600 transition hover:bg-[#F4FFFD] hover:text-[#14877B]"
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
        carregando={carregandoVersao}
        onClose={() => setVisualizarAberto(false)}
      />

      <ModalGerarVersoes
        aberto={gerarAberto}
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
    </main>
  );
}
