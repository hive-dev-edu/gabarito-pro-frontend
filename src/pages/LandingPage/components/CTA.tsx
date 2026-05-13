import { ArrowRight } from 'lucide-react';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { Link } from 'react-router-dom';

export default function CTA() {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <section
      id="cta"
      className="py-24 lg:py-32 bg-slate-900 relative overflow-hidden"
    >
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-150 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-900/20 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-6 lg:px-8 text-center">
        <div
          ref={ref}
          className={`transition-all duration-700 ${
            isVisible
              ? 'opacity-100 translate-y-0'
              : 'opacity-0 translate-y-8'
          }`}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-6">
            Pronto para transformar a{' '}
            <span className="text-green-500">sua correção</span>?
          </h2>
          <p className="text-lg lg:text-xl text-white/60 max-w-2xl mx-auto mb-10">
            Junte-se a milhares de professores que já economizam horas com
            correção automática. Comece gratuitamente hoje.
          </p>
          <Link 
            to="/dashboard"
            className="inline-flex items-center gap-2 px-10 py-5 rounded-full bg-green-500 text-white font-bold text-lg hover:bg-green-600 transition-all shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-0.5"
          >
            Começar gratuitamente
            <ArrowRight size={20} />
          </Link>
          
        </div>
      </div>
    </section>
  );
}
