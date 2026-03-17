import { httpClient } from "../../../utils/httpClient";
import type {
  CreateTurmaDTO,
  PaginatedTurmasResponse,
  Turma,
} from "../types/turma.types";

class TurmasService {
  async getAll(page = 1, limit = 10): Promise<PaginatedTurmasResponse> {
    const response = await httpClient.get("/classes", {
      params: { page, limit },
    });

    return response.data;
  }

  async create(data: CreateTurmaDTO): Promise<Turma> {
    const response = await httpClient.post("/classes", data);
    return response.data;
  }

  async update(id: string, data: CreateTurmaDTO): Promise<Turma> {
    const response = await httpClient.put(`/classes/${id}`, data);
    return response.data;
  }

  async delete(id: string): Promise<void> {
    await httpClient.delete(`/classes/${id}`);
  }

  async getById(id: string): Promise<Turma> {
    const response = await httpClient.get(`/classes/${id}`);
    return response.data;
  }
}

export default new TurmasService();