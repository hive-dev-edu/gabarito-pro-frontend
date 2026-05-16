import { Link, NavLink } from "react-router-dom";
import {
    BookOpen,
    ChevronLeft,
    ChevronRight,
    FileCheck2,
    LayoutDashboard,
    Plus,
    Users,
    ClipboardList,
    User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface SidebarProps {
    collapsed: boolean;
    onToggleCollapsed: () => void;
    mobileOpen?: boolean;
    onRequestCloseMobile?: () => void;
}

interface SidebarNavItemProps {
    to: string;
    label: string;
    icon: LucideIcon;
    collapsed: boolean;
    end?: boolean;
    badge?: number;
    onNavigate?: () => void;
}

function navItemClassName(isActive: boolean, collapsed: boolean) {
    const base =
        "group flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-colors";

    const variant = isActive
        ? "bg-white text-gray-900 border border-gray-200"
        : "text-gray-600 hover:bg-white";

    const layout = collapsed ? "justify-center px-2" : "justify-between";

    return `${base} ${variant} ${layout}`;
}

function SidebarNavItem({
    to,
    label,
    icon: Icon,
    collapsed,
    end,
    badge,
    onNavigate,
}: SidebarNavItemProps) {
    const right = badge != null
        ? (
            <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                {badge}
            </span>
        )
        : null;

    return (
        <NavLink
            to={to}
            end={end}
            aria-label={collapsed ? label : undefined}
            onClick={onNavigate}
            className={({ isActive }) => navItemClassName(isActive, collapsed)}
        >
            {({ isActive }) => (
                <>
                    <div
                        className={
                            collapsed
                                ? "relative flex items-center justify-center"
                                : "flex items-center gap-3 min-w-0"
                        }
                    >
                        <span className="relative shrink-0">
                            <Icon
                                size={18}
                                className={
                                    isActive
                                        ? "text-teal-600"
                                        : "text-gray-500 group-hover:text-gray-700"
                                }
                            />
                            {collapsed && badge != null ? (
                                <span className="absolute -top-2 -right-2 min-w-5 h-5 px-1 rounded-full bg-amber-100 text-amber-700 text-[10px] font-semibold flex items-center justify-center">
                                    {badge}
                                </span>
                            ) : null}
                        </span>

                        {!collapsed ? (
                            <span className="truncate">{label}</span>
                        ) : null}
                    </div>

                    {!collapsed ? right : null}
                </>
            )}
        </NavLink>
    );
}

function SidebarInner({
    collapsed,
    onToggleCollapsed,
    onNavigate,
    onRequestClose,
}: {
    collapsed: boolean;
    onToggleCollapsed: () => void;
    onNavigate?: () => void;
    onRequestClose?: () => void;
}) {
    return (
        <>
            <div
                className={
                    "px-3 pt-4 pb-3 " +
                    (collapsed
                        ? "flex flex-col items-center gap-2"
                        : "flex items-center justify-between")
                }
            >
                <Link
                    to="/dashboard"
                    onClick={onNavigate}
                    className={
                        "flex items-center gap-2.5 rounded-xl hover:bg-white transition-colors " +
                        (collapsed ? "p-2" : "px-2.5 py-2")
                    }
                >
                    <img
                        src="/images/logo-gabarito-pro.png"
                        alt="Logo Gabarito Pro"
                        className="w-9 h-9 rounded-full"
                    />
                    {!collapsed ? (
                        <span className="font-semibold text-gray-800">Gabarito.pro</span>
                    ) : null}
                </Link>
            </div>

            <div className="flex-1 overflow-y-auto px-2">
                <nav className="flex flex-col gap-1">
                    <SidebarNavItem
                        to="/dashboard"
                        end
                        label="Dashboard"
                        icon={LayoutDashboard}
                        collapsed={collapsed}
                        onNavigate={onNavigate}
                    />
                    <SidebarNavItem
                        to="/questoes"
                        label="Questões"
                        icon={BookOpen}
                        collapsed={collapsed}
                        onNavigate={onNavigate}
                    />
                    <SidebarNavItem
                        to="/turmas"
                        label="Turmas"
                        icon={Users}
                        collapsed={collapsed}
                        onNavigate={onNavigate}
                    />
                    <SidebarNavItem
                        to="/avaliacoes"
                        label="Avaliações"
                        icon={ClipboardList}
                        collapsed={collapsed}
                        onNavigate={onNavigate}
                    />
                    <SidebarNavItem
                        to="/correcoes"
                        label="Correções"
                        icon={FileCheck2}
                        collapsed={collapsed}
                        onNavigate={onNavigate}
                    />
                </nav>

                <div className={collapsed ? "mt-4 flex justify-center" : "mt-4 px-1"}>
                    <Link
                        to="/avaliacoes/criar"
                        onClick={onNavigate}
                        className={
                            collapsed
                                ? "w-12 h-12 rounded-2xl bg-teal-500 text-white flex items-center justify-center hover:bg-teal-600 transition-colors"
                                : "inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-500 text-white px-4 py-2.5 text-sm font-semibold hover:bg-teal-600 transition-colors"
                        }
                        aria-label={collapsed ? "Nova avaliação" : undefined}
                    >
                        <Plus size={18} />
                        {!collapsed ? <span>Nova Avaliação</span> : null}
                    </Link>
                </div>

                <hr className="my-4 border-gray-200"/>

                <SidebarNavItem
                    to="/perfil"
                    label="Perfil"
                    icon={User}
                    collapsed={collapsed}
                    onNavigate={onNavigate}
                />
            </div>

            <div className="px-2 pt-3 border-t border-gray-200 pb-[calc(env(safe-area-inset-bottom)+1rem)]">
                <button
                    type="button"
                    onClick={onRequestClose ?? onToggleCollapsed}
                    aria-label={
                        onRequestClose
                            ? "Fechar menu"
                            : collapsed
                            ? "Expandir sidebar"
                            : "Recolher sidebar"
                    }
                    className={
                        "group w-full h-10 rounded-xl text-sm font-medium transition-colors " +
                        (collapsed
                            ? "inline-flex items-center justify-center text-gray-600 hover:bg-white"
                            : "inline-flex items-center gap-2 px-3 text-gray-600 hover:bg-white")
                    }
                >
                    {onRequestClose ? (
                        <>
                            <ChevronLeft size={18} className="text-gray-500 group-hover:text-gray-700" />
                            <span className="text-gray-700">Fechar</span>
                        </>
                    ) : collapsed ? (
                        <ChevronRight size={18} className="text-gray-500 group-hover:text-gray-700" />
                    ) : (
                        <>
                            <ChevronLeft size={18} className="text-gray-500 group-hover:text-gray-700" />
                            <span className="text-gray-700">Fechar</span>
                        </>
                    )}
                </button>
            </div>
        </>
    );
}

export default function Sidebar({
    collapsed,
    onToggleCollapsed,
    mobileOpen = false,
    onRequestCloseMobile,
}: SidebarProps) {
    return (
        <>
            {/* Desktop */}
            <aside
                className={
                    "hidden lg:flex h-screen sticky top-0 z-40 shrink-0 border-r border-gray-200 bg-[#FAF8F5] flex-col " +
                    (collapsed ? "w-20" : "w-72")
                }
            >
                <SidebarInner
                    collapsed={collapsed}
                    onToggleCollapsed={onToggleCollapsed}
                />
            </aside>

            {/* Mobile drawer */}
            {mobileOpen ? (
                <div className="lg:hidden fixed inset-0 z-50">
                    <button
                        type="button"
                        aria-label="Fechar menu"
                        onClick={onRequestCloseMobile}
                        className="absolute inset-0 bg-black/40"
                    />

                    <aside className="relative h-dvh w-72 border-r border-gray-200 bg-[#FAF8F5] flex flex-col">
                        <SidebarInner
                            collapsed={false}
                            onToggleCollapsed={onToggleCollapsed}
                            onNavigate={onRequestCloseMobile}
                            onRequestClose={onRequestCloseMobile}
                        />
                    </aside>
                </div>
            ) : null}
        </>
    );
}
