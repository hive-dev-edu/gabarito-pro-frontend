import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { Fragment } from "react";
import type { PrintDataResponse } from "../types/versao.types";
import GradeGabaritoOmr from "./GradeGabaritoOmr.tsx";

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
  answerSheetPage: {
    paddingTop: 28,
    paddingBottom: 30,
    paddingHorizontal: 28,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#000000",
    position: "relative",
  },
  omrMarker: {
    width: 10,
    height: 10,
    backgroundColor: "#000000",
    position: "absolute",
  },
  omrMarkerTopLeft: {
    top: 8,
    left: 8,
  },
  omrMarkerTopRight: {
    top: 8,
    right: 8,
  },
  omrMarkerBottomLeft: {
    bottom: 8,
    left: 8,
  },
  omrMarkerBottomRight: {
    bottom: 8,
    right: 8,
  },
  answerSheetHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 10,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  answerSheetTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  answerSheetSubtitle: {
    marginTop: 3,
    fontSize: 10,
  },
  studentInfoSection: {
    marginTop: 4,
    marginBottom: 8,
    gap: 6,
  },
  studentInfoRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  studentInfoItem: {
    fontSize: 10,
  },
  instructions: {
    fontSize: 9,
    marginBottom: 10,
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
        const totalQuestions = versao.questions.length;

        return (
          <Fragment key={versao.versionId}>
            <Page size="A4" style={styles.page}>
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
            </Page>

            {/* Answer Sheet Page */}
            <Page size="A4" style={styles.answerSheetPage}>
              <View style={[styles.omrMarker, styles.omrMarkerTopLeft]} />
              <View style={[styles.omrMarker, styles.omrMarkerTopRight]} />
              <View style={[styles.omrMarker, styles.omrMarkerBottomLeft]} />
              <View style={[styles.omrMarker, styles.omrMarkerBottomRight]} />

              <View style={styles.answerSheetHeader}>
                <View>
                  <Text style={styles.answerSheetTitle}>CARTAO-RESPOSTA</Text>
                </View>
                <View style={styles.qrBox}>
                  {qrSrc ? (
                    <Image style={styles.qrImage} src={qrSrc} />
                  ) : (
                    <Text>QR</Text>
                  )}
                </View>
              </View>

              <View style={styles.studentInfoSection}>
                <View style={styles.studentInfoRow}>
                  <Text style={styles.studentInfoItem}>Nome do aluno: ____________________________</Text>
                  <Text style={styles.studentInfoItem}>Turma: __________________</Text>
                </View>
                <View style={styles.studentInfoRow}>
                  <Text style={styles.studentInfoItem}>Data: __________________</Text>
                  <Text style={styles.studentInfoItem}>
                    Codigo: {versao.versionNumber || versao.versionId}
                  </Text>
                </View>
              </View>

              <Text style={styles.instructions}>
                Marque apenas uma alternativa por questao. Use caneta escura e evite rasuras.
              </Text>

              <GradeGabaritoOmr totalQuestoes={totalQuestions} />
            </Page>
          </Fragment>
        );
      })}
    </Document>
  );
}
