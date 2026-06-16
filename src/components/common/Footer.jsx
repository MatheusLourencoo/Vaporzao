import { Instagram, Gamepad2 } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-[#121212] text-white pt-12 pb-6 border-t border-white/5 select-none mt-auto">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 pb-10 border-b border-white/5">
          
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-black text-xl tracking-tighter uppercase">
              <Gamepad2 className="w-6 h-6 text-[#00ff9d]" />
              Vaporzão<span className="text-[#00ff9d] text-xs font-bold align-super">®</span>
            </div>
            <p className="text-[13px] text-zinc-500 leading-relaxed max-w-[200px]">
              A sua plataforma definitiva para descobrir, jogar e avaliar os melhores títulos do mercado.
            </p>
          </div>

          <div>
            <h5 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Mapa do Site</h5>
            <ul className="space-y-3">
              <li>
                <Link to="/loja" className="text-[13px] text-zinc-500 hover:text-white transition-colors">Loja</Link>
              </li>
              <li>
                <Link to="/biblioteca" className="text-[13px] text-zinc-500 hover:text-white transition-colors">Biblioteca</Link>
              </li>
              <li>
                <Link to="/comunidade" className="text-[13px] text-zinc-500 hover:text-white transition-colors">Comunidade</Link>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Empresa</h5>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-[13px] text-zinc-500 hover:text-white transition-colors">Suporte</a>
              </li>
              <li>
                <a href="#" className="text-[13px] text-zinc-500 hover:text-white transition-colors">Termos de Serviço</a>
              </li>
              <li>
                <a href="#" className="text-[13px] text-zinc-500 hover:text-white transition-colors">Privacidade</a>
              </li>
            </ul>
          </div>

          <div>
            <h5 className="text-[11px] font-bold uppercase tracking-widest text-[#00ff9d] mb-4">Desenvolvedores</h5>
            <ul className="space-y-3">
              <li>
                <a href="https://www.instagram.com/matheuslourencoo_/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-zinc-500 hover:text-[#00ff9d] transition-colors group w-fit">
                  <Instagram className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  <span className="text-[13px] font-medium">Matheus Lourenço</span>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/dx_predin/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-zinc-500 hover:text-[#00ff9d] transition-colors group w-fit">
                  <Instagram className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  <span className="text-[13px] font-medium">Pedro Henrique</span>
                </a>
              </li>
              <li>
                <a href="https://www.instagram.com/paulo_vmo/" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-zinc-500 hover:text-[#00ff9d] transition-colors group w-fit">
                  <Instagram className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                  <span className="text-[13px] font-medium">Paulo Victor</span>
                </a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-[12px] text-zinc-600 font-medium text-center md:text-left">
            © 2026 Vaporzão Todos os direitos reservados.
          </span>
          
        </div>

      </div>
    </footer>
  );
}