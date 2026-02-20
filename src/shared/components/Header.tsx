import { Link, useNavigate } from "react-router-dom";
import { LogOut, User, Home, BookOpen } from "lucide-react";
import { obterPayloadToken } from "../../utils/auth";

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
            <div className="max-w-5xl mx-auto px-3 sm:px-4 py-2.5 sm:py-3 flex items-center justify-between">
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
                        <Link
                            to="/dashboard"
                            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Home size={16} />
                            <span className="hidden sm:inline">Início</span>
                        </Link>
                        <Link
                            to="/questoes"
                            className="flex items-center gap-1.5 px-2.5 sm:px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <BookOpen size={16} />
                            <span className="hidden sm:inline">Questões</span>
                        </Link>
                    </nav>
                </div>

                {/* Usuário + Perfil + Logout */}
                <div className="flex items-center gap-1.5 sm:gap-3">
                    <Link
                        to="/perfil"
                        className="flex items-center gap-2 px-2.5 sm:px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <User size={16} />
                        <span className="hidden sm:inline font-medium">
                            {nomeUsuario ?? "Perfil"}
                        </span>
                    </Link>

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
