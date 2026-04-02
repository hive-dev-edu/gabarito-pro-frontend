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

function extractApiErrorMessage(data: unknown): string | null {
    if (!data) return null;

    if (typeof data === "string") return data;

    if (typeof data === "object") {
        const record = data as Record<string, unknown>;

        const message = record.message;
        if (typeof message === "string" && message.trim()) return message;

        const error = record.error;
        if (typeof error === "string" && error.trim()) return error;

        const errors = record.errors;
        if (Array.isArray(errors)) {
            const parts = errors
                .map((e) => {
                    if (typeof e === "string") return e;
                    if (e && typeof e === "object") {
                        const er = e as Record<string, unknown>;
                        const msg = er.message;
                        if (typeof msg === "string") return msg;
                        const field = er.field;
                        const detail = er.detail;
                        if (typeof field === "string" && typeof detail === "string") {
                            return `${field}: ${detail}`;
                        }
                    }
                    return null;
                })
                .filter(Boolean);

            if (parts.length > 0) return parts.join("\n");
        }
    }

    try {
        return JSON.stringify(data);
    } catch {
        return null;
    }
}

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

function isBoolean(value: unknown): value is boolean {
    return typeof value === "boolean";
}

function isValidEnum<T extends string>(value: unknown, allowed: readonly T[]): value is T {
    return typeof value === "string" && (allowed as readonly string[]).includes(value);
}

const EDUCATION_LEVEL_ALLOWED = [
    "ensino_tecnico",
    "ensino_medio",
    "ensino_superior",
    "ensino_fundamental",
    "outro",
] as const;

const DIFFICULTY_ALLOWED = ["easy", "medium", "hard"] as const;

const QUESTION_TYPE_ALLOWED = ["multiple_choice", "true_false", "essay"] as const;

function validateAlternativesRules(payload: CriarQuestaoRequisicao) {
    const questionType = payload.questionType;

    // essay: pode não exigir alternativas
    if (questionType === "essay") {
        return;
    }

    const alternatives = payload.alternatives;
    if (!Array.isArray(alternatives)) {
        throw new Error("Alternativas são obrigatórias para este tipo de questão.");
    }

    if (questionType === "true_false") {
        if (alternatives.length !== 2) {
            throw new Error("Questões de Verdadeiro/Falso devem ter exatamente 2 alternativas.");
        }
    } else {
        // multiple_choice
        if (alternatives.length !== 5) {
            throw new Error("A questão deve conter exatamente 5 alternativas.");
        }
    }

    const vazias = alternatives.filter((a) => !a?.text?.trim());
    if (vazias.length > 0) {
        throw new Error("Todas as alternativas devem ter texto.");
    }

    const corretas = alternatives.filter((a) => a?.isCorrect === true);
    if (corretas.length !== 1) {
        throw new Error("Deve existir exatamente 1 alternativa correta.");
    }
}

function buildCreateQuestionBody(payload: CriarQuestaoRequisicao) {
    // Campos obrigatórios do schema novo
    if (!payload.statement?.trim()) throw new Error("statement é obrigatório.");
    if (!payload.content?.trim()) throw new Error("content é obrigatório.");
    if (!payload.subject?.trim()) throw new Error("subject é obrigatório.");

    if (!isValidEnum(payload.educationLevel, EDUCATION_LEVEL_ALLOWED)) {
        throw new Error("educationLevel inválido.");
    }

    if (!isValidEnum(payload.questionType, QUESTION_TYPE_ALLOWED)) {
        throw new Error("questionType inválido.");
    }

    const gradeNumber = toPositiveInt(payload.grade, 0);
    if (gradeNumber <= 0) {
        throw new Error("grade deve ser um número inteiro > 0.");
    }

    if (!isValidEnum(payload.difficulty, DIFFICULTY_ALLOWED)) {
        throw new Error("difficulty inválida.");
    }

    // Regras de alternatives (dependem do tipo)
    validateAlternativesRules(payload);

    const isPublic = isBoolean(payload.isPublic) ? payload.isPublic : false;
    return {
        statement: payload.statement.trim(),
        content: payload.content.trim(),
        subject: payload.subject.trim(),
        educationLevel: payload.educationLevel,
        grade: gradeNumber,
        questionType: payload.questionType,
        difficulty: payload.difficulty,
        isPublic,
        alternatives: payload.questionType === "essay" ? undefined : payload.alternatives,
    };
}

export class QuestoesService {
    // ── 1. Listar questões públicas (com filtros e paginação) ──
    async listar(
        filtros: FiltrosQuestao = {},
    ): Promise<ListagemQuestoesResposta> {
        try {
            const params = new URLSearchParams();

            // filtros dinâmicos (só aplica se vierem no input)
            setIfPresent(params, "myQuestions", filtros.myQuestions);
            setIfPresent(params, "subject", filtros.subject);
            setIfPresent(params, "educationLevel", filtros.educationLevel);
            setIfPresent(params, "grade", filtros.grade);

            setIfPresent(params, "difficulty", filtros.difficulty);

            // paginação
            params.set("page", String(toPositiveInt(filtros.page, 1)));
            params.set("limit", String(toPositiveInt(filtros.limit, 10)));

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

            setIfPresent(params, "subject", filtros.subject);
            setIfPresent(params, "educationLevel", filtros.educationLevel);
            setIfPresent(params, "grade", filtros.grade);

            setIfPresent(params, "difficulty", filtros.difficulty);

            params.set("page", String(toPositiveInt(filtros.page, 1)));
            params.set("limit", String(toPositiveInt(filtros.limit, 10)));

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
            const body = buildCreateQuestionBody(dados);
            const response = await httpClient.post("/questions", body);
            return response.data;
        } catch (error) {
            if (axios.isAxiosError(error)) {
                const status = error.response?.status;
                const apiMessage = extractApiErrorMessage(error.response?.data);

                if (status === 422 && apiMessage) {
                    throw new Error(apiMessage);
                }

                throw new Error("Erro ao criar questão.");
            }
            if (error instanceof Error) {
                // preserva mensagens de validação do client
                throw error;
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
