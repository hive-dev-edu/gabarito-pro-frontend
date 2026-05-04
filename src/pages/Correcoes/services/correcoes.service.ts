import axios from "axios";
import { httpClient } from "../../../utils/httpClient";

import type {
    CorrecoesListParams,
    CorrecoesListResponse,
} from "../types/correcoes.types";

function toPositiveInt(value: unknown, fallback: number) {
    if (value === undefined || value === null || value === "") return fallback;
    const num = typeof value === "number" ? value : Number(value);
    if (!Number.isFinite(num)) return fallback;
    return Math.max(1, Math.trunc(num));
}

function setIfPresent(params: URLSearchParams, key: string, value: unknown) {
    if (value === undefined || value === null) return;
    const str = String(value).trim();
    if (!str) return;
    params.set(key, str);
}

export class CorrecoesService {
    async listar(filtros: CorrecoesListParams = {}): Promise<CorrecoesListResponse> {
        try {
            const params = new URLSearchParams();

            params.set("page", String(toPositiveInt(filtros.page, 1)));
            params.set("limit", String(toPositiveInt(filtros.limit, 10)));

            setIfPresent(params, "assessmentId", filtros.assessmentId);
            setIfPresent(params, "title", filtros.title);
            setIfPresent(params, "studentName", filtros.studentName);
            setIfPresent(params, "status", filtros.status);

            const response = await httpClient.get(`/corrections?${params.toString()}`);
            return response.data as CorrecoesListResponse;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 401) throw new Error("Não autenticado.");
                if (status === 400) throw new Error("Filtros inválidos.");
                throw new Error("Erro ao carregar correções.");
            }
            throw new Error("Erro desconhecido ao carregar correções.");
        }
    }
}

export default new CorrecoesService();
