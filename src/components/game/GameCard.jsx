import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";

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
  const capaFinal = jogo.capaUrl || obterCapaAlternativa(jogo.titulo || "");
  const precoAtual = jogo.preco ? Number(jogo.preco).toFixed(2) : "0.00";

  return (
    <motion.div
      className="flex flex-col cursor-pointer group w-full"
      onClick={() => navigate(`/jogo/${jogo.id}`)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl mb-3 bg-black">
        <img
          src={capaFinal}
          alt={jogo.titulo || "Jogo sem título"}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105 opacity-90 group-hover:opacity-100"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = obterCapaAlternativa(jogo.titulo || "");
          }}
        />

        {jogo.desconto && (
          <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded-md font-bold text-xs z-10">
            -{jogo.desconto}%
          </div>
        )}
      </div>

      <div className="flex flex-col">
        <h3 className="text-base font-bold text-foreground line-clamp-1 mb-1 group-hover:text-primary transition-colors">
          {jogo.titulo}
        </h3>
        <span className="text-sm font-medium text-foreground">
          {jogo.preco > 0 ? `R$ ${precoAtual}` : "Gratuito"}
        </span>
      </div>
    </motion.div>
  );
}