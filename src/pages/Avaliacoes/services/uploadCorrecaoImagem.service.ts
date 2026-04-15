import { httpClient } from "../../../utils/httpClient";

interface RespostaAssinatura {
  api_key: string;
  timestamp: number;
  signature: string;
  folder: string;
  cloud_name: string;
}

interface RespostaCloudinary {
  secure_url: string;
  public_id: string;
  error?: {
    message: string;
  };
}

async function buscarAssinaturaCorrecao(): Promise<RespostaAssinatura> {
  const resposta = await httpClient.post<RespostaAssinatura>(
    "/cloudinary/signature-upload-to-correction-assessment-images"
  );
  return resposta.data;
}

export async function uploadImagemCorrecao(arquivo: File): Promise<string> {
  try {
    const assinatura = await buscarAssinaturaCorrecao();

    const formData = new FormData();
    formData.append("file", arquivo);
    formData.append("api_key", assinatura.api_key);
    formData.append("timestamp", String(assinatura.timestamp));
    formData.append("signature", assinatura.signature);
    formData.append("folder", assinatura.folder);

    const urlCloudinary = `https://api.cloudinary.com/v1_1/${assinatura.cloud_name}/image/upload`;

    const respostaUpload = await fetch(urlCloudinary, {
      method: "POST",
      body: formData,
    });

    const resultadoUpload: RespostaCloudinary = await respostaUpload.json();

    if (!respostaUpload.ok || resultadoUpload.error) {
      throw new Error(
        resultadoUpload.error?.message || "Erro ao fazer upload da imagem"
      );
    }

    return resultadoUpload.secure_url;
  } catch (erro) {
    if (erro instanceof Error) {
      throw new Error(`Falha no upload: ${erro.message}`);
    }
    throw new Error("Erro desconhecido ao fazer upload da imagem");
  }
}
