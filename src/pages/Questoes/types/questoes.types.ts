// ── Alternativa ──

export interface Alternativa {
    id: string;
    text: string;
    isCorrect?: boolean;
    imageUrl?: string;
    imageSource?: string;
    image?: string;
}

export interface AlternativaFormulario {
    text: string;
    isCorrect: boolean;
    imageUrl?: string;
    imageSource?: string;
    image?: string;
}

// ── Questão ──

export type Dificuldade = "easy" | "medium" | "hard";

export type EducationLevelApi =
    | "ensino_tecnico"
    | "ensino_medio"
    | "ensino_superior"
    | "ensino_fundamental"
    | "outro";

export type QuestionType = "multiple_choice" | "true_false" | "essay";

export type VisibilidadeQuestoes = "incluir_minhas" | "somente_minhas";

export interface Questao {
    id: string;
    authorId?: string;
    statement: string;
    imageUrl?: string;
    imageSource?: string;
    subject: string;
    educationLevel?: EducationLevelApi;
    grade?: number;
    questionType?: QuestionType;
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
    visibilidade?: VisibilidadeQuestoes;
    subject?: string;
    educationLevel?: EducationLevelApi;
    grade?: string;
    difficulty?: Dificuldade;
    page?: number | string;
    limit?: number | string;
}

// ── Criar / Atualizar ──

export interface CriarQuestaoRequisicao {
    statement: string;
    imageUrl?: string;
    imageSource?: string;
    content: string;
    subject: string;
    educationLevel: EducationLevelApi;
    grade: number;
    questionType: QuestionType;
    difficulty: Dificuldade;
    isPublic?: boolean;
    alternatives?: AlternativaFormulario[];
}

export interface AtualizarQuestaoRequisicao {
    statement?: string;
    imageUrl?: string | null;
    imageSource?: string | null;
    content?: string;
    subject?: string;
    educationLevel?: EducationLevelApi;
    grade?: number;
    questionType?: QuestionType;
    difficulty?: Dificuldade;
    isPublic?: boolean;
    alternatives?: AlternativaFormulario[];
}
