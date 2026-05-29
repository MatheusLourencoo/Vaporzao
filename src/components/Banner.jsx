import { useState, useEffect } from "react";
import { Eye } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export function Banner({ jogos = [], onVerDetalhes }) {
  const [destaque, setDestaque] = useState(null);
  const [listaDestaques, setListaDestaques] = useState([]);
  const [indexAtivo, setIndexAtivo] = useState(0);

  useEffect(() => {
    if (jogos && jogos.length > 0) {
      const sorteados = [...jogos]
        .sort(() => 0.5 - Math.random())
        .slice(0, 5);
      setListaDestaques(sorteados);
      setDestaque(sorteados[0]);
      setIndexAtivo(0);
    }
  }, [jogos]);

  useEffect(() => {
    if (listaDestaques.length <= 1) return;

    const interval = setInterval(() => {
      setIndexAtivo((prev) => {
        const next = (prev + 1) % listaDestaques.length;
        setDestaque(listaDestaques[next]);
        return next;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [listaDestaques]);

  if (!destaque) {
    return <div className="w-full h-[450px] bg-zinc-900 rounded-2xl flex items-center justify-center text-zinc-500">Carregando destaques...</div>;
  }

  return (
    <div className="relative w-full h-[450px] rounded-2xl overflow-hidden bg-zinc-900 shadow-[0_0_40px_-10px_rgba(0,0,0,0.5)] border border-white/10 transition-all duration-500">
      <AnimatePresence mode="wait">
        <motion.div
          key={destaque.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >

          <img
            src={destaque.capaUrl || "https://images.unsplash.com/photo-1542751371-adc38448a05e"}
            alt={destaque.titulo}
            className="absolute inset-0 w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/20" />
          
          {/* Conteúdo */}
          <div className="relative z-10 flex items-center h-full px-12">
            <div className="w-full md:w-1/2">
              <span className="bg-primary text-primary-foreground px-3 py-1 font-bold text-sm uppercase rounded shadow-lg">
                Destaque
              </span>
              <h1 className="text-6xl font-extrabold text-white mt-4 mb-2 tracking-tight drop-shadow-md">
                {destaque.titulo}
              </h1>
              <p className="text-zinc-300 text-lg mb-6 max-w-md line-clamp-2">
                {destaque.descricao}
              </p>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onVerDetalhes(destaque)}
                  className="bg-white text-black hover:bg-zinc-200 px-8 py-3 rounded font-bold transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
                >
                  <Eye className="w-5 h-5" />
                  Ver Detalhes
                </button>
                <span className="text-2xl font-bold text-white">
                  R$ {Number(destaque.preco || 0).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-20 flex gap-2">
            {listaDestaques.map((_, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === indexAtivo ? "bg-primary w-8" : "bg-zinc-600"
                }`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}