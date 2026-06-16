import { useState, useEffect } from "react";
import { PlayCircle } from "lucide-react";
import { isVideo, converterUrlYoutube, obterCapaAlternativa } from "../../utils/midia";

export function GameGallery({ game, galeria }) {
  const [imagemDestaque, setImagemDestaque] = useState("");
  const [destaqueIsVideo, setDestaqueIsVideo] = useState(false);

  useEffect(() => {
    if (game) {
      setImagemDestaque(game.capaUrl || obterCapaAlternativa(game.titulo));
      setDestaqueIsVideo(false);
    }
  }, [game]);

  if (!game) return null;

  return (
    <div className="space-y-4">
      <div className="w-full h-[400px] rounded-xl shadow-2xl bg-black overflow-hidden relative">
        {destaqueIsVideo ? (
          <iframe
            src={converterUrlYoutube(imagemDestaque)}
            className="w-full h-full border-0"
            title="Trailer do Jogo"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <img
            src={imagemDestaque}
            alt={game.titulo}
            className="w-full h-full object-cover transition-all duration-300"
            onError={(e) => { e.target.src = obterCapaAlternativa(game.titulo); }}
          />
        )}
      </div>

      {galeria.length > 0 && (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-zinc-700 scrollbar-track-transparent">
          
          <img
            src={game.capaUrl || obterCapaAlternativa(game.titulo)}
            onClick={() => { setImagemDestaque(game.capaUrl || obterCapaAlternativa(game.titulo)); setDestaqueIsVideo(false); }}
            className={`w-32 h-20 shrink-0 object-cover rounded-lg cursor-pointer border-2 transition-all ${
              imagemDestaque === (game.capaUrl || obterCapaAlternativa(game.titulo)) ? 'border-[#00ff9d] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
            }`}
            alt="Capa Original"
          />

          {galeria.map((img, index) => {
            const itemIsVideo = isVideo(img);
            return itemIsVideo ? (
              <button
                type="button"
                key={img.id || index}
                onClick={() => { setImagemDestaque(img.url); setDestaqueIsVideo(true); }}
                className={`w-32 h-20 shrink-0 rounded-lg cursor-pointer border-2 transition-all bg-zinc-900 flex items-center justify-center ${
                  imagemDestaque === img.url ? 'border-[#00ff9d] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
              >
                <PlayCircle className="w-8 h-8 text-white" />
              </button>
            ) : (
              <img
                key={img.id || index}
                src={img.url}
                onClick={() => { setImagemDestaque(img.url); setDestaqueIsVideo(false); }}
                className={`w-32 h-20 shrink-0 object-cover rounded-lg cursor-pointer border-2 transition-all ${
                  imagemDestaque === img.url ? 'border-[#00ff9d] opacity-100' : 'border-transparent opacity-60 hover:opacity-100'
                }`}
                alt={`Screenshot ${index + 1}`}
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}