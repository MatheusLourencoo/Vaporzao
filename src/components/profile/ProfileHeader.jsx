export function ProfileHeader({ inicial, nomeExibicao, stats }) {
  return (
    <div className="relative pt-24 pb-12 px-6 bg-[#121212] border-b border-white/5">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
        <div className="absolute -top-[50%] -left-[10%] w-[50%] h-[150%] bg-gradient-to-r from-[#00ff9d]/10 to-transparent -skew-x-12"></div>
      </div>

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center md:items-end gap-8 relative z-10">
        
        <div className="w-32 h-32 shrink-0 rounded-2xl bg-[#1a1a1a] border border-white/10 flex items-center justify-center text-5xl font-black text-white shadow-2xl">
          {inicial}
        </div>

        <div className="text-center md:text-left flex-1 mb-2">
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">{nomeExibicao}</h1>
          <p className="text-zinc-500 font-medium mt-1 uppercase tracking-widest text-xs">Membro da Vaporzão</p>
        </div>

        <div className="flex flex-wrap justify-center gap-4 mt-6 md:mt-0">
          {[
            { label: "Publicados", value: stats.jogosCriados },
            { label: "Avaliações", value: stats.reviews }
          ].map((stat, index) => (
            <div key={index} className="bg-[#1a1a1a] px-6 py-4 rounded-xl border border-white/5 text-center min-w-[120px] transition-colors hover:bg-[#222]">
              <span className="block text-2xl font-bold text-white font-mono">{stat.value}</span>
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mt-1 block">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}