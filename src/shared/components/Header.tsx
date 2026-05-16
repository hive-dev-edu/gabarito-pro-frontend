import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    ChevronDown,
    LogOut,
    User,
} from "lucide-react";
import { PerfilService } from "../../pages/Perfil/services/perfil.service";
import { limparUsuarioLogadoCache } from "../services/usuarioLogado.service";

const obterPerfilService = new PerfilService();

interface HeaderProps {
    showBrand?: boolean;
}

function obterBreadcrumbTexto(pathname: string) {
    const crumbs: string[] = ["Início"];

    const adicionar = (label: string) => {
        if (crumbs.includes(label)) return;
        crumbs.push(label);
    };

    if (pathname.startsWith("/questoes")) adicionar("Questões");
    if (pathname.startsWith("/turmas")) adicionar("Turmas");
    if (pathname.includes("/avaliacoes")) adicionar("Avaliações");
    if (pathname.includes("/correcoes")) adicionar("Correções");
    if (pathname.startsWith("/perfil")) adicionar("Perfil");

    return crumbs.join(" › ");
}

function obterIniciais(nome: string | null) {
    if (!nome) return "";
    const partes = nome
        .trim()
        .split(/\s+/)
        .filter(Boolean);

    if (partes.length === 0) return "";
    if (partes.length === 1) return partes[0].slice(0, 2).toUpperCase();

    const primeira = partes[0][0] ?? "";
    const ultima = partes[partes.length - 1][0] ?? "";
    return `${primeira}${ultima}`.toUpperCase();
}

export default function Header({ showBrand = true }: HeaderProps) {
    const navigate = useNavigate();
    const location = useLocation();
    const menuRef = useRef<HTMLDivElement | null>(null);

    const [nomeUsuario, setNomeUsuario] = useState<string | null>(null);
    const [nomeCompletoUsuario, setNomeCompletoUsuario] = useState<string | null>(null);
    const [menuAberto, setMenuAberto] = useState(false);

    useEffect(() => {
        let ativo = true;

        const carregarUsuario = async () => {
            try {
                const usuario = await obterPerfilService.obterUsuarioLogado();
                if (!ativo) return;

                const nomeCompleto = usuario?.name?.trim() ?? null;
                const primeiroNome = nomeCompleto?.split(/\s+/)[0] ?? null;
                setNomeCompletoUsuario(nomeCompleto);
                setNomeUsuario(primeiroNome);
            } catch {
                if (!ativo) return;
                setNomeCompletoUsuario(null);
                setNomeUsuario(null);
            }
        };

        void carregarUsuario();

        return () => {
            ativo = false;
        };
    }, []);

    function handleLogout() {
        localStorage.removeItem("accessToken");
        limparUsuarioLogadoCache();
        setNomeUsuario(null);
        setNomeCompletoUsuario(null);
        navigate("/login", { replace: true });
    }

    useEffect(() => {
        function onClickFora(event: MouseEvent) {
            const el = menuRef.current;
            if (!el) return;
            if (!(event.target instanceof Node)) return;
            if (el.contains(event.target)) return;
            setMenuAberto(false);
        }

        if (!menuAberto) return;
        document.addEventListener("mousedown", onClickFora);
        return () => document.removeEventListener("mousedown", onClickFora);
    }, [menuAberto]);

    const breadcrumbTexto = obterBreadcrumbTexto(location.pathname);
    const iniciais = obterIniciais(nomeCompletoUsuario ?? nomeUsuario);

    return (
        <header className="bg-[#FAF8F5] border-b border-gray-200 sticky top-0 z-30">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    {showBrand ? (
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
                    ) : (
                        <div className="min-w-0">
                            <p className="text-sm text-gray-500 truncate">
                                {breadcrumbTexto}
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    <div ref={menuRef} className="relative">
                        <button
                            type="button"
                            onClick={() => setMenuAberto((v) => !v)}
                            aria-label="Menu do usuário"
                            className="flex items-center gap-2 rounded-full bg-white border border-gray-200 py-1 pl-1 pr-2 hover:bg-gray-50 transition-colors"
                        >
                            <span className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center text-xs font-semibold">
                                {iniciais || "—"}
                            </span>
                            <span className="hidden sm:inline text-sm font-medium text-gray-800">
                                {nomeUsuario ?? "Conta"}
                            </span>
                            <ChevronDown size={16} className="text-gray-500" />
                        </button>

                        {menuAberto ? (
                            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-2xl shadow-sm py-1">
                                <Link
                                    to="/perfil"
                                    onClick={() => setMenuAberto(false)}
                                    className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                    <User size={16} className="text-gray-500" />
                                    Perfil
                                </Link>

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                >
                                    <LogOut size={16} />
                                    Sair
                                </button>
                            </div>
                        ) : null}
                    </div>
                </div>
            </div>
        </header>
    );
}
