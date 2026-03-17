import { useCallback, useEffect, useState } from "react";
import VersoesService from "../services/versoes.service";
import type { PrintDataResponse } from "../types/versao.types";

interface UsePrintDataResult {
  data: PrintDataResponse | null;
  loading: boolean;
  error: string;
  refetch: () => Promise<void>;
  reset: () => void;
}

interface UsePrintDataOptions {
  enabled?: boolean;
}

export function usePrintData(
  assessmentId?: string | null,
  options: UsePrintDataOptions = {}
): UsePrintDataResult {
  const { enabled = true } = options;
  const [data, setData] = useState<PrintDataResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const refetch = useCallback(async () => {
    if (!assessmentId || !enabled) return;
    setLoading(true);
    setError("");

    try {
      const response = await VersoesService.obterDadosImpressao(assessmentId);
      setData(response);
    } catch (err) {
      setData(null);
      setError(err instanceof Error ? err.message : "Erro ao carregar dados de impressao.");
    } finally {
      setLoading(false);
    }
  }, [assessmentId, enabled]);

  const reset = useCallback(() => {
    setData(null);
    setError("");
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!assessmentId || !enabled) {
      reset();
      return;
    }

    refetch();
  }, [assessmentId, enabled, refetch, reset]);

  return {
    data,
    loading,
    error,
    refetch,
    reset,
  };
}
