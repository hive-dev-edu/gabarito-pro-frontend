import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, User, Home, BookOpen, Users, FileCheck2 } from "lucide-react";
import { obterPayloadToken } from "../../utils/auth";

function navItemClassName(isActive: boolean) {
    const base =
        "flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-sm rounded-lg transition-colors";

    return isActive
        ? `${base} bg-emerald-100 text-gray-900`
        : `${base} text-gray-600 hover:bg-gray-100`;
}

export default function Header() {
    const navigate = useNavigate();
    const payload = obterPayloadToken();
    const nomeUsuario = (payload as Record<string, unknown>)?.name as
        | string
        | undefined;

    function handleLogout() {
        localStorage.removeItem("accessToken");
        navigate("/login", { replace: true });
    }

    return (
        <header className="bg-white shadow-sm sticky top-0 z-40">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
                {/* Logo + Nav */}
                <div className="flex items-center gap-2 sm:gap-6">
                    <Link
                        to="/dashboard"
                        className="flex items-center gap-2 shrink-0"
                    >
                        <img
                            src="/images/logo-gabarito-pro.png"
                            alt="Logo Gabarito Pro"
                            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full"
                        />
                        <span className="font-semibold text-lg text-gray-800 hidden sm:inline">
                            Gabarito.pro
                        </span>
                    </Link>

                    <nav className="flex items-center gap-0.5 sm:gap-1">
                        <NavLink
                            to="/dashboard"
                            end
                            className={({ isActive }) => navItemClassName(isActive)}
                        >
                            <Home size={16} />
                            <span className="hidden sm:inline">Início</span>
                        </NavLink>
                        <NavLink
                            to="/questoes"
                            className={({ isActive }) => navItemClassName(isActive)}
                        >
                            <BookOpen size={16} />
                            <span className="hidden sm:inline">Questões</span>
                        </NavLink>
                        <NavLink
                            to="/turmas"
                            className={({ isActive }) => navItemClassName(isActive)}
                        >
                            <Users size={16} />
                            <span className="hidden sm:inline">Minhas Turmas</span>
                        </NavLink>
                        <NavLink
                            to="/avaliacoes"
                            className={({ isActive }) => navItemClassName(isActive)}
                        >
                            <BookOpen size={16} />
                            <span className="hidden sm:inline">Avaliações</span>
                        </NavLink>

                        <NavLink
                            to="/correcoes"
                            className={({ isActive }) => navItemClassName(isActive)}
                        >
                            <FileCheck2 size={16} />
                            <span className="hidden sm:inline">Correções</span>
                        </NavLink>
                    </nav>
                </div>

                {/* Usuário + Perfil + Logout */}
                <div className="flex items-center gap-1.5 sm:gap-3">
                    <NavLink
                        to="/perfil"
                        className={({ isActive }) => navItemClassName(isActive)}
                    >
                        <User size={16} />
                        <span className="hidden sm:inline font-medium">
                            {nomeUsuario ?? "Perfil"}
                        </span>
                    </NavLink>

                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-sm text-red-600 border border-red-200 rounded-xl hover:bg-red-50 transition-colors duration-300 cursor-pointer"
                    >
                        <LogOut size={15} />
                        <span className="hidden sm:inline">Sair</span>
                    </button>
                </div>
            </div>
        </header>
    );
}
