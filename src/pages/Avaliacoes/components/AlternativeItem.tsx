import type { AlternativaImpressao } from "../types/versao.types";
import { normalizarImagemSrc } from "./pdfImage";

interface AlternativeItemProps {
  alternative: AlternativaImpressao;
}

export default function AlternativeItem({ alternative }: AlternativeItemProps) {
  const normalizedSrc = normalizarImagemSrc(alternative.imageUrl);

  return (
    <div className="flex flex-row items-start mb-2 break-inside-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
      <div className="w-[16px] h-[16px] min-w-[16px] mr-2 mt-[2px] flex-shrink-0">
        <svg viewBox="0 0 16 16" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
          <circle cx="8" cy="8" r="7.2" fill="none" stroke="#000000" strokeWidth="1" />
          <text 
            x="8" 
            y="11.2" 
            textAnchor="middle" 
            fontSize="9px" 
            fontWeight="500" 
            fill="#000000" 
            fontFamily="sans-serif"
          >
            {alternative.letter}
          </text>
        </svg>
      </div>
      <div className="flex-1 block">
        {alternative.text ? <span className="text-[10px] leading-snug block">{alternative.text}</span> : null}
        {normalizedSrc ? (
          <div className="w-full h-[90px] my-2 flex items-center justify-start break-inside-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
            <img 
              src={normalizedSrc} 
              alt={`Alternativa ${alternative.letter}`} 
              className="max-w-full max-h-full object-contain" 
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}