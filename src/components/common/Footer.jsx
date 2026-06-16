export function Footer() {
	return (
		<footer className="bg-[#1a1a1a] text-white pt-12 border-t border-white/5">
			<div className="max-w-7xl mx-auto px-8">
				<div className="grid grid-cols-[220px_1fr] gap-10 pb-10 border-b border-white/10">
					<div>
						<h2 className="text-xl font-bold">Vaporzão</h2>
					</div>
					<div className="grid grid-cols-4 gap-8">
						{[
							{
								title: "Recursos",
								links: ["Suporte", "Comunidade", "Carreiras", "Imprensa"],
							},
							{
								title: "Empresa",
								links: [
									"Sobre",
									"Termos de Serviço",
									"Privacidade",
									"Acessibilidade",
								],
							},
							{
								title: "Loja",
								links: ["Jogos Gratuitos", "Descobrir", "Novidades", "Desejos"],
							},
							{
								title: "Conta",
								links: ["Minha Conta", "Biblioteca", "Amigos", "Conquistas"],
							},
						].map(({ title, links }) => (
							<div key={title}>
								<h5 className="text-[11px] font-bold uppercase tracking-widest text-white mb-4">
									{title}
								</h5>
								<ul className="space-y-2.5">
									{links.map((link) => (
										<li key={link}>
											<a
												href="#"
												className="text-[13px] text-white/40 hover:text-white transition-colors"
											>
												{link}
											</a>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>
				<div className="py-5 flex items-center justify-between flex-wrap gap-4">
					<div className="flex items-center gap-5 flex-wrap">
						<span className="text-[11px] text-white/30">
							© 2026 Vaporzão Inc.
						</span>
						{[
							"Política de Privacidade",
							"Termos de Serviço",
							"Política de Cookies",
							"Termos de Venda",
							"Acessibilidade",
						].map((item) => (
							<a
								key={item}
								href="#"
								className="text-[11px] text-white/30 hover:text-white/60 transition-colors"
							>
								{item}
							</a>
						))}
					</div>
					<div className="flex items-center gap-2">
						{["LIVRE", "+12", "+16", "+18"].map((r) => (
							<span
								key={r}
								className="border border-white/25 rounded-sm px-1.5 py-0.5 text-[11px] font-bold text-white/50 tracking-wide"
							>
								{r}
							</span>
						))}
					</div>
				</div>
			</div>
		</footer>
	);
}
