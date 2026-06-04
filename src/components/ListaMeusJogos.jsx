import { Pencil, Trash2 } from "lucide-react";
import { GameCard } from "./GameCard";
import { useNavigate } from "react-router-dom";

export function ListaMeusJogos({ meusJogos, carregandoMeusJogos, onEditar, onDeletar }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-[400px]">
      {carregandoMeusJogos ? (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground gap-4">
          <div className="w-8 h-8 border-4 border-[#00ff9d] border-t-transparent rounded-full animate-spin"></div>
          <p className="font-medium">Carregando seu catálogo...</p>
        </div>
      ) : meusJogos.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-2xl border border-white/5 flex flex-col items-center gap-4">
          <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center">
            <Pencil className="w-8 h-8 text-zinc-600" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Seu catálogo está vazio</h3>
            <p className="text-muted-foreground">Você ainda não publicou nenhum título na Vaporzão.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5">
          {meusJogos.map(jogo => (
            <div key={jogo.id} className="relative cursor-pointer group" onClick={() => navigate(`/jogo/${jogo.id}`)}>
              <GameCard game={jogo} />
              <div className="absolute top-2 right-2 flex gap-1 bg-black/80 backdrop-blur-md p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity border border-white/10 shadow-xl">
                <button 
                  onClick={(e) => { e.stopPropagation(); onEditar(jogo); }} 
                  className="p-1.5 text-zinc-400 hover:text-white hover:bg-blue-500/80 rounded transition-all" title="Editar Jogo">
                  <Pencil className="w-4 h-4" />
                </button>
                <div className="w-px bg-white/10 mx-0.5"></div>
                <button 
                  onClick={(e) => { e.stopPropagation(); onDeletar(jogo); }} 
                  className="p-1.5 text-zinc-400 hover:text-white hover:bg-red-500/80 rounded transition-all" title="Excluir Jogo">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}