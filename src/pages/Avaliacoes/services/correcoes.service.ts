import axios from "axios";
import { httpClient } from "../../../utils/httpClient";
import type {
  CorrecaoRequest,
  SubmitCorrecaoPayload,
  StatusCorrecao,
} from "../types/correcao.types";

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function getString(record: UnknownRecord, key: string): string | undefined {
  const v = record[key];
  return typeof v === "string" ? v : undefined;
}

function getIdLike(record: UnknownRecord, key: string): string | undefined {
  const v = record[key];
  if (typeof v === "string") return v;
  if (typeof v === "number") return String(v);
  return undefined;
}

function normalizeStatus(raw: unknown): StatusCorrecao {
  const s = String(raw ?? "").toUpperCase();
  if (s === "PENDING" || s === "PROCESSING" || s === "COMPLETED" || s === "FAILED") {
    return s;
  }
  return "PENDING";
}

function normalizeCorrecao(raw: unknown): CorrecaoRequest {
  if (!isRecord(raw)) {
    return { id: "", status: "PENDING", result: null, errorMessage: null };
  }

  const nested = isRecord(raw.correctionRequest) ? raw.correctionRequest : undefined;

  const id =
    getIdLike(raw, "id") ??
    getIdLike(raw, "correctionRequestId") ??
    (nested ? getIdLike(nested, "id") : undefined) ??
    "";

  const status = normalizeStatus(raw.status);

  const result = (raw.result ?? (isRecord(raw.data) ? raw.data.result : undefined)) as unknown;

  const errorMessage =
    getString(raw, "errorMessage") ??
    getString(raw, "error") ??
    getString(raw, "message") ??
    null;

  const assessmentVersionId =
    getIdLike(raw, "assessmentVersionId") ?? getIdLike(raw, "assessment_version_id");

  const imageUrl = getString(raw, "imageUrl") ?? getString(raw, "image_url");

  const createdAt = getString(raw, "createdAt");
  const updatedAt = getString(raw, "updatedAt");

  return {
    id,
    status,
    result: (result ?? null) as CorrecaoRequest["result"],
    errorMessage,
    assessmentVersionId,
    imageUrl,
    createdAt,
    updatedAt,
  };
}

class CorrecoesService {
  async submit(payload: SubmitCorrecaoPayload): Promise<string> {
    try {
      const response = await httpClient.post("/corrections", {
        imageUrl: payload.imageUrl,
      });
      const data: unknown = response.data;

      if (!isRecord(data)) {
        throw new Error("Resposta inválida do servidor ao criar correção.");
      }

      const nested = isRecord(data.correctionRequest) ? data.correctionRequest : undefined;

      const id =
        getIdLike(data, "correctionRequestId") ??
        getIdLike(data, "id") ??
        (nested ? getIdLike(nested, "id") : undefined) ??
        getIdLike(data, "requestId");

      if (!id) {
        throw new Error("Resposta inválida do servidor ao criar correção.");
      }

      return id;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const respData: unknown = error.response?.data;
        const message = isRecord(respData) ? getString(respData, "message") : undefined;
        throw new Error(message || "Erro ao enviar imagem para correção.");
      }
      throw new Error("Erro desconhecido ao enviar imagem para correção.");
    }
  }

  async getById(id: string): Promise<CorrecaoRequest> {
    try {
      const response = await httpClient.get(`/corrections/${id}`);
      return normalizeCorrecao(response.data as unknown);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const respData: unknown = error.response?.data;
        const message = isRecord(respData) ? getString(respData, "message") : undefined;
        if (status === 404) throw new Error("Correção não encontrada.");
        throw new Error(message || "Erro ao consultar status da correção.");
      }
      throw new Error("Erro desconhecido ao consultar status da correção.");
    }
  }

  async atualizarNomeAluno(id: string, studentName: string): Promise<void> {
    try {
      await httpClient.patch(`/corrections/${id}/student-name`, {
        studentName,
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const respData: unknown = error.response?.data;
        const message = isRecord(respData) ? getString(respData, "message") : undefined;
        throw new Error(message || "Erro ao salvar nome do aluno.");
      }
      throw new Error("Erro desconhecido ao salvar nome do aluno.");
    }
  }
}

export default new CorrecoesService();
