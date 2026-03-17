import { useState } from "react";
import { GripVertical } from "lucide-react";
import type { Questao } from "../../Questoes/types/questoes.types";
import ItemQuestaoSelecionada from "./ItemQuestaoSelecionada";

interface QuestaoSelecionadaLocal {
  questionId: string;
  weight: number;
  position: number;
  statement?: string;
  content?: string;
  subject?: string;
  schoolYear?: string;
  difficulty?: string;
  alternatives?: Array<{ id: string; text: string }>;
  question?: Questao;
}

interface Props {
  questoes: QuestaoSelecionadaLocal[];
  atualizarPeso: (id: string, peso: number) => void;
  remover: (id: string) => void;
  onReorder?: (novaOrdem: QuestaoSelecionadaLocal[]) => void;
}

export default function ListaQuestoesSelecionadas({
  questoes,
  atualizarPeso,
  remover,
  onReorder,
}: Props) {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [overId, setOverId] = useState<string | null>(null);

  function handleDragStart(e: React.DragEvent, id: string) {
    setDraggingId(id);
    try {
      e.dataTransfer.setData("text/plain", id);
    } catch {}
    e.dataTransfer.effectAllowed = "move";
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function handleDragEnter(e: React.DragEvent, id: string) {
    e.preventDefault();
    if (id !== draggingId) setOverId(id);
  }

  function handleDragLeave(_e: React.DragEvent, id: string) {
    if (overId === id) setOverId(null);
  }

  function handleDrop(e: React.DragEvent, dropId?: string) {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData("text/plain") || draggingId;
    if (!draggedId) return;

    // if no dropId provided, append to end
    const fromIndex = questoes.findIndex((q) => q.questionId === draggedId);
    const toIndex = dropId
      ? questoes.findIndex((q) => q.questionId === dropId)
      : questoes.length - 1;

    if (fromIndex === -1 || toIndex === -1) return;
    if (fromIndex === toIndex) return;

    const next = [...questoes];
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);

    const rePos = next.map((item, idx) => ({ ...item, position: idx + 1 }));
    onReorder?.(rePos);
    setDraggingId(null);
    setOverId(null);
  }

  return (
    <div className="space-y-3">
      {questoes.map((questao) => (
        <div key={questao.questionId}>
          <div
            className={`relative transition-all duration-200 ease-in-out ${
              draggingId === questao.questionId ? "opacity-60 scale-95" : ""
            } ${overId === questao.questionId ? "translate-y-2 ring-1 ring-[#2EC5B6] rounded-lg" : ""}`}
            onDragEnter={(e) => handleDragEnter(e, questao.questionId)}
            onDragLeave={(e) => handleDragLeave(e, questao.questionId)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, questao.questionId)}
          >
            {/* handle dentro do card (visualmente dentro) */}
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, questao.questionId)}
              onDragEnd={() => {
                setDraggingId(null);
                setOverId(null);
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2"
              aria-hidden
            >
              <div className={`flex h-9 w-9 items-center justify-center rounded-full bg-[#F0FDFA] text-[#0F766E] shadow-sm transition-transform duration-300 ${
                draggingId === questao.questionId ? "scale-95 shadow-lg" : ""
              }`}>
                <GripVertical size={18} className="cursor-grab text-[#0F766E]" />
              </div>
            </div>

            <div className="pl-14">
              <ItemQuestaoSelecionada
                questao={questao}
                atualizarPeso={atualizarPeso}
                remover={remover}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}