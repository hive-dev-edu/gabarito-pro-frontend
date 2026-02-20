/**
 * Utilitário de autenticação.
 *
 * - `estaAutenticado()` — verifica se existe um token JWT válido e não expirado.
 * - `obterPayloadToken()` — retorna o payload decodificado do token.
 * - `logout()` — remove o token e, opcionalmente, redireciona.
 */

interface TokenPayload {
    sub?: string;
    id?: string;
    email?: string;
    exp?: number;
    iat?: number;
    [key: string]: unknown;
}

/**
 * Decodifica o payload de um JWT (sem validar assinatura — isso é papel do backend).
 */
export function obterPayloadToken(): TokenPayload | null {
    const token = localStorage.getItem("accessToken");
    if (!token) return null;

    try {
        const base64 = token.split(".")[1];
        const json = atob(base64);
        return JSON.parse(json) as TokenPayload;
    } catch {
        return null;
    }
}

/**
 * Retorna `true` se houver um token no localStorage **e** ele ainda não expirou.
 */
export function estaAutenticado(): boolean {
    const payload = obterPayloadToken();
    if (!payload) return false;

    // Se o token tem campo `exp`, verifica expiração
    if (payload.exp) {
        const agora = Math.floor(Date.now() / 1000); // segundos
        if (payload.exp < agora) {
            // Token expirado → limpa
            localStorage.removeItem("accessToken");
            return false;
        }
    }

    return true;
}

/**
 * Remove o token do localStorage.
 */
export function logout(): void {
    localStorage.removeItem("accessToken");
}
