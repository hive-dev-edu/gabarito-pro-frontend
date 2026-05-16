import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { ChevronRight } from "lucide-react";
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

    const [sidebarMobileOpen, setSidebarMobileOpen] = useState(false);

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
                    mobileOpen={sidebarMobileOpen}
                    onRequestCloseMobile={() => setSidebarMobileOpen(false)}
                />

                {!sidebarMobileOpen ? (
                    <button
                        type="button"
                        aria-label="Abrir menu"
                        onClick={() => setSidebarMobileOpen(true)}
                        className="lg:hidden fixed left-2 top-1/2 -translate-y-1/2 z-40 h-12 w-10 rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-sm hover:bg-gray-50 transition-colors flex items-center justify-center"
                    >
                        <ChevronRight size={20} />
                    </button>
                ) : null}

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
