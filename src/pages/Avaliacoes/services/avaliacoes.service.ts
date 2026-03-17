import axios from "axios";
import { httpClient } from "../../../utils/httpClient";
import type {
  Avaliacao,
  CreateAvaliacaoDTO,
  PaginatedAvaliacoesResponse,
  QuestaoAvaliacao,
} from "../types/avaliacao.types";

function normalizeQuestion(question: any): QuestaoAvaliacao {
  return {
    questionId: String(question?.questionId ?? question?.id ?? ""),
    weight: Number(question?.weight ?? 0),
    position: Number(question?.position ?? 0),

    statement: question?.statement ?? question?.question?.statement ?? "",
    content: question?.content ?? question?.question?.content ?? "",
    subject: question?.subject ?? question?.question?.subject ?? "",
    schoolYear: question?.schoolYear ?? question?.question?.schoolYear ?? "",
    difficulty: question?.difficulty ?? question?.question?.difficulty ?? "",
    alternatives: Array.isArray(question?.alternatives)
      ? question.alternatives
      : Array.isArray(question?.question?.alternatives)
      ? question.question.alternatives
      : [],

    question: question?.question
      ? {
          id: question.question?.id ?? question?.questionId ?? "",
          statement: question.question?.statement ?? question?.statement ?? "",
          content: question.question?.content ?? question?.content ?? "",
          subject: question.question?.subject ?? question?.subject ?? "",
          schoolYear:
            question.question?.schoolYear ?? question?.schoolYear ?? "",
          difficulty: question.question?.difficulty ?? question?.difficulty ?? "",
          alternatives: Array.isArray(question.question?.alternatives)
            ? question.question.alternatives
            : Array.isArray(question?.alternatives)
            ? question.alternatives
            : [],
        }
      : undefined,
  };
}

function normalizeAssessment(raw: any): Avaliacao {
  const questions = Array.isArray(raw?.questions)
    ? raw.questions.map(normalizeQuestion).sort((a: { position: number; }, b: { position: number; }) => a.position - b.position)
    : [];

  return {
    id: String(raw?.id ?? ""),
    title: raw?.title ?? "",
    date: raw?.date ?? "",
    totalScore: Number(raw?.totalScore ?? 0),
    status: raw?.status ?? "DRAFT",
    classId:
      raw?.classId ??
      raw?.class_id ??
      raw?.class?.id ??
      raw?.classroomId ??
      raw?.classroom_id ??
      raw?.classroom?.id ??
      raw?.turmaId ??
      raw?.turma_id ??
      raw?.turma?.id ??
      raw?.class?.classId ??
      "",

    className:
      raw?.className ??
      raw?.class_name ??
      raw?.class?.name ??
      raw?.class?.title ??
      raw?.classroomName ??
      raw?.classroom_name ??
      raw?.classroom?.name ??
      raw?.turmaName ??
      raw?.turma_name ??
      raw?.turma?.name ??
      raw?.name ??
      "",

    questionsCount:
      Number(
        raw?.questionsCount ??
          raw?.questions_count ??
          raw?.questionCount ??
          raw?.question_count ??
          raw?.totalQuestions ??
          raw?.total_questions ??
          questions.length
      ) || 0,

    teacherId: raw?.teacherId,
    createdAt: raw?.createdAt,
    updatedAt: raw?.updatedAt,
    questions,
  };
}

function normalizePaginatedResponse(raw: any): PaginatedAvaliacoesResponse {
  const data = Array.isArray(raw?.data)
    ? raw.data.map(normalizeAssessment)
    : Array.isArray(raw?.items)
    ? raw.items.map(normalizeAssessment)
    : [];
  return {
    data,
    meta: {
      total: Number(raw?.meta?.total ?? raw?.total ?? 0),
      page: Number(raw?.meta?.page ?? raw?.page ?? 1),
      limit: Number(raw?.meta?.limit ?? raw?.limit ?? 10),
      totalPages: Number(raw?.meta?.totalPages ?? raw?.totalPages ?? 1),
    },
    items: data,
  };
}

class AvaliacoesService {
  async getPublished(
    page = 1,
    limit = 10
  ): Promise<PaginatedAvaliacoesResponse> {
    const response = await httpClient.get("/assessments", {
      params: { status: "PUBLISHED", page, limit },
    });

    return normalizePaginatedResponse(response.data);
  }

  async getDrafts(
    page = 1,
    limit = 10
  ): Promise<PaginatedAvaliacoesResponse> {
    const response = await httpClient.get("/assessments", {
      params: { status: "DRAFT", page, limit },
    });

    return normalizePaginatedResponse(response.data);
  }

  async getById(id: string): Promise<Avaliacao> {
    const response = await httpClient.get(`/assessments/${id}`);
    return normalizeAssessment(response.data);
  }

  async create(data: CreateAvaliacaoDTO): Promise<Avaliacao> {
    try {
      const response = await httpClient.post("/assessments", data);
      return normalizeAssessment(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Erro ao criar avaliação."
        );
      }
      throw new Error("Erro desconhecido ao criar avaliação.");
    }
  }

  async update(id: string, data: CreateAvaliacaoDTO): Promise<Avaliacao> {
    try {
      const response = await httpClient.put(`/assessments/${id}`, data);
      return normalizeAssessment(response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(
          error.response?.data?.message || "Erro ao atualizar avaliação."
        );
      }
      throw new Error("Erro desconhecido ao atualizar avaliação.");
    }
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/assessments/${id}`);
  }
}

export default new AvaliacoesService();