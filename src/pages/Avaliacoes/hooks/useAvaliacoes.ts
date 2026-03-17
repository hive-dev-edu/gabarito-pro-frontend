import { useEffect, useState } from "react";
import AvaliacoesService from "../services/avaliacoes.service";
import type { Avaliacao } from "../types/avaliacao.types";

export function useAvaliacoes(status: "PUBLISHED" | "DRAFT") {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);

  async function carregar() {
    setLoading(true);

    const data =
      status === "PUBLISHED"
        ? await AvaliacoesService.getPublished()
        : await AvaliacoesService.getDrafts();

    setAvaliacoes(data.items);

    setLoading(false);
  }

  useEffect(() => {
    carregar();
  }, [status]);

  return {
    avaliacoes,
    loading,
    recarregar: carregar,
  };
}