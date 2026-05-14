// import { Mail, Instagram, Youtube, Linkedin } from 'lucide-react';

// const footerLinks = {
//   Produto: ['Recursos', 'Como funciona', 'Planos', 'Integrações'],
//   Suporte: ['Central de ajuda', 'Tutoriais', 'Contato', 'Status'],
//   Empresa: ['Sobre nós', 'Blog', 'Carreiras', 'Imprensa'],
//   Legal: ['Termos de uso', 'Privacidade', 'LGPD', 'Cookies'],
// };

export default function Footer() {
  return (
    <footer id="contato" className="bg-slate-900 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="flex justify-center">
          <div className="flex flex-col items-center text-center">
            <a href="#inicio" className="flex items-center justify-center gap-2 mb-4">
              <img src="/images/logo-gabarito-pro.png" alt="Gabarito.pro" className="h-10 w-auto rounded-lg" />
              <span className="text-lg font-bold text-white">
                Gabarito<span className="text-green-500">.pro</span>
              </span>
            </a>
            <p className="text-sm text-white/40 leading-relaxed mb-6">
              Plataforma educacional para criação e correção automática de provas
              objetivas.
            </p>
            {/* <div className="flex items-center justify-center gap-3">
              {[Instagram, Youtube, Linkedin, Mail].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                >
                  <Icon size={16} className="text-white/60" />
                </a>
              ))}
            </div> */}
          </div>

          {/* {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-sm font-semibold text-white mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <a
                      href="#"
                      className="text-sm text-white/40 hover:text-white/80 transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))} */}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">
            &copy; {new Date().getFullYear()} Gabarito.pro. Todos os direitos
            reservados.
          </p>
          <p className="text-sm text-white/30">
            Feito com dedicacção para professores que querem transformar a experiência de criar e corrigir provas.
          </p>
        </div>
      </div>
    </footer>
  );
}
