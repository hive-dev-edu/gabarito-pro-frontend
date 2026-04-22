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
    paddingTop: 22,
    paddingBottom: 24,
    paddingHorizontal: 24,
    fontSize: 10,
    fontFamily: "Helvetica",
    color: "#000000",
  },
  answerSheetContainer: {
    borderWidth: 1,
    borderColor: "#000000",
    paddingTop: 16,
    paddingBottom: 12,
    paddingHorizontal: 12,
    position: "relative",
  },
  omrMarker: {
    width: 10,
    height: 10,
    backgroundColor: "#000000",
    position: "absolute",
  },
  omrMarkerTopLeft: {
    top: 4,
    left: 4,
  },
  omrMarkerTopRight: {
    top: 4,
    right: 4,
  },
  omrMarkerBottomLeft: {
    bottom: 4,
    left: 4,
  },
  omrMarkerBottomRight: {
    bottom: 4,
    right: 4,
  },
  answerSheetHeader: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 0,
    marginBottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 0,
  },
  answerSheetHeaderLeft: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 8,
    paddingHorizontal: 10,
  },
  answerSheetHeaderRight: {
    width: 190,
    alignItems: "stretch",
    justifyContent: "flex-start",
    borderLeftWidth: 1,
    borderLeftColor: "#000000",
  },
  qrLabel: {
    width: "100%",
    textAlign: "center",
    color: "#000000",
    fontSize: 9,
    fontWeight: "bold",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingTop: 6,
    paddingBottom: 5,
  },
  qrBody: {
    width: "100%",
    height: 86,
    alignItems: "center",
    justifyContent: "center",
  },
  answerSheetQrImage: {
    width: 84,
    height: 84,
  },
  answerSheetTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#000000",
  },
  studentInfoSection: {
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    marginBottom: 8,
    gap: 0,
  },
  studentInfoHeaderRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    minHeight: 20,
    backgroundColor: "#FFFFFF",
  },
  studentInfoValueRow: {
    flexDirection: "row",
    flexWrap: "nowrap",
    minHeight: 28,
    borderTopWidth: 1,
    borderTopColor: "#000000",
  },
  studentInfoHeaderItem: {
    fontSize: 9,
    color: "#000000",
    fontWeight: "bold",
  },
  studentInfoCell: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#000000",
  },
  studentInfoValueCell: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    justifyContent: "center",
    borderRightWidth: 1,
    borderRightColor: "#000000",
  },
  studentInfoCellName: {
    flex: 2.2,
  },
  studentInfoCellClass: {
    flex: 1,
  },
  studentInfoCellDate: {
    flex: 1,
  },
  studentInfoCellCode: {
    flex: 1,
    borderRightWidth: 0,
  },
  studentInfoValueLine: {
    marginTop: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    height: 10,
  },
  studentInfoValueCode: {
    fontSize: 9,
    color: "#000000",
    fontWeight: "normal",
  },
  instructions: {
    fontSize: 9,
    marginBottom: 8,
    color: "#000000",
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
              <View style={styles.answerSheetContainer}>
                <View style={[styles.omrMarker, styles.omrMarkerTopLeft]} />
                <View style={[styles.omrMarker, styles.omrMarkerTopRight]} />
                <View style={[styles.omrMarker, styles.omrMarkerBottomLeft]} />
                <View style={[styles.omrMarker, styles.omrMarkerBottomRight]} />

                <View style={styles.answerSheetHeader}>
                  <View style={styles.answerSheetHeaderLeft}>
                    <Text style={styles.answerSheetTitle}>CARTÃO-RESPOSTA</Text>
                  </View>
                  <View style={styles.answerSheetHeaderRight}>
                    <Text style={styles.qrLabel}>QR CODE</Text>
                    <View style={styles.qrBody}>
                      {qrSrc ? (
                        <Image style={styles.answerSheetQrImage} src={qrSrc} />
                      ) : (
                        <Text>QR</Text>
                      )}
                    </View>
                  </View>
                </View>

                <View style={styles.studentInfoSection}>
                  <View style={styles.studentInfoHeaderRow}>
                    <View style={[styles.studentInfoCell, styles.studentInfoCellName]}>
                      <Text style={styles.studentInfoHeaderItem}>Nome do aluno</Text>
                    </View>
                    <View style={[styles.studentInfoCell, styles.studentInfoCellClass]}>
                      <Text style={styles.studentInfoHeaderItem}>Turma</Text>
                    </View>
                    <View style={[styles.studentInfoCell, styles.studentInfoCellDate]}>
                      <Text style={styles.studentInfoHeaderItem}>Data</Text>
                    </View>
                    <View style={[styles.studentInfoCell, styles.studentInfoCellCode]}>
                      <Text style={styles.studentInfoHeaderItem}>Codigo</Text>
                    </View>
                  </View>
                  <View style={styles.studentInfoValueRow}>
                    <View style={[styles.studentInfoValueCell, styles.studentInfoCellName]}>
                      <View style={styles.studentInfoValueLine} />
                    </View>
                    <View style={[styles.studentInfoValueCell, styles.studentInfoCellClass]}>
                      <View style={styles.studentInfoValueLine} />
                    </View>
                    <View style={[styles.studentInfoValueCell, styles.studentInfoCellDate]}>
                      <View style={styles.studentInfoValueLine} />
                    </View>
                    <View style={[styles.studentInfoValueCell, styles.studentInfoCellCode]}>
                      <Text style={styles.studentInfoValueCode}>
                        {versao.versionNumber || versao.versionId}
                      </Text>
                    </View>
                  </View>
                </View>

                <Text style={styles.instructions}>
                  Marque apenas uma alternativa por questao. Use caneta escura e evite rasuras.
                </Text>

                <GradeGabaritoOmr totalQuestoes={totalQuestions} />
              </View>
            </Page>
          </Fragment>
        );
      })}
    </Document>
  );
}
