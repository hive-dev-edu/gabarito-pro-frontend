import type { QuestaoImpressao } from "../types/versao.types";
import AlternativeItem from "./AlternativeItem";
import QuestionImage from "./QuestionImage";

interface QuestionBlockProps {
  position: number;
  question: QuestaoImpressao;
}

export default function QuestionBlock({ position, question }: QuestionBlockProps) {
  const hasImage = !!question.imageUrl;

  return (
    <div className="relative pb-3 mb-3 border-b-[0.5px] border-[#000000] break-inside-avoid w-full odd:after:content-[''] odd:after:absolute odd:after:top-0 odd:after:-right-[9px] odd:after:bottom-0 odd:after:w-[0.5px] odd:after:bg-[#000000] even:before:content-[''] even:before:absolute even:before:top-0 even:before:-left-[9px] even:before:bottom-0 even:before:w-[0.5px] even:before:bg-[#000000]" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
      <div className="flex items-start gap-[10px] mb-2">
        <div className="w-[24px] h-[24px] min-w-[24px] shrink-0">
          <svg viewBox="0 0 24 24" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="11.5" fill="none" stroke="#000000" strokeWidth="1" />
            <text 
              x="12" 
              y="16.2" 
              textAnchor="middle" 
              fontSize="12px" 
              fontWeight="bold" 
              fill="#000000" 
              fontFamily="sans-serif"
            >
              {position}
            </text>
          </svg>
        </div>
        <div className="text-[11px] leading-[1.4] whitespace-pre-wrap flex-1 mt-[4px]">
          {question.statement || "Enunciado não disponível"}
        </div>
      </div>

      {hasImage && <QuestionImage src={question.imageUrl} />}

      <div className="mt-2 block w-full pl-[34px]">
        {question.alternatives.map((alternative) => (
          <AlternativeItem
            key={`${position}-${alternative.letter}`}
            alternative={alternative}
          />
        ))}
      </div>
    </div>
  );
}