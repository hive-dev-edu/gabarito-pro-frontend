import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function AnswerSheetMockup() {
  const rows = Array.from({ length: 10 }, (_, i) => i + 1);

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="absolute -inset-4 bg-linear-to-r from-blue-900/20 to-green-500/20 rounded-3xl blur-2xl" />
      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 animate-float">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="h-3 w-24 bg-slate-900/10 rounded mb-1.5" />
            <div className="h-2 w-32 bg-gray-200 rounded" />
          </div>
          <div className="w-10 h-10 rounded-lg bg-linear-to-br from-blue-900 to-green-500 flex items-center justify-center">
            <span className="text-white font-bold text-xs">G</span>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center gap-1 mb-3">
            {['A', 'B', 'C', 'D', 'E'].map((letter) => (
              <div
                key={letter}
                className="flex-1 text-center text-[10px] font-semibold text-gray-400"
              >
                {letter}
              </div>
            ))}
          </div>

          {rows.map((num) => (
            <div key={num} className="flex items-center gap-1 mb-1.5">
              <span className="text-[10px] font-medium text-gray-400 w-5 text-right mr-1">
                {num}
              </span>
              {['A', 'B', 'C', 'D', 'E'].map((letter, li) => {
                const selected =
                  (num === 1 && li === 1) ||
                  (num === 2 && li === 3) ||
                  (num === 3 && li === 0) ||
                  (num === 4 && li === 2) ||
                  (num === 5 && li === 4) ||
                  (num === 6 && li === 1) ||
                  (num === 7 && li === 3) ||
                  (num === 8 && li === 0) ||
                  (num === 9 && li === 2) ||
                  (num === 10 && li === 4);
                return (
                  <div
                    key={letter}
                    className={`flex-1 h-6 rounded border transition-all ${
                      selected
                        ? 'bg-green-500/15 border-green-500/40'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {selected && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-3 h-3 rounded-full bg-green-500" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-green-500/10 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse-slow" />
            </div>
            <span className="text-[10px] font-medium text-green-500">
              Leitura automática por câmera
            </span>
          </div>
          <span className="text-[10px] text-gray-400">Versão A</span>
        </div>
      </div>
    </div>
  );
}

export default function Hero() {
  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center overflow-hidden bg-linear-to-b from-gray-50 to-white"
    >
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-green-500/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-900/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-200 h-200 bg-linear-to-r from-blue-900/3 to-green-500/3 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="animate-fade-in-up">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-sm font-semibold border border-green-500/20">
                <Sparkles size={14} />
                Plataforma para professores
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight animate-fade-in-up"
              style={{ animationDelay: '0.1s' }}
            >
              Corrija provas em minutos com{' '}
              <span className="gradient-text">inteligência</span> e{' '}
              <span className="gradient-text">automação</span>
            </h1>

            <p
              className="text-lg lg:text-xl text-gray-500 leading-relaxed max-w-lg animate-fade-in-up"
              style={{ animationDelay: '0.2s' }}
            >
              Gere provas com versões unicas para cada aluno, cartões-resposta
              personalizados e correção automática por câmera. Tudo em uma
              plataforma simples e rápida.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 animate-fade-in-up"
              style={{ animationDelay: '0.3s' }}
            >
              <Link to="dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-green-500 text-white font-semibold text-base hover:bg-green-600 transition-all shadow-xl shadow-green-500/25 hover:shadow-green-500/40 hover:-translate-y-0.5"
              >
                Testar gratuitamente
                <ArrowRight size={18} />
              </Link>
              <a
                href="#como-funciona"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full border-2 border-gray-200 text-slate-900 font-semibold text-base hover:border-blue-900/30 hover:bg-blue-900/5 transition-all"
              >
                Veja como funciona
              </a>
            </div>

          </div>

          <div
            className="animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            <AnswerSheetMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
