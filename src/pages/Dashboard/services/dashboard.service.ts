import { httpClient } from "../../../utils/httpClient";
import type {
    ListagemQuestoesResposta,
} from "../../Questoes/types/questoes.types";
import {
    obterUsuarioLogadoCached,
    type UsuarioLogado,
} from "../../../shared/services/usuarioLogado.service";

export type Usuario = UsuarioLogado;

export class DashboardService {
    async obterUsuarioLogado(): Promise<Usuario> {
        try {
            return await obterUsuarioLogadoCached();
        } catch (error) {
            console.error("Erro ao obter usuário logado: ", error);
            throw new Error("Erro ao obter usuário logado");
        }
    }

    async obterQuestoesRecentes(): Promise<ListagemQuestoesResposta> {
        try {
            const params = new URLSearchParams();
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
