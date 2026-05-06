import { normalizarImagemSrc } from "./pdfImage";

interface QuestionImageProps {
  src?: string;
}

export default function QuestionImage({ src }: QuestionImageProps) {
  const normalizedSrc = normalizarImagemSrc(src);

  if (!normalizedSrc) return null;

  return (
    <div className="w-full h-[120px] my-2 flex items-center justify-center break-inside-avoid" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
      <img
        src={normalizedSrc}
        alt="Imagem da questão"
        className="max-w-full max-h-full object-contain"
      />
    </div>
  );
}