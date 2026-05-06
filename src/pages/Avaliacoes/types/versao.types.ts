export interface VersaoAvaliacao {
  id: string;
  versionNumber: number;
  assessmentId: string;
  createdAt: string;
}

export interface AlternativaImpressao {
  letter: string;
  text: string;
  imageUrl?: string;
}

export interface QuestaoImpressao {
  position: number;
  statement: string;
  imageUrl?: string;
  alternatives: AlternativaImpressao[];
}

export interface DadosImpressaoVersao {
  versionId: string;
  versionNumber: number;
  questions: QuestaoImpressao[];
}

export interface AssessmentImpressao {
  title: string;
  date: string;
  totalScore: number;
  className: string;
  logoUrl?: string;
}

export interface PrintDataResponse {
  assessment: AssessmentImpressao;
  versions: DadosImpressaoVersao[];
}
