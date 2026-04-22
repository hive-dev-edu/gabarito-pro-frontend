import { Text, View, StyleSheet } from "@react-pdf/renderer";

interface GradeGabaritoOmrProps {
  totalQuestoes: number;
}

const LETRAS_OMR = ["A", "B", "C", "D", "E"];

const styles = StyleSheet.create({
  answerGridWrapper: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    flexWrap: "nowrap",
  },
  answerGridTable: {
    width: 214,
  },
  answerGridRow: {
    flexDirection: "row",
    alignItems: "center",
    height: 26,
    justifyContent: "center",
  },
  answerGridHeaderRow: {
    backgroundColor: "#FFFFFF",
  },
  answerGridCell: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    height: 26,
  },
  answerGridCellTopBorder: {
    borderTopWidth: 1,
  },
  answerGridCellLeftBorder: {
    borderLeftWidth: 1,
  },
  answerGridQuestionCell: {
    width: 24,
  },
  answerGridOptionCell: {
    width: 38,
  },
  answerGridHeaderText: {
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000000",
  },
  answerGridQuestionText: {
    fontSize: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  answerGridBubble: {
    width: 11,
    height: 11,
    borderWidth: 1.4,
    borderColor: "#000000",
    borderRadius: 5,
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
      <View
        style={[
          styles.answerGridCell,
          styles.answerGridCellLeftBorder,
          styles.answerGridQuestionCell,
        ]}
      >
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
        <View
          style={[
            styles.answerGridCell,
            styles.answerGridCellTopBorder,
            styles.answerGridCellLeftBorder,
            styles.answerGridQuestionCell,
          ]}
        >
          <Text style={styles.answerGridHeaderText}>Q</Text>
        </View>
        {LETRAS_OMR.map((letra) => (
          <View
            key={`omr-header-${letra}`}
            style={[
              styles.answerGridCell,
              styles.answerGridCellTopBorder,
              styles.answerGridOptionCell,
            ]}
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