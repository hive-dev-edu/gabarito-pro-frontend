import { httpClient } from "../../../utils/httpClient";
import axios from "axios";
import type {
    ListagemQuestoesResposta,
    Questao,
    FiltrosQuestao,
    FiltrosQuestoesPrivadas,
    CriarQuestaoRequisicao,
    AtualizarQuestaoRequisicao,
} from "../types/questoes.types";

export class QuestoesService {
    // ── 1. Listar questões públicas (com filtros e paginação) ──
    async listar(
        filtros: FiltrosQuestao = {},
    ): Promise<ListagemQuestoesResposta> {
        try {
            const params = new URLSearchParams();

            if (filtros.myQuestions === "false")
                params.set("myQuestions", "false");
            if (filtros.subject) params.set("subject", filtros.subject);
            if (filtros.schoolYear)
                params.set("schoolYear", filtros.schoolYear);
            if (filtros.difficulty)
                params.set("difficulty", filtros.difficulty);
            params.set("page", String(filtros.page ?? 1));
            params.set("limit", String(filtros.limit ?? 10));

            const response = await httpClient.get(`/questions?${params}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error("Erro ao listar questões.");
            }
            throw new Error("Erro desconhecido ao listar questões.");
        }
    }

    // ── 2. Listar questões privadas (do usuário autenticado) ──
    async listarPrivadas(
        filtros: FiltrosQuestoesPrivadas = {},
    ): Promise<ListagemQuestoesResposta> {
        try {
            const params = new URLSearchParams();

            if (filtros.subject) params.set("subject", filtros.subject);
            if (filtros.schoolYear)
                params.set("schoolYear", filtros.schoolYear);
            if (filtros.difficulty)
                params.set("difficulty", filtros.difficulty);
            params.set("page", String(filtros.page ?? 1));
            params.set("limit", String(filtros.limit ?? 10));

            const response = await httpClient.get(
                `/questions/private?${params}`,
            );
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error("Erro ao listar questões privadas.");
            }
            throw new Error("Erro desconhecido ao listar questões privadas.");
        }
    }

    // ── 3. Buscar questão por ID ──
    async buscarPorId(id: string): Promise<Questao> {
        try {
            const response = await httpClient.get(`/questions/${id}`);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    throw new Error("Questão não encontrada.");
                }
                if (error.response?.status === 403) {
                    throw new Error(
                        "Você não tem permissão para acessar esta questão.",
                    );
                }
                throw new Error("Erro ao buscar questão.");
            }
            throw new Error("Erro desconhecido ao buscar questão.");
        }
    }

    // ── 3. Criar questão ──
    async criar(dados: CriarQuestaoRequisicao): Promise<Questao> {
        try {
            const response = await httpClient.post("/questions", dados);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                throw new Error("Erro ao criar questão.");
            }
            throw new Error("Erro desconhecido ao criar questão.");
        }
    }

    // ── 4. Atualizar questão ──
    async atualizar(
        id: string,
        dados: AtualizarQuestaoRequisicao,
    ): Promise<Questao> {
        try {
            const response = await httpClient.patch(`/questions/${id}`, dados);

            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    throw new Error("Questão não encontrada.");
                }
                if (error.response?.status === 403) {
                    throw new Error(
                        "Você não tem permissão para editar esta questão.",
                    );
                }
                throw new Error("Erro ao atualizar questão.");
            }
            throw new Error("Erro desconhecido ao atualizar questão.");
        }
    }

    // ── 5. Excluir questão ──
    async excluir(id: string): Promise<void> {
        try {
            await httpClient.delete(`/questions/${id}`);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 404) {
                    throw new Error("Questão não encontrada.");
                }
                if (error.response?.status === 403) {
                    throw new Error(
                        "Você não tem permissão para excluir esta questão.",
                    );
                }
                throw new Error("Erro ao excluir questão.");
            }
            throw new Error("Erro desconhecido ao excluir questão.");
        }
    }
}
