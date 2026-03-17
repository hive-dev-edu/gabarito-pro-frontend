import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import type { PrintDataResponse } from "../types/versao.types";

interface Props {
  data: PrintDataResponse;
  qrCodes: Record<string, string | undefined>;
}

const styles = StyleSheet.create({
  page: {
    paddingTop: 32,
    paddingBottom: 36,
    paddingHorizontal: 32,
    fontSize: 11,
    fontFamily: "Helvetica",
    color: "#000000",
  },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 12,
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  headerSub: {
    marginTop: 4,
    color: "#000000",
    fontSize: 11,
  },
  metaRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    flexWrap: "wrap",
  },
  metaItem: {
    fontSize: 10,
    color: "#000000",
  },
  qrBox: {
    width: 64,
    height: 64,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  qrImage: {
    width: 64,
    height: 64,
  },
  sectionTitle: {
    marginTop: 8,
    marginBottom: 8,
    fontSize: 12,
    fontWeight: "bold",
  },
  questionBlock: {
    padding: 10,
    marginBottom: 10,
  },
  questionText: {
    fontSize: 11,
    lineHeight: 1.4,
    marginBottom: 6,
  },
  alternativeRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 4,
  },
  alternativeLetter: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 9,
    textAlign: "center",
    fontSize: 9,
    paddingTop: 3,
  },
  alternativeText: {
    fontSize: 10,
    lineHeight: 1.35,
    flex: 1,
  },
  answerKeyTitle: {
    marginTop: 8,
    marginBottom: 6,
    fontSize: 12,
    fontWeight: "bold",
  },
  answerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    gap: 8,
    flexWrap: "wrap",
  },
  answerNumber: {
    width: 18,
    fontSize: 10,
    fontWeight: "bold",
  },
  answerBubble: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginRight: 6,
  },
  bubbleCircle: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: "#000000",
    borderRadius: 6,
  },
  bubbleLetter: {
    fontSize: 9,
  },
});

export default function ProvaPdfDocument({ data, qrCodes }: Props) {
  const { assessment, versions } = data;
  function formatarDataBr(data?: string) {
    if (!data) return "—";
    const parsed = new Date(data);
    if (Number.isNaN(parsed.getTime())) return "—";
    return parsed.toLocaleDateString("pt-BR");
  }

  return (
    <Document>
      {versions.map((versao) => {
        const qrSrc = qrCodes[versao.versionId];
        const lettersFallback = ["A", "B", "C", "D", "E"];

        return (
          <Page key={versao.versionId} size="A4" style={styles.page}>
            <View style={styles.header}>
              <View>
                <Text style={styles.headerTitle}>
                  {assessment.title || "Prova"}
                </Text>
                <Text style={styles.headerSub}>Versao {versao.versionNumber}</Text>
                <View style={styles.metaRow}>
                  {assessment.className ? (
                    <Text style={styles.metaItem}>Turma: {assessment.className}</Text>
                  ) : null}
                  <Text style={styles.metaItem}>Data: {formatarDataBr(assessment.date)}</Text>
                  <Text style={styles.metaItem}>Aluno:__________________________________</Text>
                </View>
              </View>
              <View style={styles.qrBox}>
                {qrSrc ? (
                  <Image style={styles.qrImage} src={qrSrc} />
                ) : (
                  <Text>QR</Text>
                )}
              </View>
            </View>

            <Text style={styles.sectionTitle}>Questões</Text>
            {versao.questions.map((q) => (
              <View key={`${versao.versionId}-${q.position}`} style={styles.questionBlock} wrap={false}>
                <Text style={styles.questionText}>
                  {q.position}. {q.statement || "Enunciado nao disponivel"}
                </Text>
                {q.alternatives.map((alt, idx) => (
                  <View key={`${q.position}-${idx}`} style={styles.alternativeRow}>
                    <Text style={styles.alternativeLetter}>{alt.letter}</Text>
                    <Text style={styles.alternativeText}>{alt.text}</Text>
                  </View>
                ))}
              </View>
            ))}

            <Text style={styles.answerKeyTitle}>Gabarito</Text>
            {versao.questions.map((q) => {
              const letters = q.alternatives.length
                ? q.alternatives.map((alt) => alt.letter)
                : lettersFallback;

              return (
                <View key={`gabarito-${versao.versionId}-${q.position}`} style={styles.answerRow}>
                  <Text style={styles.answerNumber}>{q.position}</Text>
                  {letters.map((letter) => (
                    <View key={`${q.position}-${letter}`} style={styles.answerBubble}>
                      <View style={styles.bubbleCircle} />
                      <Text style={styles.bubbleLetter}>{letter}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </Page>
        );
      })}
    </Document>
  );
}
