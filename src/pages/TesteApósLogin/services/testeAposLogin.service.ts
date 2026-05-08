import {
    obterUsuarioLogadoCached,
} from "../../../shared/services/usuarioLogado.service";

export class TesteAposLoginService { 
    async obterUsuarioLogado() {
        try {
            const usuario = await obterUsuarioLogadoCached();
            console.log(usuario);
            return usuario;
        } catch (error) {
            console.error("Erro ao obter usuário logado: ", error);
            throw new Error("Erro ao obter usuário logado");
        }
    }
}