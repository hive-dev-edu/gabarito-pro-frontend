import { Navigate } from "react-router-dom";
import { estaAutenticado } from "../../utils/auth";

interface RotaProtegidaProps {
    children: React.ReactNode;
}

/**
 * Wrapper que protege rotas autenticadas.
 * Se o usuário não tem token ou o token expirou, redireciona para `/login`.
 */
export default function RotaProtegida({ children }: RotaProtegidaProps) {
    if (!estaAutenticado()) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}
