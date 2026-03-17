export interface Turma {
  id: string;
  name: string;
  gradeLevel: string | null;
  teacherId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTurmaDTO {
  name: string;
  gradeLevel: string;
}

export interface PaginatedTurmasResponse {
  data: Turma[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}