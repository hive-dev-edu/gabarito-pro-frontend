interface GradeGabaritoOmrProps {
  totalQuestoes: number;
}

const LETRAS_OMR = ["A", "B", "C", "D", "E"];

export default function GradeGabaritoOmr({ totalQuestoes }: GradeGabaritoOmrProps) {
  const numerosQuestoes = Array.from(
    { length: totalQuestoes },
    (_, index) => index + 1,
  );
  const indiceDivisao = Math.ceil(totalQuestoes / 2);
  const questoesColunaEsquerda = numerosQuestoes.slice(0, indiceDivisao);
  const questoesColunaDireita = numerosQuestoes.slice(indiceDivisao);

  const renderizarLinha = (numeroQuestao: number) => (
    <div key={`omr-row-${numeroQuestao}`} className="flex items-center h-[26px] justify-center break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
      <div className="border-b border-l border-black h-[26px] w-[24px] text-center" style={{ lineHeight: "26px" }}>
        <span className="text-[8px] font-bold">
          {String(numeroQuestao).padStart(2, "0")}
        </span>
      </div>
      {LETRAS_OMR.map((letra) => (
        <div
          key={`omr-cell-${numeroQuestao}-${letra}`}
          className="border-b border-l border-black flex items-center justify-center h-[26px] w-[38px] border-r-0 last:border-r"
        >
          <div className="w-[11px] h-[11px] border-[1.4px] border-black rounded-[5px]" />
        </div>
      ))}
    </div>
  );

  const renderizarTabela = (questoes: number[]) => (
    <div className="w-[214px]">
      <div className="flex items-center h-[26px] justify-center bg-white break-inside-avoid" style={{ pageBreakInside: 'avoid' }}>
        <div className="border-t border-b border-l border-black h-[26px] w-[24px] text-center" style={{ lineHeight: "24px" }}>
          <span className="text-[8px] font-bold text-black">Q</span>
        </div>
        {LETRAS_OMR.map((letra) => (
          <div
            key={`omr-header-${letra}`}
            className="border-t border-b border-l border-black h-[26px] w-[38px] border-r-0 last:border-r text-center"
            style={{ lineHeight: "24px" }}
          >
            <span className="text-[8px] font-bold text-black">{letra}</span>
          </div>
        ))}
      </div>
      {questoes.map(renderizarLinha)}
    </div>
  );

  return (
    <div className="flex flex-row justify-center gap-2 flex-nowrap mt-4">
      {renderizarTabela(questoesColunaEsquerda)}
      {renderizarTabela(questoesColunaDireita)}
    </div>
  );
}