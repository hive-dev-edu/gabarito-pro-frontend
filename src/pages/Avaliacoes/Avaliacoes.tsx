import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  FileText,
  Plus,
  Search,
} from "lucide-react";

import AvaliacoesService from "./services/avaliacoes.service";
import type { Avaliacao } from "./types/avaliacao.types";
import CardAvaliacao from "./components/CardAvaliacao";
import ModalPreviewAvaliacao from "./components/ModalPreviewAvaliacao";
import IconeCarregamento from "../../shared/components/IconeCarregamento";
import ModalConfirmDelete from "./components/ModalConfirmDelete";

export default function AvaliacoesPage() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [meta, setMeta] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);

  const [carregando, setCarregando] = useState(false);
  const [carregandoPreview, setCarregandoPreview] = useState(false);
  const [erro, setErro] = useState("");
  const [preview, setPreview] = useState<Avaliacao | null>(null);
  const [modalAberto, setModalAberto] = useState(false);
  const [excluirAberto, setExcluirAberto] = useState(false);
  const [selecionadaParaExcluir, setSelecionadaParaExcluir] = useState<{
    id: string;
    title?: string;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function carregarAvaliacoes(currentPage = 1) {
    try {
      setCarregando(true);
      setErro("");

      const resposta = await AvaliacoesService.getPublished(currentPage, limit);

      const lista = Array.isArray((resposta as any)?.data)
        ? (resposta as any).data
        : Array.isArray((resposta as any)?.items)
        ? (resposta as any).items
        : [];

      setAvaliacoes(lista);

      setMeta({
        total: (resposta as any)?.meta?.total ?? (resposta as any)?.total ?? 0,
        page: (resposta as any)?.meta?.page ?? (resposta as any)?.page ?? currentPage,
        limit: (resposta as any)?.meta?.limit ?? limit,
        totalPages:
          (resposta as any)?.meta?.totalPages ??
          (resposta as any)?.totalPages ??
          1,
      });
    } catch (error) {
      console.error("Erro ao carregar avaliações:", error);
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar avaliações."
      );
      setAvaliacoes([]);
      setMeta(null);
    } finally {
      setCarregando(false);
    }
  }

  async function abrirPreview(id: string) {
    try {
      setCarregandoPreview(true);
      setErro("");

      const resposta = await AvaliacoesService.getById(id);
      setPreview(resposta);
      setModalAberto(true);
    } catch (error) {
      console.error("Erro ao buscar avaliação:", error);
      setErro(
        error instanceof Error
          ? error.message
          : "Erro ao carregar prévia da avaliação."
      );
    } finally {
      setCarregandoPreview(false);
    }
  }

  function fecharPreview() {
    setModalAberto(false);
    setPreview(null);
  }

  function abrirModalExcluir(id: string, title?: string) {
    setSelecionadaParaExcluir({ id, title });
    setExcluirAberto(true);
  }

  function fecharModalExcluir() {
    setExcluirAberto(false);
    setSelecionadaParaExcluir(null);
  }

  async function confirmarExcluir() {
    if (!selecionadaParaExcluir) return;
    const id = selecionadaParaExcluir.id;
    try {
      setDeletingId(id);
      await AvaliacoesService.delete(id);
      setAvaliacoes((prev) => prev.filter((a) => a.id !== id));
      fecharModalExcluir();
    } catch (error) {
      console.error("Erro ao excluir avaliação:", error);
      // eslint-disable-next-line no-alert
      alert(error instanceof Error ? error.message : "Erro ao excluir avaliação.");
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    carregarAvaliacoes(page);
  }, [page]);

  const avaliacoesFiltradas = useMemo(() => {
    return avaliacoes.filter((avaliacao) => {
      if (!search.trim()) return true;
      return (avaliacao.title || "")
        .toLowerCase()
        .includes(search.toLowerCase().trim());
    });
  }, [avaliacoes, search]);

  function handleLimparFiltros() {
    setSearch("");
    setPage(1);
  }

  return (
    <>
      <main>
        <div className="max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => navigate("/dashboard")}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer shrink-0"
                title="Voltar"
              >
                <ArrowLeft size={22} />
              </button>

              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                  Minhas Avaliações
                </h1>
                <p className="text-gray-500 text-sm sm:text-base mt-0.5 sm:mt-1">
                  Visualize e acompanhe suas avaliações publicadas
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => navigate("/avaliacoes/rascunhos")}
                className="inline-flex items-center justify-center gap-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-5 py-3 rounded-2xl font-semibold transition-colors duration-300 cursor-pointer"
              >
                <Bookmark size={18} />
                Rascunhos
              </button>

              <button
                onClick={() => navigate("/avaliacoes/criar")}
                className="inline-flex items-center justify-center gap-2 bg-[#2EC5B6] hover:bg-[#27b3a6] text-white px-5 py-3 rounded-2xl font-semibold transition-colors duration-300 cursor-pointer"
              >
                <Plus size={20} />
                Nova Avaliação
              </button>
            </div>
          </div>

          <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buscar avaliação
                </label>
                <div className="relative">
                  <Search
                    size={18}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(1);
                    }}
                    className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]"
                    placeholder="Ex: Prova de História"
                  />
                </div>
              </div>

              <div className="flex items-end">
                <button
                  onClick={handleLimparFiltros}
                  className="w-full sm:w-auto px-5 py-3 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-50 transition-colors duration-300 cursor-pointer"
                >
                  Limpar filtros
                </button>
              </div>
            </div>
          </div>

          {carregando ? (
            <div className="flex justify-center items-center py-20">
              <IconeCarregamento w={32} h={32} color="black" />
            </div>
          ) : erro ? (
            <div className="bg-red-50 border border-red-300 text-red-700 p-6 rounded-2xl text-center">
              <p>{erro}</p>
              <button
                onClick={() => carregarAvaliacoes(page)}
                className="mt-3 text-sm underline cursor-pointer"
              >
                Tentar novamente
              </button>
            </div>
          ) : avaliacoesFiltradas.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <FileText size={48} className="mx-auto mb-4 opacity-50" />
              <p className="text-lg">
                Você ainda não possui avaliações publicadas.
              </p>
              <p className="text-sm mt-1">
                Clique em "Nova Avaliação" para criar sua primeira prova.
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-4">
                {avaliacoesFiltradas.map((avaliacao) => (
                  <CardAvaliacao
                    key={avaliacao.id}
                    avaliacao={avaliacao}
                    onPreview={abrirPreview}
                    onRequestDelete={(id) => abrirModalExcluir(id, avaliacao.title)}
                    deleting={deletingId === avaliacao.id}
                  />
                ))}
              </div>

              {meta && meta.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-8">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1}
                    className="p-2 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ChevronLeft size={20} />
                  </button>

                  <span className="text-sm text-gray-600">
                    Página <span className="font-semibold">{meta.page}</span> de{" "}
                    <span className="font-semibold">{meta.totalPages}</span>{" "}
                    <span className="text-gray-400">
                      ({meta.total} avaliações)
                    </span>
                  </span>

                  <button
                    onClick={() =>
                      setPage((p) => Math.min(meta.totalPages, p + 1))
                    }
                    disabled={page >= meta.totalPages}
                    className="p-2 rounded-xl border border-gray-300 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <ModalPreviewAvaliacao
        avaliacao={preview}
        aberto={modalAberto}
        carregando={carregandoPreview}
        onClose={fecharPreview}
      />
      <ModalConfirmDelete
        aberto={excluirAberto}
        titulo={selecionadaParaExcluir?.title ?? "Excluir avaliação"}
        descricao="Esta ação irá remover permanentemente a avaliação. Deseja continuar?"
        loading={!!deletingId}
        onCancel={fecharModalExcluir}
        onConfirm={confirmarExcluir}
      />
    </>
  );
}