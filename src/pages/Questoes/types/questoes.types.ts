// ── Alternativa ──

export interface Alternativa {
    id: string;
    text: string;
    isCorrect?: boolean;
}

export interface AlternativaFormulario {
    text: string;
    isCorrect: boolean;
}

// ── Questão ──

export type Dificuldade = "easy" | "medium" | "hard";

export interface Questao {
    id: string;
    authorId?: string;
    statement: string;
    subject: string;
    schoolYear: string;
    difficulty: Dificuldade;
    content: string;
    isPublic?: boolean;
    createdAt: string;
    updatedAt?: string;
    alternatives: Alternativa[];
}

// ── Paginação ──

export interface MetaPaginacao {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ListagemQuestoesResposta {
    data: Questao[];
    meta: MetaPaginacao;
}

// ── Filtros ──

export interface FiltrosQuestao {
    subject?: string;
    schoolYear?: string;
    difficulty?: Dificuldade;
    page?: number;
    limit?: number;
}

// ── Criar / Atualizar ──

export interface CriarQuestaoRequisicao {
    statement: string;
    content: string;
    subject: string;
    schoolYear: string;
    difficulty: Dificuldade;
    isPublic: boolean;
    alternatives: AlternativaFormulario[];
}

export interface AtualizarQuestaoRequisicao {
    statement?: string;
    content?: string;
    subject?: string;
    schoolYear?: string;
    difficulty?: Dificuldade;
    isPublic?: boolean;
    alternatives?: AlternativaFormulario[];
}
