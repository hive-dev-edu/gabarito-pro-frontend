import { PenTool, Shuffle, Printer, ScanLine } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const steps = [
  {
    icon: PenTool,
    number: '01',
    title: 'Crie questões',
    description:
      'Cadastre suas questões objetivas com enunciado, alternativas e gabarito. Organize por disciplina e assunto.',
    color: 'from-blue-900 to-blue-400',
  },
  {
    icon: Shuffle,
    number: '02',
    title: 'Gere versões',
    description:
      'Com um clique, gere múltiplas versões da prova com questões e alternativas embaralhadas automaticamente.',
    color: 'from-green-500 to-emerald-400',
  },
  {
    icon: Printer,
    number: '03',
    title: 'Imprima cartões-resposta',
    description:
      'Imprima as provas e cartões-resposta personalizados para cada versão. Prontos para aplicar.',
    color: 'from-amber-500 to-orange-400',
  },
  {
    icon: ScanLine,
    number: '04',
    title: 'Escaneie e receba a nota',
    description:
      'Aponte a câmera para o cartão-resposta e a correção é feita automaticamente. Resultado instantâneo.',
    color: 'from-rose-500 to-pink-400',
  },
];

export default function HowItWorks() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      id="como-funciona"
      className="py-24 lg:py-32 bg-linear-to-b from-white to-gray-50"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-green-500/10 text-green-500 text-sm font-semibold mb-4">
            Passo a passo
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            Como funciona?
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Em apenas 4 passos, vôce cria, aplica e corrige provas objetivas
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-0.5 bg-linear-to-r from-blue-900/20 via-green-500/20 to-rose-500/20" />

          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`relative text-center transition-all duration-700 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${(index + 1) * 200}ms` }}
            >
              <div className="relative inline-flex mb-6">
                <div
                  className={`w-16 h-16 rounded-2xl bg-linear-to-br ${step.color} flex items-center justify-center shadow-lg`}
                >
                  <step.icon size={28} className="text-white" />
                </div>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center text-xs font-bold text-slate-900">
                  {step.number}
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
