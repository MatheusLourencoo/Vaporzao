import { useState } from "react";
import { Heart, Trash2 } from "lucide-react";
import { GameCard } from "../components/GameCard";
import { useNavigate } from "react-router-dom";

export function Wishlist({ wishlist, removerDaWishlist }) {
  const [jogoParaRemover, setJogoParaRemover] = useState(null);
  const navigate = useNavigate();
  const listaValida = wishlist.filter(game => game && (game.id || game.jogoId));

  return (
    <>
      <div className="py-8 animate-in fade-in duration-500 max-w-[1400px] mx-auto px-4">
        <div className="flex items-center gap-3 mb-8">
          <Heart className="w-8 h-8 text-primary" />
          <h1 className="text-3xl font-bold">Lista de Desejos</h1>
        </div>

        {listaValida.length === 0 ? (
          <div className="text-center py-20 bg-card border border-border rounded-xl">
            <p className="text-xl text-muted-foreground mb-4">Sua lista de desejos está vazia.</p>
            <p className="text-muted-foreground">Fique de olho nos lançamentos e salve seus favoritos!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
            {listaValida.map((game) => (
              <div 
                key={game.id || game.jogoId} 
                className="relative group cursor-pointer" 
                onClick={() => navigate(`/jogo/${game.id || game.jogoId}`)}
              >
                <GameCard game={game} />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setJogoParaRemover(game);
                  }}
                  className="absolute top-2 right-2 p-2 bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                  title="Remover da Wishlist"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {jogoParaRemover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#18181b] border border-white/10 p-6 rounded-xl max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-white mb-2">Remover da Lista?</h2>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Deseja parar de monitorar <strong>"{jogoParaRemover.titulo || 'Jogo Desconhecido'}"</strong>?
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setJogoParaRemover(null)} 
                className="flex-1 py-2.5 rounded-lg font-semibold text-zinc-300 hover:bg-white/5 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={() => {
                  removerDaWishlist(jogoParaRemover.id || jogoParaRemover.jogoId);
                  setJogoParaRemover(null);
                }} 
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
              >
                Remover
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}