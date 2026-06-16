import { Star, ThumbsUp, ThumbsDown, MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { decodificarTexto } from "../../utils/formatacao";

export function ProfileReviews({ reviews }) {
  if (!reviews || reviews.length === 0) {
    return (
      <section>
        <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
          <MessageSquare className="w-6 h-6 text-zinc-500" />
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Atividade Recente</h2>
        </div>
        <div className="bg-[#121212] p-10 rounded-xl border border-white/5 text-center flex flex-col items-center">
          <MessageSquare className="w-10 h-10 text-zinc-800 mb-4" />
          <p className="text-zinc-500 font-medium">Este usuário ainda não avaliou nenhum título.</p>
        </div>
      </section>
    );
  }

  return (
    <section>
      <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
        <MessageSquare className="w-6 h-6 text-white" />
        <h2 className="text-2xl font-black text-white uppercase tracking-tight">Atividade Recente</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reviews.map((review, index) => {
          const notaReal = review.nota > 5 ? Math.round(review.nota / 2) : (review.nota || 0);
          const dataFormatada = new Date(review.createdAt || review.dataCriacao || review.data || new Date()).toLocaleDateString('pt-BR');
          
          // Extraindo dados do jogo
          const tituloJogo = review.jogo?.titulo || review.Jogo?.titulo || review.jogoTitulo || review.tituloJogo || review.game?.titulo || "Jogo Desconhecido";
          const idJogo = review.jogo?.id || review.Jogo?.id || review.jogoId || review.idJogo || review.game?.id;
          
          const recomenda = review.recomenda !== false;
          const textoReview = review.texto || review.comentario || review.conteudo;
          
          return (
            <div key={index} className="bg-[#121212] border border-white/5 p-6 rounded-xl flex flex-col justify-between hover:border-white/10 hover:bg-[#151515] transition-all group">
              <div className="flex justify-between items-start mb-4">
                <div className="pr-4">
                  {/* Lógica do Link Adicionada Aqui */}
                  {idJogo ? (
                    <Link to={`/jogo/${idJogo}`} className="block w-fit">
                      <h3 className="text-lg font-bold text-white hover:text-blue-400 transition-colors line-clamp-1 mb-1">
                        {decodificarTexto(tituloJogo)}
                      </h3>
                    </Link>
                  ) : (
                    <h3 className="text-lg font-bold text-white transition-colors line-clamp-1 mb-1">
                      {decodificarTexto(tituloJogo)}
                    </h3>
                  )}
                  <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">{dataFormatada}</span>
                </div>
                <div className="flex bg-black px-2 py-1.5 rounded text-[#00ff9d] shrink-0 border border-white/5">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold ml-1">{notaReal}/5</span>
                </div>
              </div>
              
              {textoReview ? (
                <p className="text-sm text-zinc-400 leading-relaxed italic border-l-2 border-white/10 pl-3">
                  "{decodificarTexto(textoReview)}"
                </p>
              ) : (
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded text-xs font-bold uppercase tracking-wider ${recomenda ? 'bg-blue-500/10 text-blue-400' : 'bg-red-500/10 text-red-400'}`}>
                  {recomenda ? <ThumbsUp className="w-4 h-4" /> : <ThumbsDown className="w-4 h-4" />}
                  {recomenda ? "Recomendado" : "Não Recomendado"}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}