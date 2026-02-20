import { httpClient } from "../../../utils/httpClient";
import axios from "axios";

export interface Usuario {
    id: string;
    email: string;
    name: string;
    role: "student" | "guardianship";
}

export interface TrocarSenhaRequisicao {
    oldPassword: string;
    newPassword: string;
}

export class PerfilService {
    async obterUsuarioLogado(): Promise<Usuario> {
        try {
            const response = await httpClient.get("/users/me");
            return response.data;
        } catch (error) {
            console.error("Erro ao obter usuário logado: ", error);
            throw new Error("Erro ao obter usuário logado");
        }
    }

    async trocarSenha(dados: TrocarSenhaRequisicao): Promise<void> {
        try {
            await httpClient.patch("/users/change-password", dados);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error.response?.status === 400) {
                    throw new Error("Senha atual incorreta.");
                }
                if (error.response?.status === 401) {
                    throw new Error("Sessão expirada. Faça login novamente.");
                }
                throw new Error("Erro ao trocar senha.");
            }
            throw new Error("Erro desconhecido ao trocar senha.");
        }
    }
}
