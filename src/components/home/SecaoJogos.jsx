import { ChevronDown, Gamepad2 } from "lucide-react";
import { GameCard } from "../game/GameCard";

export function SecaoJogos({ carregando, erro, jogosExibidos, jogosPaginados, itensVisiveis, onCarregarMais, onVerDetalhes }) {
  if (carregando) {
    return (
      <div className="text-center py-20 text-zinc-400 bg-[#121212] rounded-2xl border border-white/5">
        <div className="w-8 h-8 border-4 border-[#00ff9d] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        Carregando catálogo...
      </div>
    );
  }

  if (erro) {
    return (
      <div className="text-center py-10 bg-red-950/30 border border-red-500/20 rounded-2xl">
        <p className="text-red-400 font-medium">{erro}</p>
      </div>
    );
  }

  if (jogosExibidos.length === 0) {
    return (
      <div className="text-center py-20 bg-[#121212] rounded-2xl border border-white/5">
        <Gamepad2 className="w-16 h-16 text-zinc-800 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">Nenhum jogo encontrado</h3>
        <p className="text-zinc-500">Tente ajustar seus filtros para encontrar novos jogos.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-5">
        {jogosPaginados.map((game) => (
          <GameCard key={game.id} game={game} onViewDetails={() => onVerDetalhes(game)} />
        ))}
      </div>

      {itensVisiveis < jogosExibidos.length && (
        <div className="mt-12 flex justify-center">
          <button
            onClick={onCarregarMais}
            className="flex items-center gap-2 px-8 py-4 bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white font-bold rounded-xl transition-all hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] group"
          >
            Carregar mais jogos <ChevronDown className="w-5 h-5 group-hover:translate-y-1 transition-transform" />
          </button>
        </div>
      )}
    </>
  );
}