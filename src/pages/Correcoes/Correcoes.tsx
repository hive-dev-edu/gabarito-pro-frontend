import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight, FileCheck2 } from "lucide-react";

import IconeCarregamento from "../../shared/components/IconeCarregamento";
import CorrecoesService from "./services/correcoes.service";
import type {
    CorrecoesListItem,
    StatusCorrecao,
} from "./types/correcoes.types";

function badgeClasses(status: StatusCorrecao) {
    switch (status) {
        case "COMPLETED":
            return "border-emerald-200 bg-emerald-50 text-emerald-800";
        case "FAILED":
            return "border-red-200 bg-red-50 text-red-800";
        case "PROCESSING":
            return "border-blue-200 bg-blue-50 text-blue-800";
        default:
            return "border-amber-200 bg-amber-50 text-amber-800";
    }
}

function statusLabel(status: StatusCorrecao) {
    switch (status) {
        case "PENDING":
            return "Pendente";
        case "PROCESSING":
            return "Processando";
        case "COMPLETED":
            return "Concluída";
        case "FAILED":
            return "Falhou";
        default:
            return status;
    }
}

function formatDateTime(value?: string | null) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString("pt-BR");
}

type StatusFilter = StatusCorrecao | "";

function normalizeStatusFilter(value: string | null): StatusFilter {
    const v = String(value ?? "").toUpperCase();
    if (v === "PENDING" || v === "PROCESSING" || v === "COMPLETED" || v === "FAILED") {
        return v;
    }
    return "";
}

function parsePage(value: string | null): number {
    const num = Number(value);
    if (!Number.isFinite(num)) return 1;
    return Math.max(1, Math.trunc(num));
}

export default function CorrecoesPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams, setSearchParams] = useSearchParams();

    const [status, setStatus] = useState<StatusFilter>(() =>
        normalizeStatusFilter(searchParams.get("status")),
    );
    // assessmentId is never user-editable — derive directly from URL so the chip
    // "Limpar" button only needs to call setSearchParams without a reload.
    const assessmentId = searchParams.get("assessmentId") ?? "";
    const [title, setTitle] = useState(() => searchParams.get("title") ?? "");
    const [studentName, setStudentName] = useState(() => searchParams.get("studentName") ?? "");
    // Debounced values: fetch only fires after 400 ms of inactivity on text inputs.
    const [debouncedTitle, setDebouncedTitle] = useState(title);
    const [debouncedStudentName, setDebouncedStudentName] = useState(studentName);
    const [page, setPage] = useState(() => parsePage(searchParams.get("page")));
    const limit = 10;

    const [items, setItems] = useState<CorrecoesListItem[]>([]);
    const [meta, setMeta] = useState<{
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    } | null>(null);

    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState("");

    useEffect(() => {
        const id = setTimeout(() => setDebouncedTitle(title), 400);
        return () => clearTimeout(id);
    }, [title]);

    useEffect(() => {
        const id = setTimeout(() => setDebouncedStudentName(studentName), 400);
        return () => clearTimeout(id);
    }, [studentName]);

    useEffect(() => {
        let ignore = false;

        async function carregar() {
            try {
                setCarregando(true);
                setErro("");

                const resp = await CorrecoesService.listar({
                    page,
                    limit,
                    status: status || undefined,
                    assessmentId: assessmentId || undefined,
                    title: debouncedTitle.trim() || undefined,
                    studentName: debouncedStudentName.trim() || undefined,
                });

                if (!ignore) {
                    setItems(Array.isArray(resp.data) ? resp.data : []);
                    setMeta(resp.meta ?? null);
                }
            } catch (e) {
                if (!ignore) {
                    setErro(e instanceof Error ? e.message : "Erro ao carregar correções.");
                    setItems([]);
                    setMeta(null);
                }
            } finally {
                if (!ignore) setCarregando(false);
            }
        }

        carregar();
        return () => { ignore = true; };
    }, [page, status, assessmentId, debouncedTitle, debouncedStudentName]);

    useEffect(() => {
        const next = new URLSearchParams();
        if (assessmentId.trim()) next.set("assessmentId", assessmentId.trim());
        if (debouncedTitle.trim()) next.set("title", debouncedTitle.trim());
        if (debouncedStudentName.trim()) next.set("studentName", debouncedStudentName.trim());
        if (status) next.set("status", status);
        if (page > 1) next.set("page", String(page));
        if (next.toString() !== searchParams.toString()) {
            setSearchParams(next, { replace: true });
        }
    }, [assessmentId, debouncedTitle, debouncedStudentName, page, status, searchParams, setSearchParams]);

    const hasPrev = page > 1;
    const hasNext = meta ? page < meta.totalPages : items.length === limit;

    const resumo = useMemo(() => {
        if (!meta) return "";
        return `${meta.total} itens • página ${meta.page} de ${meta.totalPages}`;
    }, [meta]);

    return (
        <main className="bg-[#FAF8F5]">
            <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8">
                    <div className="flex items-center gap-3 sm:gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer shrink-0"
                            title="Voltar"
                        >
                            <ArrowLeft size={22} />
                        </button>

                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                                Minhas Correções
                            </h1>
                            <p className="text-gray-500 text-sm sm:text-base mt-0.5 sm:mt-1">
                                Acompanhe o status das suas correções automáticas
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 w-full">
                        {assessmentId.trim() ? (
                            <div className="flex items-center gap-2">
                                <span className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200 px-3 py-1 text-sm text-teal-800">
                                    Filtrando por avaliação específica
                                </span>
                                <button
                                    onClick={() => {
                                        const next = new URLSearchParams(searchParams);
                                        next.delete("assessmentId");
                                        setSearchParams(next, { replace: true });
                                    }}
                                    className="text-sm text-teal-600 underline cursor-pointer hover:text-teal-800"
                                >
                                    Limpar
                                </button>
                            </div>
                        ) : null}

                        <div className="flex flex-wrap items-end gap-3">
                            <div className="min-w-55">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Título da avaliação
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]"
                                    placeholder="Ex: Prova de Matemática"
                                />
                            </div>

                            <div className="min-w-55">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nome do aluno
                                </label>
                                <input
                                    type="text"
                                    value={studentName}
                                    onChange={(e) => {
                                        setStudentName(e.target.value);
                                        setPage(1);
                                    }}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]"
                                    placeholder="Ex: Maria Silva"
                                />
                            </div>

                            <div className="min-w-45">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={status}
                                    onChange={(e) => {
                                        setStatus(e.target.value as StatusFilter);
                                        setPage(1);
                                    }}
                                    className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6] bg-white"
                                >
                                    <option value="">Todos</option>
                                    <option value="PENDING">Pendente</option>
                                    <option value="PROCESSING">Processando</option>
                                    <option value="COMPLETED">Concluída</option>
                                    <option value="FAILED">Falhou</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>

                {erro ? (
                    <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                        {erro}
                    </div>
                ) : null}

                {carregando ? (
                    <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6">
                        <IconeCarregamento w={22} h={22} color="black" />
                        <span className="text-slate-700">Carregando...</span>
                    </div>
                ) : items.length === 0 ? (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 text-slate-600">
                        Nenhuma correção encontrada.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {items.map((item) => {
                            const assessmentTitle = item.assessment?.title ?? "Aguardando identificação da avaliação";
                            const className = item.assessment?.class?.name ?? "—";
                            const itemStudentName = item.result?.studentName ?? "—";
                            const score = item.result?.finalScore ?? "—";

                            return (
                                <Link
                                    key={item.id}
                                    to={`/correcoes/${item.id}`}
                                    state={{ from: `${location.pathname}${location.search}` }}
                                    className="block rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-2">
                                                <FileCheck2 size={18} className="text-slate-500" />
                                                <h2 className="text-base sm:text-lg font-semibold text-slate-800 line-clamp-1">
                                                    {assessmentTitle}
                                                </h2>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-2 text-xs">
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                                                    Turma: {className}
                                                </span>
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                                                    Aluno: {itemStudentName}
                                                </span>
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                                                    Nota: {score}
                                                </span>
                                                <span className="rounded-full bg-slate-100 px-3 py-1 text-slate-700">
                                                    Data: {formatDateTime(item.createdAt)}
                                                </span>
                                            </div>

                                            {item.status === "FAILED" && item.errorMessage ? (
                                                <p className="mt-3 text-sm text-red-700">
                                                    {item.errorMessage}
                                                </p>
                                            ) : null}
                                        </div>

                                        <span
                                            className={`shrink-0 inline-flex items-center justify-center rounded-full border px-3 py-1 text-xs font-semibold ${badgeClasses(
                                                item.status
                                            )}`}
                                        >
                                            {statusLabel(item.status)}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <p className="text-sm text-slate-500">{resumo}</p>

                    <div className="flex items-center justify-end gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={!hasPrev}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft size={16} />
                            Anterior
                        </button>

                        <button
                            onClick={() => setPage((p) => p + 1)}
                            disabled={!hasNext}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition cursor-pointer hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Próxima
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}
