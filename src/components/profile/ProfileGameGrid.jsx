import { Link } from "react-router-dom";
import { decodificarTexto } from "../../utils/formatacao";

export function ProfileGameGrid({ titulo, icone: Icon, jogos, mensagemVazia }) {
  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <Icon className="w-6 h-6 text-[#00ff9d]" />
        <h2 className="text-2xl font-bold text-white">{titulo}</h2>
      </div>
      
      {jogos.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {jogos.map((jogo) => (
            <Link key={jogo.id || jogo.jogoId || Math.random()} to={`/jogo/${jogo.id || jogo.jogoId}`} className="group block cursor-pointer">
              <div className="relative aspect-[3/4] overflow-hidden rounded-xl bg-zinc-800 mb-3 border border-white/5 group-hover:border-[#00ff9d]/30 transition-all duration-300 shadow-md group-hover:shadow-[0_0_20px_rgba(0,255,157,0.1)]">
                <img 
                  src={jogo.capaUrl || "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300"} 
                  alt={jogo.titulo || "Jogo"} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  onError={(e) => { e.target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=300"; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              <h3 className="text-sm font-bold text-white truncate group-hover:text-[#00ff9d] transition-colors">
                {decodificarTexto(jogo.titulo || "Jogo sem título")}
              </h3>
              <p className="text-xs text-zinc-500 mt-1 font-medium">
                {jogo.preco === 0 || !jogo.preco ? 'Gratuito' : `R$ ${Number(jogo.preco).toFixed(2)}`}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-zinc-900/50 p-10 rounded-2xl border border-white/5 text-center flex flex-col items-center">
          <Icon className="w-12 h-12 text-zinc-800 mb-3" />
          <p className="text-zinc-400 font-medium">{mensagemVazia}</p>
        </div>
      )}
    </section>
  );
}