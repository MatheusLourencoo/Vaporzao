import { Check } from "lucide-react";
import {
  formatarNomeCompleto,
  formatarPrimeiroEUltimoNome,
  formatarDataLancamento,
} from "../../utils/formatacao";

export function GameSidebar({ 
  game, 
  localInLib, 
  localInWish, 
  processandoObter, 
  processandoWishlist, 
  handleObter, 
  handleWishlist 
}) {
  if (!game) return null;

  return (
    <div className="bg-card p-6 rounded-2xl border border-white/5 sticky top-24">
      <div className="text-3xl font-bold mb-6 text-white">
        {game.preco > 0 ? `R$ ${game.preco.toFixed(2)}` : "Gratuito"}
      </div>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleObter}
          disabled={processandoObter}
          className={`w-full flex items-center justify-center gap-2 font-black py-4 rounded-lg transition-all ${
            processandoObter
              ? "bg-[#00ff9d] text-black opacity-70 cursor-wait"
              : localInLib
              ? "bg-white/5 text-white hover:bg-white/10 border border-white/10"
              : "bg-[#00ff9d] text-black hover:bg-[#00e08a] shadow-[0_0_15px_rgba(0,255,157,0.2)] hover:shadow-[0_0_25px_rgba(0,255,157,0.4)]"
          }`}
        >
          {processandoObter ? (
            "Adicionando..."
          ) : localInLib ? (
            <><Check className="w-5 h-5 text-[#00ff9d]" /> Na Biblioteca</>
          ) : (
            "Obter"
          )}
        </button>

        <button
          type="button"
          onClick={handleWishlist}
          disabled={processandoWishlist}
          className={`w-full flex items-center justify-center gap-2 font-bold py-4 rounded-lg transition-all border ${
            processandoWishlist
              ? "bg-[#2a2a2a] border-white/10 text-white opacity-70 cursor-wait"
              : localInWish
              ? "bg-transparent border-white/10 text-white hover:bg-white/5"
              : "bg-[#2a2a2a] border-white/10 text-white hover:bg-[#3d3d3d]"
          }`}
        >
          {processandoWishlist ? (
            "Adicionando..."
          ) : localInWish ? (
            <><Check className="w-5 h-5 text-white" /> Na Lista de Desejos</>
          ) : (
            "Lista de desejos"
          )}
        </button>
      </div>

      <div className="mt-6 space-y-4">
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-zinc-400 whitespace-nowrap">Desenvolvedor</span>
          <span className="text-white font-medium text-right break-words line-clamp-2">
            {formatarNomeCompleto(game.desenvolvedora || game.desenvolvedor, "Não informado")}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-zinc-400 whitespace-nowrap">Autor / Autora</span>
          <span className="text-white font-medium text-right break-words line-clamp-2">
            {formatarPrimeiroEUltimoNome(game.autor || game.publicadora, "Não informado")}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 text-sm">
          <span className="text-zinc-400 whitespace-nowrap">Lançamento</span>
          <span className="text-white font-medium text-right whitespace-nowrap">
            {formatarDataLancamento(game)}
          </span>
        </div>
      </div>
    </div>
  );
}