export function Footer() {
  return (
    <footer className="bg-[#0c0c0c] border-t border-white/10 pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-xl font-bold mb-4">Vaporzão</h2>
            <p className="text-muted-foreground text-sm">
              Sua plataforma favorita de jogos digitais. Conectando jogadores a mundos incríveis.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-white">Recursos</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">Suporte</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Comunidade</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Carreiras</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4 text-sm uppercase tracking-wider text-white">Empresa</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="hover:text-primary transition-colors cursor-pointer">Sobre</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Termos de Serviço</li>
              <li className="hover:text-primary transition-colors cursor-pointer">Privacidade</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground">
          <p>© 2026 Vaporzão Inc. Todos os direitos reservados.</p>
          <div className="flex gap-6">
            <span className="hover:text-white transition-colors cursor-pointer">Política de Cookies</span>
            <span className="hover:text-white transition-colors cursor-pointer">Termos de Venda</span>
          </div>
        </div>
      </div>
    </footer>
  );
}