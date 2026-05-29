import { Heart, Trash2 } from "lucide-react";
import { GameCard } from "../components/GameCard";

export function Wishlist({ 
  wishlist, 
  removerDaWishlist 
}) {
  return (
    <div className="py-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3 mb-8 px-4 max-w-[1400px] mx-auto">
        <Heart className="w-8 h-8 text-accent-foreground fill-current" />
        <h1 className="text-3xl font-bold">Minha Wishlist</h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center py-20 bg-card border border-border rounded-xl mx-4">
          <p className="text-xl text-muted-foreground mb-4">Sua lista de desejos está vazia.</p>
          <p className="text-muted-foreground">Volte para a loja e marque os jogos que você quer comprar!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-[1400px] mx-auto px-4">
          {wishlist.map((game) => (
            <div key={game.id} className="relative group">
              <GameCard game={game} />
              
              <button
                onClick={() => removerDaWishlist(game.id)}
                className="absolute top-2 right-2 p-2 bg-destructive/90 hover:bg-destructive text-destructive-foreground rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg z-10"
                title="Remover da wishlist"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}