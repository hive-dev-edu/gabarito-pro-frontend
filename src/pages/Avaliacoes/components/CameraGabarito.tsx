import { useEffect, useRef, useState } from "react";
import { Camera, Check, RotateCcw, X } from "lucide-react";
import IconeCarregamento from "../../../shared/components/IconeCarregamento";

interface CameraGabaritoProps {
  aberto: boolean;
  onFechar: () => void;
  onImagemConfirmada: (arquivo: File) => Promise<void>;
}

export default function CameraGabarito({
  aberto,
  onFechar,
  onImagemConfirmada,
}: CameraGabaritoProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [erro, setErro] = useState("");
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [arquivoCapturado, setArquivoCapturado] = useState<File | null>(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (!aberto) return;

    iniciarCamera();

    return () => pararCamera();
  }, [aberto]);

  async function iniciarCamera() {
    try {
      setErro("");
      setFotoPreview(null);
      setArquivoCapturado(null);

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: "environment" },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
        audio: false,
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch {
      setErro(
        "Não foi possível acessar a câmera. Verifique a permissão do navegador."
      );
    }
  }

  function pararCamera() {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }

  function capturarFoto() {
  const video = videoRef.current;
  const canvas = canvasRef.current;

  if (!video || !canvas) return;

  const videoWidth = video.videoWidth;
  const videoHeight = video.videoHeight;

  const angle = screen.orientation?.angle ?? 0;
  const celularDeitado = angle === 90 || angle === 270;

  if (celularDeitado) {
    canvas.width = videoHeight;
    canvas.height = videoWidth;
  } else {
    canvas.width = videoWidth;
    canvas.height = videoHeight;
  }

  const contexto = canvas.getContext("2d");
  if (!contexto) return;

  contexto.save();

  if (celularDeitado) {
    contexto.translate(canvas.width / 2, canvas.height / 2);

    if (angle === 90) {
      contexto.rotate(-Math.PI / 2);
    } else {
      contexto.rotate(Math.PI / 2);
    }

    contexto.drawImage(
      video,
      -videoWidth / 2,
      -videoHeight / 2,
      videoWidth,
      videoHeight
    );
  } else {
    contexto.drawImage(video, 0, 0, canvas.width, canvas.height);
  }

  contexto.restore();

  canvas.toBlob(
    (blob) => {
      if (!blob) {
        setErro("Erro ao capturar imagem.");
        return;
      }

      const arquivo = new File([blob], `gabarito-${Date.now()}.jpg`, {
        type: "image/jpeg",
      });

      const previewUrl = URL.createObjectURL(blob);

      setArquivoCapturado(arquivo);
      setFotoPreview(previewUrl);
      pararCamera();
    },
    "image/jpeg",
    0.92
  );
}

  async function confirmarFoto() {
    if (!arquivoCapturado) return;

    try {
      setEnviando(true);
      setErro("");
      await onImagemConfirmada(arquivoCapturado);
      fecharModal();
    } catch (e) {
      setErro(e instanceof Error ? e.message : "Erro ao enviar imagem.");
    } finally {
      setEnviando(false);
    }
  }

  function tirarNovamente() {
    if (fotoPreview) {
      URL.revokeObjectURL(fotoPreview);
    }

    setFotoPreview(null);
    setArquivoCapturado(null);
    iniciarCamera();
  }

  function fecharModal() {
    pararCamera();

    if (fotoPreview) {
      URL.revokeObjectURL(fotoPreview);
    }

    setFotoPreview(null);
    setArquivoCapturado(null);
    setErro("");
    onFechar();
  }

  if (!aberto) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <canvas ref={canvasRef} className="hidden" />

      <div className="relative h-full w-full overflow-hidden">
        {fotoPreview ? (
          <img
            src={fotoPreview}
            alt="Preview do gabarito"
            className="h-full w-full object-contain bg-black"
          />
        ) : (
          <>
            <video
              ref={videoRef}
              playsInline
              muted
              autoPlay
              className="h-full w-full object-cover"
            />

            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="relative h-[58%] w-[86%] max-w-[520px] rounded-3xl border-4 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.55)]">
                <div className="absolute -top-12 left-1/2 w-max -translate-x-1/2 rounded-full bg-black/70 px-4 py-2 text-center text-sm font-medium text-white">
                  Encaixe o gabarito dentro do retângulo
                </div>

                <div className="absolute -left-1 -top-1 h-10 w-10 rounded-tl-3xl border-l-8 border-t-8 border-[#2EC5B6]" />
                <div className="absolute -right-1 -top-1 h-10 w-10 rounded-tr-3xl border-r-8 border-t-8 border-[#2EC5B6]" />
                <div className="absolute -bottom-1 -left-1 h-10 w-10 rounded-bl-3xl border-b-8 border-l-8 border-[#2EC5B6]" />
                <div className="absolute -bottom-1 -right-1 h-10 w-10 rounded-br-3xl border-b-8 border-r-8 border-[#2EC5B6]" />
              </div>
            </div>
          </>
        )}

        <button
          type="button"
          onClick={fecharModal}
          className="absolute left-4 top-4 inline-flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white"
        >
          <X size={22} />
        </button>

        {erro && (
          <div className="absolute left-4 right-4 top-20 rounded-2xl bg-red-50 p-3 text-center text-sm text-red-700">
            {erro}
          </div>
        )}

        <div className="absolute bottom-0 left-0 right-0 flex justify-center gap-3 bg-gradient-to-t from-black/80 to-transparent px-4 pb-8 pt-10">
          {fotoPreview ? (
            <>
              <button
                type="button"
                onClick={tirarNovamente}
                disabled={enviando}
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 font-semibold text-slate-800 disabled:opacity-60"
              >
                <RotateCcw size={18} />
                Tirar novamente
              </button>

              <button
                type="button"
                onClick={confirmarFoto}
                disabled={enviando}
                className="inline-flex items-center gap-2 rounded-2xl bg-[#2EC5B6] px-5 py-3 font-semibold text-white disabled:opacity-60"
              >
                {enviando ? (
                  <>
                    <IconeCarregamento w={18} h={18} color="white" />
                    Enviando...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Usar foto
                  </>
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={capturarFoto}
              className="inline-flex h-16 w-16 items-center justify-center rounded-full border-4 border-white bg-[#2EC5B6] text-white shadow-lg"
            >
              <Camera size={28} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}