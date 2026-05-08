import { httpClient } from "../../utils/httpClient";

export interface UsuarioLogado {
    id: string;
    email: string;
    name: string;
    role: "student" | "guardianship";
}

let usuarioCache: UsuarioLogado | null = null;
let tokenCache: string | null = null;
let requisicaoEmAndamento: Promise<UsuarioLogado> | null = null;

export function limparUsuarioLogadoCache(): void {
    usuarioCache = null;
    tokenCache = null;
    requisicaoEmAndamento = null;
}

interface ObterUsuarioLogadoOpcoes {
    force?: boolean;
}

/**
 * Retorna o usuário logado (GET /users/me) com cache em memória.
 * - Evita múltiplas chamadas ao navegar entre páginas.
 * - Se o token mudar, o cache é invalidado automaticamente.
 */
export async function obterUsuarioLogadoCached(
    opcoes: ObterUsuarioLogadoOpcoes = {},
): Promise<UsuarioLogado> {
    const { force = false } = opcoes;
    const tokenAtual = localStorage.getItem("accessToken");

    if (!tokenAtual) {
        limparUsuarioLogadoCache();
        throw new Error("Não autenticado.");
    }

    if (tokenCache && tokenAtual !== tokenCache) {
        limparUsuarioLogadoCache();
    }

    if (!force && usuarioCache) {
        return usuarioCache;
    }

    if (!force && requisicaoEmAndamento) {
        return requisicaoEmAndamento;
    }

    requisicaoEmAndamento = httpClient
        .get("/users/me")
        .then((response) => {
            usuarioCache = response.data as UsuarioLogado;
            tokenCache = tokenAtual;
            return usuarioCache;
        })
        .finally(() => {
            requisicaoEmAndamento = null;
        });

    return requisicaoEmAndamento;
}
