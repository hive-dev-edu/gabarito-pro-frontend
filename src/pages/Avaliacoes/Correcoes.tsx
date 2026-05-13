import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileCheck2 } from "lucide-react";

import AvaliacoesService from "./services/avaliacoes.service";
import CorrecoesService from "./services/correcoes.service";
import IconeCarregamento from "../../shared/components/IconeCarregamento";
import CampoUploadImagem from "../Questoes/components/CampoUploadImagem";
import { uploadImagemCorrecao } from "./services/uploadCorrecaoImagem.service";

function isLikelyHttpUrl(value: string) {
  const v = value.trim();
  if (!v) return false;
  try {
    const url = new URL(v);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export default function PaginaCorrecoes() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [nomeAvaliacao, setNomeAvaliacao] = useState<string>("");
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string>("");

  const [imageUrl, setImageUrl] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);

  const carregar = useCallback(async () => {
    if (!id) return;

    try {
      setCarregando(true);
      setErro("");

      const avaliacao = await AvaliacoesService.getById(id);
      setNomeAvaliacao(avaliacao.title ?? "");
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao carregar dados.");
    } finally {
      setCarregando(false);
    }
  }, [id]);

  useEffect(() => {
    carregar();
  }, [carregar]);

  async function handleSubmit() {
    if (!id) return;

    const urlFinal = imageUrl.trim();

    if (!urlFinal) {
      setErro("Envie uma imagem ou informe a URL da imagem.");
      return;
    }

    if (!isLikelyHttpUrl(urlFinal)) {
      setErro("Informe uma URL válida (http/https) ou envie a imagem pelo upload.");
      return;
    }

    try {
      setSubmitting(true);
      setErro("");

      const correcaoId = await CorrecoesService.submit({
        imageUrl: urlFinal,
        assessmentId: id,
      });

      navigate(`/correcoes/${correcaoId}`, {
        state: { assessmentId: id },
      });
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao enviar para correção.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main>
      <div className="mx-auto max-w-7xl px-3 py-6 sm:px-4 sm:py-8">
        <div className="mb-6 flex flex-col justify-between gap-4 sm:mb-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => navigate("/avaliacoes")}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-[#D9E7E4] bg-white text-slate-600 transition hover:bg-[#F4FFFD] hover:text-[#14877B] cursor-pointer"
              title="Voltar"
            >
              <ArrowLeft size={18} />
            </button>

            <div>
              <h1 className="text-xl font-bold text-slate-800 sm:text-2xl">
                Correção Automática
              </h1>
              {nomeAvaliacao && (
                <p className="mt-0.5 text-sm text-slate-500">{nomeAvaliacao}</p>
              )}
            </div>
          </div>

        </div>

        {carregando ? (
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-6">
            <IconeCarregamento w={22} h={22} color="black" />
            <span className="text-slate-700">Carregando...</span>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-4 rounded-2xl border border-[#BDEAE4] bg-[#F4FFFD] p-4 text-sm text-slate-700">
                Envie a imagem da folha respondida. A versão da prova é identificada pelo QR Code na folha.
                O processamento é assíncrono — você pode fechar a tela; o resultado fica disponível quando finalizar.
              </div>

              {erro && (
                <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  {erro}
                </div>
              )}

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div className="space-y-4">
                  <CampoUploadImagem
                    rotulo="Imagem da correção"
                    urlImagem={imageUrl || undefined}
                    onImagemAlterada={(url) => setImageUrl(url ?? "")}
                    tamanhoPreview="grande"
                    uploadFn={uploadImagemCorrecao}
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ou cole a URL da imagem
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      className="w-full px-3 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#2EC5B6]"
                      placeholder="https://..."
                    />
                    <p className="mt-1 text-xs text-slate-500">
                      Se você fizer upload acima, este campo será preenchido automaticamente.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Como funciona</h2>
                    <ul className="mt-3 list-disc pl-5 text-sm text-slate-700 space-y-1">
                      <li>Enviamos a imagem para processamento.</li>
                      <li>Acompanhe o status (Pendente/Processando).</li>
                      <li>Quando finalizar, exibimos pontuação e detalhes por questão.</li>
                    </ul>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="mt-6 inline-flex items-center justify-center gap-2 rounded-2xl bg-[#2EC5B6] px-5 py-3 font-semibold text-white transition-colors duration-300 hover:bg-[#27b3a6] disabled:opacity-60 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <IconeCarregamento w={18} h={18} color="white" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <FileCheck2 size={18} />
                        Enviar para correção
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </main>
  );
}
