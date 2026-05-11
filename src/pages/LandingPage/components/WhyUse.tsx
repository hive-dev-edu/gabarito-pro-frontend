import { Shuffle, Camera, Clock } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const features = [
  {
    icon: Shuffle,
    title: 'Geração automática de versões',
    description:
      'Crie múltiplas versões da mesma prova com questões e alternativas embaralhadas automaticamente, garantindo provas únicas para cada aluno.',
    color: 'from-blue-900 to-blue-400',
    bg: 'bg-blue-900/5',
    border: 'border-blue-900/10',
  },
  {
    icon: Camera,
    title: 'Correção por câmera (OMR)',
    description:
      'Aponte a câmera do celular para o cartão-resposta e receba a nota instantaneamente. Tecnologia OMR precisa e rápida, sem scanners.',
    color: 'from-green-500 to-emerald-400',
    bg: 'bg-green-500/5',
    border: 'border-green-500/10',
  },
  {
    icon: Clock,
    title: 'Redução de cola e economia de tempo',
    description:
      'Com versões únicas, a cola entre alunos é eliminada. E vôce economiza horas de correção manual que podem ser usadas para ensinar.',
    color: 'from-amber-500 to-orange-400',
    bg: 'bg-amber-500/5',
    border: 'border-amber-500/10',
  },
];

export default function WhyUse() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section id="recursos" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-blue-900/10 text-blue-900 text-sm font-semibold mb-4">
            Recursos
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            Por que usar o{' '}
            <span className="gradient-text">Gabarito.pro</span>?
          </h2>
          <p className="mt-4 text-lg text-gray-500">
            Tudo que vôce precisa para modernizar a criação e correção de provas
            objetivas
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className={`group relative p-8 rounded-2xl border ${feature.border} ${feature.bg} hover:shadow-xl hover:-translate-y-1 transition-all duration-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${(index + 1) * 150}ms` }}
            >
              <div
                className={`w-14 h-14 rounded-xl bg-linear-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon size={24} className="text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
