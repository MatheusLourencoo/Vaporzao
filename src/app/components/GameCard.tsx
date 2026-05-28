import { useState } from "react";
import { Eye, Plus, Heart, Star } from "lucide-react";
import { motion } from "motion/react";
import type { Game } from "../../types";

interface GameCardProps {
  game: Game;
  onViewDetails: () => void;
}

export function GameCard({ game, onViewDetails }: GameCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="bg-card rounded-lg overflow-hidden border border-border cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="relative aspect-[16/9] overflow-hidden">
        <img
          src={game.capaUrl}
          alt={game.titulo}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        {game.desconto && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground px-3 py-1 rounded-md font-bold text-sm">
            -{game.desconto}%
          </div>
        )}

        <motion.div
          className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-3 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <button
            onClick={onViewDetails}
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

      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 text-foreground line-clamp-1">{game.titulo}</h3>

        <div className="flex gap-2 mb-3 flex-wrap">
          {game.generos.map((genero) => (
            <span key={genero} className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
              {genero}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-primary text-primary" />
            <span className="text-sm font-semibold text-foreground">{game.nota}</span>
          </div>
          <span className="text-xs text-muted-foreground">({game.avaliacoes} avaliações)</span>
        </div>

        <div className="flex items-center gap-2">
          {game.precoOriginal && (
            <span className="text-sm text-muted-foreground line-through">
              R$ {game.precoOriginal.toFixed(2)}
            </span>
          )}
          <span className="text-xl font-bold text-primary">R$ {game.preco.toFixed(2)}</span>
        </div>
      </div>
    </motion.div>
  );
}
