export type StatusAvaliacao = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface AlternativaAvaliacao {
  id: string;
  text: string;
}

export interface QuestaoAvaliacao {
  questionId: string;
  weight: number;
  position: number;

  statement?: string;
  content?: string;
  subject?: string;
  schoolYear?: string;
  difficulty?: string;
  alternatives?: AlternativaAvaliacao[];

  question?: {
    id?: string;
    statement?: string;
    content?: string;
    subject?: string;
    schoolYear?: string;
    difficulty?: string;
    alternatives?: AlternativaAvaliacao[];
  };
}

export interface Avaliacao {
  id: string;
  title: string;
  date: string;
  totalScore: number;
  status: StatusAvaliacao;
  classId: string;

  className?: string;
  questionsCount?: number;

  teacherId?: string;
  createdAt?: string;
  updatedAt?: string;

  questions: QuestaoAvaliacao[];
}

export interface CreateAvaliacaoDTO {
  title: string;
  date: string;
  totalScore: number;
  status: StatusAvaliacao;
  classId: string;
  questions: Array<{
    questionId: string;
    weight: number;
    position: number;
  }>;
}

export interface PaginatedAvaliacoesResponse {
  items: Avaliacao[];
  data: Avaliacao[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}