import { Timer, TrendingDown, Shuffle } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';

const benefits = [
  {
    icon: Timer,
    value: '< 1 min',
    label: 'Corrija 30 provas em menos de 1 minuto',
    color: 'text-green-500',
    bg: 'bg-green-500/10',
  },
  {
    icon: TrendingDown,
    value: '90%',
    label: 'Até 90% menos tempo gasto com correção',
    color: 'text-blue-900',
    bg: 'bg-blue-900/10',
  },
  {
    icon: Shuffle,
    value: 'Auto',
    label: 'Versões únicas geradas automaticamente',
    color: 'text-amber-600',
    bg: 'bg-amber-500/10',
  },
];

export default function Benefits() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section className="py-24 lg:py-32 bg-slate-900 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div
          ref={ref}
          className={`text-center max-w-2xl mx-auto mb-16 transition-all duration-700 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/80 text-sm font-semibold mb-4">
            Resultados
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
            Números que fazem a diferença
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Veja como o Gabarito.pro transforma a rotina de professores
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.label}
              className={`text-center p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${(index + 1) * 150}ms` }}
            >
              <div
                className={`w-16 h-16 rounded-2xl ${benefit.bg} flex items-center justify-center mx-auto mb-6`}
              >
                <benefit.icon size={28} className={benefit.color} />
              </div>
              <div
                className={`text-4xl lg:text-5xl font-extrabold ${benefit.color} mb-3`}
              >
                {benefit.value}
              </div>
              <p className="text-white/70 text-base leading-relaxed">
                {benefit.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
