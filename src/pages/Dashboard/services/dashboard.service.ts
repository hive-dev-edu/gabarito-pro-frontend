import { httpClient } from "../../../utils/httpClient";
import type {
    ListagemQuestoesResposta,
} from "../../Questoes/types/questoes.types";

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

    async obterQuestoesRecentes(): Promise<ListagemQuestoesResposta> {
        try {
            const params = new URLSearchParams();
            params.set("myQuestions", "false");
            params.set("page", "1");
            params.set("limit", "5");

            const response = await httpClient.get(`/questions?${params}`);
            return response.data;
        } catch (error) {
            console.error("Erro ao obter questões recentes: ", error);
            throw new Error("Erro ao obter questões recentes");
        }
    }
}
