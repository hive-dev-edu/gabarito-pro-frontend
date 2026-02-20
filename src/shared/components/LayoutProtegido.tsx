import { Outlet } from "react-router-dom";
import Header from "./Header";
import RotaProtegida from "./RotaProtegida";

/**
 * Layout para rotas protegidas.
 * Renderiza o Header fixo + o conteúdo da rota filha via <Outlet />.
 */
export default function LayoutProtegido() {
    return (
        <RotaProtegida>
            <div className="min-h-screen bg-gray-50 flex flex-col">
                <Header />
                <div className="flex-1">
                    <Outlet />
                </div>
            </div>
        </RotaProtegida>
    );
}
