import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { decodificarTexto } from "../../utils/formatacao";

const capasPadrao = [
  "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?q=80&w=1000&auto=format&fit=crop"
];

const obterCapaAlternativa = (titulo = "") => {
  const indice = titulo.length % capasPadrao.length;
  return capasPadrao[indice];
};

export function GameCard({ game: jogo }) {
  const navigate = useNavigate();
  
  // Limpeza do título usando o seu utilitário
  const tituloLimpo = decodificarTexto(jogo.titulo || "Jogo sem título");
  const capaFinal = jogo.capaUrl || obterCapaAlternativa(jogo.titulo || "");
  
  // Formatação de preço elegante
  const precoAtual = jogo.preco && Number(jogo.preco) > 0 
    ? `R$ ${Number(jogo.preco).toFixed(2).replace('.', ',')}` 
    : "Gratuito";

  return (
    <motion.div
      className="flex flex-col cursor-pointer group w-full"
      onClick={() => navigate(`/jogo/${jogo.id || jogo.jogoId}`)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Capa com proporção 3:4, zoom suave e sem bordas grossas */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl mb-3 bg-[#18181c] border border-transparent group-hover:border-white/10 shadow-lg">
        <img
          src={capaFinal}
          alt={tituloLimpo}
          className="w-full h-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105 opacity-90 group-hover:opacity-100"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = obterCapaAlternativa(jogo.titulo || "");
          }}
        />

        {/* Efeito de sombra interna base que aparece no hover para dar contraste */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Sua lógica original de desconto */}
        {jogo.desconto && (
          <div className="absolute top-2 right-2 bg-[#00ff9d] text-black px-2 py-1 rounded-md font-bold text-xs z-10 shadow-lg">
            -{jogo.desconto}%
          </div>
        )}
      </div>

      {/* Textos soltos, tipografia moderna */}
      <div className="flex flex-col px-1">
        <h3 
          className="text-sm font-bold text-zinc-100 line-clamp-1 mb-1 group-hover:text-[#00ff9d] transition-colors"
          title={tituloLimpo}
        >
          {tituloLimpo}
        </h3>
        <span className="text-xs font-medium text-zinc-400">
          {precoAtual}
        </span>
      </div>
    </motion.div>
  );
}