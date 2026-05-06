import { Fragment } from "react";
import type { PrintDataResponse } from "../types/versao.types";
import GradeGabaritoOmr from "./GradeGabaritoOmr";
import QuestionBlock from "./QuestionBlock";
import { normalizarImagemSrc } from "./pdfImage";

interface Props {
  data: PrintDataResponse;
  qrCodes: Record<string, string | undefined>;
}

export default function ProvaPdfDocument({ data, qrCodes }: Props) {
  const { assessment, versions } = data;

  function formatarDataBr(data?: string) {
    if (!data) return "—";
    const parsed = new Date(data);
    if (Number.isNaN(parsed.getTime())) return "—";
    return parsed.toLocaleDateString("pt-BR");
  }

  return (
    <div id="pdf-root" className="font-sans text-black w-[210mm] mx-auto bg-white">
      {versions.map((versao, idx) => {
        const qrSrc = qrCodes[versao.versionId];
        const totalQuestions = versao.questions.length;
        const logoSrc = normalizarImagemSrc(assessment.logoUrl);
        const isFirst = idx === 0;

        return (
          <Fragment key={versao.versionId}>
            {/* Exam Page */}
            <div className={`pt-8 pb-9 px-8 text-[11px] ${!isFirst ? "break-before-page" : ""}`}>
              <div className="flex flex-row justify-between items-start gap-3 border-b border-black pb-3 mb-4">
                <div className="flex-1 pr-2">
                  {logoSrc ? <img src={logoSrc} alt="Logo" className="w-[110px] h-[42px] mb-1.5 object-contain" /> : null}
                  <h1 className="text-[16px] font-bold m-0">{assessment.title || "Prova"}</h1>
                  <p className="mt-1 text-[11px] m-0">Versão {versao.versionNumber}</p>
                  <div className="flex flex-row gap-3 mt-2 flex-wrap text-[10px]">
                    {assessment.className ? (
                      <span>Turma: {assessment.className}</span>
                    ) : null}
                    <span>Data: {formatarDataBr(assessment.date)}</span>
                    <span>Aluno:__________________________________</span>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-md flex items-center justify-center bg-white shrink-0">
                  {qrSrc ? (
                    <img src={qrSrc} alt="QR Code" className="w-16 h-16" />
                  ) : (
                    <span>QR</span>
                  )}
                </div>
              </div>

              <h2 className="my-2 text-[12px] font-bold border-b border-[#000000] pb-1">Questões</h2>
              <div className="grid grid-cols-2 gap-[20px] mt-3 relative">
                {versao.questions.map((q) => (
                  <QuestionBlock
                    key={`${versao.versionId}-${q.position}`}
                    position={q.position}
                    question={q}
                  />
                ))}
              </div>
            </div>

            {/* Answer Sheet Page */}
            <div className="break-before-page pt-[22px] pb-[24px] px-[24px] text-[10px]">
              <div className="border border-black pt-4 pb-3 px-3 relative min-h-[500px]">
                {/* OMR Markers */}
                <div className="w-[10px] h-[10px] bg-black absolute top-1 left-1" />
                <div className="w-[10px] h-[10px] bg-black absolute top-1 right-1" />
                <div className="w-[10px] h-[10px] bg-black absolute bottom-1 left-1" />
                <div className="w-[10px] h-[10px] bg-black absolute bottom-1 right-1" />

                <div className="flex flex-row justify-between items-start border-b border-black">
                  <div className="flex-1 py-2 px-2.5">
                    <h2 className="text-[22px] font-bold m-0">CARTÃO-RESPOSTA</h2>
                  </div>
                  <div className="w-[190px] flex flex-col items-stretch justify-start border-l border-black shrink-0">
                    <div className="w-full text-center text-[9px] font-bold border-b border-black pt-1.5 pb-1">
                      QR CODE
                    </div>
                    <div className="w-full h-[86px] flex items-center justify-center">
                      {qrSrc ? (
                        <img src={qrSrc} alt="QR" className="w-[84px] h-[84px]" />
                      ) : (
                        <span>QR</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-b border-black mb-2 flex flex-col">
                  <div className="flex flex-row min-h-[20px] bg-white">
                    <div className="flex-[2.2] px-2.5 py-1 flex items-center border-r border-black font-bold text-[9px]">Nome do aluno</div>
                    <div className="flex-1 px-2.5 py-1 flex items-center border-r border-black font-bold text-[9px]">Turma</div>
                    <div className="flex-1 px-2.5 py-1 flex items-center border-r border-black font-bold text-[9px]">Data</div>
                    <div className="flex-1 px-2.5 py-1 flex items-center font-bold text-[9px]">Código</div>
                  </div>
                  <div className="flex flex-row min-h-[28px] border-t border-black bg-white">
                    <div className="flex-[2.2] px-2.5 py-1.5 flex flex-col justify-center border-r border-black">
                      <div className="mt-1 border-b border-black h-[10px]" />
                    </div>
                    <div className="flex-1 px-2.5 py-1.5 flex flex-col justify-center border-r border-black">
                      <div className="mt-1 border-b border-black h-[10px]" />
                    </div>
                    <div className="flex-1 px-2.5 py-1.5 flex flex-col justify-center border-r border-black">
                      <div className="mt-1 border-b border-black h-[10px]" />
                    </div>
                    <div className="flex-1 px-2.5 py-1.5 flex items-center justify-start text-[9px]">
                      {versao.versionNumber || versao.versionId}
                    </div>
                  </div>
                </div>

                <p className="text-[9px] mb-2 m-0">
                  Marque apenas uma alternativa por questão. Use caneta escura e evite rasuras.
                </p>

                <GradeGabaritoOmr totalQuestoes={totalQuestions} />
              </div>
            </div>
          </Fragment>
        );
      })}
    </div>
  );
}
