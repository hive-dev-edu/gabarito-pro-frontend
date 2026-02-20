import { httpClient } from "../../../utils/httpClient";

export interface Usuario {
    id: string;
    email: string;
    name: string;
    role: "student" | "guardianship";
}

export class DashboardService {
    async obterUsuarioLogado(): Promise<Usuario> {
        try {
            const response = await httpClient.get("/users/me");
            return response.data;
        } catch (error) {
            console.error("Erro ao obter usuário logado: ", error);
            throw new Error("Erro ao obter usuário logado");
        }
    }
}
