import { useState } from "react";
import { Eye, Plus, Heart, Star } from "lucide-react";
import { motion } from "motion/react";

export function GameCard({ game: jogo, onViewDetails: aoVerDetalhes }) {

  const [mousePorCima, setMousePorCima] = useState(false);

  // Se a API não mandar alguma informação, usamos esses valores para a tela não quebrar
  const imagemCapa = jogo.capaUrl || "https://images.unsplash.com/photo-1552820728-8b83bb6b773f";
  const notaDoJogo = jogo.nota || 0;
  const totalAvaliacoes = jogo.avaliacoes || 0;

  // Formatação garantindo que o preço sempre terá duas casas decimais (ex: 29.90)
  const precoAntigo = jogo.precoOriginal ? Number(jogo.precoOriginal).toFixed(2) : null;
  const precoAtual = jogo.preco ? Number(jogo.preco).toFixed(2) : "0.00";

  return (
    <motion.div
      className="bg-card rounded-lg overflow-hidden border border-border cursor-pointer group"
      onMouseEnter={() => setMousePorCima(true)}
      onMouseLeave={() => setMousePorCima(false)}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      {/* --- ÁREA DA IMAGEM E BOTÕES DE AÇÃO --- */}
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={imagemCapa}
          alt={jogo.titulo || "Jogo sem título"}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        
        {/* Etiqueta de Desconto (só aparece se o jogo tiver desconto) */}
        {jogo.desconto && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-md font-bold text-sm">
            -{jogo.desconto}%
          </div>
        )}

        {/* Fundo escuro com os botões que aparece apenas quando passa o mouse */}
        <motion.div
          className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: mousePorCima ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={aoVerDetalhes}
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-6 py-2 rounded-md flex items-center gap-2 transition-all"
          >
            <Eye className="w-4 h-4" />
            Ver Detalhes
          </button>
          <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-md flex items-center gap-2 transition-all">
            <Plus className="w-4 h-4" />
            Adicionar à Biblioteca
          </button>
          <button className="bg-accent hover:bg-accent/90 text-accent-foreground px-6 py-2 rounded-md flex items-center gap-2 transition-all">
            <Heart className="w-4 h-4" />
            Wishlist
          </button>
        </motion.div>
      </div>

      {/* --- ÁREA DOS TEXTOS (Título, Gêneros e Preço) --- */}
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 text-foreground line-clamp-1">
          {jogo.titulo}
        </h3>

        {/* Lista de Gêneros */}
        <div className="flex gap-2 mb-3 flex-wrap">
          {jogo.generos?.map((genero, index) => {
            // Verifica se a API mandou uma palavra solta ou um Objeto completo e extrai o nome
            const nomeDoGenero = typeof genero === 'string' ? genero : genero.nome;
            const idDoGenero = typeof genero === 'string' ? genero : (genero.id || index);

            return (
              <span key={idDoGenero} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
                {nomeDoGenero}
              </span>
            );
          })}
        </div>

        {/* Avaliações e Estrelas */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm font-semibold text-foreground">{notaDoJogo}</span>
          </div>
          <span className="text-xs text-muted-foreground">({totalAvaliacoes} avaliações)</span>
        </div>

        {/* Bloco de Preços */}
        <div className="flex items-center gap-2">
          {precoAntigo && (
            <span className="text-sm text-muted-foreground line-through">
              R$ {precoAntigo}
            </span>
          )}
          <span className="text-xl font-bold text-primary">R$ {precoAtual}</span>
        </div>
      </div>
    </motion.div>
  );
}