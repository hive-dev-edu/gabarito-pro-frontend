import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "./Header";
import RotaProtegida from "./RotaProtegida";
import Sidebar from "./Sidebar";

/**
 * Layout para rotas protegidas.
 * Renderiza o Header fixo + o conteúdo da rota filha via <Outlet />.
 */
export default function LayoutProtegido() {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
        if (typeof window === "undefined") return false;
        return window.localStorage.getItem("sidebarCollapsed") === "1";
    });

    useEffect(() => {
        if (typeof window === "undefined") return;
        try {
            window.localStorage.setItem(
                "sidebarCollapsed",
                sidebarCollapsed ? "1" : "0",
            );
        } catch {
            void 0;
        }
    }, [sidebarCollapsed]);

    return (
        <RotaProtegida>
            <div className="min-h-screen bg-gray-50 flex">
                <Sidebar
                    collapsed={sidebarCollapsed}
                    onToggleCollapsed={() => setSidebarCollapsed((v) => !v)}
                />

                <div className="flex-1 min-w-0 flex flex-col">
                    <Header showBrand={false} />
                    <div className="flex-1 min-w-0">
                        <Outlet />
                    </div>
                </div>
            </div>
        </RotaProtegida>
    );
}
