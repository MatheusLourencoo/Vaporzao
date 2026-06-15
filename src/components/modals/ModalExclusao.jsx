import { Trash2 } from "lucide-react";

export function ModalExclusao({ jogo, onConfirmar, onCancelar }) {
  if (!jogo) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#18181b] border border-white/10 p-6 rounded-2xl max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
          <Trash2 className="w-6 h-6 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Excluir Jogo Permanente</h2>
        <p className="text-zinc-400 text-sm mb-8 leading-relaxed">
          Tem certeza que deseja remover <strong>"{jogo.titulo || 'Jogo Desconhecido'}"</strong> da plataforma? Esta ação apagará todos os dados, imagens e avaliações e não pode ser desfeita.
        </p>
        <div className="flex gap-3">
          <button 
            onClick={onCancelar} 
            className="flex-1 py-3 rounded-lg font-bold text-zinc-300 hover:bg-white/5 transition-colors border border-transparent hover:border-white/10"
          >
            Cancelar
          </button>
          <button 
            onClick={() => onConfirmar(jogo.id || jogo.jogoId)} 
            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)] hover:shadow-[0_0_25px_rgba(239,68,68,0.4)]"
          >
            Sim, Excluir
          </button>
        </div>
      </div>
    </div>
  );
}