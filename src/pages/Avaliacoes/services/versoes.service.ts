import axios from "axios";
import { httpClient } from "../../../utils/httpClient";
import type {
  VersaoAvaliacao,
  PrintDataResponse,
  DadosImpressaoVersao,
  AssessmentImpressao,
  QuestaoImpressao,
  AlternativaImpressao,
} from "../types/versao.types";

function normalizarAlternativa(alt: any, index: number): AlternativaImpressao {
  return {
    letter: alt?.letter ?? String.fromCharCode(65 + index),
    text: alt?.text ?? alt?.content ?? "",
  };
}

function normalizarQuestao(q: any, index: number): QuestaoImpressao {
  return {
    position: Number(q?.position ?? index + 1),
    statement: q?.statement ?? q?.enunciado ?? "",
    alternatives: Array.isArray(q?.alternatives)
      ? q.alternatives.map(normalizarAlternativa)
      : [],
  };
}

function normalizarVersao(v: any): DadosImpressaoVersao {
  return {
    versionId: String(v?.versionId ?? v?.id ?? ""),
    versionNumber: Number(v?.versionNumber ?? v?.version_number ?? 0),
    questions: Array.isArray(v?.questions)
      ? v.questions.map(normalizarQuestao)
      : [],
  };
}

function normalizarPrintData(raw: any): PrintDataResponse {
  const assessment: AssessmentImpressao = {
    title: raw?.assessment?.title ?? "",
    date: raw?.assessment?.date ?? "",
    totalScore: Number(raw?.assessment?.totalScore ?? 0),
    className: raw?.assessment?.className ?? "",
  };
  const versions: DadosImpressaoVersao[] = Array.isArray(raw?.versions)
    ? raw.versions.map(normalizarVersao)
    : [];
  return { assessment, versions };
}

class VersoesService {
  async listarPorAvaliacao(assessmentId: string): Promise<VersaoAvaliacao[]> {
    try {
      const response = await httpClient.get(
        `/assessment-versions/assessment/${assessmentId}`
      );
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;
        if (status === 403) {
          throw new Error("Você não tem permissão para acessar as versões desta avaliação.");
        }
        if (status === 404) {
          throw new Error("Avaliação não encontrada.");
        }
        throw new Error(message || "Erro ao carregar versões.");
      }
      throw new Error("Erro desconhecido ao carregar versões.");
    }
  }

  async gerar(assessmentId: string, versionCount: number): Promise<void> {
    try {
      await httpClient.post("/assessment-versions/generate", {
        assessmentId,
        versionCount,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;
        if (status === 400) {
          throw new Error(
            message || "A avaliação não está publicada ou não possui questões."
          );
        }
        if (status === 403) {
          throw new Error("Você não tem permissão para gerar versões desta avaliação.");
        }
        if (status === 404) {
          throw new Error("Avaliação não encontrada.");
        }
        throw new Error(message || "Erro ao gerar versões.");
      }
      throw new Error("Erro desconhecido ao gerar versões.");
    }
  }

  async excluirTodas(assessmentId: string): Promise<void> {
    try {
      await httpClient.delete(
        `/assessment-versions/assessment/${assessmentId}`
      );
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message;
        throw new Error(message || "Erro ao excluir versões.");
      }
      throw new Error("Erro desconhecido ao excluir versões.");
    }
  }

  async obterDadosImpressao(assessmentId: string): Promise<PrintDataResponse> {
    try {
      const response = await httpClient.get(
        `/assessment-versions/assessment/${assessmentId}/print-data`
      );
      return normalizarPrintData(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const message = error.response?.data?.message;
        if (status === 403) {
          throw new Error("Você não tem permissão para acessar os dados desta avaliação.");
        }
        if (status === 404) {
          throw new Error("Avaliação não encontrada ou sem versões geradas.");
        }
        throw new Error(message || "Erro ao carregar dados das versões.");
      }
      throw new Error("Erro desconhecido ao carregar dados das versões.");
    }
  }
}

export default new VersoesService();
