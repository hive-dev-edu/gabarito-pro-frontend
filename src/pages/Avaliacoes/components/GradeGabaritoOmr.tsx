import { Text, View, StyleSheet } from "@react-pdf/renderer";

interface GradeGabaritoOmrProps {
  totalQuestoes: number;
}

const LETRAS_OMR = ["A", "B", "C", "D", "E"];

const styles = StyleSheet.create({
  answerGridWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    flexWrap: "nowrap",
  },
  answerGridTable: {
    width: 242,
    borderWidth: 1,
    borderColor: "#CFCFCF",
  },
  answerGridRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 34,
    justifyContent: "center",
  },
  answerGridHeaderRow: {
    backgroundColor: "#EAEAEA",
  },
  answerGridCell: {
    borderWidth: 1,
    borderColor: "#CFCFCF",
    alignItems: "center",
    justifyContent: "center",
    height: 34,
    marginTop: -1,
    marginLeft: -1,
  },
  answerGridQuestionCell: {
    width: 30,
  },
  answerGridOptionCell: {
    width: 42,
  },
  answerGridHeaderText: {
    fontSize: 9,
    fontWeight: "bold",
    textAlign: "center",
  },
  answerGridQuestionText: {
    fontSize: 10,
    fontWeight: "bold",
    textAlign: "center",
  },
  answerGridBubble: {
    width: 11,
    height: 11,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 6,
  },
});

export default function GradeGabaritoOmr({ totalQuestoes }: GradeGabaritoOmrProps) {
  const numerosQuestoes = Array.from(
    { length: totalQuestoes },
    (_, index) => index + 1,
  );
  const indiceDivisao = Math.ceil(totalQuestoes / 2);
  const questoesColunaEsquerda = numerosQuestoes.slice(0, indiceDivisao);
  const questoesColunaDireita = numerosQuestoes.slice(indiceDivisao);

  const renderizarLinha = (numeroQuestao: number) => (
    <View key={`omr-row-${numeroQuestao}`} style={styles.answerGridRow} wrap={false}>
      <View style={[styles.answerGridCell, styles.answerGridQuestionCell]}>
        <Text style={styles.answerGridQuestionText}>
          {String(numeroQuestao).padStart(2, "0")}
        </Text>
      </View>
      {LETRAS_OMR.map((letra) => (
        <View
          key={`omr-cell-${numeroQuestao}-${letra}`}
          style={[styles.answerGridCell, styles.answerGridOptionCell]}
        >
          <View style={styles.answerGridBubble} />
        </View>
      ))}
    </View>
  );

  const renderizarTabela = (questoes: number[]) => (
    <View style={styles.answerGridTable}>
      <View style={[styles.answerGridRow, styles.answerGridHeaderRow]} wrap={false}>
        <View style={[styles.answerGridCell, styles.answerGridQuestionCell]}>
          <Text style={styles.answerGridHeaderText}>Q</Text>
        </View>
        {LETRAS_OMR.map((letra) => (
          <View
            key={`omr-header-${letra}`}
            style={[styles.answerGridCell, styles.answerGridOptionCell]}
          >
            <Text style={styles.answerGridHeaderText}>{letra}</Text>
          </View>
        ))}
      </View>
      {questoes.map(renderizarLinha)}
    </View>
  );

  return (
    <View style={styles.answerGridWrapper}>
      {renderizarTabela(questoesColunaEsquerda)}
      {renderizarTabela(questoesColunaDireita)}
    </View>
  );
}