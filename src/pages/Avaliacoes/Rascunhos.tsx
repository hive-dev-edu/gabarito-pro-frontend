import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  FilePenLine,
  Plus,
  Search,
} from "lucide-react";

import AvaliacoesService from "./services/avaliacoes.service";
import type { Avaliacao } from "./types/avaliacao.types";
import CardRascunho from "./components/CardRascunho";
import ModalConfirmDelete from "./components/ModalConfirmDelete";
import IconeCarregamento from "../../shared/components/IconeCarregamento";

export default function PaginaRascunhos() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const limit = 10;

  const [rascunhos, setRascunhos] = useState<Avaliacao[]>([]);
  const [meta, setMeta] = useState<{
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);

  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");
  const [excluirAberto, setExcluirAberto] = useState(false);
  const [selecionadaParaExcluir, setSelecionadaParaExcluir] = useState<{
    id: string;
    title?: string;
  } | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function carregarRascunhos(currentPage = 1) {
    setCarregando(true);
    setErro("");

    try {
      const resposta = await AvaliacoesService.getDrafts(currentPage, limit);
      setRascunhos(resposta.data);
      setMeta(resposta.meta);
    } catch (error) {
      console.error("Erro ao carregar rascunhos:", error);
      setErro(
        error instanceof Error ? error.message : "Erro ao carregar rascunhos."
      );
      setRascunhos([]);
      setMeta(null);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarRascunhos(page);
  }, [page]);

  const rascunhosFiltrados = useMemo(() => {
    return rascunhos.filter((avaliacao) => {
      if (!search.trim()) return true;
      return (avaliacao.title || "")
        .toLowerCase()
        .includes(search.toLowerCase().trim());
    });
  }, [rascunhos, search]);

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
      setRascunhos((prev) => prev.filter((a) => a.id !== id));
      fecharModalExcluir();
    } catch (error) {
      console.error(error);
      setErro(error instanceof Error ? error.message : "Erro ao excluir rascunho.");
    } finally {
      setDeletingId(null);
    }
  }

  function handleLimparFiltros() {
    setSearch("");
    setPage(1);
  }

  return (
    <main>
      <div className="mx-auto max-w-5xl px-3 py-6 sm:px-4 sm:py-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate("/avaliacoes")}
              className="shrink-0 rounded-2xl p-2 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
              title="Voltar"
            >
              <ArrowLeft size={22} />
            </button>

            <div>
              <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">
                Rascunhos de Avaliações
              </h1>
              <p className="mt-0.5 text-sm text-slate-500 sm:mt-1 sm:text-base">
                Continue editando ou remova provas salvas como rascunho
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/avaliacoes/criar")}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2EC5B6] px-5 py-3 font-semibold text-white transition-colors duration-300 hover:bg-[#27b3a6]"
          >
            <Plus size={20} />
            Nova Avaliação
          </button>
        </div>

        <div className="mb-6 rounded-3xl border border-[#DDEDEA] bg-white p-4 shadow-sm sm:p-6">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto] sm:gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-slate-700">
                Buscar rascunho
              </label>
              <div className="relative">
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                  className="w-full rounded-2xl border border-slate-300 py-3 pl-10 pr-3 focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]"
                  placeholder="Ex: Simulado de Matemática"
                />
              </div>
            </div>

            <div className="flex items-end">
              <button
                onClick={handleLimparFiltros}
                className="w-full rounded-2xl border border-slate-300 px-5 py-3 text-slate-600 transition-colors duration-300 hover:bg-slate-50 sm:w-auto"
              >
                Limpar filtros
              </button>
            </div>
          </div>
        </div>

        {carregando ? (
          <div className="flex items-center justify-center py-20">
            <IconeCarregamento w={32} h={32} color="black" />
          </div>
        ) : erro ? (
          <div className="rounded-3xl border border-red-300 bg-red-50 p-6 text-center text-red-700">
            <p>{erro}</p>
            <button
              onClick={() => carregarRascunhos(page)}
              className="mt-3 cursor-pointer text-sm underline"
            >
              Tentar novamente
            </button>
          </div>
        ) : rascunhosFiltrados.length === 0 ? (
          <div className="py-20 text-center text-slate-400">
            <FilePenLine size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">Você ainda não possui rascunhos salvos.</p>
            <p className="mt-1 text-sm">
              Clique em "Nova Avaliação" para começar uma prova e salvá-la depois.
            </p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {rascunhosFiltrados.map((avaliacao) => (
                <CardRascunho
                  key={avaliacao.id}
                  avaliacao={avaliacao}
                  onEditar={(id) => navigate(`/avaliacoes/criar?id=${id}`)}
                  onRequestDelete={(id) => abrirModalExcluir(id, avaliacao.title)}
                  deleting={deletingId === avaliacao.id}
                />
              ))}
            </div>

            {meta && meta.totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                  className="rounded-2xl border border-slate-300 p-2 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronLeft size={20} />
                </button>

                <span className="text-sm text-slate-600">
                  Página <span className="font-semibold">{meta.page}</span> de{" "}
                  <span className="font-semibold">{meta.totalPages}</span>{" "}
                  <span className="text-slate-400">({meta.total} rascunhos)</span>
                </span>

                <button
                  onClick={() =>
                    setPage((p) => Math.min(meta.totalPages, p + 1))
                  }
                  disabled={page >= meta.totalPages}
                  className="rounded-2xl border border-slate-300 p-2 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-30"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <ModalConfirmDelete
        aberto={excluirAberto}
        titulo={selecionadaParaExcluir?.title ?? "Excluir rascunho"}
        descricao="Esta ação irá remover permanentemente o rascunho. Deseja continuar?"
        loading={!!deletingId}
        onCancel={fecharModalExcluir}
        onConfirm={confirmarExcluir}
      />
    </main>
  );
}
