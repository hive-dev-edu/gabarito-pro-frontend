export type StatusCorrecao = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export type CorrecoesListParams = {
    page?: number;
    limit?: number;
    assessmentId?: string;
    title?: string;
    studentName?: string;
    status?: StatusCorrecao;
};

export type CorrecoesListItem = {
    id: string;
    status: StatusCorrecao;
    imageUrl: string | null;
    errorMessage: string | null;
    createdAt: string;
    updatedAt: string;
    assessment: {
        id: string;
        title: string;
        date: string;
        totalScore: string;
        versionId: string;
        versionNumber: number;
        class: {
            id: string;
            name: string;
        };
    } | null;
    result: {
        id: string;
        studentName: string;
        finalScore: string;
        totalHits: number;
        totalMisses: number;
        createdAt: string;
    } | null;
};

export type CorrecoesListResponse = {
    data: CorrecoesListItem[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
};
