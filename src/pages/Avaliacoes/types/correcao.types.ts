export type StatusCorrecao = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";

export interface SubmitCorrecaoPayload {
  imageUrl: string;
}

export interface CorrecaoResult {
  // correction_results
  id?: string;
  correctionRequestId?: string;
  assessmentVersionId?: string;
  createdAt?: string;

  finalScore: string | number;
  totalHits: number;
  totalMisses: number;
  studentName: string | null;
  answersDetails?: unknown;
}

export interface CorrecaoRequest {
  id: string;
  status: StatusCorrecao;
  result?: CorrecaoResult | null;
  errorMessage?: string | null;

  // campos auxiliares (podem variar conforme backend)
  assessmentVersionId?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}
