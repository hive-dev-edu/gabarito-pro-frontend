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

export type EducationLevelApi =
    | "ensino_tecnico"
    | "ensino_medio"
    | "ensino_superior"
    | "ensino_fundamental"
    | "outro";

export type QuestionType = "multiple_choice" | "true_false" | "essay";

export interface Questao {
    id: string;
    authorId?: string;
    statement: string;
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
    myQuestions?: string;
    subject?: string;
    educationLevel?: EducationLevelApi;
    grade?: string;
    difficulty?: Dificuldade;
    page?: number | string;
    limit?: number | string;
}

export interface FiltrosQuestoesPrivadas {
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
    content?: string;
    subject?: string;
    educationLevel?: EducationLevelApi;
    grade?: number;
    questionType?: QuestionType;
    difficulty?: Dificuldade;
    isPublic?: boolean;
    alternatives?: AlternativaFormulario[];
}
